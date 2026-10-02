# Garde sous vigilance · Configuration Plausible

Le suivi minimal est intégré à la version v0.3.2 du jeu. Le script fourni par le propriétaire est associé au domaine `jetpod.github.io` ; son installation est limitée au chemin `/garde-sous-vigilance/`.

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

## Périmètre de confidentialité

Aucun nom, courriel, score, erreur critique, choix de réponse ni identifiant d’apprenant n’est transmis par l’application. Les noms d’événements indiquent uniquement l’action et, le cas échéant, le numéro du dossier.

Les suivis automatiques de liens sortants, téléchargements et formulaires sont désactivés. Le code retire les paramètres et fragments d’URL, le référent, les propriétés personnalisées et les montants de revenus avant transmission ; il limite les noms d’événements à la liste prévue, ainsi qu’aux événements natifs de page et d’engagement.

Plausible traite les informations techniques des requêtes selon sa [politique de données](https://plausible.io/data-policy). L’information des visiteurs est accessible dans l’écran « Référentiels ». Le propriétaire reste responsable des réglages du compte, de la durée de conservation et de la validation institutionnelle du dispositif.
