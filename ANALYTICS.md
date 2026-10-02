# Garde sous vigilance · Configuration Plausible

Le suivi minimal, intégré en v0.3.2, est complété en v0.4.0 par un suivi pédagogique agrégé. Le script fourni par le propriétaire est associé au domaine `jetpod.github.io` ; son installation est limitée au chemin `/garde-sous-vigilance/`.

## Terminer la configuration dans le compte

Le code public de suivi ne donne pas accès aux réglages privés du compte. Les objectifs ci-dessous doivent être ajoutés par une personne disposant de cet accès.

Dans Plausible, ouvrir le site **jetpod.github.io**, puis **Settings → Goals → Add goal → Custom event**. Créer les 20 objectifs avec les noms exacts suivants, en respectant les accents, espaces et zéros initiaux :

```text
Jeu démarré
Dossier 01 démarré
Dossier 01 terminé
Dossier 02 démarré
Dossier 02 terminé
Dossier 03 démarré
Dossier 03 terminé
Dossier 04 démarré
Dossier 04 terminé
Dossier 05 démarré
Dossier 05 terminé
Dossier 06 démarré
Dossier 06 terminé
Dossier 07 démarré
Dossier 07 terminé
Dossier 08 démarré
Dossier 08 terminé
Dossier 09 démarré
Dossier 09 terminé
Parcours terminé
```

