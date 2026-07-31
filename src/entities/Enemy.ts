import Phaser from 'phaser'

const SIZE = 48
const SPEED = 90
const STOP_DISTANCE = 40
const DEATH_DURATION = 150

/** Basic grunt: seeks Jean directly, stops at melee range, dies in one hit. */
export class Enemy {
  private readonly sprite: Phaser.GameObjects.Sprite
  private dead = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, 'enemy-idle-0').setDisplaySize(SIZE, SIZE)
    this.sprite.play('enemy-idle')
  }

  get x(): number {
    return this.sprite.x
  }

  get y(): number {
    return this.sprite.y
  }

  get isDead(): boolean {
    return this.dead
  }

  update(delta: number, targetX: number, targetY: number): void {
    if (this.dead) return

    const dx = targetX - this.sprite.x
    const dy = targetY - this.sprite.y
    const dist = Math.hypot(dx, dy)
    if (dist <= STOP_DISTANCE) {
      this.sprite.play('enemy-idle', true)
      return
    }

    const step = (SPEED * delta) / 1000
    this.sprite.x += (dx / dist) * step
    this.sprite.y += (dy / dist) * step
    this.sprite.setFlipX(dx < 0)
    this.sprite.play('enemy-walk', true)
  }

  kill(scene: Phaser.Scene): void {
    if (this.dead) return
    this.dead = true

    scene.tweens.add({
      targets: this.sprite,
      scale: 0,
      alpha: 0,
      duration: DEATH_DURATION,
      onComplete: () => this.sprite.destroy(),
    })
  }
}
