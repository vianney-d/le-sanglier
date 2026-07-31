# CLAUDE.md

Ce fichier guide Claude Code pour ce projet. Il est mis à jour au fil des
décisions — dès qu'un choix de stack, d'architecture ou de scope est pris ou
change, ce fichier doit être mis à jour dans la foulée.

## Concept

**Le Sanglier** est un hack'n'slash 2D jouable dans le navigateur.

Le héros, **Jean**, est un sanglier humanoïde surpuissant qui carbure au
Moscow Mule — un seul coup de poing lui suffit à casser une table en marbre.
Il vit des aventures épiques, affronte des hordes d'ennemis et des boss
surpuissants.

## Statut actuel

Jalons 0 à 4 faits. Jalon 5 (boss de fin de niveau) codé, en cours de
déploiement — voir [ROADMAP.md](ROADMAP.md) pour le détail des cases
cochées. **Ce jalon complète le MVP** (déplacement + horde + boss = un
mini-niveau jouable de bout en bout, thème rectangles placeholder — pas
encore de vrais sprites/assets).

## Organisation produit

Ce projet avance par **jalons hebdomadaires**, chacun visant une version
jouable déployée sur un lien testable (pas juste du code local) :

- **[ROADMAP.md](ROADMAP.md)** — jalons planifiés, dans l'ordre, avec leur
  objectif et leur statut. Source de vérité sur "c'est quoi la suite".
- **[BACKLOG.md](BACKLOG.md)** — idées/tâches identifiées mais pas encore
  affectées à un jalon.
- **[CHANGELOG.md](CHANGELOG.md)** — une entrée par version déployée,
  décrivant ce qui est réellement jouable dans ce build.
