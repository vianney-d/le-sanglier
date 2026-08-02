# Roadmap

Découpage en jalons hebdomadaires. Chaque jalon vise une version **jouable
et testable en ligne** (lien GitHub Pages), même minime. Un jalon n'est
"terminé" que quand le build déployé correspond à son objectif — pas quand
le code est écrit en local.

Statuts : `à faire` / `en cours` / `fait`.

## Jalon 0 — Pipeline

**Objectif** : prouver que la chaîne outil → build → déploiement → lien
testable fonctionne, avant tout gameplay.

- [x] Scaffold Vite + TypeScript + Phaser
- [x] Scène placeholder qui s'affiche (texte "LE SANGLIER")
- [x] Repo GitHub créé et poussé (https://github.com/vianney-d/le-sanglier)
- [x] Workflow GitHub Actions qui build et déploie sur GitHub Pages
- [x] Lien Pages vérifié (HTTP 200) — https://vianney-d.github.io/le-sanglier/
- [ ] Vérifié à l'œil sur mobile par l'utilisateur

**Statut** : fait (reste juste une vérification visuelle mobile de ton côté)

## Jalon 1 — Jean bouge

**Objectif** : Jean se déplace dans une scène vide au clavier/souris.

- [x] Placeholder de Jean affiché (rectangle, pas encore de sprite réel —
      dépend du choix d'outil de génération d'assets, voir BACKLOG)
- [x] Déplacement 8 directions, clavier (flèches + WASD), vitesse normalisée
      en diagonale, borné aux limites de l'écran de jeu
- [x] Couche d'abstraction des inputs (`InputController`) pour brancher le
      tactile plus tard sans dupliquer la logique de mouvement
- [x] Déployé sur le lien Pages
- [ ] Vérifié à l'œil par toi (desktop + mobile)

**Statut** : fait côté déploiement, reste ta vérification visuelle

## Jalon 2 — Jean tape

**Objectif** : Jean a un combo de coups testable (pas d'ennemis réels
avant le Jalon 3 — on ajoute un mannequin passif pour avoir quelque chose
à frapper et vérifier que ça marche).

- [x] Touche d'attaque (Espace / clic gauche), abstraite comme le
      mouvement (même logique que pour le futur bouton tactile)
- [x] Jean garde en mémoire sa dernière direction de mouvement comme
      direction "de face", pour savoir où porter le coup à l'arrêt
- [x] Combo 3 coups : chaque appui dans une fenêtre de temps courte après
      le précédent enchaîne ; sinon ça repart au coup 1
- [x] Mannequin cible statique dans la scène, qui flashe et pulse
      visuellement quand touché, pour valider la détection de coup
- [x] Déployé sur le lien Pages
- [ ] Vérifié à l'œil par toi

**Statut** : fait côté déploiement, reste ta vérification

## Jalon 3 — La horde

**Objectif** : une vraie mini-vague d'ennemis à vaincre, plutôt que le
mannequin statique du Jalon 2 (retiré, devenu inutile).

- [x] Ennemi basique (carré rouge) qui poursuit Jean à vue, s'arrête à
      distance de mêlée
- [x] Spawner : vague de 8 ennemis au total, apparaissant sur les bords de
      l'écran, avec un maximum de 4 vivants en même temps (pour garder le
      rythme gérable)
