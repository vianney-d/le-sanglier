# Backlog

Idées et tâches identifiées mais pas encore planifiées dans un jalon
(voir [ROADMAP.md](ROADMAP.md)). Quand une entrée est prise dans un jalon,
elle est retirée d'ici.

Pas de tri par priorité formel pour l'instant — le tri se fait en discussion
au moment de planifier le jalon suivant.

## Gameplay

- Définir 2-3 types d'ennemis basiques (pas juste un clone recoloré) — un
  seul type existe pour l'instant (Jalon 3)

## Bugs connus

- **W et A déclenchent un déplacement alors qu'ils ne devraient pas
  (clavier AZERTY testé)** : ZQSD fonctionne correctement, mais W/A
  bougent aussi Jean alors que `MOVE_TOKENS` dans
  `src/input/InputController.ts` ne les contient plus (retirés dans le
  commit `40fab3a` justement pour corriger ce comportement — sans effet
  observé). Pistes non explorées : cache navigateur/CDN servant un ancien
  bundle malgré le nouveau hash de build, ou un comportement de
  `event.key`/`event.code` différent de ce qui est supposé sur le clavier
  de test. À reproduire avec un hard refresh + DevTools (onglet Network,
  vérifier quel fichier JS est réellement chargé, et logguer
  `event.code`/`event.key` bruts sur keydown) avant de retoucher le code.

- **Affichage mobile toujours trop petit / mal cadré**, malgré le fix
  `100vw`/`100vh` sur `html`/`body`/`#game` (voir CHANGELOG, Jalon 6).
  Vérifié en Playwright (viewport émulé portrait 390×844 et paysage
  844×390) où le canvas se cadrait correctement — mais pas confirmé sur
  téléphone réel par l'utilisateur, qui le trouve toujours trop petit.
  L'émulation de viewport ne suffit donc pas à reproduire le problème ;
  à diagnostiquer sur device réel (Chrome remote debugging via USB, ou
  au moins tester la taille de fenêtre/pixel ratio réels) plutôt qu'en
  devinant depuis un émulateur. Piste possible : `Phaser.Scale.FIT` vs
  un autre mode d'échelle (`RESIZE`, `ENVELOP`), ou le `devicePixelRatio`
  qui fausse le calcul de `Scale.FIT`.

## Technique

- Système de particules/feedback visuel pour les coups qui "cassent" des
  choses (cohérent avec le thème "casse une table en marbre")
- Étudier la perf mobile réelle une fois le jalon 1 en ligne (pas avant —
  pas de sur-optimisation prématurée)

## Produit / process

- Décider si on garde GitHub Pages ou si on bascule vers Vercel/Netlify une
  fois que le besoin de preview par branche devient utile
