import Phaser from 'phaser'

interface AnimSpec {
  frames: number
  frameRate: number
}

export type CharacterAnimConfig = Record<string, AnimSpec>

const BASE_PATH = `${import.meta.env.BASE_URL}assets/sprites/`

/** Queues load.image calls for every frame of every animation of a character. Call from Scene.preload(). */
export function preloadCharacter(scene: Phaser.Scene, character: string, config: CharacterAnimConfig): void {
  for (const [anim, { frames }] of Object.entries(config)) {
    for (let i = 0; i < frames; i++) {
      scene.load.image(`${character}-${anim}-${i}`, `${BASE_PATH}${character}/${anim}_${i}.png`)
    }
  }
}

/** Registers the anims (non-looping for "attack", looping otherwise). Call from Scene.create() after preload. */
export function createCharacterAnims(scene: Phaser.Scene, character: string, config: CharacterAnimConfig): void {
  for (const [anim, { frames, frameRate }] of Object.entries(config)) {
    scene.anims.create({
      key: `${character}-${anim}`,
      frames: Array.from({ length: frames }, (_, i) => ({ key: `${character}-${anim}-${i}` })),
      frameRate,
      repeat: anim === 'attack' ? 0 : -1,
    })
  }
}
