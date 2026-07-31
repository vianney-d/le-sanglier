import Phaser from 'phaser'

class BootScene extends Phaser.Scene {
  constructor() {
    super('boot')
  }

  create() {
    const { width, height } = this.scale

    this.add
      .text(width / 2, height / 2 - 20, 'LE SANGLIER', {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#e8b04b',
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, height / 2 + 20, 'pipeline OK — v0.1', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#888888',
      })
      .setOrigin(0.5)
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#111111',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene],
})
