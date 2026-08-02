import Phaser from 'phaser'

export type EnemyKind = 'grunt' | 'fast' | 'tank'

interface EnemyStats {
  spriteKey: string
  size: number
  speed: number
  stopDistance: number
  hp: number
}

const STATS: Record<EnemyKind, EnemyStats> = {
  grunt: { spriteKey: 'enemy', size: 48, speed: 90, stopDistance: 40, hp: 1 },
  fast: { spriteKey: 'enemy-fast', size: 40, speed: 170, stopDistance: 40, hp: 1 },
  tank: { spriteKey: 'enemy-tank', size: 64, speed: 55, stopDistance: 45, hp: 2 },
}

const HIT_FLASH_TINT = 0xffffff
const HIT_FLASH_DURATION = 100
const DEATH_DURATION = 150

/**
 * Grunt/fast/tank share the same seek-and-melee behavior, only their
 * stats (speed/hp/size) and sprite differ — see STATS above. Fast still
 * dies in one hit like the grunt (the theme is "one punch kills"); tank
 * is the first exception, needing 2 hits.
 */
export class Enemy {
  private readonly sprite: Phaser.GameObjects.Sprite
  private readonly stats: EnemyStats
  private hp: number
  private dead = false

  constructor(scene: Phaser.Scene, x: number, y: number, kind: EnemyKind = 'grunt') {
    this.stats = STATS[kind]
    this.hp = this.stats.hp
    this.sprite = scene.add
      .sprite(x, y, `${this.stats.spriteKey}-idle-0`)
      .setDisplaySize(this.stats.size, this.stats.size)
    this.sprite.play(`${this.stats.spriteKey}-idle`)
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
    if (dist <= this.stats.stopDistance) {
      this.sprite.play(`${this.stats.spriteKey}-idle`, true)
      return
    }

    const step = (this.stats.speed * delta) / 1000
    this.sprite.x += (dx / dist) * step
    this.sprite.y += (dy / dist) * step
    this.sprite.setFlipX(dx < 0)
    this.sprite.play(`${this.stats.spriteKey}-walk`, true)
  }

  /** Returns true if this hit killed the enemy. */
  hit(scene: Phaser.Scene): boolean {
    if (this.dead) return false

    this.hp -= 1
    if (this.hp > 0) {
      this.sprite.setTint(HIT_FLASH_TINT)
      scene.time.delayedCall(HIT_FLASH_DURATION, () => {
        if (!this.dead) this.sprite.clearTint()
      })
      return false
    }

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
}