Plausible demande un objectif correspondant pour afficher un événement personnalisé dans le tableau de bord ; les événements antérieurs à sa création ne sont pas rétroactifs ([documentation Plausible](https://plausible.io/docs/custom-event-goals)). Créer les objectifs avant de diffuser largement le jeu.

## Correspondance des dossiers

| Numéro | Sujet |
|---|---|
| 01 | Risque de portage d’EPC |
| 02 | Suspicion de tuberculose |
| 03 | EPI pour intubation |
| 04 | Repérage REB générique |
| 05 | Diphtérie |
| 06 | FHV Ebola |
| 07 | MERS-CoV |
| 08 | Grippe zoonotique |
| 09 | Retour de voyage et paludisme |

## Vérifier l’affichage

Après création des objectifs, ouvrir le [jeu public](https://jetpod.github.io/garde-sous-vigilance/) dans un navigateur autorisant le script Plausible. Ouvrir un dossier puis terminer ses quatre décisions pour accéder au débriefing.

Dans le tableau de bord, choisir une période incluant le test et vérifier les pages vues puis les objectifs `Jeu démarré`, `Dossier XX démarré` et `Dossier XX terminé`. L’apparition de `Parcours terminé` nécessite de terminer les neuf dossiers pendant la même ouverture de page.

Vérifier également le fuseau horaire du site : **Europe/Paris**. Si d’autres applications du domaine utilisent ultérieurement le même site Plausible, filtrer les pages sur `/garde-sous-vigilance/`.

## Lire correctement les compteurs

- **Pages vues** : chargements de la page, pas nombre de réponses.
- **Jeu démarré** : première ouverture d’un dossier pendant la vie de la page.
- **Dossier démarré** : nouvelle tentative, y compris après un rejeu confirmé. Une reprise ne compte pas comme un nouveau démarrage.
- **Dossier terminé** : arrivée au débriefing après les quatre décisions, indépendamment du score.
- **Parcours terminé** : premier achèvement des neuf dossiers pendant la vie de la page.

Consulter les nombres totaux d’événements pour compter les tentatives. Les visiteurs ou conversions uniques utilisent la méthode d’identification quotidienne de Plausible et ne constituent pas un registre nominatif des apprenants ([définition des métriques](https://plausible.io/docs/metrics-definitions)).

Un rechargement réinitialise le jeu. Les bloqueurs, les restrictions réseau et les interruptions peuvent réduire la collecte ; les compteurs ne garantissent donc pas l’exhaustivité.

## Activer les nouveaux objectifs pédagogiques

Conserver les 20 objectifs existants. Ajouter les 45 noms du fichier [objectifs pédagogiques](PEDAGOGY-GOALS.txt) dans **Settings → Goals → Add goal → Custom event**, avec leurs accents et zéros initiaux, soit 65 objectifs au total.

Ces noms évitent le recours aux propriétés personnalisées, qui sont une fonctionnalité du forfait Business ([documentation Plausible](https://plausible.io/docs/custom-props/introduction)). Aucun changement de forfait n’est effectué par cette mise à jour ; le volume d’événements augmente toutefois puisque chaque décision évaluée produit un événement pédagogique, et une erreur critique un événement supplémentaire.

| Événement, pour chaque dossier 01 à 09 | Déclenchement |
|---|---|
| `Dossier XX décision adaptée` | Validation correcte, selon le barème actuel du jeu. |
| `Dossier XX décision à revoir` | Validation incorrecte, critique ou non. |
| `Dossier XX erreur critique` | En complément de « décision à revoir », si la décision porte le drapeau critique dans le scénario. |
| `Dossier XX bilan sans erreur critique` | Passage au débriefing d’une tentative sans erreur critique. |
| `Dossier XX bilan avec erreur critique` | Passage au débriefing d’une tentative avec au moins une erreur critique. |

Une validation produit exactement un événement « adaptée » ou « à revoir ». L’événement « erreur critique » est un sous-ensemble de « à revoir », pas une troisième catégorie exclusive ; les bilans avec/sans erreur critique sont exclusifs.

Les rejeux contribuent à nouveau, mais la reprise d’un dossier ou la relecture d’une correction ne déclenchent pas ces événements. Aucun identifiant ne permet d’apparier les essais ; il n’est donc pas possible de calculer un gain individuel entre première tentative et rejeu.

### Lire les résultats pédagogiques

Utiliser les **totaux**, jamais le CR affiché par Plausible, avec la même période et les mêmes filtres. Les objectifs doivent avoir été créés avant le début de la période analysée, sans quoi la comparaison est tronquée ([configuration Plausible](https://plausible.io/docs/custom-event-goals)).

Pour un dossier, noter A = décisions adaptées, R = décisions à revoir, C = erreurs critiques, B0 = bilans sans erreur critique, B1 = bilans avec erreur critique. Si le dénominateur est nul, le résultat est non calculable.

| Indicateur | Formule | Limite |
|---|---|---|
| Part de décisions adaptées | `100 × A / (A + R)` | Toutes les validations collectées, y compris tentatives inachevées et rejeux. Ce n’est pas le score moyen des dossiers terminés. |
| Part de décisions à revoir | `100 × R / (A + R)` | Complément de la précédente, pas un taux d’échec des personnes. |
| Erreurs critiques parmi toutes les décisions | `100 × C / (A + R)` | Dépend aussi du nombre d’étapes marquées critiques dans chaque scénario. Ne pas classer les dossiers sans tenir compte de ce contexte. |
| Part de bilans sans erreur critique | `100 × B0 / (B0 + B1)` | Tentatives achevées dont le bilan a été collecté ; l’absence d’erreur critique ne signifie pas 4/4. |
| Volume de bilans pédagogiques | `B0 + B1` | Peut être inférieur aux « dossiers terminés » si le suivi pédagogique est désactivé. |

Ne pas diviser B0 par l’ancien événement « Dossier XX terminé » : celui-ci reste actif lorsque le joueur désactive le suivi pédagogique. Une désactivation ou réactivation en cours de tentative peut aussi rendre les événements de décision incomplets ; le bilan classe les quatre réponses locales, sans retransmettre rétroactivement les décisions.

### Recette dans le compte

Après création des objectifs, réaliser un essai correct et un essai comportant une erreur critique connue sur le jeu public. Vérifier les objectifs pédagogiques et leurs totaux, puis annoter cette période comme test ; les tests locaux n’alimentent pas le compte.

Vérifier ensuite la désactivation dans la notice accessible depuis l’accueil. Les nouveaux événements pédagogiques cessent, mais le jeu et les événements de fréquentation continuent ; les événements déjà envoyés ne sont pas supprimés.

## Périmètre de confidentialité

Aucun nom, courriel, score individuel exact, choix de réponse, identifiant d’apprenant ou de tentative n’est transmis par l’application. Les noms d’événements indiquent l’action ou la catégorie pédagogique, ainsi que le numéro du dossier ; ni question, ni service, ni promotion, ni temps de réponse précis ne sont ajoutés.

Le choix de désactivation reste uniquement dans la mémoire de la page ouverte et n’est pas transmis. Après fermeture ou rechargement, il doit être renouvelé ; aucun stockage persistant n’est ajouté par le jeu.

Les suivis automatiques de liens sortants, téléchargements et formulaires sont désactivés. Le code retire les paramètres et fragments d’URL, le référent, les propriétés personnalisées et les montants de revenus avant transmission ; il limite les noms d’événements à la liste prévue, ainsi qu’aux événements natifs de page et d’engagement.

Plausible traite les informations techniques des requêtes selon sa [politique de données](https://plausible.io/data-policy). L’information des visiteurs est accessible dans l’écran « Référentiels ». Le propriétaire reste responsable des réglages du compte, de la durée de conservation et de la validation institutionnelle du dispositif.

Le dispositif vise une analyse agrégée sans identification des apprenants, pas une garantie absolue d’anonymisation. Éviter de publier des résultats de très petits groupes ou de les croiser avec un planning nominatif ; aucune statistique ne doit servir à certifier ou classer individuellement les internes.
