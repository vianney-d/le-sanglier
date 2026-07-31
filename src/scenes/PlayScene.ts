import Phaser from 'phaser'
import { InputController } from '../input/InputController'
import { Enemy } from '../entities/Enemy'
import { Boss } from '../entities/Boss'

const JEAN_SPEED = 220
const JEAN_SIZE = 32
const JEAN_COLOR = 0xe8b04b

const ATTACK_RANGE = 60
const ATTACK_COS_THRESHOLD = 0.3 // ~72° half-cone in front of Jean
const COMBO_WINDOW_MS = 600
const COMBO_STEPS = 3
const ATTACK_INDICATOR_DURATION = 100

const TOTAL_ENEMIES = 8
const MAX_ALIVE_ENEMIES = 4
const SPAWN_INTERVAL_MS = 1200
const SPAWN_MARGIN = 20

const RAGE_COLOR = 0xff5533
const RAGE_DURATION_MS = 3000
const RAGE_COOLDOWN_MS = 8000
const RAGE_SPEED_MULTIPLIER = 1.4
const RAGE_RANGE_MULTIPLIER = 1.5

const BOSS_SPAWN_DELAY_MS = 1000
const BOSS_HP = 6

export class PlayScene extends Phaser.Scene {
  private inputController!: InputController
  private jean!: Phaser.GameObjects.Rectangle
  private comboText!: Phaser.GameObjects.Text
  private objectiveText!: Phaser.GameObjects.Text
  private abilityText!: Phaser.GameObjects.Text
  private attackIndicator!: Phaser.GameObjects.Rectangle

  private enemies: Enemy[] = []
  private spawnedCount = 0
  private defeatedCount = 0
  private spawnTimer = 0
  private hordeCleared = false

  private boss: Boss | null = null
  private levelComplete = false

  private facing = new Phaser.Math.Vector2(1, 0)
  private comboStep = 0
  private lastAttackTime = -Infinity

  private rageActiveUntil = -Infinity
  private rageCooldownUntil = -Infinity
  private wasRageActive = false

  constructor() {
    super('play')
  }

  create() {
    const { width, height } = this.scale

    this.add
      .text(width / 2, 20, 'LE SANGLIER — Jalon 5 (placeholder)', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#888888',
      })
      .setOrigin(0.5, 0)

    this.jean = this.add.rectangle(width / 2, height / 2, JEAN_SIZE, JEAN_SIZE, JEAN_COLOR)
    this.attackIndicator = this.add.rectangle(0, 0, 20, 20, 0xffffff).setVisible(false)

    this.objectiveText = this.add
      .text(width / 2, 44, `Horde : 0/${TOTAL_ENEMIES} vaincus`, {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#aa3333',
      })
      .setOrigin(0.5, 0)

