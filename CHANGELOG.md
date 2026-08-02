# Changelog

Une entrée par version déployée sur le lien testable, la plus récente en
haut. Chaque entrée dit ce qui est réellement jouable/vérifiable dans ce
build, pas juste ce qui a été codé.

## [Jalon 7] — Diversité d'ennemis

- 2 nouveaux types d'ennemis en plus du grunt : **Rapide** (véloce,
  meurt en 1 coup) et **Costaud** (lent, encaisse 2 coups, plus gros et
  armuré) — tirés aléatoirement à chaque spawn de la horde
- Sprites dédiés générés via PixelLab.ai, idle + marche
- En ligne : https://vianney-d.github.io/le-sanglier/

## [Jalon 6] — Vrais sprites

- Rectangles placeholder remplacés par de vrais sprites pixel art pour
  Jean, l'ennemi basique et le boss (générés via PixelLab.ai)
- Jean : idle, marche et attaque (combo) animés ; ennemi et boss : idle
  et marche/poursuite animés
- Flip gauche/droite en code (un seul art par personnage, vue de côté)
- Télégraphe/charge du boss et Rage de Jean toujours rendus par teinte
  de couleur (`setTint`), pas d'anim dédiée
- Fix : affichage mobile — `#game`/`html`/`body` n'avaient pas de
  dimensions explicites, donc `Scale.FIT` de Phaser n'avait rien sur
  quoi caler l'échelle (canvas illisible/mal cadré sur petit écran) ;
  passage en `100vw`/`100vh`
- En ligne : https://vianney-d.github.io/le-sanglier/

## [Jalon 5] — Le boss

- Boss apparaît 1s après la horde vidée, à l'opposé de la position de Jean
- 6 PV, affichés à l'écran ; plus gros et plus lent qu'un ennemi basique
- Pattern : télégraphe visuel puis charge en ligne droite, évitable en
  bougeant
- Message "Niveau terminé !" quand le boss est vaincu
- **MVP atteint** : mini-niveau complet jouable de bout en bout
  (déplacement → horde → boss)
- En ligne : https://vianney-d.github.io/le-sanglier/

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
