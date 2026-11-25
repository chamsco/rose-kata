# Gilded Rose — kata de refactorisation en TypeScript

Ce dépôt présente une reprise progressive d'un code legacy : comprendre le comportement existant, le protéger par des tests, améliorer sa lisibilité, puis ajouter une règle métier. La classe `Item` reste inchangée, comme l'exige le kata.

Le cas est volontairement petit. La démarche est celle que j'appliquerais dans un produit déjà en service : réduire l'incertitude avant de modifier, vérifier les effets observables, avancer par changements faciles à relire et expliciter les décisions qui nécessitent une validation métier.

## Démarrer

Prérequis : Node.js 22.18 ou ultérieur. Les tests utilisent le support TypeScript natif de Node ; le compilateur TypeScript est utilisé pour la vérification des types.

```bash
npm install
npm test
npm run coverage
npm run typecheck
npm run texttest
```

`npm test` exécute les tests métier et le test d'équivalence avec le comportement historique. `npm run coverage` mesure la couverture du dossier `app/`. `npm run texttest` affiche le résultat du scénario de démonstration sur 30 jours.

## Démarche de travail

L'implémentation suit des étapes courtes pour rendre le raisonnement vérifiable :

1. **Observer le point de départ.** Le code du kata et son scénario TextTest sont conservés comme référence.
2. **Écrire les exemples métier.** Les attentes sont tirées du cahier des charges, indépendamment de la sortie de l'implémentation.
3. **Ajouter un filet de compatibilité.** Une copie figée de l'ancien comportement sert d'oracle pendant le refactoring. Les deux implémentations sont comparées sur 13 039 combinaisons d'articles, de dates et de qualités, pendant deux jours.
4. **Refactoriser progressivement.** La boucle est clarifiée, la logique d'un article est isolée, les chemins par type sont rendus explicites et les opérations communes sont nommées.
5. **Ajouter Conjured en TDD.** Les cas sont d'abord écrits sous forme de tests, puis l'implémentation est étendue.

Des mutations manuelles ont aussi servi à vérifier la capacité de détection des tests : 7 des 9 changements erronés ont été détectés. Les 2 autres ne modifiaient pas le résultat observable dans les cas concernés.

## Choix de conception

- `Item` n'est pas modifiée. Le traitement est donc séparé dans la fonction d'actualisation et aiguillé selon le nom de l'article.
- Les règles métier sont isolées dans de petites fonctions nommées, plutôt que réparties dans des conditions imbriquées.
- Les bornes de qualité sont appliquées aux règles qui augmentent ou diminuent la qualité. Une valeur initiale hors limites n'est pas corrigée, afin de conserver la compatibilité avec le comportement historique.
- Il n'y a pas de hiérarchie de classes : pour cinq règles fixes, elle ajouterait de la structure sans simplifier le changement. Une table de règles serait à réévaluer si les règles devenaient nombreuses ou configurables.
- L'oracle historique est un outil temporaire de sécurisation. Après validation des écarts avec le métier, les tests décrivant les règles doivent être la référence durable.

## Questions métier ouvertes

Ces comportements sont conservés parce qu'ils existent dans le legacy, mais ils méritent une confirmation avant une évolution produit :

- `Aged Brie` augmente de 2 après sa date de vente, alors que cette nuance n'est pas explicitée dans le cahier des charges.
- Un article `Conjured` est reconnu par le préfixe exact `Conjured `, sensible à la casse.
- Le comportement de `Conjured Aged Brie` n'est pas défini par le kata.

## Présenter le projet

Le [guide d'entretien](docs/guide-entretien.md) propose un déroulé oral, les démonstrations à préparer, les questions à poser dans un projet existant avec Next.js, NestJS et une base de données, ainsi que des questions d'entretien possibles.

## Arborescence

```text
app/    implémentation TypeScript
test/   tests métier, oracle historique et scénario TextTest
docs/   support de présentation pour l'entretien
```

## Limites connues

Le constructeur de `Item` est laissé non typé pour respecter la forme du kata ; `noImplicitAny` est donc désactivé. La copie de l'ancienne logique dans les tests est volontaire et sert uniquement de référence de compatibilité.
