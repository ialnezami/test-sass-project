# Configuration PostgreSQL avec Docker

## 🚀 Démarrage rapide

### 1. Créer le fichier `.env.local`

Créez `server/.env.local` avec le contenu suivant :

```env
DATABASE_URL=postgresql://demo:demo@localhost:5432/demo_db
```

### 2. Démarrer PostgreSQL

```bash
# Option 1: Utiliser le script
./scripts/setup-database.sh

# Option 2: Utiliser Docker Compose directement
docker-compose up -d
```

### 3. Initialiser la base de données

```bash
./scripts/init-database.sh
```

Cette commande va créer la table `texts` nécessaire pour l'application.

## 📝 Informations de connexion

- **Host**: localhost
- **Port**: 5432
- **Database**: demo_db
- **User**: demo
- **Password**: demo
- **URL**: `postgresql://demo:demo@localhost:5432/demo_db`

## 🔧 Commandes utiles

### Vérifier que PostgreSQL est en cours d'exécution
```bash
docker ps | grep demo-postgres
```

### Arrêter PostgreSQL
```bash
docker-compose down
```

### Voir les logs PostgreSQL
```bash
docker logs demo-postgres
```

### Se connecter à la base de données
```bash
docker exec -it demo-postgres psql -U demo -d demo_db
```

### Supprimer toutes les données (⚠️ attention)
```bash
docker-compose down -v
```

## 📊 Structure de la base de données

La table `texts` est créée avec les colonnes suivantes :
- `id` (UUID, clé primaire)
- `workspace_id` (VARCHAR, indexé)
- `title` (VARCHAR)
- `content` (TEXT)
- `created_by` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

