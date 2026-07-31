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
- [ ] Déployé et vérifié sur le lien Pages

**Statut** : code fait, reste le déploiement + vérif en ligne

**Ce jalon complète le MVP** défini dans CLAUDE.md (déplacement + horde +
boss = mini-niveau complet jouable de bout en bout).

## Jalons suivants (non détaillés)

- Contrôles tactiles (joystick virtuel + boutons) sur la même abstraction
  d'inputs que le clavier/souris

Ces jalons seront détaillés (scope précis, checklist) un par un, juste avant
d'y attaquer — pas à l'avance, pour rester adaptable.
