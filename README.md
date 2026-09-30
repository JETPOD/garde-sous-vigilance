# Garde sous vigilance

Serious game d’hygiène hospitalière destiné aux internes aux urgences. Version pédagogique **v0.3.1**, du 30 septembre 2026.

## Objectif

S’entraîner à repérer un risque infectieux, choisir les protections, organiser les gestes et transmettre une alerte. Le parcours propose **9 situations fictives et 36 décisions corrigées**, pour environ 45 minutes ; chaque dossier peut aussi être ouvert indépendamment.

## Situations proposées

- **Risque de portage d’EPC** : le détail dans le dossier.
- **Suspicion de tuberculose contagieuse** : une toux qui dure.
- **EPI pour une intubation à risque respiratoire** : avant le premier geste.
- **Repérage REB générique** : le voyage ne dit pas tout.
- **Suspicion de diphtérie ORL** : une angine pas comme les autres.
- **Suspicion de FHV Ebola** : sans saignement, pas sans risque.
- **MERS-CoV après exposition hospitalière** : une toux presque banale.
- **Suspicion de grippe zoonotique** : un œil rouge, une exposition.
- **Contre-exemple REB et recherche de paludisme** : le voyage n’est pas le diagnostic.

## Cadre pédagogique et sécurité

Ce prototype n’est ni un protocole de soins, ni un examen validant, ni une attestation. Une relecture par l’EOH et les référents concernés, une adaptation aux circuits locaux et un test avec les apprenants sont nécessaires avant utilisation institutionnelle.

Les définitions de cas, zones à risque et alertes sanitaires doivent être actualisées avant utilisation. Les expositions des scénarios sont fictives ; les références datées figurent dans les corrections et dans l’écran « Référentiels ».

Hors des horaires de présence de l’EOH, les mesures immédiates sont coordonnées par le senior selon les protocoles locaux. Les soins et alertes urgentes n’attendent pas l’EOH ; une transmission tracée permet la reprise du suivi à ses horaires de présence.

Les dossiers à haut risque entraînent notamment au repérage et à l’appel d’une équipe expérimentée. Ils ne constituent pas une formation à l’intervention autonome ou aux techniques de prise en charge des agents à haut risque.

## Fonctionnement

- Dossiers avec indices à explorer, questions à choix unique ou multiple.
- Correction après validation, explications et liens vers les référentiels.
- Repérage des erreurs critiques et bilan pédagogique par compétence.
- Reprise d’un dossier interrompu et possibilité de le rejouer pendant la session.
- Interface responsive et thèmes clair/sombre.

La progression est conservée uniquement dans la mémoire de la page. Un rechargement ou une fermeture la réinitialise ; aucun compte ni base de données n’est utilisé.

## Lancement local

L’application est statique : aucun service serveur applicatif ni aucune clé API ne sont nécessaires.

Avec Node.js disponible, ouvrir un terminal dans le dossier du dépôt :

```sh
npx serve .
```

Ouvrir ensuite l’adresse locale affichée par le serveur. Une connexion Internet est nécessaire pour charger la police externe et consulter les références ; l’interface prévoit des polices de remplacement.

## Déploiement GitHub Pages

Dans les paramètres du dépôt, rubrique **Pages** :

1. Choisir **Deploy from a branch**.
2. Sélectionner la branche **main** et le dossier **/ (root)**.
3. Enregistrer puis attendre la fin du déploiement.

Les liens des fichiers du jeu sont relatifs afin de fonctionner sous le sous-chemin du dépôt.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure de l’application |
| `cases.js` | Scénarios, réponses et références |
| `app.js` | Navigation, interactions, scores et débriefings |
| `base.css`, `style.css` | Mise en forme responsive |
| `scene.webp` | Illustration d’ambiance générée par IA |
| `.nojekyll` | Publication directe des fichiers statiques |

Les questions médicales, les choix de réponses et les circuits organisationnels doivent être relus après chaque modification. Le simple déploiement technique n’atteste pas de leur validation clinique.

## Dépendances et confidentialité

La police General Sans est chargée depuis Fontshare. Les liens de références ouvrent des sites externes ; aucun outil de mesure d’audience n’est intégré dans le code du jeu.

Ne pas introduire de données de patients réels dans les scénarios ou les contributions. Ce dépôt ne contient que le jeu, ses références et sa documentation, sans historique de conversation ni fichiers de travail internes.
