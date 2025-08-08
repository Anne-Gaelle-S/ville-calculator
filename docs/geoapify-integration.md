# Documentation API Geoapify - Intégration Isochrones

## 🎯 Vue d'ensemble

Cette documentation explique comment utiliser l'API Geoapify Isoline dans le projet Ville Calculator pour générer des cartes de temps de trajet (isochrones).

## 🔑 Configuration de l'API

### 1. Obtenir une clé API Geoapify

1. Rendez-vous sur [geoapify.com](https://geoapify.com)
2. Créez un compte gratuit
3. Accédez à votre dashboard
4. Générez une nouvelle API key
5. Copiez la clé API

### 2. Configuration dans le projet

Ajoutez votre clé API dans le fichier `.env` :

```env
VITE_GEOAPIFY_API_KEY=votre_cle_api_ici
```

⚠️ **Important** : Ne commitez jamais votre vraie clé API dans Git. Utilisez `.env.local` pour le développement local.

## 📁 Architecture du code

### Types (`src/types/commute.types.ts`)

- `ICoordinates` : Coordonnées géographiques (lat, lng)
- `ILocation` : Localisation avec adresse et coordonnées
- `ITransportMode` : Modes de transport supportés
- `IIsochroneRequest/Response` : Requêtes et réponses API
- `ICommuteArea` : Zone de temps de trajet complète

### Service (`src/services/geoapify.service.ts`)

- `getIsochrone()` : Génère une isochrone simple
- `getMultipleIsochrones()` : Génère plusieurs isochrones
- Gestion des erreurs et validation

### Hook (`src/hooks/useCommuteMap.ts`)

- `addCommuteArea()` : Ajoute une zone
- `removeCommuteArea()` : Supprime une zone
- `updateCommuteArea()` : Met à jour une zone
- Gestion de l'état et des erreurs

### Utilitaires (`src/utils/coordinates.util.ts`)

- Validation des coordonnées
- Calculs de distance
- Formatage et parsing

## 🚀 Utilisation pratique

### Exemple d'utilisation basique

```typescript
import { useCommuteMap } from '../hooks/useCommuteMap'

const MyComponent = () => {
  const { 
    commuteAreas, 
    isLoading, 
    error, 
    addCommuteArea 
  } = useCommuteMap()

  const handleAddArea = async () => {
    await addCommuteArea(
      {
        address: "Paris, France",
        coordinates: { lat: 48.8566, lng: 2.3522 }
      },
      'drive', // Mode de transport
      30       // 30 minutes
    )
  }

  return (
    <div>
      {isLoading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      
      <button onClick={handleAddArea}>
        Ajouter zone Paris (30min en voiture)
      </button>
      
      {commuteAreas.map(area => (
        <div key={area.id}>
          {area.location.address} - {area.timeInMinutes}min
        </div>
      ))}
    </div>
  )
}
```

## 🎨 Modes de transport disponibles

| Mode | Description | Geoapify API |
|------|-------------|--------------|
| `drive` | Voiture | `drive` |
| `walk` | Marche à pied | `walk` |
| `bicycle` | Vélo | `bicycle` |
| `transit` | Transports publics | `transit` |

## ⚡ Limites et recommandations

### Limites de l'API Geoapify (plan gratuit)

- **3000 requêtes/jour** pour les isochrones
- **Timeout** : 5 secondes par requête
- **Zones géographiques** : Mondiale avec limitations régionales

### Bonnes pratiques

1. **Cache** : Stockez les résultats pour éviter les requêtes répétées
2. **Debouncing** : Limitez les requêtes pendant la saisie utilisateur
3. **Gestion d'erreur** : Toujours gérer les cas d'échec
4. **Validation** : Validez les coordonnées avant l'envoi

### Optimisations recommandées

```typescript
// ✅ Bon : Debounce les requêtes
const debouncedAddArea = debounce(addCommuteArea, 500)

// ✅ Bon : Validation avant envoi
if (!validateCoordinates(coordinates)) {
  setError('Coordonnées invalides')
  return
}

// ❌ Éviter : Requêtes en boucle
// for (const city of cities) {
//   await addCommuteArea(city, mode, time)
// }
```

## 🗺️ Format des données GeoJSON

Les isochrones sont retournées au format GeoJSON :

```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {
      "mode": "drive",
      "range": 1800,
      "range_type": "time"
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[lng1, lat1], [lng2, lat2], ...]]
    }
  }]
}
```

## 🔧 Développement et tests

### Tests unitaires recommandés

```typescript
// Test du service
describe('GeoapifyService', () => {
  it('should generate isochrone for valid coordinates', async () => {
    const result = await geoapifyService.getIsochrone({
      location: { lat: 48.8566, lng: 2.3522 },
      mode: 'drive',
      range: 1800
    })
    expect(result.features).toBeDefined()
  })
})

// Test du hook
describe('useCommuteMap', () => {
  it('should add commute area successfully', async () => {
    const { result } = renderHook(() => useCommuteMap())
    // ... tests
  })
})
```

### Variables d'environnement pour les tests

```env
# .env.test
VITE_GEOAPIFY_API_KEY=test_api_key
```

## 📚 Ressources supplémentaires

- [Documentation officielle Geoapify](https://apidocs.geoapify.com/docs/isoline)
- [Exemples d'isochrones](https://geoapify.com/isoline-api)
- [Limites et tarification](https://geoapify.com/pricing)

## 🐛 Dépannage courant

### Erreur "API Key manquante"

```bash
⚠️ VITE_GEOAPIFY_API_KEY n'est pas définie
```

**Solution** : Vérifiez que `VITE_GEOAPIFY_API_KEY` est bien définie dans `.env`

### Erreur "Coordinates invalid"

```bash
Erreur API Geoapify: Invalid coordinates
```

**Solution** : Utilisez `validateCoordinates()` avant l'envoi

### Timeout de requête

```bash
Erreur lors de la récupération de l'isochrone: timeout
```

**Solution** : Réduisez le temps de trajet ou changez de mode de transport

---

Cette intégration vous permet de créer une application similaire à CommuteTimeMap.com avec React et TypeScript ! 🚀
