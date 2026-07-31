import Phaser from 'phaser'

export interface Direction {
  x: number
  y: number
}

// Two complementary signals, because neither is reliable alone:
// - `code` identifies a key by physical position (QWERTY's "W" spot reports
//   "KeyW" even though it's labeled Z on AZERTY) — but some browser/OS
//   combos don't remap the swapped Q/A and W/Z keys correctly in `code`.
// - `key` is the actual character produced. Only used as a fallback for the
//   two keys that actually move between layouts (Q/A and W/Z, via their
//   AZERTY characters) — not their QWERTY characters, which would match a
//   different, unrelated physical key on AZERTY. S/D never needed this:
//   same character, same position, on both layouts.
const MOVE_TOKENS = {
  up: ['arrowup', 'keyw', 'z'],
  down: ['arrowdown', 'keys'],
  left: ['arrowleft', 'keya', 'q'],
  right: ['arrowright', 'keyd'],
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
