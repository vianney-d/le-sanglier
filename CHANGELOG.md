# Changelog

Une entrée par version déployée sur le lien testable, la plus récente en
haut. Chaque entrée dit ce qui est réellement jouable/vérifiable dans ce
build, pas juste ce qui a été codé.

## [Jalon 1] — Jean bouge

- Jean (placeholder rectangle) se déplace au clavier (flèches/WASD), 8
  directions, bloqué aux bords de l'écran
- Couche d'abstraction des inputs (`InputController`) prête pour brancher
  une source tactile plus tard sans dupliquer la logique
- Fix : détection des touches par position physique (`KeyboardEvent.code`)
  plutôt que par caractère, pour que ZQSD fonctionne nativement sur clavier
  AZERTY sans configuration
- En ligne : https://vianney-d.github.io/le-sanglier/

## [Jalon 0] — pipeline

- Scaffold Vite + TypeScript + Phaser
- Scène placeholder affichant "LE SANGLIER — pipeline OK"
- Déploiement GitHub Pages automatique sur push vers `main`
- En ligne : https://vianney-d.github.io/le-sanglier/
