import Phaser from 'phaser'

export interface Direction {
  x: number
  y: number
}

/**
 * Abstracts movement input behind a single interface so a future touch
 * source (virtual joystick) can be swapped in without touching scene code.
 */
export class InputController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>

  constructor(scene: Phaser.Scene) {
    this.cursors = scene.input.keyboard!.createCursorKeys()
    this.wasd = scene.input.keyboard!.addKeys('W,A,S,D') as typeof this.wasd
  }

  getDirection(): Direction {
    let x = 0
    let y = 0

    if (this.cursors.left.isDown || this.wasd.A.isDown) x -= 1
    if (this.cursors.right.isDown || this.wasd.D.isDown) x += 1
    if (this.cursors.up.isDown || this.wasd.W.isDown) y -= 1
    if (this.cursors.down.isDown || this.wasd.S.isDown) y += 1

    if (x !== 0 && y !== 0) {
      x *= Math.SQRT1_2
      y *= Math.SQRT1_2
    }

    return { x, y }
  }
}
