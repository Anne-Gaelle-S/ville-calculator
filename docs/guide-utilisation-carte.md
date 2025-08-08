# 🗺️ Guide d'utilisation - Carte de temps de trajet

## ✨ Nouvelle fonctionnalité ajoutée !

Votre application **Ville Calculator** dispose maintenant d'une carte interactive pour visualiser les zones de temps de trajet (isochrones) ! Cette fonctionnalité s'inspire de **CommuteTimeMap.com**.

## 🎯 Fonctionnalités disponibles

### 1. **Générateur de zones de temps de trajet**
- **Recherche de villes** : Tapez le nom d'une ville française
- **Modes de transport** : 🚗 Voiture, 🚶 Marche, 🚴 Vélo, 🚌 Transport public  
- **Temps configurable** : De 5 à 120 minutes avec un slider
- **Génération d'isochrones** : Zones colorées montrant ce qui est accessible

### 2. **Carte interactive**
- **Visualisation en temps réel** : Les zones s'affichent automatiquement
- **Markers de départ** : Points de départ des calculs
- **Popups informatifs** : Cliquez sur une zone pour voir les détails
- **Légende colorée** : Chaque zone a sa propre couleur
- **Ajustement automatique** : La carte se centre sur vos zones

### 3. **Gestion des zones**
- **Zones multiples** : Ajoutez plusieurs zones simultanément
- **Suppression facile** : Cliquez sur 🗑️ pour supprimer une zone
- **Couleurs distinctes** : Chaque zone a une couleur unique

## 🚀 Comment utiliser

### Étape 1 : Configuration
1. Obtenez une **clé API Geoapify** sur [geoapify.com](https://geoapify.com) (gratuite)
2. Ajoutez-la dans votre fichier `.env` :
   ```env
   VITE_GEOAPIFY_API_KEY=votre_cle_api_ici
   ```

### Étape 2 : Ajouter une zone
1. **Tapez une ville** dans le champ "Ville de départ"
2. **Choisissez un mode** de transport (🚗🚶🚴🚌)
3. **Réglez le temps** avec le slider (5-120 min)
4. **Cliquez sur "Ajouter la zone"**
5. **Regardez la magie opérer** ! 🎉

### Étape 3 : Explorer la carte
- **Naviguez** : Zoom, pan, explorez
- **Cliquez sur les zones** : Voir les détails dans les popups
- **Ajoutez plus de zones** : Comparez différents scenarios
- **Supprimez** : Cliquez sur 🗑️ à côté d'une zone

## 🎨 Layout responsive

### 📱 **Mobile** 
```
┌─────────────────┐
│  Formulaire     │
│  critères       │
├─────────────────┤
│  Liste des      │
│  critères       │  
├─────────────────┤
│  🗺️ Zones de    │
│  temps trajet   │
│  + Carte        │
└─────────────────┘
```

### 💻 **Desktop**
```
┌─────────┬─────────┬─────────────┐
│ Form.   │  Liste  │             │
│ crit.   │  crit.  │  🗺️ Zones   │
│         │         │  + Carte    │
│         │         │             │
└─────────┴─────────┴─────────────┘
```

## 🛠️ Technologies utilisées

- **🗺️ Leaflet** : Carte interactive open source
- **🌍 Geoapify API** : Génération d'isochrones
- **📍 Nominatim API** : Géocodage des villes
- **⚛️ React + TypeScript** : Interface utilisateur
- **🎨 Tailwind CSS** : Styling responsive

## 🔧 API et Services

### Service Geoapify (`geoapify.service.ts`)
```typescript
// Génère une isochrone
await geoapifyService.getIsochrone({
  location: { lat: 48.8566, lng: 2.3522 },
  mode: 'drive',
  range: 1800 // 30 minutes
})
```

### Service Géocodage (`geocoding.service.ts`)
```typescript
// Obtient les coordonnées d'une ville
const coords = await geocodingService.getCityCoordinatesWithFallback('Paris')
```

### Hook CommuteMap (`useCommuteMap.ts`)
```typescript
const { 
  commuteAreas, 
  addCommuteArea, 
  removeCommuteArea 
} = useCommuteMap()
```

## 🎯 Exemples d'usage

### Scénario 1 : Recherche de logement
1. Ajoutez votre lieu de travail (mode 🚗, 45 min)
2. Ajoutez l'école des enfants (mode 🚶, 15 min)  
3. Voyez la zone d'intersection = zone de recherche !

### Scénario 2 : Comparaison modes transport
1. Même ville, mode 🚗 (30 min)
2. Même ville, mode 🚌 (30 min)
3. Comparez les zones accessibles

### Scénario 3 : Planification déménagement
1. Ajoutez plusieurs villes candidates
2. Même temps de trajet, même mode
3. Comparez les zones pour choisir

## 🐛 Dépannage

### Problème : "Service Geoapify non configuré"
**Solution** : Vérifiez votre clé API dans `.env`

### Problème : Aucune zone ne s'affiche
**Solution** : 
1. Vérifiez votre connexion internet
2. Ouvrez la console pour voir les erreurs
3. Testez avec une ville connue (ex: "Paris")

### Problème : Erreur de géocodage
**Solution** : L'app utilise automatiquement Paris en fallback

## 🚀 Prochaines améliorations possibles

- [ ] **Export des cartes** en PNG/PDF
- [ ] **Sauvegarde des zones** dans localStorage  
- [ ] **Intersection de zones** (zones communes)
- [ ] **Calcul de prix immobilier** dans les zones
- [ ] **Intégration transport en commun** temps réel
- [ ] **Mode hors ligne** avec cache

---

**Félicitations ! 🎉** Vous avez maintenant une application complète de calcul de zones de temps de trajet, similaire à CommuteTimeMap ! 

Bon exploration ! 🗺️✨
