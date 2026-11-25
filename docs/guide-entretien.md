# Guide de présentation — Gilded Rose

## Intention

Présenter une manière de prendre en charge un code existant sans prétendre connaître le produit avant d'avoir parlé à l'équipe. Le kata illustre une méthode : établir les faits, protéger les comportements utiles, rendre les règles lisibles, puis livrer un changement ciblé.

Le fil rouge à dire au jury :

> « Avant de changer un système que je ne connais pas, je cherche à comprendre ce qu'il garantit déjà. Je rends ce comportement observable, je vérifie mes hypothèses avec les tests et les personnes qui connaissent le métier, puis j'avance par petits changements que l'équipe peut relire et déployer. »

## Déroulé suggéré — 15 minutes

| Temps | Démonstration | Message à faire passer |
|---|---|---|
| 1 min | Présenter le problème et la contrainte de ne pas modifier `Item`. | On travaille avec les contraintes réelles du système, pas avec une réécriture idéale. |
| 2 min | Parcourir l'arborescence puis le fichier de tests métier. | La démarche sépare les règles, les exemples et l'implémentation ; les tests accompagnent le changement. |
| 3 min | Montrer les tests métier, puis `test/legacy-equivalence.test.ts`. | Les exemples métier expliquent les règles ; l'oracle aide à préserver les cas déjà observés pendant le refactoring. |
| 3 min | Comparer les étapes de simplification de `updateBackstagePasses`. | Rendre une règle visible facilite la revue et diminue le risque d'une évolution suivante. |
| 1 min | Expliquer pourquoi le code n'introduit pas de hiérarchie de classes. | La structure choisie correspond au nombre de règles et aux contraintes présentes. Elle pourra évoluer si le besoin change. |
| 2 min | Montrer les tests Conjured et la modification correspondante. | Le filet de sécurité permet d'ajouter un comportement sans perdre les précédents. |
| 3 min | Relier la démarche à un projet Next.js, NestJS et base de données déjà en service. | Je commence par cartographier les parcours, données, accès, intégrations et procédures de livraison avant de prioriser une intervention. |

## Préparation de la démonstration

À exécuter avant l'entretien :

```bash
npm test
npm run coverage
npm run typecheck
npm run texttest
sed -n '1,240p' app/gilded-rose.ts
sed -n '1,240p' test/gilded-rose.test.ts
sed -n '1,240p' test/legacy-equivalence.test.ts
```

Vérifier que chaque commande fonctionne sur la machine utilisée pour l'entretien. Ouvrir d'avance les fichiers à montrer. Être capable d'expliquer les changements et les limites de chaque test, plutôt que de réciter uniquement les chiffres.

## Transposition à un produit existant

Pour une application dont le frontend Next.js, l'API NestJS et la base de données existent déjà, je commencerais par une courte phase de découverte avec l'équipe :

1. **Comprendre le résultat attendu.** Qui utilise le parcours, quel problème métier est prioritaire, comment sait-on qu'il fonctionne et quelle est la date ou la contrainte de livraison ?
2. **Tracer le parcours de bout en bout.** Depuis l'écran Next.js jusqu'au contrôleur et au service NestJS, aux requêtes et écritures en base, puis aux événements, tâches asynchrones ou services tiers éventuels.
3. **Établir les contraintes de données.** Examiner le schéma, les migrations, les clés et contraintes, les volumes, les règles d'accès, la rétention, les données sensibles et les chemins de restauration. Ne pas modifier le schéma avant d'avoir compris ses consommateurs.
4. **Lire les signaux existants.** Tests, journaux, métriques, erreurs, tickets connus, documentation, historique des changements et procédure de déploiement. Les écarts entre documentation et fonctionnement sont à confirmer avec les responsables du domaine.
5. **Choisir le plus petit filet utile.** Ajouter ou compléter des tests sur le parcours critique : tests unitaires pour une règle, tests d'intégration pour l'API et la base, et un test de bout en bout si le parcours utilisateur le justifie. Préférer les environnements et données de test prévus par l'équipe.
6. **Formuler les inconnues.** Distinguer un bug confirmé d'un comportement historique, d'une décision métier non documentée et d'une dette technique. Demander au métier de trancher les ambiguïtés.
7. **Proposer un ordre de travail réversible.** Traiter d'abord les risques élevés pour les utilisateurs, les données ou la sécurité ; livrer ensuite en changements courts, observables et compatibles avec le processus de revue et de déploiement de l'équipe.

