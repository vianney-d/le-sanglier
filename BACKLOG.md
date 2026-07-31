# Backlog

Idées et tâches identifiées mais pas encore planifiées dans un jalon
(voir [ROADMAP.md](ROADMAP.md)). Quand une entrée est prise dans un jalon,
elle est retirée d'ici.

Pas de tri par priorité formel pour l'instant — le tri se fait en discussion
au moment de planifier le jalon suivant.

## Gameplay

- Choisir le nombre de coups du combo de Jean et leur timing
- Concevoir la capacité spéciale (piste : rage/Moscow Mule)
- Définir 2-3 types d'ennemis basiques (pas juste un clone recoloré)
- Concevoir le premier boss (pattern d'attaque, condition de victoire)

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

## Technique

- Choisir l'outil de génération d'assets IA (pixel art)
- Système de particules/feedback visuel pour les coups qui "cassent" des
  choses (cohérent avec le thème "casse une table en marbre")
- Étudier la perf mobile réelle une fois le jalon 1 en ligne (pas avant —
  pas de sur-optimisation prématurée)

## Produit / process

- Décider si on garde GitHub Pages ou si on bascule vers Vercel/Netlify une
  fois que le besoin de preview par branche devient utile
