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
- [ ] Repo GitHub créé et poussé
- [ ] Workflow GitHub Actions qui build et déploie sur GitHub Pages
- [ ] Lien Pages ouvert et vérifié sur desktop + mobile

**Statut** : en cours

## Jalon 1 — Jean bouge

**Objectif** : Jean se déplace dans une scène vide au clavier/souris.

- [ ] Sprite/placeholder de Jean affiché
- [ ] Déplacement 8 directions (ou 4, à trancher à l'implémentation)
- [ ] Couche d'abstraction des inputs (pour brancher le tactile plus tard
      sans dupliquer la logique)

**Statut** : à faire

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
