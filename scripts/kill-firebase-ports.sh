#!/bin/bash

# Script pour libérer tous les ports utilisés par les émulateurs Firebase

echo "🔍 Recherche des processus utilisant les ports Firebase..."

# Ports utilisés par les émulateurs Firebase
PORTS=(5001 8081 9000 8086 9099 4000 5002)

# Tuer les processus utilisant ces ports
for port in "${PORTS[@]}"; do
  PIDS=$(lsof -ti:$port 2>/dev/null)
  if [ ! -z "$PIDS" ]; then
    echo "🛑 Arrêt des processus sur le port $port..."
    echo "$PIDS" | xargs kill -9 2>/dev/null
  fi
done

# Tuer les processus Firebase/émulateurs
echo "🛑 Arrêt des processus Firebase/émulateurs..."
pkill -f "firebase.*emulator" 2>/dev/null
pkill -f "java.*pubsub" 2>/dev/null

# Vérifier que les ports sont libres
echo ""
echo "✅ Vérification des ports..."
FREE=true
for port in "${PORTS[@]}"; do
  if lsof -ti:$port >/dev/null 2>&1; then
    echo "⚠️  Le port $port est toujours utilisé"
    FREE=false
  else
    echo "✅ Port $port est libre"
  fi
done

if [ "$FREE" = true ]; then
  echo ""
  echo "✅ Tous les ports sont libres !"
else
  echo ""
  echo "⚠️  Certains ports sont encore utilisés. Essayez de redémarrer votre terminal."
fi