- [x] Le combo de Jean tue un ennemi en un coup (thème : Jean casse des
      tables en marbre d'un coup de poing) ; un swing peut toucher
      plusieurs ennemis alignés dans son cône
- [x] Compteur "X/8 vaincus" affiché, message de victoire quand la horde
      est vidée
- [x] Déployé sur le lien Pages
- [ ] Vérifié à l'œil par toi

**Statut** : fait côté déploiement, reste ta vérification

## Jalon 4 — Rage du Moscow Mule

**Objectif** : une capacité spéciale à thème, activable, qui change
sensiblement la façon de jouer pendant sa durée.

- [x] Touche dédiée (E), abstraite comme attaque/mouvement
- [x] Pendant 3s : Jean plus rapide (x1,4), ses coups touchent tout autour
      de lui (360°, portée x1,5) au lieu du cône devant lui seulement
- [x] Retour visuel clair : Jean change de couleur pendant la rage
- [x] Cooldown de 8s après usage, affiché à l'écran (prêt / temps restant)
- [x] Déployé sur le lien Pages
- [ ] Vérifié à l'œil par toi

**Statut** : fait côté déploiement, reste ta vérification

## Jalon 5 — Le boss

**Objectif** : boss de fin de niveau, dernier morceau du MVP défini dans
CLAUDE.md (déplacement + horde + boss = mini-niveau complet).

- [x] Apparaît 1s après que la horde est vidée, à l'opposé de Jean
- [x] Plus gros, plus lent qu'un ennemi basique, encaisse 6 coups avant de
      mourir (PV affichés à l'écran)
- [x] Pattern d'attaque simple : le boss se fige un instant (télégraphe
      visuel) puis charge en ligne droite vers la position de Jean à cet
      instant — évitable en bougeant
- [x] Message de victoire ("Niveau terminé !") quand le boss est vaincu
- [x] Déployé sur le lien Pages
- [ ] Vérifié à l'œil par toi

**Statut** : fait côté déploiement, reste ta vérification

**Ce jalon complète le MVP** défini dans CLAUDE.md (déplacement + horde +
boss = mini-niveau complet jouable de bout en bout).

## Jalon 6 — Vrais sprites

**Objectif** : remplacer les rectangles placeholder par de vrais sprites
pixel art pour Jean, l'ennemi basique et le boss.

Outil choisi : **PixelLab.ai** (gratuit, spécialisé sprites de jeu —
génère personnage + variations/animations, contrairement à un générateur
d'images généraliste). Génération faite par l'utilisateur en dehors du
repo, fichiers fournis ensuite pour intégration.

- [x] Jean : idle (4 frames) + marche (6 frames) + attaque (6 frames,
      `cross-punch`), vue de côté face à droite, 64×64 affiché (canvas
      généré 92×92 avec marge d'animation), fond transparent — le flip
      gauche/droite se fait en code (`setFlipX`), pas d'art séparé par
      direction
- [x] Ennemi basique : idle (4 frames) + marche (6 frames), 48×48
      affiché, même logique de flip
- [x] Boss : idle (4 frames) + poursuite/marche (6 frames), 96×96
      affiché — le télégraphe/la charge restent gérés par teinte de
      couleur en code (`setTint`), pas d'anim dédiée
- [x] Sprites intégrés dans Phaser (chargement dans `preload()`,
      remplacement des `Rectangle` par des `Sprite` animés)
- [x] Déployé et vérifié sur le lien Pages

**Statut** : fait — généré via PixelLab.ai (mode standard, vue "side",
1 génération par personnage + 1 génération par animation en mode
template, direction "east" uniquement)

## Jalon 7 — Diversité d'ennemis

**Objectif** : sortir la horde du clone unique (Jalon 3) — introduire 2
types d'ennemis supplémentaires avec un comportement distinct, pour
varier le rythme du combat.

- [x] Ennemi **Rapide** : vitesse nettement supérieure au grunt (170 vs
      90), meurt en 1 coup comme lui (thème "un coup suffit" préservé) —
      force à réagir plus vite / esquiver plutôt qu'à foncer dans le tas
- [x] Ennemi **Costaud** : plus lent que le grunt (55 vs 90), encaisse 2
      coups avant de mourir (premier ennemi de base à rompre le "1 coup
      tue" — cohérent en le présentant comme mieux protégé, armuré),
      sprite plus imposant (64×64 affiché contre 48×48)
- [x] Sprites dédiés générés via PixelLab (mêmes specs que le Jalon 6 :
      vue "side", idle + marche)
- [x] Spawner : à chaque spawn de la vague de 8, le type (grunt/rapide/
      costaud) est tiré aléatoirement
- [x] Déployé et vérifié sur le lien Pages

**Statut** : fait — `Enemy.ts` généralisé en un seul type paramétré
(vitesse/PV/taille/sprite par `EnemyKind` plutôt que 3 classes dupliquées)

## Jalons suivants (non détaillés)

- Contrôles tactiles (joystick virtuel + boutons) sur la même abstraction
  d'inputs que le clavier/souris

Ces jalons seront détaillés (scope précis, checklist) un par un, juste avant
d'y attaquer — pas à l'avance, pour rester adaptable.
