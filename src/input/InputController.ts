import Phaser from 'phaser'

export interface Direction {
  x: number
  y: number
}

// Two complementary signals, because neither is reliable alone:
// - `code` identifies a key by physical position (QWERTY's "W" spot reports
//   "KeyW" even though it's labeled Z on AZERTY) — but some browser/OS
//   combos don't remap the swapped Q/A and W/Z keys correctly in `code`.
// - `key` is the actual character produced, which is always correct for
//   what's printed on the keycap, and catches ZQSD directly when `code`
//   misbehaves. S and D are identical on both layouts, so they never
//   exposed this — only the swapped keys (Q/A, W/Z) did.
const MOVE_TOKENS = {
  up: ['arrowup', 'keyw', 'w', 'z'],
  down: ['arrowdown', 'keys', 's'],
  left: ['arrowleft', 'keya', 'a', 'q'],
  right: ['arrowright', 'keyd', 'd'],
} as const

/**
 * Abstracts movement input behind a single interface so a future touch
 * source (virtual joystick) can be swapped in without touching scene code.
 */
export class InputController {
  private pressed = new Set<string>()

  constructor(scene: Phaser.Scene) {
    scene.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      this.pressed.add(event.code.toLowerCase())
      this.pressed.add(event.key.toLowerCase())
    })
    scene.input.keyboard!.on('keyup', (event: KeyboardEvent) => {
      this.pressed.delete(event.code.toLowerCase())
      this.pressed.delete(event.key.toLowerCase())
    })
    // Prevents keys getting stuck "down" if the tab loses focus (e.g. alt-tab)
    // before the keyup event fires.
    window.addEventListener('blur', () => this.pressed.clear())
  }

  private isDown(tokens: readonly string[]): boolean {
    return tokens.some((token) => this.pressed.has(token))
  }

  getDirection(): Direction {
    let x = 0
    let y = 0

    if (this.isDown(MOVE_TOKENS.left)) x -= 1
    if (this.isDown(MOVE_TOKENS.right)) x += 1
    if (this.isDown(MOVE_TOKENS.up)) y -= 1
    if (this.isDown(MOVE_TOKENS.down)) y += 1

    if (x !== 0 && y !== 0) {
      x *= Math.SQRT1_2
      y *= Math.SQRT1_2
    }

    return { x, y }
  }
}
