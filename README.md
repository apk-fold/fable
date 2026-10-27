<p align="center"><img src="docs/icon.png" width="96" alt="Icône de Fable"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>Tes heures, ton brut, sans calculette.</b><br>Suivi d'heures pour l'intérim, le CDD et le CDI : heures sup à paliers, nuit, dimanche, fériés, paniers, IFM et congés payés.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ Télécharger l'APK</b></a> · Android 7 et plus · gratuit, hors ligne, sans compte</p>

<p align="center">
  <img src="docs/accueil.png" width="200" alt="Accueil et pointeuse">
  <img src="docs/historique.png" width="200" alt="Historique">
  <img src="docs/resume.png" width="200" alt="Résumé du mois">
  <img src="docs/mission.png" width="200" alt="Réglages d'une mission">
</p>

## Installer

1. Sur le téléphone, ouvre le lien **Télécharger l'APK** ci-dessus (ou la dernière [release](https://github.com/apk-fold/fable/releases/latest)).
2. Autorise l'installation depuis ton navigateur si Android le demande, puis installe.
3. Les nouvelles versions s'installent par-dessus l'ancienne : même signature, données conservées.

Chaque modification du code poussée sur `main` recompile l'APK automatiquement (GitHub Actions) et publie une nouvelle release.

### Signature

La clé de signature n'est pas dans le dépôt. GitHub Actions la lit dans le secret **`FABLE_KEYSTORE_B64`** (le fichier `.jks` encodé en base64, mot de passe `FABLE_KEYSTORE_PASSWORD` facultatif). Sans ce secret, l'APK est signé avec une clé temporaire : il s'installe, mais la version suivante demandera de désinstaller la précédente.

## Ce que fait l'appli

**Saisie**
- Pointeuse : *Commencer*, *Pause*, *Terminer* — la journée est créée toute seule (arrondi au quart d'heure en option).
- Saisie manuelle : date, début → fin (passage de minuit géré), pause, boutons **+ Heures sup.** (+15 min, +30 min, +1 h).
- Aperçu en direct du calcul pendant la saisie, avertissement si deux journées se chevauchent.
- Répéter une journée sur d'autres jours de la semaine, dupliquer une journée, panier forcé ou retiré au cas par cas.

**Missions** (une par employeur ou agence), chacune avec ses règles :
- Type de contrat : Intérim, CDD, CDI, Autre — taux horaire brut, couleur.
- **Heures supplémentaires** par semaine ou par jour, avec 2 paliers (ex. +25 % dès 35 h, +50 % dès 43 h).
- **Heures de nuit** sur une plage réglable (21 h → 6 h par défaut) avec sa majoration.
- **Dimanche** et **jours fériés** : calendrier **France métropolitaine (Paris)** par défaut, ou **Alsace-Moselle** (+ Vendredi saint et 26 décembre), réglable pour toutes les missions.
- Cumul des majorations : additionnées ou seulement la plus forte ; nuit du samedi au dimanche comptée selon le jour de début ou heure par heure.
- **Panier repas** chaque jour travaillé ou à partir d'un nombre d'heures, **indemnité de trajet** par jour.
- **IFM** (intérim) ou **prime de précarité** (CDD) et **ICCP** (congés payés), 10 % + 10 % par défaut.
- **Période de paie** du mois complet ou décalée (ex. du 21 au 20), horaires et pause par défaut.

**Suivi**
- Accueil : pointeuse, semaine en cours avec la jauge du seuil d'heures sup, totaux du mois.
- Historique par mois, en liste groupée par semaine ou en calendrier, filtre par mission.
- Résumé semaine / mois / année : heures, heures sup par palier, nuit, dimanche, fériés, jours travaillés, graphique, détail du brut jusqu'au **net estimé** (taux de cotisations réglable).
- **Export PDF** (relevé d'heures prêt à envoyer), **Excel .xlsx** et **CSV** — sans abonnement.

**Le reste**
- Rappel par notification aux jours et à l'heure choisis.
- **Tout se personnalise** dans Réglages : thème sombre, noir (AMOLED), clair ou auto ; couleur principale et couleurs des majorations (palette ou couleur libre) ; polices ; taille du texte ; coins ; densité ; animations ; format des durées (7 h 30, 7h30 ou 7,5 h) ; mode discret qui masque les montants ; écran d'ouverture ; vue de l'historique. Couleur libre aussi pour chaque mission.
- Sauvegarde / restauration en fichier `.json`, copie de secours automatique dans les fichiers privés de l'appli.
- Aucune donnée ne quitte le téléphone : pas de compte, pas de serveur, pas de pub.

## Comment c'est calculé

Chaque journée est découpée minute par minute. Pour chaque minute travaillée, Fable sait si elle tombe la nuit, un dimanche, un jour férié et dans quel palier d'heures sup (cumul de la semaine du lundi au dimanche, dans l'ordre chronologique). La pause est retirée au prorata. Une semaine à cheval sur deux mois est calculée en entier, puis seules les journées de la période sont comptées.

- Salaire brut = heures × taux + majorations
- IFM / précarité = brut × 10 %
- ICCP = (brut + IFM) × 10 %
- Net estimé = total brut − cotisations (22 % par défaut) + paniers et trajets

Ce sont des **estimations** : ta convention collective et ton bulletin de paie font foi.

## Développer

```bash
npm install
npm run dev        # interface dans le navigateur
npm test           # tests du moteur de calcul
npm run sync       # build web + projet Android (après « npx cap add android » la première fois)
npm run open       # ouvre le projet dans Android Studio
```

Structure : `src/core` (calculs, jours fériés, stockage, exports PDF/Excel), `src/views` (écrans), `src/ui` (composants), `scripts/patch-android.mjs` (nom, icônes, thème et signature du projet Android), `tests/` (tests du moteur et parcours de l'interface).

Pile : HTML/CSS/JS sans framework, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). Polices Manrope et Unbounded (SIL Open Font License).
