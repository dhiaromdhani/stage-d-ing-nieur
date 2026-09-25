# STIR Workflow de Gestion des Congés

##  Présentation

**STIR Workflow de Gestion des Congés** est une application web développée dans le cadre d'un stage d'ingénieur au sein de la **Société Tunisienne des Industries de Raffinage (STIR)**.

L'objectif principal du projet est de **digitaliser et automatiser le processus de gestion des demandes de congé**, depuis la création de la demande par l'employé jusqu'à sa validation finale par le service des ressources humaines.

L'application permet de centraliser les demandes, suivre leur état et gérer le processus de validation selon les différents niveaux hiérarchiques.

---

##  Objectifs

* Digitaliser la gestion des demandes de congé.
* Automatiser le workflow de validation.
* Centraliser les informations liées aux demandes.
* Assurer la traçabilité des décisions.
* Gérer les utilisateurs selon leurs rôles.
* Sécuriser l'accès à l'application.
* Intégrer un service d'analyse basé sur l'intelligence artificielle.
* Préparer une architecture conteneurisée et déployable sur Kubernetes et Azure.

---

#  Workflow de gestion des congés

Le processus de validation est organisé selon plusieurs niveaux hiérarchiques :

```text
Employé
   │
   │ Création de la demande
   ▼
Chef de service
   │
   ├── Refus → Demande refusée + justification
   │
   ▼
Sous-directeur
   │
   ├── Refus → Demande refusée + justification
   │
   ▼
Directeur
   │
   ├── Refus → Demande refusée + justification
   │
   ▼
Ressources Humaines
   │
   ▼
Demande approuvée
```

Chaque responsable peut traiter les demandes correspondant à son niveau de responsabilité.

---

#  Architecture du projet

L'application est composée de plusieurs services :

```text
                         ┌──────────────────────┐
                         │       Frontend       │
                         │      React + Vite    │
                         └──────────┬───────────┘
                                    │
                                  REST API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Backend        │
                         │     Spring Boot      │
                         │   Spring Security    │
                         │        JWT           │
                         └───────┬───────┬──────┘
                                 │       │
                                 │       │ REST API
                                 │       ▼
                                 │  ┌───────────────┐
                                 │  │ AI / Python   │
                                 │  │    Flask      │
                                 │  └───────────────┘
                                 │
                                 ▼
                         ┌──────────────────────┐
                         │       MongoDB        │
                         │      Database        │
                         └──────────────────────┘
```

### Composants

* **Frontend** : interface utilisateur et dashboards.
* **Backend** : logique métier et API REST.
* **MongoDB** : base de données principale de l'application.
* **AI Service** : service Python destiné à l'analyse des données.

---

#  Technologies utilisées

## Frontend

* React 19
* Vite
* React Router DOM
* Axios
* Bootstrap 5
* React Icons

## Backend

* Java
* Spring Boot 3.5.3
* Spring Security
* JWT
* REST API
* Maven

## Base de données

* **MongoDB 7**

MongoDB constitue la **base de données principale du projet**.

Base utilisée :

```text
stirworkflow
```

## Intelligence artificielle

* Python
* Flask
* Machine Learning / analyse de données

## Conteneurisation

* Docker
* Docker Compose

## Cloud & Orchestration

La partie DevOps prévoit une architecture basée sur :

* Microsoft Azure
* Azure Resource Group
* Azure Container Registry (**ACR**)
* Azure Kubernetes Service (**AKS**)
* Kubernetes
* Kubernetes Ingress
* Kubernetes Services
* Kubernetes Deployments
* Helm

---

#  Authentification et sécurité

L'application utilise **Spring Security** avec une authentification basée sur **JWT**.

Les utilisateurs sont associés à différents rôles :

```text
ROLE_EMPLOYEE
ROLE_CHEF
ROLE_SOUS_DIRECTEUR
ROLE_DIRECTEUR
ROLE_RH
ROLE_ADMIN
```

Les autorisations sont adaptées aux responsabilités de chaque rôle.

---

#  Statuts des demandes

Une demande de congé peut prendre différents statuts :

```text
PENDING_CHEF
REFUSED_CHEF

PENDING_SOUS_DIRECTEUR
REFUSED_SOUS_DIRECTEUR

PENDING_DIRECTEUR
REFUSED_DIRECTEUR

PENDING_RH
REFUSED_RH

APPROVED
```

En cas de refus, une justification peut être enregistrée.

---

#  Service d'intelligence artificielle

Un service Python indépendant est intégré à l'architecture.

Il expose une API permettant au backend de communiquer avec le modèle d'analyse.

Endpoint principal :

```http
POST /analyze
```

Le service fonctionne indépendamment du backend Spring Boot.

Cette séparation permet d'avoir une architecture composée de plusieurs services :

```text
Spring Boot Backend
        │
        │ HTTP
        ▼
Python AI Service
```

---

#  Docker

Les différents composants peuvent être exécutés sous forme de conteneurs Docker.

Les principaux services sont :

```text
Frontend
Backend
MongoDB
AI Service
```

Lancement avec Docker Compose :

```bash
docker compose up --build
```

Arrêt :

