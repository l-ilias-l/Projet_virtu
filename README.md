Documentation de l'Application
Description

Cette application est un projet de gestion d'événements, développé avec FastAPI pour le backend, MySQL pour la base de données et Docker pour l'orchestration des services. Elle permet de gérer des événements (création, consultation et suppression) à travers une API REST.
Architecture

L'application se compose des éléments suivants :

    Backend (API) : Développé avec FastAPI pour gérer les événements via une API REST.
    Base de données : Utilisation de MySQL pour stocker les événements.
    Frontend : Interface utilisateur en cours de développement (pas encore inclus dans cette version).
    Orchestration : Utilisation de Docker Compose pour orchestrer le backend et la base de données.

Prérequis

Avant de démarrer l'application, vous devez avoir les outils suivants installés :

    Docker : Pour la gestion des containers.
    Docker Compose : Pour orchestrer les services Docker.

Installation
1. Cloner le dépôt

Clonez ce dépôt sur votre machine locale :

git clone https://github.com/votre-utilisateur/nom-du-repository.git
cd nom-du-repository

2. Démarrer les services avec Docker Compose

Utilisez Docker Compose pour lancer l'application et la base de données :

docker-compose up --build

Cela va :

    Créer et démarrer deux services : app (backend FastAPI) et db (base de données MySQL).
    La base de données sera accessible via le service db sur le port 3306.
    L'API FastAPI sera accessible sur le port 8000.

3. Accéder à l'API

Une fois les services démarrés, vous pouvez accéder à l'API à l'adresse suivante :

    URL de l'API : http://localhost:8000
    Documentation automatique de l'API : http://localhost:8000/docs (généré automatiquement par FastAPI).

4. Base de données

La base de données MySQL est pré-configurée avec les identifiants suivants :

    Utilisateur : root
    Mot de passe : root
    Nom de la base de données : testdb

Vous pouvez y accéder via un client MySQL ou un outil comme DBeaver pour vérifier les données.
Endpoints de l'API
1. Créer un événement

    Méthode : POST
    URL : /events
    Corps de la requête (JSON) :

{
  "title": "Titre de l'événement",
  "time": "2024-12-25T10:00:00",
  "description": "Description de l'événement"
}

    Réponse (JSON) :

{
  "id": 1,
  "title": "Titre de l'événement",
  "time": "2024-12-25T10:00:00",
  "description": "Description de l'événement"
}

2. Obtenir tous les événements

    Méthode : GET
    URL : /events
    Réponse (JSON) :

[
  {
    "id": 1,
    "title": "Titre de l'événement",
    "time": "2024-12-25T10:00:00",
    "description": "Description de l'événement"
  },
  ...
]

3. Obtenir un événement spécifique

    Méthode : GET
    URL : /events/{event_id}
    Paramètre : event_id (ID de l'événement)
    Réponse (JSON) :

{
  "id": 1,
  "title": "Titre de l'événement",
  "time": "2024-12-25T10:00:00",
  "description": "Description de l'événement"
}

4. Supprimer un événement

    Méthode : DELETE
    URL : /events/{event_id}
    Réponse (JSON) :

{
  "message": "Événement supprimé avec succès"
}

Technologies utilisées

    FastAPI : Framework pour la création d'API REST.
    SQLAlchemy : ORM pour interagir avec la base de données MySQL.
    MySQL : Système de gestion de base de données relationnelle.
    Docker : Containerisation de l'application et de la base de données.
    Docker Compose : Orchestration des services Docker.
    Pydantic : Validation des données d'entrée et sortie via des schémas.

Développement local
1. Démarrer les services localement

Si vous souhaitez démarrer l'application en mode développement avec les modifications en temps réel, vous pouvez utiliser le volume Docker pour lier votre code local à l'application :

docker-compose up --build

Le volume .:/app permet de monter votre répertoire local dans le conteneur, ce qui signifie que toutes les modifications que vous apportez au code seront immédiatement prises en compte dans le conteneur. 
2. Accéder à l'API

    URL de l'API : http://localhost:8000
    Documentation Swagger : http://localhost:8000/docs
    Documentation ReDoc : http://localhost:8000/redoc

Contribuer