    this.abilityText = this.add
      .text(width / 2, height - 44, 'Rage prête (E)', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ff5533',
      })
      .setOrigin(0.5)

    this.comboText = this.add
      .text(width / 2, height - 24, 'Espace / clic pour frapper', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#e8b04b',
      })
      .setOrigin(0.5)

    this.inputController = new InputController(this)
  }

  update(time: number, delta: number) {
    const rageActive = time < this.rageActiveUntil
    if (rageActive !== this.wasRageActive) {
      this.jean.setFillStyle(rageActive ? RAGE_COLOR : JEAN_COLOR)
      this.wasRageActive = rageActive
    }

    const dir = this.inputController.getDirection()
    const speed = JEAN_SPEED * (rageActive ? RAGE_SPEED_MULTIPLIER : 1)
    const distance = (speed * delta) / 1000
    const { width, height } = this.scale

    this.jean.x = Phaser.Math.Clamp(this.jean.x + dir.x * distance, JEAN_SIZE / 2, width - JEAN_SIZE / 2)
    this.jean.y = Phaser.Math.Clamp(this.jean.y + dir.y * distance, JEAN_SIZE / 2, height - JEAN_SIZE / 2)

    if (dir.x !== 0 || dir.y !== 0) {
      this.facing.set(dir.x, dir.y).normalize()
    }

    if (this.inputController.consumeAttack()) {
      this.attack(time)
    }

    if (this.inputController.consumeAbility()) {
      this.tryActivateRage(time)
    }

    this.updateAbilityText(time, rageActive)
    this.updateSpawner(delta)
    for (const enemy of this.enemies) {
      enemy.update(delta, this.jean.x, this.jean.y)
    }

    if (this.boss && !this.boss.isDead) {
      this.boss.update(delta, this.jean.x, this.jean.y, time, { width, height })
    }

    this.updateObjectiveText()
  }

  private tryActivateRage(time: number): void {
    if (time < this.rageCooldownUntil) return // still on cooldown

    this.rageActiveUntil = time + RAGE_DURATION_MS
    this.rageCooldownUntil = time + RAGE_COOLDOWN_MS
  }

  private updateAbilityText(time: number, rageActive: boolean): void {
    if (rageActive) {
      this.abilityText.setText('RAGE ACTIVE')
      return
    }

    if (time < this.rageCooldownUntil) {
      const remaining = Math.ceil((this.rageCooldownUntil - time) / 1000)
      this.abilityText.setText(`Rage : ${remaining}s`)
      return
    }

    this.abilityText.setText('Rage prête (E)')
  }

  private updateSpawner(delta: number): void {
    if (this.spawnedCount >= TOTAL_ENEMIES) return

    this.spawnTimer += delta
    const aliveCount = this.enemies.filter((e) => !e.isDead).length
    if (aliveCount >= MAX_ALIVE_ENEMIES || this.spawnTimer < SPAWN_INTERVAL_MS) return

    this.spawnTimer = 0
    this.spawnEnemy()
    this.spawnedCount += 1
  }

  private spawnEnemy(): void {
    const { width, height } = this.scale
    const edge = Phaser.Math.Between(0, 3)
    let x: number
    let y: number

    switch (edge) {
      case 0: // top
        x = Phaser.Math.Between(SPAWN_MARGIN, width - SPAWN_MARGIN)
        y = SPAWN_MARGIN
        break
      case 1: // bottom
        x = Phaser.Math.Between(SPAWN_MARGIN, width - SPAWN_MARGIN)
        y = height - SPAWN_MARGIN
        break
      case 2: // left
        x = SPAWN_MARGIN
        y = Phaser.Math.Between(SPAWN_MARGIN, height - SPAWN_MARGIN)
        break
      default: // right
        x = width - SPAWN_MARGIN
        y = Phaser.Math.Between(SPAWN_MARGIN, height - SPAWN_MARGIN)
    }

    this.enemies.push(new Enemy(this, x, y))
  }

  private spawnBoss(): void {
    const { width, height } = this.scale
    // Opposite Jean's offset from the arena center.
    const x = Phaser.Math.Clamp(width - this.jean.x, SPAWN_MARGIN, width - SPAWN_MARGIN)
    const y = Phaser.Math.Clamp(height - this.jean.y, SPAWN_MARGIN, height - SPAWN_MARGIN)

    this.boss = new Boss(this, x, y, this.time.now, BOSS_HP)
  }

  private isInAttackRange(targetX: number, targetY: number, range: number, rageActive: boolean): boolean {
    const toTarget = new Phaser.Math.Vector2(targetX - this.jean.x, targetY - this.jean.y)
    const dist = toTarget.length()
    const inFront = rageActive || dist === 0 || this.facing.dot(toTarget.normalize()) >= ATTACK_COS_THRESHOLD
    return dist <= range && inFront
  }

  private attack(time: number): void {
    this.comboStep = time - this.lastAttackTime > COMBO_WINDOW_MS ? 1 : (this.comboStep % COMBO_STEPS) + 1
    this.lastAttackTime = time
    this.comboText.setText(`Combo ${this.comboStep}/${COMBO_STEPS}`)

    this.attackIndicator
      .setPosition(this.jean.x + this.facing.x * 24, this.jean.y + this.facing.y * 24)
      .setVisible(true)
    this.time.delayedCall(ATTACK_INDICATOR_DURATION, () => this.attackIndicator.setVisible(false))

    const rageActive = time < this.rageActiveUntil
    const range = rageActive ? ATTACK_RANGE * RAGE_RANGE_MULTIPLIER : ATTACK_RANGE

    for (const enemy of this.enemies) {
      if (enemy.isDead) continue
      if (this.isInAttackRange(enemy.x, enemy.y, range, rageActive)) {
        enemy.kill(this)
        this.defeatedCount += 1
      }
    }

    if (!this.hordeCleared && this.defeatedCount >= TOTAL_ENEMIES) {
      this.hordeCleared = true
      this.time.delayedCall(BOSS_SPAWN_DELAY_MS, () => this.spawnBoss())
    }

    if (this.boss && !this.boss.isDead && this.isInAttackRange(this.boss.x, this.boss.y, range, rageActive)) {
      const killed = this.boss.hit(this)
      if (killed) this.levelComplete = true
    }
  }

  private updateObjectiveText(): void {
    if (this.levelComplete) {
      this.objectiveText.setText('Niveau terminé !')
      return
    }

    if (this.boss) {
      this.objectiveText.setText(`Boss : PV ${this.boss.currentHp}/${this.boss.maxHitPoints}`)
      return
    }

    if (this.hordeCleared) {
      this.objectiveText.setText('Horde vaincue ! Le boss arrive...')
      return
    }

    this.objectiveText.setText(`Horde : ${this.defeatedCount}/${TOTAL_ENEMIES} vaincus`)
  }
}
