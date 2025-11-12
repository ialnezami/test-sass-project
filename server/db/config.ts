import { Pool, types } from 'pg';

// Configuration des parsers de types PostgreSQL pour les dates
types.setTypeParser(1114, (val: string) => new Date(val));
types.setTypeParser(1184, (val: string) => new Date(val));

/**
 * Vérifie si l'URL de la base de données est valide
 */
const validateDatabaseUrl = (url: string): boolean => {
  return Boolean(url && url.startsWith('postgresql://') && url.length > 20);
};

// Pool de connexion dynamique basé sur l'environnement
let pool: Pool | undefined;

export function getPool(): Pool {
  if (!pool) {
    let connectionString: string;

    // En local (développement)
    if (!process.env.DATABASE_URL) {
      // 🔧 MODE DÉMO - Utiliser PostgreSQL Docker par défaut
      console.warn('⚠️  MODE DÉMO: DATABASE_URL non configurée - Utilisation de PostgreSQL Docker par défaut');
      console.warn('⚠️  Assurez-vous que Docker Compose est lancé: docker-compose up -d');
      connectionString = 'postgresql://demo:demo@localhost:5432/demo_db';
    } else {
      connectionString = process.env.DATABASE_URL;
    }

    if (!validateDatabaseUrl(connectionString)) {
      throw new Error('URL de base de données invalide');
    }

    const poolConfig: any = {
      connectionString,
      // Configuration optimisée pour Firebase Functions
      max: 5, // Plus de connexions disponibles
      min: 1, // Garde toujours 1 connexion ouverte
      
      // Timeouts adaptés pour Firebase Functions
      // ✅ Configuration équilibrée :
      // - Assez long pour opérations complexes (IA, uploads)
      // - Assez court pour détecter les problèmes rapidement
      idleTimeoutMillis: 120000, // 2min permet opérations IA
      connectionTimeoutMillis: 15000, // 15 secondes - détection rapide des problèmes réseau
      
      // Keepalive optimisé
      keepAlive: true,
      keepAliveInitialDelayMillis: 2000, // 2 secondes
      
      // Permet la sortie propre
      allowExitOnIdle: false // Ne ferme pas automatiquement en production
    };

    // ✅ SSL configuration : Désactiver SSL pour PostgreSQL local (Docker)
    // En production avec une vraie URL DATABASE_URL distante, SSL sera activé
    // En local avec Docker, PostgreSQL ne supporte pas SSL par défaut
    const isLocalDocker = !process.env.DATABASE_URL || 
                          connectionString.includes('localhost') || 
                          connectionString.includes('127.0.0.1');
    
    if (!isLocalDocker) {
      // Production : Activer SSL uniquement pour les connexions distantes
      poolConfig.ssl = {
        rejectUnauthorized: false
      };
    }
    // Local Docker : Pas de SSL (défaut) - PostgreSQL Docker ne supporte pas SSL

    pool = new Pool(poolConfig);

    // Gestion des erreurs avec recréation automatique du pool
    pool.on('error', (err, client) => {
      // En mode démo, ne pas bloquer sur les erreurs de connexion
      if (!process.env.DATABASE_URL) {
        console.warn('⚠️  MODE DÉMO: Erreur de connexion PostgreSQL ignorée:', err.message);
        console.warn('⚠️  Les repositories continueront de fonctionner en mode démo (données vides)');
        return; // Ne pas recréer le pool en mode démo
      }
      console.error('🔴 Erreur PostgreSQL Pool:', err.message);
      console.error('🔄 Pool sera recréé au prochain appel');
      pool = undefined; // Force recréation au prochain appel
    });

    // Configuration du search_path pour chaque nouvelle connexion
    // Cela permet d'accéder aux tables du schéma 'vertex' sans préfixe
    // Impact sur la latence : ~1-5ms par nouvelle connexion (négligeable avec un pool)
    pool.on('connect', (client) => {
      client.query('SET search_path TO public, vertex;');
    });

    pool.on('release', (err, client) => {
      if (err) {
        console.error('⚠️ Erreur lors de la libération de connexion:', err.message);
      }
    });

    // Gestion propre de la fermeture du pool
    process.on('SIGTERM', () => {
      if (pool) {
        pool.end();
        pool = undefined;
      }
    });
  }

  return pool;
}

// Export par défaut pour la compatibilité
export default {
  getPool
}; 