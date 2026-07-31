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

Jalon 0 (pipeline) et Jalon 1 (Jean se déplace) faits. Jalon 2 (Jean tape,
combo 3 coups contre un mannequin de test) codé, en cours de déploiement —
voir [ROADMAP.md](ROADMAP.md) pour le détail des cases cochées.

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
- **Moveset de Jean (premier jalon)** : combo de coups + une capacité
  spéciale à thème (piste : liée au Moscow Mule / à la rage).

## Premier jalon (MVP)

Un mini-niveau complet et jouable :
- déplacement de Jean,
- une horde d'ennemis qui spawnent,
- un boss simple en fin de niveau.

Boucle courte mais complète, pas juste un prototype technique isolé.

## À trancher plus tard

- Outil de génération d'assets IA (pixel art).
- Design détaillé du moveset (nombre de coups du combo, nature exacte de la
  capacité spéciale).
- Structure de progression au-delà du premier niveau (arbre de compétences,
  hordes/boss suivants, etc.).

## Structure actuelle

- `src/main.ts` — point d'entrée, crée le `Phaser.Game` et enregistre les
  scènes.
- `src/scenes/PlayScene.ts` — scène de jeu actuelle : affiche Jean
  (placeholder rectangle, pas de sprite réel tant que l'outil d'assets IA
  n'est pas choisi), gère son déplacement, sa direction de face (dernière
  direction de mouvement non nulle), et son attaque (combo 3 coups, portée
  + cône devant Jean) contre le mannequin de test.
- `src/entities/Dummy.ts` — cible statique passive (pas d'IA, pas de PV)
  utilisée pour valider la détection de coup avant que de vrais ennemis
  n'existent (Jalon 3).
- `src/input/InputController.ts` — abstraction des inputs de mouvement et
  d'attaque (actuellement clavier flèches/WASD/ZQSD + Espace/clic pour
  attaquer, `consumeAttack()` edge-triggered). Détecte chaque touche de
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
- Pas encore de dossier `entities/`/`assets/` séparé — à introduire quand
  Jean a un vrai sprite ou qu'un deuxième personnage (ennemi) arrive.

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