Je ne proposerais pas de gel général des fonctionnalités ni de seuil de couverture arbitraire sans connaître le calendrier, le risque et les pratiques de l'équipe. Je proposerais plutôt une priorité limitée, des critères de réussite mesurables et une vérification en production adaptée à l'impact du changement.

### Exemple de première intervention

Si l'équipe me confie une évolution qui ajoute un champ à un dossier métier, je commencerais par clarifier qui le renseigne, qui peut le consulter, s'il est obligatoire, comment les anciens dossiers doivent se comporter et quels systèmes le consomment. Ensuite, je suivrais une donnée existante similaire dans le schéma, la migration, le DTO/contrôleur NestJS, le client Next.js et les tests. Avec ces éléments confirmés, je proposerais une migration compatible, le changement d'API et d'interface, les tests correspondants et une stratégie de déploiement/retour arrière conforme aux pratiques du projet.

## Questions métier utiles

- Quel utilisateur ou processus dépend de ce comportement ?
- Quelle est la source de vérité pour cette donnée ?
- Que doit-il arriver aux enregistrements existants et aux valeurs absentes ou invalides ?
- Quels rôles peuvent lire ou modifier cette information ?
- Existe-t-il des intégrations, exports ou tâches planifiées qui consomment cette donnée ?
- Quel comportement doit être conservé pour assurer la compatibilité ?
- Quels sont les critères d'acceptation et comment les observer après déploiement ?

## Questions probables du jury

**Pourquoi avoir commencé par des tests ?**

Parce que le code historique contient des décisions qui ne sont pas toutes documentées. Des tests métier rendent les règles attendues explicites ; l'oracle aide à vérifier qu'un refactoring ne change pas silencieusement les sorties. Un oracle ne remplace pas la validation métier : il décrit ce que faisait le programme, pas nécessairement ce qu'il doit faire.

**L'oracle historique ne fige-t-il pas des bugs ?**

Oui, c'est un risque. Je l'utilise comme garde-fou temporaire, puis j'examine les différences et les cas inattendus avec le métier. Une fois les règles acceptées, les tests métier prennent le rôle de référence et l'oracle peut être retiré.

**Pourquoi ne pas créer une classe par article ?**

La contrainte du kata interdit de modifier `Item`, et les quelques comportements se lisent bien dans un aiguillage court. Si le nombre de règles, leurs variantes ou leur configuration augmentaient, je réévaluerais cette structure avec l'équipe.

**Comment choisiriez-vous quoi faire en premier dans une application existante ?**

Je croiserais l'impact métier, le risque pour les données et les utilisateurs, la sécurité, la fréquence des incidents, les dépendances et le coût de validation. Je confirmerais l'ordre avec les personnes responsables du produit et de l'exploitation.

**Comment aborder une migration de base de données ?**

Je vérifie les consommateurs, les volumes, les contraintes et les pratiques de déploiement. Je privilégie une migration compatible avec les versions en cours d'exécution, j'ajoute les contrôles pertinents, et je définis avec l'équipe le suivi, la reprise et le retour arrière possibles avant le déploiement.

**Comment travailleriez-vous avec une IA de développement ?**

Je peux l'utiliser pour accélérer l'exploration ou proposer une première version, mais je reste responsable du résultat : je vérifie les hypothèses, le diff, les tests, les cas limites et la sécurité. Je décris honnêtement les outils utilisés et je dois pouvoir expliquer chaque décision et chaque ligne livrée.

## Repères d'honnêteté

- Ne pas présenter le comportement hérité comme une règle métier approuvée.
- Ne pas annoncer une couverture, un gain ou un délai qui n'a pas été vérifié.
- Expliquer clairement ce qui a été fait avec assistance et ce qui a été compris et validé personnellement.
- Présenter les choix comme des hypothèses révisables lorsque le contexte produit n'est pas encore connu.
