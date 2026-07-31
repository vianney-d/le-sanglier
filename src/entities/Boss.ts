import Phaser from 'phaser'

const SIZE = 64
const BASE_COLOR = 0x552266
const TELEGRAPH_COLOR = 0xffaa00
const CHARGE_COLOR = 0xff2222
const HIT_FLASH_COLOR = 0xffffff
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
  private readonly rect: Phaser.GameObjects.Rectangle
  private readonly maxHp: number
  private hp: number
  private dead = false

  private state: State = 'idle'
  private nextActionAt: number
  private telegraphUntil = 0
  private chargingUntil = 0
  private chargeDir = new Phaser.Math.Vector2(0, 0)

  constructor(scene: Phaser.Scene, x: number, y: number, startTime: number, hp = 6) {
    this.rect = scene.add.rectangle(x, y, SIZE, SIZE, BASE_COLOR)
    this.maxHp = hp
    this.hp = hp
    this.nextActionAt = startTime + INITIAL_DELAY_MS
  }

  get x(): number {
    return this.rect.x
  }

  get y(): number {
    return this.rect.y
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
          this.chargeDir = new Phaser.Math.Vector2(targetX - this.rect.x, targetY - this.rect.y).normalize()
          this.rect.setFillStyle(TELEGRAPH_COLOR)
        }
        break

      case 'telegraph':
        if (time >= this.telegraphUntil) {
          this.state = 'charging'
          this.chargingUntil = time + CHARGE_DURATION_MS
          this.rect.setFillStyle(CHARGE_COLOR)
        }
        break

      case 'charging': {
        const step = (CHARGE_SPEED * delta) / 1000
        this.rect.x += this.chargeDir.x * step
        this.rect.y += this.chargeDir.y * step
        if (time >= this.chargingUntil) {
          this.state = 'idle'
          this.nextActionAt = time + CHARGE_INTERVAL_MS
          this.rect.setFillStyle(BASE_COLOR)
        }
        break
      }
    }

    this.rect.x = Phaser.Math.Clamp(this.rect.x, SIZE / 2, bounds.width - SIZE / 2)
    this.rect.y = Phaser.Math.Clamp(this.rect.y, SIZE / 2, bounds.height - SIZE / 2)
  }

  private seek(targetX: number, targetY: number, delta: number): void {
    const dx = targetX - this.rect.x
    const dy = targetY - this.rect.y
    const dist = Math.hypot(dx, dy)
    if (dist <= STOP_DISTANCE) return

    const step = (CHASE_SPEED * delta) / 1000
    this.rect.x += (dx / dist) * step
    this.rect.y += (dy / dist) * step
  }

  /** Returns true if this hit killed the boss. */
  hit(scene: Phaser.Scene): boolean {
    if (this.dead) return false

    this.hp -= 1
    const baseColor = this.state === 'idle' ? BASE_COLOR : this.state === 'telegraph' ? TELEGRAPH_COLOR : CHARGE_COLOR
    this.rect.setFillStyle(HIT_FLASH_COLOR)
    scene.time.delayedCall(HIT_FLASH_DURATION, () => {
      if (!this.dead) this.rect.setFillStyle(baseColor)
    })

    if (this.hp <= 0) {
      this.dead = true
      scene.tweens.add({
        targets: this.rect,
        scale: 0,
        alpha: 0,
        duration: DEATH_DURATION,
        onComplete: () => this.rect.destroy(),
      })
      return true
    }

    return false
  }
}
