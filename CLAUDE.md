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

Jalons 0 à 7 faits — voir [ROADMAP.md](ROADMAP.md) pour le détail des
cases cochées. MVP (déplacement + horde + boss) atteint au Jalon 5 ;
Jalon 6 a remplacé les rectangles placeholder par de vrais sprites pixel
art (Jean, ennemi basique, boss) générés via PixelLab.ai ; Jalon 7 a
ajouté 2 types d'ennemis (Rapide, Costaud) en plus du grunt.

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
- **Assets** : générés par IA via **PixelLab.ai** (gratuit, spécialisé
  sprites de jeu pixel art — génère personnage + animations, contrairement
  à un générateur d'images généraliste). Le serveur MCP PixelLab (scope
  user) permet à Claude Code de générer et télécharger directement les
  sprites depuis la conversation (character standard mode, vue "side",
  direction "east" uniquement — flip en code pour la gauche, voir Jalon 6
  dans ROADMAP.md). Alternative envisagée : Leonardo.ai (plus généraliste,
  écarté — moins pensé pour des sprites de jeu).
- **Équipe** : développement solo, assets produits via IA.
- **Contrôles** : développement et équilibrage du gameplay d'abord au
  clavier/souris (itération plus rapide) via une couche d'abstraction des
  inputs ; ajout ensuite d'un joystick virtuel + boutons tactiles pour le
  mobile, branchés sur la même abstraction plutôt que dupliqués.
- **Moveset de Jean** : combo 3 coups (portée + cône devant lui) et une
  capacité spéciale "Rage du Moscow Mule" (touche E, 3s, +40% vitesse,
  coups en 360° portée x1,5, cooldown 8s).

## MVP — atteint (Jalon 5), vrais sprites — atteint (Jalon 6)

Un mini-niveau complet et jouable :
- déplacement de Jean,
- une horde d'ennemis qui spawnent,
- un boss simple en fin de niveau.

Boucle courte mais complète, pas un prototype technique isolé. Jean,
l'ennemi basique et le boss ont maintenant de vrais sprites pixel art
animés (Jalon 6) — la prochaine étape naturelle est soit les contrôles
tactiles (roadmap), soit du contenu au-delà du MVP (plusieurs niveaux,
progression).

## À trancher plus tard

- Structure de progression au-delà du premier niveau (arbre de compétences,
  hordes/boss suivants, etc.).

## Structure actuelle

- `src/main.ts` — point d'entrée, crée le `Phaser.Game` et enregistre les
  scènes.
- `src/scenes/PlayScene.ts` — scène de jeu actuelle : charge les sprites
  (`preload()`) et déclare leurs animations (`create()`, via
  `src/sprites.ts`), affiche Jean (`Sprite` animé, plus rectangle), gère
  son déplacement, sa direction de face (dernière direction de mouvement
  non nulle, pilote aussi `setFlipX`), son attaque (combo 3 coups, portée +
  cône devant Jean, partagée avec les ennemis et le boss via
  `isInAttackRange()` — joue l'anim `jean-attack`, non bouclée, tant que
  `attackAnimPlaying` est vrai pour ne pas être interrompue par idle/walk),
  le spawner de la horde (vague de 8 ennemis, max 4 vivants simultanément),
  le spawn et le suivi du boss après la horde, et la capacité Rage (touche
  E, `consumeAbility()`, cooldown/durée gérés par comparaison de timestamps
  `time` plutôt que des timers Phaser séparés, rendu par `setTint`/
  `clearTint` plutôt que `setFillStyle` maintenant que Jean est un Sprite).
  `objectiveText` reflète l'état courant (horde → boss → victoire) dans un
  seul texte, mis à jour chaque frame.
- `src/sprites.ts` — helpers partagés `preloadCharacter`/
  `createCharacterAnims` : chargent les frames d'un personnage
  (`public/assets/sprites/<perso>/<anim>_<n>.png`) et déclarent les anims
  Phaser correspondantes (bouclées sauf `attack`). Les anims sont globales
  au `Game` (pas à la scène), donc `Enemy`/`Boss` peuvent jouer
  `enemy-idle`/`enemy-walk`/`boss-idle`/`boss-walk` sans les redéclarer.
- `src/entities/Enemy.ts` — un seul type paramétré par `EnemyKind`
  (`grunt`/`fast`/`tank`, table `STATS` : vitesse/PV/taille/préfixe de
  sprite), plutôt que 3 classes dupliquées — les trois partagent le même
  comportement (poursuite à vue, arrêt à distance de mêlée, `Sprite`
  animé idle/walk avec flip selon le sens de déplacement). `grunt` et
  `fast` meurent en un coup (thème "un coup de poing suffit" préservé) ;
  `tank` est la seule exception avec 2 PV — premier ennemi de base à
  encaisser plus d'un coup. `hit()` retourne `true` si le coup tue
  (PlayScene ne compte l'ennemi comme vaincu que dans ce cas). Le
  mannequin de test du Jalon 2 (`Dummy.ts`) a été retiré, devenu
  redondant.
- `src/entities/Boss.ts` — premier ennemi avec de vrais PV (6, seul cas
  pour l'instant — ne pas ajouter de PV à `Enemy` sans besoin réel).
  `Sprite` animé (idle/walk selon qu'il poursuit ou non) ; machine à
  états `idle`/`telegraph`/`charging` : poursuit comme un ennemi basique,
  puis périodiquement se fige (télégraphe visuel, `setTint`) avant de
  charger en ligne droite (`setTint` différent) vers la position de Jean
  au moment du télégraphe — le télégraphe/la charge restent du tint, pas
  d'anim dédiée (voir Jalon 6 dans ROADMAP.md).
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
- `public/assets/sprites/<jean|enemy|boss>/<idle|walk|attack>_<n>.png` —
  frames de sprites (générés PixelLab.ai, vue "side" face à droite, un
  fichier par frame plutôt qu'une spritesheet packée — chargés
  individuellement par `preloadCharacter`). Servi tel quel par Vite
  (dossier `public/`), donc référencé via `import.meta.env.BASE_URL` dans
  `src/sprites.ts` pour rester valide sous le sous-chemin GitHub Pages.

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
