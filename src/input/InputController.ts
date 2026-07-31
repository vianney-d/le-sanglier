import Phaser from 'phaser'

export interface Direction {
  x: number
  y: number
}

// KeyboardEvent.code identifies a key by its physical position, not the
// character it produces — so the QWERTY "W" position (which is labeled Z on
// an AZERTY keyboard) still reports "KeyW". Binding to codes rather than
// Phaser's keyCode-based Key objects makes WASD/ZQSD work automatically on
// any layout, with no detection or configuration needed.
const MOVE_CODES = {
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
} as const

/**
 * Abstracts movement input behind a single interface so a future touch
 * source (virtual joystick) can be swapped in without touching scene code.
 */
export class InputController {
  private pressed = new Set<string>()

  constructor(scene: Phaser.Scene) {
    scene.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      this.pressed.add(event.code)
    })
    scene.input.keyboard!.on('keyup', (event: KeyboardEvent) => {
      this.pressed.delete(event.code)
    })
    // Prevents keys getting stuck "down" if the tab loses focus (e.g. alt-tab)
    // before the keyup event fires.
    window.addEventListener('blur', () => this.pressed.clear())
  }

  private isDown(codes: readonly string[]): boolean {
    return codes.some((code) => this.pressed.has(code))
  }

  getDirection(): Direction {
    let x = 0
    let y = 0

    if (this.isDown(MOVE_CODES.left)) x -= 1
    if (this.isDown(MOVE_CODES.right)) x += 1
    if (this.isDown(MOVE_CODES.up)) y -= 1
    if (this.isDown(MOVE_CODES.down)) y += 1

    if (x !== 0 && y !== 0) {
      x *= Math.SQRT1_2
      y *= Math.SQRT1_2
    }

    return { x, y }
  }
}
