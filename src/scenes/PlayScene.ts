import Phaser from 'phaser'
import { InputController } from '../input/InputController'
import { Enemy } from '../entities/Enemy'

const JEAN_SPEED = 220
const JEAN_SIZE = 32

const ATTACK_RANGE = 60
const ATTACK_COS_THRESHOLD = 0.3 // ~72° half-cone in front of Jean
const COMBO_WINDOW_MS = 600
const COMBO_STEPS = 3
const ATTACK_INDICATOR_DURATION = 100

const TOTAL_ENEMIES = 8
const MAX_ALIVE_ENEMIES = 4
const SPAWN_INTERVAL_MS = 1200
const SPAWN_MARGIN = 20

export class PlayScene extends Phaser.Scene {
  private inputController!: InputController
  private jean!: Phaser.GameObjects.Rectangle
  private comboText!: Phaser.GameObjects.Text
  private hordeText!: Phaser.GameObjects.Text
  private attackIndicator!: Phaser.GameObjects.Rectangle

  private enemies: Enemy[] = []
  private spawnedCount = 0
  private defeatedCount = 0
  private spawnTimer = 0
  private hordeCleared = false

  private facing = new Phaser.Math.Vector2(1, 0)
  private comboStep = 0
  private lastAttackTime = -Infinity

  constructor() {
    super('play')
  }

  create() {
    const { width, height } = this.scale

    this.add
      .text(width / 2, 20, 'LE SANGLIER — Jalon 3 (placeholder)', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#888888',
      })
      .setOrigin(0.5, 0)

    this.jean = this.add.rectangle(width / 2, height / 2, JEAN_SIZE, JEAN_SIZE, 0xe8b04b)
    this.attackIndicator = this.add.rectangle(0, 0, 20, 20, 0xffffff).setVisible(false)

    this.hordeText = this.add
      .text(width / 2, 44, `Horde : 0/${TOTAL_ENEMIES} vaincus`, {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#aa3333',
      })
      .setOrigin(0.5, 0)

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
    const dir = this.inputController.getDirection()
    const distance = (JEAN_SPEED * delta) / 1000
    const { width, height } = this.scale

    this.jean.x = Phaser.Math.Clamp(this.jean.x + dir.x * distance, JEAN_SIZE / 2, width - JEAN_SIZE / 2)
    this.jean.y = Phaser.Math.Clamp(this.jean.y + dir.y * distance, JEAN_SIZE / 2, height - JEAN_SIZE / 2)

    if (dir.x !== 0 || dir.y !== 0) {
      this.facing.set(dir.x, dir.y).normalize()
    }

    if (this.inputController.consumeAttack()) {
      this.attack(time)
    }

    this.updateSpawner(delta)
    for (const enemy of this.enemies) {
      enemy.update(delta, this.jean.x, this.jean.y)
    }
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

  private attack(time: number): void {
    this.comboStep = time - this.lastAttackTime > COMBO_WINDOW_MS ? 1 : (this.comboStep % COMBO_STEPS) + 1
    this.lastAttackTime = time
    this.comboText.setText(`Combo ${this.comboStep}/${COMBO_STEPS}`)

    this.attackIndicator
      .setPosition(this.jean.x + this.facing.x * 24, this.jean.y + this.facing.y * 24)
      .setVisible(true)
    this.time.delayedCall(ATTACK_INDICATOR_DURATION, () => this.attackIndicator.setVisible(false))

    for (const enemy of this.enemies) {
      if (enemy.isDead) continue

      const toEnemy = new Phaser.Math.Vector2(enemy.x - this.jean.x, enemy.y - this.jean.y)
      const dist = toEnemy.length()
      const inFront = dist === 0 || this.facing.dot(toEnemy.normalize()) >= ATTACK_COS_THRESHOLD

      if (dist <= ATTACK_RANGE && inFront) {
        enemy.kill(this)
        this.defeatedCount += 1
      }
    }

    this.updateHordeText()
  }

  private updateHordeText(): void {
    if (this.hordeCleared) return

    if (this.defeatedCount >= TOTAL_ENEMIES) {
      this.hordeCleared = true
      this.hordeText.setText('Horde vaincue !')
      return
    }

    this.hordeText.setText(`Horde : ${this.defeatedCount}/${TOTAL_ENEMIES} vaincus`)
  }
}