- **Déploiement** : GitHub Pages via GitHub Actions
  (`.github/workflows/deploy.yml`), déclenché à chaque push sur `main`.
  Choisi plutôt que Vercel/Netlify parce que `gh` était déjà authentifié
  dans l'environnement et qu'aucun compte externe n'était donc nécessaire ;
  basculer plus tard reste trivial (c'est juste un build statique).

Un jalon n'est marqué "fait" dans la roadmap que quand le lien déployé
correspond à son objectif — pas quand le code est juste écrit en local.

## Décisions prises

- **Plateforme** : jeu web (navigateur). Compatibilité mobile à prévoir mais
  pas prioritaire sur l'itération initiale (voir Contrôles ci-dessous).
- **Stack technique** : Phaser 3 + TypeScript + Vite.
  - Phaser gère nativement sprites, animations, collisions et physique
    arcade — pertinent pour un hack'n'slash 2D, bonne doc/communauté.
  - Écarté : Godot (export HTML5 plus lourd à charger dans un navigateur),
    PixiJS seul (demanderait de recoder la boucle de jeu, collisions, etc.
    à la main sans bénéfice ici).
- **Style visuel** : 2D pixel art.
- **Assets** : générés par IA (outil pas encore choisi — à trancher quand la
  prod d'assets démarrera réellement).
- **Équipe** : développement solo, assets produits via IA.
- **Contrôles** : développement et équilibrage du gameplay d'abord au
  clavier/souris (itération plus rapide) via une couche d'abstraction des
  inputs ; ajout ensuite d'un joystick virtuel + boutons tactiles pour le
  mobile, branchés sur la même abstraction plutôt que dupliqués.
- **Moveset de Jean** : combo 3 coups (portée + cône devant lui) et une
  capacité spéciale "Rage du Moscow Mule" (touche E, 3s, +40% vitesse,
  coups en 360° portée x1,5, cooldown 8s).

## MVP — atteint (Jalon 5)

Un mini-niveau complet et jouable :
- déplacement de Jean,
- une horde d'ennemis qui spawnent,
- un boss simple en fin de niveau.

Boucle courte mais complète, pas un prototype technique isolé. Tout est
encore en rectangles placeholder (pas de vrais sprites) — la prochaine
étape naturelle est soit les contrôles tactiles (roadmap), soit du contenu
au-delà du MVP (plusieurs niveaux, progression, vrais assets).

## À trancher plus tard

- Outil de génération d'assets IA (pixel art).
- Structure de progression au-delà du premier niveau (arbre de compétences,
  hordes/boss suivants, etc.).

## Structure actuelle

- `src/main.ts` — point d'entrée, crée le `Phaser.Game` et enregistre les
  scènes.
- `src/scenes/PlayScene.ts` — scène de jeu actuelle : affiche Jean
  (placeholder rectangle, pas de sprite réel tant que l'outil d'assets IA
  n'est pas choisi), gère son déplacement, sa direction de face (dernière
  direction de mouvement non nulle), son attaque (combo 3 coups, portée +
  cône devant Jean, partagée avec les ennemis et le boss via
  `isInAttackRange()`), le spawner de la horde (vague de 8 ennemis, max 4
  vivants simultanément), le spawn et le suivi du boss après la horde, et
  la capacité Rage (touche E, `consumeAbility()`, cooldown/durée gérés par
  comparaison de timestamps `time` plutôt que des timers Phaser séparés).
  `objectiveText` reflète l'état courant (horde → boss → victoire) dans un
  seul texte, mis à jour chaque frame.
- `src/entities/Enemy.ts` — ennemi basique : poursuit Jean à vue, s'arrête
  à distance de mêlée, meurt en un coup (pas d'IA plus poussée, pas de PV
  — cohérent avec le thème "un coup de poing suffit"). Le mannequin de
  test du Jalon 2 (`Dummy.ts`) a été retiré, devenu redondant.
- `src/entities/Boss.ts` — premier ennemi avec de vrais PV (6, seul cas
  pour l'instant — ne pas ajouter de PV à `Enemy` sans besoin réel). Machine
  à états `idle`/`telegraph`/`charging` : poursuit comme un ennemi basique,
  puis périodiquement se fige (télégraphe visuel) avant de charger en
  ligne droite vers la position de Jean au moment du télégraphe.
- `src/input/InputController.ts` — abstraction des inputs de mouvement,
  d'attaque et de capacité (clavier flèches/WASD/ZQSD, Espace/clic pour
  attaquer, E pour la capacité — `consumeAttack()`/`consumeAbility()`
  edge-triggered). Détecte chaque touche de
  mouvement à la fois par `KeyboardEvent.code` (position physique — la
  touche à la position QWERTY "W" reste "KeyW" même labellée Z sur AZERTY)
  et par `event.key` (caractère réellement produit) en complément, car
  `code` ne remappe pas toujours correctement Q/A et W/Z selon
  navigateur/OS (bug connu ouvert, voir BACKLOG — W/A déclenchent encore
  un déplacement dans certains cas malgré le fix). Ne pas revenir aux
  `Key`/`CursorKeys` de Phaser (basés sur `keyCode`, déprécié et peu
  fiable) pour cette raison. Toute nouvelle source d'input (tactile) doit
  exposer la même interface (`getDirection()`/`consumeAttack()`) plutôt
  que dupliquer la logique dans les scènes.
- `vite.config.ts` — `base: './'` (chemins relatifs, nécessaire pour que le
  build fonctionne servi depuis un sous-chemin GitHub Pages).
- `.github/workflows/deploy.yml` — build + déploiement Pages sur push
  `main`.
- Pas encore de dossier `assets/` séparé — à introduire quand Jean/les
  ennemis ont un vrai sprite plutôt que des rectangles placeholder.

## Pour Claude Code

- Ne pas commencer à coder du gameplay sans confirmation explicite de
  l'utilisateur sur l'étape en cours — ce projet avance par petites
  décisions validées une à une, pas par implémentation autonome. (La mise en
  place d'outillage/process comme ce scaffold ou les docs produit ne
  compte pas comme "gameplay".)
- Dès qu'une structure de dossiers/architecture change, mettre à jour la
  section "Structure actuelle" ci-dessus.
- À chaque jalon complété, mettre à jour ROADMAP.md (statut) et
  CHANGELOG.md (nouvelle entrée) dans le même geste que le code — ne pas
  laisser ces docs dériver du repo réel.
