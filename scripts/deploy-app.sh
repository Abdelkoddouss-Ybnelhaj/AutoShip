#!/bin/bash

set -e

# Variables
CONTAINER_NAME=$1
IMAGE_NAME=$2
RUN_COMMAND=$3

echo "---------------------------------------------"
echo "[INFO] Déploiement du container : $CONTAINER_NAME"
echo "---------------------------------------------"

# Stop the container if it exists
if docker ps -a --format '{{.Names}}' | grep "^${CONTAINER_NAME}\$"; then
    echo "[INFO] Arrêt et suppression de l'ancien container : $CONTAINER_NAME"
    docker rm -f "$CONTAINER_NAME"
else
    echo "[INFO] Aucun container existant trouvé."
fi

# Remove the image if it exists
if docker images --format '{{.Repository}}:{{.Tag}}' | grep "^${IMAGE_NAME}\$"; then
    echo "[INFO] Suppression de l'image existante : $IMAGE_NAME"
    docker rmi -f "$IMAGE_NAME"
else
    echo "[INFO] Aucune image existante à supprimer."
fi

# Run new container
echo "[INFO] Lancement du nouveau container à partir de l'image : $IMAGE_NAME"
CONTAINER_ID=$(eval "$RUN_COMMAND")
echo "[INFO] Container lancé : $CONTAINER_ID"

# Attendre que le container soit bien "Up"
for i in {1..5}; do
    STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER_ID" 2>/dev/null || echo "not_found")
    if [[ "$STATUS" == "running" ]]; then
        echo "[INFO] Le container est en cours d'exécution."
        break
    else
        echo "[INFO] En attente de démarrage... ($i/5)"
        sleep 2
    fi
done

# Affichage des logs
echo "---------------------------------------------"
echo "[INFO] Logs du container ($CONTAINER_NAME) :"
echo "---------------------------------------------"
docker logs "$CONTAINER_ID"
