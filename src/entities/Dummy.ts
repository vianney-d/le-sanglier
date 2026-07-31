import Phaser from 'phaser'

const SIZE = 36
const BASE_COLOR = 0x6b4a2f
const FLASH_COLOR = 0xffffff
const FLASH_DURATION = 100

/**
 * Static target used to validate hit detection before real enemies exist
 * (Jalon 3). Not an enemy: no AI, no health, just visual feedback on hit.
 */
export class Dummy {
  private readonly rect: Phaser.GameObjects.Rectangle
  private readonly counterText: Phaser.GameObjects.Text
  private readonly scene: Phaser.Scene
  private hits = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene
    this.rect = scene.add.rectangle(x, y, SIZE, SIZE, BASE_COLOR)
    this.counterText = scene.add
      .text(x, y - SIZE, '0', { fontFamily: 'monospace', fontSize: '14px', color: '#888888' })
      .setOrigin(0.5)
  }

  get x(): number {
    return this.rect.x
  }

  get y(): number {
    return this.rect.y
  }

  hit(): void {
    this.hits += 1
    this.counterText.setText(String(this.hits))

    this.rect.setFillStyle(FLASH_COLOR)
    this.scene.time.delayedCall(FLASH_DURATION, () => this.rect.setFillStyle(BASE_COLOR))

    this.scene.tweens.add({
      targets: this.rect,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: FLASH_DURATION,
      yoyo: true,
    })
  }
}
