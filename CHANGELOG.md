# Changelog

Une entrée par version déployée sur le lien testable, la plus récente en
haut. Chaque entrée dit ce qui est réellement jouable/vérifiable dans ce
build, pas juste ce qui a été codé.

## [Jalon 4] — Rage du Moscow Mule

- Capacité spéciale (touche E) : 3s de rage, +40% vitesse, coups en 360°
  autour de Jean (portée x1,5) au lieu du cône devant lui
- Retour visuel : Jean passe au rouge-orangé pendant la rage
- Cooldown de 8s affiché à l'écran (prêt / temps restant)
- En ligne : https://vianney-d.github.io/le-sanglier/

## [Jalon 3] — La horde

- Ennemis basiques qui poursuivent Jean et s'arrêtent à distance de mêlée
- Spawner : vague de 8 ennemis, max 4 vivants simultanément
- Le combo de Jean tue en un coup, peut toucher plusieurs ennemis alignés
- Compteur de vaincus + message de victoire quand la horde est vidée
- Retrait du mannequin de test (Jalon 2), devenu inutile
- En ligne : https://vianney-d.github.io/le-sanglier/

## [Jalon 2] — Jean tape

- Attaque (Espace ou clic gauche), combo 3 coups avec fenêtre de chaînage
- Jean garde sa dernière direction de mouvement comme direction de face
- Mannequin cible statique qui flashe/pulse et compte les coups reçus,
  pour valider la détection de coup (pas encore un vrai ennemi)
- En ligne : https://vianney-d.github.io/le-sanglier/

## [Jalon 1] — Jean bouge

- Jean (placeholder rectangle) se déplace au clavier (flèches/WASD), 8
  directions, bloqué aux bords de l'écran
- Couche d'abstraction des inputs (`InputController`) prête pour brancher
  une source tactile plus tard sans dupliquer la logique
- Fix : détection des touches par position physique (`KeyboardEvent.code`)
  plutôt que par caractère, pour que ZQSD fonctionne nativement sur clavier
  AZERTY sans configuration
- Fix : `code` ne remappait pas correctement Z/Q sur certains
  navigateurs/OS (S/D non affectés car identiques aux deux layouts) —
  ajout de `event.key` en complément pour fiabiliser
- Fix : W/A (caractères QWERTY) déclenchaient aussi le déplacement sur
  AZERTY par effet de bord du fallback précédent — retirés, seul le
  caractère AZERTY (Z/Q) sert de fallback
- En ligne : https://vianney-d.github.io/le-sanglier/

## [Jalon 0] — pipeline

- Scaffold Vite + TypeScript + Phaser
- Scène placeholder affichant "LE SANGLIER — pipeline OK"
- Déploiement GitHub Pages automatique sur push vers `main`
- En ligne : https://vianney-d.github.io/le-sanglier/
