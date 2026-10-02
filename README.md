# Garde sous vigilance

Serious game d’hygiène hospitalière destiné aux internes aux urgences. Version pédagogique **v0.4.0**, du 2 octobre 2026.

**[Jouer en ligne](https://jetpod.github.io/garde-sous-vigilance/)** · [Consulter le dépôt](https://github.com/JETPOD/garde-sous-vigilance)

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
| `analytics.js` | Filtrage fermé des événements et préférence de suivi pédagogique |
| `base.css`, `style.css` | Mise en forme responsive |
| `scene.webp` | Illustration d’ambiance générée par IA |
| `.nojekyll` | Publication directe des fichiers statiques |

Les questions médicales, les choix de réponses et les circuits organisationnels doivent être relus après chaque modification. Le simple déploiement technique n’atteste pas de leur validation clinique.

## Mesure d’audience et confidentialité

Le site public utilise Plausible pour mesurer les pages vues et les événements suivants :

- `Jeu démarré`
- `Dossier 01 démarré` à `Dossier 09 démarré`
- `Dossier 01 terminé` à `Dossier 09 terminé`
- `Parcours terminé`

Depuis la v0.4.0, cinq événements pédagogiques supplémentaires par dossier comptent les décisions adaptées, les décisions à revoir, les erreurs critiques, ainsi que les bilans avec ou sans erreur critique. Les 45 nouveaux objectifs s’ajoutent aux 20 objectifs de fréquentation, soit 65 au total ; toutes les 36 décisions contribuent, sans transmettre leur numéro ni leur contenu.

Le suivi ne transmet ni nom, ni réponse cochée, ni score individuel exact, ni identifiant d’apprenant ou de tentative. Les événements utilisent des noms distincts par dossier afin de ne pas dépendre des propriétés personnalisées de Plausible. Le script de mesure ne se charge que sur `jetpod.github.io`, et non dans les prévisualisations ou lors des tests locaux.

Le suivi automatique des liens sortants, des téléchargements et des formulaires est désactivé. L’URL est transmise sans paramètres ni fragment et le référent est supprimé ; aucune propriété personnalisée ou valeur de revenu n’est envoyée. Une liste fermée limite les noms d’événements autorisés.

Le début du jeu est compté une seule fois pendant la vie de la page, à l’ouverture du premier dossier. Chaque nouvelle tentative d’un dossier est comptée, mais une reprise, un retour au menu ou la consultation d’un débriefing ne crée pas de nouveau démarrage. Un dossier est terminé au passage à son débriefing après quatre décisions. Un parcours complet est compté une seule fois lorsque les neuf dossiers ont été terminés dans la même page, quel que soit leur ordre ou le score. Un rechargement commence une nouvelle séquence de jeu ; ces compteurs ne sont pas un décompte de personnes physiques ni une validation de formation.

Voir [le guide de configuration Plausible](ANALYTICS.md) pour activer l’affichage des événements dans le tableau de bord privé.

Le test local `node test-analytics.cjs` vérifie les 45 noms autorisés, le nettoyage des données transmises et la désactivation. Il n’envoie aucune requête à Plausible.

Le bouton d’information sur l’accueil ouvre la notice et la désactivation du suivi pédagogique. Le choix reste en mémoire uniquement pendant l’ouverture de la page ; après rechargement, il faut le renouveler. Il ne désactive pas les événements de fréquentation. Les bilans pédagogiques avec et sans erreur critique ont leur propre dénominateur pour éviter de mélanger les joueurs ayant désactivé le suivi avec les autres.

Plausible fonctionne sans cookie ni identifiant persistant. Sa [politique de données](https://plausible.io/data-policy) explique le traitement transitoire de l’adresse IP et du navigateur pour produire des statistiques quotidiennes agrégées. Une information correspondante est affichée dans l’écran « Référentiels » du jeu.

La police General Sans est chargée depuis Fontshare et les liens de références ouvrent des sites externes.

Ne pas introduire de données de patients réels dans les scénarios ou les contributions. Ce dépôt ne contient que le jeu, ses références et sa documentation, sans historique de conversation ni fichiers de travail internes.
