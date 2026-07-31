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

## Jalons suivants (non détaillés)

- Capacité spéciale de Jean (à thème Moscow Mule/rage)
- Boss simple en fin de niveau
- → Jalon "mini-niveau complet" (le MVP défini dans CLAUDE.md) atteint quand
  ces éléments sont assemblés en une boucle jouable de bout en bout
- Contrôles tactiles (joystick virtuel + boutons) sur la même abstraction
  d'inputs que le clavier/souris

Ces jalons seront détaillés (scope précis, checklist) un par un, juste avant
d'y attaquer — pas à l'avance, pour rester adaptable.
