import Phaser from 'phaser'

const SIZE = 96
const TELEGRAPH_TINT = 0xffaa00
const CHARGE_TINT = 0xff2222
const HIT_FLASH_TINT = 0xffffff
const HIT_FLASH_DURATION = 100
const DEATH_DURATION = 300

const CHASE_SPEED = 70
const STOP_DISTANCE = 70
const INITIAL_DELAY_MS = 1500
const CHARGE_INTERVAL_MS = 4000
const TELEGRAPH_DURATION_MS = 500
const CHARGE_DURATION_MS = 400
const CHARGE_SPEED = 500

type State = 'idle' | 'telegraph' | 'charging'

/**
 * Simple boss: chases like a grunt, but periodically telegraphs then
 * dashes in a straight line toward Jean's position at the moment of the
 * telegraph — dodgeable by moving during the flash.
 */
export class Boss {
  private readonly sprite: Phaser.GameObjects.Sprite
  private readonly maxHp: number
  private hp: number
  private dead = false

  private state: State = 'idle'
  private nextActionAt: number
  private telegraphUntil = 0
  private chargingUntil = 0
  private chargeDir = new Phaser.Math.Vector2(0, 0)

  constructor(scene: Phaser.Scene, x: number, y: number, startTime: number, hp = 6) {
    this.sprite = scene.add.sprite(x, y, 'boss-idle-0').setDisplaySize(SIZE, SIZE)
    this.sprite.play('boss-idle')
    this.maxHp = hp
    this.hp = hp
    this.nextActionAt = startTime + INITIAL_DELAY_MS
  }

  get x(): number {
    return this.sprite.x
  }

  get y(): number {
    return this.sprite.y
  }

  get currentHp(): number {
    return this.hp
  }

  get maxHitPoints(): number {
    return this.maxHp
  }

  get isDead(): boolean {
    return this.dead
  }

  update(delta: number, targetX: number, targetY: number, time: number, bounds: { width: number; height: number }): void {
    if (this.dead) return

    switch (this.state) {
      case 'idle':
        this.seek(targetX, targetY, delta)
        if (time >= this.nextActionAt) {
          this.state = 'telegraph'
          this.telegraphUntil = time + TELEGRAPH_DURATION_MS
          this.chargeDir = new Phaser.Math.Vector2(targetX - this.sprite.x, targetY - this.sprite.y).normalize()
          this.sprite.setTint(TELEGRAPH_TINT)
          this.sprite.play('boss-idle', true)
        }
        break

      case 'telegraph':
        if (time >= this.telegraphUntil) {
          this.state = 'charging'
          this.chargingUntil = time + CHARGE_DURATION_MS
          this.sprite.setTint(CHARGE_TINT)
          this.sprite.setFlipX(this.chargeDir.x < 0)
          this.sprite.play('boss-walk', true)
        }
        break

      case 'charging': {
        const step = (CHARGE_SPEED * delta) / 1000
        this.sprite.x += this.chargeDir.x * step
        this.sprite.y += this.chargeDir.y * step
        if (time >= this.chargingUntil) {
          this.state = 'idle'
          this.nextActionAt = time + CHARGE_INTERVAL_MS
          this.sprite.clearTint()
        }
        break
      }
    }

    this.sprite.x = Phaser.Math.Clamp(this.sprite.x, SIZE / 2, bounds.width - SIZE / 2)
    this.sprite.y = Phaser.Math.Clamp(this.sprite.y, SIZE / 2, bounds.height - SIZE / 2)
  }

  private seek(targetX: number, targetY: number, delta: number): void {
    const dx = targetX - this.sprite.x
    const dy = targetY - this.sprite.y
    const dist = Math.hypot(dx, dy)
    if (dist <= STOP_DISTANCE) {
      this.sprite.play('boss-idle', true)
      return
    }

    const step = (CHASE_SPEED * delta) / 1000
    this.sprite.x += (dx / dist) * step
    this.sprite.y += (dy / dist) * step
    this.sprite.setFlipX(dx < 0)
    this.sprite.play('boss-walk', true)
  }

  /** Returns true if this hit killed the boss. */
  hit(scene: Phaser.Scene): boolean {
    if (this.dead) return false

    this.hp -= 1
    const baseTint = this.state === 'idle' ? null : this.state === 'telegraph' ? TELEGRAPH_TINT : CHARGE_TINT
    this.sprite.setTint(HIT_FLASH_TINT)
    scene.time.delayedCall(HIT_FLASH_DURATION, () => {
      if (this.dead) return
      if (baseTint === null) this.sprite.clearTint()
      else this.sprite.setTint(baseTint)
    })

    if (this.hp <= 0) {
      this.dead = true
      scene.tweens.add({
        targets: this.sprite,
        scale: 0,
        alpha: 0,
        duration: DEATH_DURATION,
        onComplete: () => this.sprite.destroy(),
      })
      return true
    }

    return false
  }
}