```bash
docker compose down
```

---

#  Déploiement sur Microsoft Azure

Une partie importante du projet concerne la préparation du déploiement sur **Microsoft Azure**.

L'architecture cible utilise :

### Azure Resource Group

Un Resource Group permet de regrouper les ressources Azure du projet.

```text
stir-rg
```

### Azure Container Registry — ACR

**Azure Container Registry (ACR)** est utilisé pour stocker les images Docker du projet.

Les images des différents services pourront être publiées dans l'ACR :

```text
Frontend Image
Backend Image
AI Model Image
```

### Azure Kubernetes Service — AKS

**Azure Kubernetes Service (AKS)** est utilisé comme cluster Kubernetes pour héberger les différents services de l'application.

Architecture cible :

```text
                    Internet
                       │
                       ▼
                ┌─────────────┐
                │   Ingress   │
                └──────┬──────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
     Frontend       Backend       AI Model
       Pod            Pod            Pod
                       │
                       ▼
                  MongoDB
```

Le cluster Kubernetes prévu pour le projet :

```text
AKS Cluster
└── stir-aks
```

Les ressources Azure principales sont donc :

```text
Azure
│
├── Resource Group
│   └── stir-rg
│
├── Azure Container Registry
│
└── Azure Kubernetes Service
    └── stir-aks
```

---

#  Kubernetes

Le déploiement Kubernetes est organisé autour de plusieurs ressources :

```text
Kubernetes Cluster
│
├── Frontend Deployment
├── Backend Deployment
├── AI Model Deployment
├── MongoDB Deployment
│
├── Services
│
└── Ingress
```

Les fichiers Kubernetes peuvent être organisés comme suit :

```text
k8s/
├── frontend.yaml
├── backend.yaml
├── model.yaml
├── mongodb.yaml
└── ingress.yaml
```

Cette architecture permet de déployer chaque composant indépendamment dans le cluster AKS.

---

#  Structure du projet

```text
STIR-Workflow/
│
├── BackendStiirworkflow/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── stir-frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── projASSu/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── k8s/
│   ├── frontend.yaml
│   ├── backend.yaml
│   ├── model.yaml
│   ├── mongodb.yaml
│   └── ingress.yaml
│
├── docker-compose.yml
│
└── README.md
```

---

#  Installation locale

## Prérequis

Installer :

* Node.js
* npm
* Java JDK
* Maven
* Python
* MongoDB ou Docker
* Docker Desktop

---

## Backend

```bash
cd BackendStiirworkflow
mvn clean install
mvn spring-boot:run
```

Backend :

```text
http://localhost:8080
```

---

## Frontend

```bash
cd stir-frontend
npm install
npm run dev
```

Frontend :

```text
http://localhost:5173
```

---

## AI Service

```bash
cd projASSu
pip install -r requirements.txt
python app.py
```

AI Service :

```text
http://localhost:5000
```

---

# API d'authentification

Endpoint de connexion :

```http
POST /api/auth/login
```

Exemple :

```json
{
  "username": "user",
  "password": "password"
}
```

Après authentification, le serveur retourne un **JWT** permettant d'accéder aux ressources protégées.

---

#  Variables d'environnement

Les informations sensibles sont stockées dans des fichiers `.env` et ne doivent pas être publiées sur GitHub.

Exemple :

```env
MONGO_URI=mongodb://localhost:27017/stirworkflow
JWT_SECRET=your_secret
AI_SERVICE_URL=http://localhost:5000
```

Les fichiers `.env` sont exclus du dépôt Git.

---

#  État actuel du projet

### Fonctionnalités développées

* [x] Authentification utilisateur
* [x] Authentification JWT
* [x] Gestion des rôles
* [x] Gestion des demandes de congé
* [x] Workflow multi-niveaux
* [x] Gestion des refus et justifications
* [x] Dashboards par rôle
* [x] Connexion à MongoDB
* [x] Service Python/Flask
* [x] Conteneurisation Docker
* [x] Docker Compose

### Partie DevOps / Cloud

* [x] Création du Resource Group Azure
* [x] Création de l'Azure Container Registry (ACR)
* [x] Préparation du cluster Azure Kubernetes Service (AKS)
* [x] Préparation des manifests Kubernetes
* [ ] Déploiement complet de l'application sur AKS
* [ ] Mise en place complète du pipeline CI/CD
* [ ] Monitoring et observabilité

> Les éléments marqués comme non réalisés correspondent aux prochaines étapes du projet.

---

# 🎓 Contexte du projet

Ce projet a été réalisé dans le cadre d'un **stage d'ingénieur à la Société Tunisienne des Industries de Raffinage (STIR)**.

Il permet de mettre en pratique des compétences en :

* Développement Full Stack
* Java / Spring Boot
* React
* MongoDB
* REST API
* JWT / Spring Security
* Python / Flask
* Intelligence artificielle
* Docker
* Kubernetes
* Microsoft Azure
* AKS
* ACR
* Architecture Cloud

---

## 👨‍💻 Auteur

**Mohamed Dhia Romdhane**

Projet réalisé dans le cadre d'un stage d'ingénieur à la **STIR**.
