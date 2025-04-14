#!/bin/bash

set -e  # Stopper immédiatement si une commande échoue.

# Paramètres
PROJECT_DIR="$1"
TAG="$2"
BUILD_NB="$3"
DOCKER_USER="$4"
DOCKER_PASS="$5"

# Vérification des paramètres
if [ $# -ne 5 ]; then
  echo "Usage: $0 <project_dir> <tag> <build_number> <docker_username> <docker_password>"
  exit 1
fi

echo "Logging in to Docker Hub..."
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
if [ $? -ne 0 ]; then
  echo "Docker login failed."
  exit 1
fi

# Recherche des Dockerfiles
find "$PROJECT_DIR" -maxdepth 2 -type f -name "Dockerfile" | while IFS= read -r file_path; do
  dir_path=$(dirname "$file_path")
  dir_name=$(basename "$dir_path")

  echo "Building Docker image for $dir_name"
  docker build -t "$TAG:$dir_name" "$dir_path"
  docker tag "$TAG:$dir_name" "$TAG:$dir_name-$BUILD_NB"

  echo "Pushing $TAG:$dir_name-$BUILD_NB to Docker Hub"
  docker push "$TAG:$dir_name-$BUILD_NB"

  echo "Pushing $TAG:$dir_name to Docker Hub"
  docker push "$TAG:$dir_name"

  echo "ARTIFACT: $TAG:$dir_name-$BUILD_NB "
done

echo "All Docker images built and pushed successfully."
