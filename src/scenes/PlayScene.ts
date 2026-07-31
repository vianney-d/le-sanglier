import Phaser from 'phaser'
import { InputController } from '../input/InputController'
import { Dummy } from '../entities/Dummy'

const JEAN_SPEED = 220
const JEAN_SIZE = 32

const ATTACK_RANGE = 60
const ATTACK_COS_THRESHOLD = 0.3 // ~72° half-cone in front of Jean
const COMBO_WINDOW_MS = 600
const COMBO_STEPS = 3
const ATTACK_INDICATOR_DURATION = 100

export class PlayScene extends Phaser.Scene {
  private inputController!: InputController
  private jean!: Phaser.GameObjects.Rectangle
  private dummy!: Dummy
  private comboText!: Phaser.GameObjects.Text
  private attackIndicator!: Phaser.GameObjects.Rectangle

  private facing = new Phaser.Math.Vector2(1, 0)
  private comboStep = 0
  private lastAttackTime = -Infinity

  constructor() {
    super('play')
  }

  create() {
    const { width, height } = this.scale

    this.add
      .text(width / 2, 20, 'LE SANGLIER — Jalon 2 (placeholder)', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#888888',
      })
      .setOrigin(0.5, 0)

    this.jean = this.add.rectangle(width / 2, height / 2, JEAN_SIZE, JEAN_SIZE, 0xe8b04b)
    this.dummy = new Dummy(this, width / 2 + 160, height / 2)
    this.attackIndicator = this.add.rectangle(0, 0, 20, 20, 0xffffff).setVisible(false)

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
  }

  private attack(time: number): void {
    this.comboStep = time - this.lastAttackTime > COMBO_WINDOW_MS ? 1 : (this.comboStep % COMBO_STEPS) + 1
    this.lastAttackTime = time
    this.comboText.setText(`Combo ${this.comboStep}/${COMBO_STEPS}`)

    this.attackIndicator
      .setPosition(this.jean.x + this.facing.x * 24, this.jean.y + this.facing.y * 24)
      .setVisible(true)
    this.time.delayedCall(ATTACK_INDICATOR_DURATION, () => this.attackIndicator.setVisible(false))

    const toDummy = new Phaser.Math.Vector2(this.dummy.x - this.jean.x, this.dummy.y - this.jean.y)
    const dist = toDummy.length()
    const inFront = dist === 0 || this.facing.dot(toDummy.normalize()) >= ATTACK_COS_THRESHOLD

    if (dist <= ATTACK_RANGE && inFront) {
      this.dummy.hit()
    }
  }
}
