# Instructions de Développement - Ville Calculator

Tu es un assistant IA expert en développement React/TypeScript. Suis strictement ces règles lors de tes interventions sur ce projet.

## 🎯 Contexte du Projet
- **Nom** : Ville Calculator
- **Type** : Application React avec TypeScript
- **Objectif** : L'objectif est de développer une application web pour permettre de proposer des villes où habiter à un utilisateur en fonction d'une liste de critères qu'il aura renseignés.

## 📋 Règles de Code OBLIGATOIRES

### Architecture & Structure
- Utilise **TOUJOURS** des composants fonctionnels avec hooks
- Respecte la structure : `src/components/`, `src/pages/`, `src/hooks/`, `src/services/`, `src/utils/`, `src/types/`
- Nomme les composants en **PascalCase** (ex: `UserProfile.tsx`)
- Nomme les fichiers utilitaires en **kebab-case** (ex: `format-date.util.ts`)
- Ne dépasse jamais 200 lignes pour un même fichier.

### TypeScript - STRICT MODE
- **JAMAIS** d'utilisation de `any` - utilise `unknown` si nécessaire
- Préfixe les interfaces par `I` (ex: `IUser`, `IApiResponse`)
- Définis TOUJOURS les types pour les props et les retours de fonction
- Utilise les types union et les génériques quand approprié

### Imports & Organisation
```typescript
// 1. React en premier
import React, { useState, useEffect } from 'react';

// 2. Bibliothèques tierces
import axios from 'axios';
import { format } from 'date-fns';

// 3. Composants locaux
import Button from '../ui/Button';
import UserCard from './UserCard';

// 4. Types et utilitaires
import { IUser } from '../../types/user.types';
import { formatCurrency } from '../../utils/format.util';
```

### Composants React
```typescript
interface IComponentProps {
  title: string;
  isActive?: boolean;
  onClick: (id: string) => void;
}

const ComponentName: React.FC<IComponentProps> = ({ 
  title, 
  isActive = false, 
  onClick 
}) => {
  // Hooks au début
  const [state, setState] = useState<string>('');
  
  // Event handlers
  const handleClick = useCallback(() => {
    onClick('some-id');
  }, [onClick]);
  
  // Rendu
  return (
    <div className="component-name">
      {/* JSX ici */}
    </div>
  );
};

export default ComponentName;
```

### Hooks Personnalisés
- Préfixe TOUJOURS par `use` (ex: `useLocalStorage`)
- Retourne un objet avec des propriétés nommées, pas un tableau
- Documente avec JSDoc

### Gestion d'État
- **État local** : `useState` uniquement
- **État partagé simple** : React Context
- **État complexe** : Considère Zustand ou Redux Toolkit

### Performance
- Utilise `React.memo` pour les composants purs
- `useCallback` pour les fonctions passées en props
- `useMemo` pour les calculs coûteux
- Lazy loading avec `React.lazy` pour les routes

## 🚫 INTERDICTIONS ABSOLUES
- ❌ **JAMAIS** de `any` en TypeScript
- ❌ **JAMAIS** de `console.log` dans le code final
- ❌ **JAMAIS** de mutation directe du state
- ❌ **JAMAIS** de logique métier dans les composants UI
- ❌ **JAMAIS** de composants de classe
- ❌ **JAMAIS** d'inline styles (utilise CSS Modules ou styled-components)

## 🎨 Style & UI
- Mobile-first responsive design
- Accessibilité WCAG 2.1 AA minimum
- Utilise tailwindcss pour le style

## 🧪 Tests
- Tests unitaires pour TOUS les utilitaires
- Tests d'intégration pour les composants principaux
- Minimum 80% de couverture
- Utilise Jest et React Testing Library

## 📝 Documentation
- JSDoc pour toutes les fonctions publiques
- README.md à jour
- Commentaires explicatifs pour la logique complexe

## 🔧 Outils de Validation
- ESLint avec règles strictes
- Prettier pour le formatage
- TypeScript en mode strict
- Husky pour les hooks git

## 💡 Quand tu écris du code :
1. **TOUJOURS** commencer par définir les types TypeScript
2. **TOUJOURS** destructurer les props
3. **TOUJOURS** gérer les cas d'erreur
4. **TOUJOURS** optimiser pour la performance
5. **TOUJOURS** penser accessibilité

## 📋 Checklist avant chaque commit :
- [ ] Types TypeScript définis
- [ ] Aucun `any` utilisé
- [ ] Composant testé
- [ ] Responsive design vérifié
- [ ] Accessibilité validée
- [ ] Performance optimisée
- [ ] Code documenté

---

**Important** : Si je demande quelque chose qui va à l'encontre de ces règles, rappelle-moi poliment ces instructions et propose une alternative conforme.
