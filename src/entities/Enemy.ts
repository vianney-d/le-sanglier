import Phaser from 'phaser'

const SIZE = 28
const COLOR = 0xaa3333
const SPEED = 90
const STOP_DISTANCE = 40
const DEATH_DURATION = 150

/** Basic grunt: seeks Jean directly, stops at melee range, dies in one hit. */
export class Enemy {
  private readonly rect: Phaser.GameObjects.Rectangle
  private dead = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.rect = scene.add.rectangle(x, y, SIZE, SIZE, COLOR)
  }

  get x(): number {
    return this.rect.x
  }

  get y(): number {
    return this.rect.y
  }

  get isDead(): boolean {
    return this.dead
  }

  update(delta: number, targetX: number, targetY: number): void {
    if (this.dead) return

    const dx = targetX - this.rect.x
    const dy = targetY - this.rect.y
    const dist = Math.hypot(dx, dy)
    if (dist <= STOP_DISTANCE) return

    const step = (SPEED * delta) / 1000
    this.rect.x += (dx / dist) * step
    this.rect.y += (dy / dist) * step
  }

  kill(scene: Phaser.Scene): void {
    if (this.dead) return
    this.dead = true

    scene.tweens.add({
      targets: this.rect,
      scale: 0,
      alpha: 0,
      duration: DEATH_DURATION,
      onComplete: () => this.rect.destroy(),
    })
  }
}
