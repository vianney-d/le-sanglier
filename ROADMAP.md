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

## Jalons suivants (non détaillés)

- Attaque de base + combo de coups
- Une horde d'ennemis basique qui spawn et poursuit Jean
- Capacité spéciale de Jean (à thème Moscow Mule/rage)
- Boss simple en fin de niveau
- → Jalon "mini-niveau complet" (le MVP défini dans CLAUDE.md) atteint quand
  ces éléments sont assemblés en une boucle jouable de bout en bout
- Contrôles tactiles (joystick virtuel + boutons) sur la même abstraction
  d'inputs que le clavier/souris

Ces jalons seront détaillés (scope précis, checklist) un par un, juste avant
d'y attaquer — pas à l'avance, pour rester adaptable.
