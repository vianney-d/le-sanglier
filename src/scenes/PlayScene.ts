import Phaser from 'phaser'
import { InputController } from '../input/InputController'

const JEAN_SPEED = 220
const JEAN_SIZE = 32

export class PlayScene extends Phaser.Scene {
  private inputController!: InputController
  private jean!: Phaser.GameObjects.Rectangle

  constructor() {
    super('play')
  }

  create() {
    const { width, height } = this.scale

    this.add
      .text(width / 2, 20, 'LE SANGLIER — Jalon 1 (placeholder)', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#888888',
      })
      .setOrigin(0.5, 0)

    this.jean = this.add.rectangle(width / 2, height / 2, JEAN_SIZE, JEAN_SIZE, 0xe8b04b)
    this.inputController = new InputController(this)
  }

  update(_time: number, delta: number) {
    const dir = this.inputController.getDirection()
    const distance = (JEAN_SPEED * delta) / 1000
    const { width, height } = this.scale

    this.jean.x = Phaser.Math.Clamp(this.jean.x + dir.x * distance, JEAN_SIZE / 2, width - JEAN_SIZE / 2)
    this.jean.y = Phaser.Math.Clamp(this.jean.y + dir.y * distance, JEAN_SIZE / 2, height - JEAN_SIZE / 2)
  }
}
