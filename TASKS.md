# 📋 LISTE DES TÂCHES - TEST TECHNIQUE

## 🎯 OBJECTIF GLOBAL
Faire fonctionner le projet existant et créer un service de commentaires complet en respectant l'architecture Agentova.

---

## 📚 PRÉPARATION (À FAIRE AVANT L'ENREGISTREMENT)

### Documentation et Formation
- [x] Regarder la vidéo de formation Cursor : [Formation Cursor](https://www.youtube.com/watch?v=6fBHvKTYMCM)
- [x] Lire attentivement `CURSOR_LEARN.md` (automatismes essentiels)
- [x] Lire `docs/ARCHITECTURE.md` (structure du projet)
- [x] Lire `docs/VALIDATION_PATTERN_EXAMPLE.md` (patterns de validation)
- [x] Lire `.cursor/rules/` (règles Agentova complètes)

### Installation et Setup
- [x] Installer Cursor
- [x] Installer Node.js 18+
- [x] Installer Firebase CLI
- [x] Forker le repository sur votre profil GitHub personnel
- [x] Cloner VOTRE fork (pas le projet original)
- [x] Installer les dépendances client : `cd client && npm install`
- [x] Installer les dépendances serveur : `cd server && npm install`

### Préparation Enregistrement
- [x] Tester l'outil d'enregistrement vidéo (Screen Capture ou logiciel natif)
- [x] Pratiquer Cursor sur un petit projet avant le test
- [x] Familiariser avec les modes Ask/Agent de Cursor

---

## 🚀 PARTIE 1 : FAIRE FONCTIONNER LE PROJET

### 1.1 Correction du `textService` côté CLIENT

**Fichier : `client/services/api/textService.ts`**

- [ ] **Supprimer les mocks** : Remplacer toutes les fonctions fantômes par de vrais appels API
- [ ] **Utiliser `callSecuredFunction`** : Importer et utiliser depuis `@/services/local/authenticationService`
- [ ] **Méthodes statiques uniquement** : Toutes les méthodes doivent être `static`
- [ ] **Types partagés** : 
  - [ ] Supprimer les interfaces locales (`TextType`, `CreateTextRequest`, etc.)
  - [ ] Importer depuis `shared/types.ts` : `TextType`, `CreateTextType`
- [ ] **Pattern workspace** : `workspaceId` TOUJOURS en premier paramètre
- [ ] **Implémenter les méthodes** :
  - [ ] `static async createText(workspaceId: string, data: CreateTextType): Promise<TextType>`
  - [ ] `static async getTexts(workspaceId: string): Promise<TextType[]>`
  - [ ] `static async deleteText(workspaceId: string, textId: string): Promise<boolean>`
  - [ ] `static async updateText(workspaceId: string, textId: string, data: Partial<CreateTextType>): Promise<TextType>`
- [ ] **Appels Firebase** : Chaque méthode doit appeler la Firebase Function correspondante via `callSecuredFunction`

### 1.2 Correction du `textService` côté SERVEUR

**Fichier : `server/src/services/textService.ts`**

- [ ] **Vérifier validation cascade** : S'assurer que les 7 étapes sont respectées
  1. ✅ Validation auth (`validateAuth`)
  2. ✅ Validation params (`validateRequiredFields`)
  3. ✅ Validation workspace (`verifyWorkspaceToken`)
  4. ✅ Validation métier (à créer séparément)
  5. ✅ Logique métier
  6. ✅ Logging succès
  7. ✅ Réponse standardisée
- [ ] **Créer validation métier séparée** :
  - [ ] Créer `server/src/utils/validation/textValidation.ts`
  - [ ] Implémenter `validateTextData(data: CreateTextType): TextValidationResult`
  - [ ] Implémenter `validateTextUpdate(existingText: TextType, updateData: Partial<TextType>): TextValidationResult`
  - [ ] Suivre le pattern de `docs/VALIDATION_PATTERN_EXAMPLE.md`
- [ ] **Utiliser types partagés** : Importer depuis `shared/types.ts`
- [ ] **Secrets Firebase** : Vérifier que les secrets sont configurés si nécessaire
- [ ] **Logging structuré** : Utiliser `logger.info()` et `logger.error()`

### 1.3 Communication Client-Serveur

- [ ] **Tester la création** :
  - [ ] Créer un texte depuis l'interface
  - [ ] Vérifier que la Firebase Function est appelée
  - [ ] Vérifier que le texte est enregistré
  - [ ] Vérifier que le cache React Query est mis à jour
- [ ] **Tester la récupération** :
  - [ ] Vérifier que les textes s'affichent correctement
  - [ ] Vérifier que les données viennent du serveur (pas de mocks)
- [ ] **Tester la suppression** :
  - [ ] Supprimer un texte
  - [ ] Vérifier que la Firebase Function est appelée
  - [ ] Vérifier que le texte disparaît de l'interface
- [ ] **Vérifier les tokens workspace** :
  - [ ] S'assurer que `workspaceToken` est envoyé correctement
  - [ ] Vérifier la gestion des tokens renouvelés

### 1.4 Interface Utilisateur

**Fichier : `client/app/dashboard/page.tsx`**

- [ ] **Vérifier l'affichage** : La liste des textes doit s'afficher correctement
- [ ] **Tester le formulaire** : Le formulaire de création doit fonctionner
- [ ] **Tester la suppression** : Le bouton de suppression doit fonctionner
- [ ] **États de chargement** : Vérifier que les loaders s'affichent correctement
- [ ] **Gestion d'erreurs** : Vérifier l'affichage des erreurs

### 1.5 Build et Démarrage

- [ ] **Client démarre** : `cd client && npm run dev` → Application accessible sur `http://localhost:3000`
- [ ] **Serveur démarre** : `cd server && npm run dev` → Pas d'erreurs au démarrage
- [ ] **Build client réussi** : `cd client && npm run build` → Pas d'erreurs
- [ ] **Build serveur réussi** : `cd server && npm run build` → Pas d'erreurs
- [ ] **Application fonctionnelle** : Toutes les fonctionnalités textService fonctionnent end-to-end

---

## 🆕 PARTIE 2 : CRÉER UN SERVICE DE COMMENTAIRES

### 2.1 Types Partagés

**Fichier : `shared/types.ts`**

- [ ] **Créer `CommentType` interface** :
  ```typescript
  export interface CommentType {
    id: string;
    workspace_id: string;
    text_id: string; // Lien vers le texte
    content: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
  }
  ```
- [ ] **Créer `CreateCommentType` interface** :
  ```typescript
  export interface CreateCommentType {
    text_id: string;
    content: string;
    created_by: string;
  }
  ```
- [ ] **Créer enum si nécessaire** : Par exemple `CommentStatus` (si besoin de statuts)
- [ ] **❌ INTERDIT** : Pas de string unions (`'status1' | 'status2'`), utiliser des enums

### 2.2 Repository (Serveur)

**Fichier : `server/db/repositories/commentRepository.ts`**

- [ ] **Créer la classe `CommentRepository`** :
  - [ ] Pattern singleton avec lazy initialization
  - [ ] Pool PostgreSQL via `getPool()`
- [ ] **Méthodes CRUD avec isolation workspace** :
  - [ ] `async getByWorkspace(workspaceId: string): Promise<CommentType[]>`
  - [ ] `async getById(id: string, workspaceId: string): Promise<CommentType | null>`
  - [ ] `async getByTextId(textId: string, workspaceId: string): Promise<CommentType[]>`
  - [ ] `async create(workspaceId: string, data: CreateCommentType): Promise<CommentType>`
  - [ ] `async update(id: string, workspaceId: string, data: Partial<CreateCommentType>): Promise<CommentType | null>`
  - [ ] `async delete(id: string, workspaceId: string): Promise<boolean>`
- [ ] **Sécurité** :
  - [ ] TOUTES les requêtes avec `WHERE workspace_id = $X`
  - [ ] Paramètres préparés SQL (pas de concaténation)
- [ ] **Exporter via index** :
  - [ ] Ajouter `getCommentRepository()` dans `server/db/repositories/index.ts`

### 2.3 Validation Métier (Serveur)

**Fichier : `server/src/utils/validation/commentValidation.ts`**

- [ ] **Créer `CommentValidationResult` interface** :
  ```typescript
  export interface CommentValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
  }
  ```
- [ ] **Implémenter `validateCommentData`** :
  - [ ] Validation contenu obligatoire
  - [ ] Validation longueur max (ex: 2000 caractères)
  - [ ] Validation `text_id` obligatoire
  - [ ] Retourner `CommentValidationResult`
- [ ] **Implémenter `validateCommentUpdate`** (si nécessaire) :
  - [ ] Validation spécifique pour les mises à jour
  - [ ] Ne pas permettre de changer `workspace_id` ou `text_id`
- [ ] **Suivre le pattern** : Exactement comme `docs/VALIDATION_PATTERN_EXAMPLE.md`

### 2.4 Service Firebase Functions (Serveur)

**Fichier : `server/src/services/commentService.ts`**

- [ ] **Créer `createComment`** :
  - [ ] Firebase Function `onCall` avec configuration complète
  - [ ] Validation cascade complète (7 étapes)
  - [ ] Utiliser `validateCommentData` pour validation métier
  - [ ] Appeler `getCommentRepository().create()`
  - [ ] Logging structuré
  - [ ] Réponse standardisée avec `createResponseWithTokens`
- [ ] **Créer `getComments`** :
  - [ ] Récupérer tous les commentaires d'un workspace
  - [ ] Optionnel : Filtrer par `text_id` si paramètre fourni
  - [ ] Validation cascade (auth → workspace)
- [ ] **Créer `deleteComment`** :
  - [ ] Supprimer un commentaire
  - [ ] Rôle ADMIN requis (comme pour `deleteText`)
  - [ ] Validation cascade complète
- [ ] **Exporter les fonctions** : S'assurer qu'elles sont exportées dans `server/src/index.ts`

### 2.5 Service Client

**Fichier : `client/services/api/commentService.ts`**

- [ ] **Créer la classe `CommentService`** :
  - [ ] Toutes les méthodes doivent être `static`
- [ ] **Méthodes avec pattern standard** :
  - [ ] `static async createComment(workspaceId: string, data: CreateCommentType): Promise<CommentType>`
  - [ ] `static async getComments(workspaceId: string, textId?: string): Promise<CommentType[]>`
  - [ ] `static async deleteComment(workspaceId: string, commentId: string): Promise<boolean>`
- [ ] **Utiliser `callSecuredFunction`** :
  - [ ] Importer depuis `@/services/local/authenticationService`
  - [ ] Appeler les Firebase Functions correspondantes
- [ ] **Types partagés** :
  - [ ] Importer `CommentType`, `CreateCommentType` depuis `shared/types.ts`
  - [ ] ❌ Pas de types locaux

### 2.6 Hook React Query (Client)

**Fichier : `client/hooks/useComments.ts`**

- [ ] **Créer le hook `useComments`** :
  - [ ] Utiliser `useWorkspaceContext()` pour `currentWorkspaceId`
  - [ ] Utiliser `useQueryClient()` pour gestion cache
- [ ] **Query pour récupérer les commentaires** :
  - [ ] `useQuery` avec `queryKey: queryKeys.comments.all(currentWorkspaceId)`
  - [ ] `queryFn: () => CommentService.getComments(currentWorkspaceId)`
  - [ ] Configuration : `staleTime: 0`, `refetchOnMount: true`, `placeholderData`
- [ ] **Mutations avec gestion cache** :
  - [ ] `createMutation` : Ajouter le nouveau commentaire au cache
  - [ ] `deleteMutation` : Supprimer le commentaire du cache
- [ ] **Handlers stabilisés** :
  - [ ] Tous les handlers avec `useCallback`
  - [ ] Dépendances correctes
- [ ] **Return organisé** :
  ```typescript
  return {
    // Data
    comments: ...,
    // Loading states
    isLoading: ...,
    isError: ...,
    // Actions
    createComment: ...,
    deleteComment: ...,
    isCreating: ...,
    isDeleting: ...,
    // Utils
    refresh: ...
  };
  ```

### 2.7 Query Keys

**Fichier : `client/query/queryKeys.ts`**

- [ ] **Ajouter les clés pour commentaires** :
  ```typescript
  comments: {
    all: (workspaceId: string) => ['comments', workspaceId] as const,
    byText: (workspaceId: string, textId: string) => ['comments', workspaceId, textId] as const,
    detail: (workspaceId: string, commentId: string) => ['comments', workspaceId, commentId] as const
  }
  ```

### 2.8 Interface Utilisateur

**Option 1 : Intégrer dans la page dashboard existante**
- [ ] Ajouter une section commentaires dans `client/app/dashboard/page.tsx`
- [ ] Afficher les commentaires pour chaque texte
- [ ] Formulaire de création de commentaire
- [ ] Bouton de suppression

**Option 2 : Créer une page dédiée**
- [ ] Créer `client/app/dashboard/comments/page.tsx`
- [ ] Liste complète des commentaires
- [ ] Filtres par texte
- [ ] Formulaire de création
- [ ] Actions CRUD complètes

**Requis pour l'UI** :
- [ ] États de chargement (`isLoading`, `isCreating`, `isDeleting`)
- [ ] Gestion d'erreurs (affichage des erreurs)
- [ ] Design cohérent avec le reste de l'application
- [ ] Utiliser React Icons pour les icônes

---

## ✅ VALIDATION FINALE

### Architecture et Patterns
- [ ] **Services respectent l'architecture** :
  - [ ] Méthodes statiques uniquement
  - [ ] `workspaceId` premier paramètre
  - [ ] Types depuis `shared/types.ts`
- [ ] **Pas de types `any`** : Utiliser types spécifiques ou `unknown`
- [ ] **Pas de variables non utilisées** : Vérifier tous les imports et variables
- [ ] **Tous les enums dans `shared/types.ts`** : Pas de string unions
- [ ] **Validation métier séparée** : Fichiers dédiés dans `server/src/utils/validation/`
- [ ] **Isolation workspace systématique** : Toutes les requêtes avec `workspace_id`
- [ ] **Validation cascade** : 7 étapes respectées dans toutes les Firebase Functions

### Fonctionnalités
- [ ] **Build réussi** : Client ET serveur
- [ ] **Application fonctionnelle** : Toutes les fonctionnalités marchent end-to-end
- [ ] **TextService fonctionnel** : CRUD complet et fonctionnel
- [ ] **CommentService fonctionnel** : CRUD complet et fonctionnel
- [ ] **Interface utilisateur** : Toutes les fonctionnalités accessibles et utilisables

### Code Quality
- [ ] **Pas d'erreurs TypeScript** : `npm run build` sans erreurs
- [ ] **Pas d'erreurs ESLint** : Vérifier les linters
- [ ] **Code propre** : Pas de code commenté, pas de console.log inutiles
- [ ] **Documentation** : Commentaires JSDoc pour les fonctions publiques

---

## 📤 LIVRABLE FINAL

### Enregistrement Vidéo
- [ ] **Enregistrement complet** : Du début jusqu'à la fin
- [ ] **Processus visible** : Montrer tout le workflow avec Cursor
- [ ] **Qualité** : 1080p minimum, écran lisible
- [ ] **Segments** : Si plusieurs vidéos, numéroter (Partie 1/3, etc.)
- [ ] **Transmission** : Lien WeTransfer avec vidéos compressées

### Repository GitHub
- [ ] **Fork public** : Repository GitHub accessible publiquement
- [ ] **Code complet** : Toutes les corrections et nouvelles fonctionnalités
- [ ] **Commits clairs** : Messages de commit explicites
- [ ] **Lien GitHub** : Envoyer le lien du repository

### Documentation
- [ ] **README à jour** : Si modifications importantes
- [ ] **Commentaires code** : Code auto-documenté

---

## 🚨 POINTS CRITIQUES - ERREURS ÉLIMINATOIRES

### Automatismes Obligatoires
- [ ] **Drag & Drop** : Documentation + règles au début de chaque session
- [ ] **Communication globale** : Demandes complètes à Cursor (pas micro-étapes)
- [ ] **Review systématique** : Examiner chaque modification avant validation
- [ ] **Privilégier l'IA** : 90%+ du code généré par Cursor

### Erreurs à Éviter Absolument
- [ ] ❌ **Coder manuellement** au lieu d'utiliser Cursor
- [ ] ❌ **Ne pas drag & drop** la documentation et les règles
- [ ] ❌ **Valider en bloc** sans examiner et comprendre chaque modification
- [ ] ❌ **Ne pas respecter** l'architecture existante et les patterns Agentova
- [ ] ❌ **Types locaux** au lieu de `shared/types.ts`
- [ ] ❌ **String unions** au lieu d'enums
- [ ] ❌ **Validation métier** dans les Firebase Functions au lieu de fichiers séparés

---

## 📝 NOTES IMPORTANTES

### Workflow Recommandé
1. **Setup** : Drag & drop `.cursor/rules/` + `docs/` + fichiers spécifiques
2. **Compréhension** : Demander à Cursor d'analyser le projet
3. **Planification** : Mode Ask pour comprendre les problèmes
4. **Exécution** : Mode Agent pour générer les solutions
5. **Validation** : Review modification par modification

### Priorités
1. **Priorité 1** : L'enregistrement vidéo (plus important que le code parfait)
2. **Priorité 2** : Repository GitHub avec code corrigé et fonctionnel

### Ressources
- **Formation Cursor** : [Vidéo YouTube](https://www.youtube.com/watch?v=6fBHvKTYMCM)
- **Documentation** : `docs/ARCHITECTURE.md`, `docs/VALIDATION_PATTERN_EXAMPLE.md`
- **Règles** : `.cursor/rules/` (agentova-backend.mdc, agentova-frontend.mdc, agentova-global.mdc)

---

**Bonne chance ! 🚀**

*Montrez-nous votre expertise avec Cursor et votre compréhension de l'architecture moderne !*

