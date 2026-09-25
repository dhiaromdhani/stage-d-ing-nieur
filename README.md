# STIR Workflow de Gestion des Congés et Recommandation

##  Présentation

**STIR Workflow de Gestion des Congés et Recommandation** est une application web développée dans le cadre d'un stage d'ingénieur au sein de la **Société Tunisienne des Industries de Raffinage (STIR)**.

Le projet vise à digitaliser le processus de gestion des congés tout en intégrant des fonctionnalités intelligentes permettant d'exploiter les données des employés et de proposer des **recommandations d'activités adaptées à leurs profils**.

L'application est conçue selon une architecture **Full Stack et microservices**, avec plusieurs services indépendants communiquant via des API.

---

#  Objectifs

Le projet a plusieurs objectifs :

* Digitaliser la gestion des demandes de congé.
* Automatiser le workflow de validation.
* Centraliser les données des employés et des demandes.
* Assurer la traçabilité des validations et des refus.
* Gérer les utilisateurs selon leurs rôles.
* Sécuriser l'application avec JWT.
* Exploiter les données des employés.
* Analyser les compétences et informations liées aux employés.
* Proposer des **activités adaptées aux employés** grâce à un service de recommandation.
* Préparer le déploiement des différents services avec Docker et Kubernetes sur Azure.

---

#  Architecture générale

Le système est composé de plusieurs services :

```text
                         ┌─────────────────────┐
                         │      Frontend       │
                         │    React + Vite     │
                         └──────────┬──────────┘
                                    │
                                  REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Backend       │
                         │     Spring Boot     │
                         │   Security + JWT    │
                         └──────┬──────┬───────┘
                                │      │
                    ┌───────────┘      └───────────────┐
                    │                                  │
                    ▼                                  ▼
             ┌──────────────┐                  ┌──────────────┐
             │   MongoDB    │                  │ Model / AI   │
             │   Database   │                  │   Service    │
             └──────────────┘                  └──────┬───────┘
                                                      │
                                                      ▼
                                            ┌──────────────────┐
                                            │ Recommendation   │
                                            │     Service      │
                                            └──────────────────┘
```

### Principaux composants

| Service        | Technologie    | Responsabilité                    |
| -------------- | -------------- | --------------------------------- |
| Frontend       | React / Vite   | Interface utilisateur             |
| Backend        | Spring Boot    | Logique métier et API             |
| MongoDB        | MongoDB        | Base de données principale        |
| Model          | Python / Flask | Analyse et traitement intelligent |
| Recommendation | Python / AI    | Recommandation d'activités        |

---

#  Workflow de gestion des congés

Le processus de validation suit plusieurs niveaux :

```text
Employé
   │
   ▼
Création d'une demande
   │
   ▼
Chef de service
   │
   ├── Refus → Justification
   │
   ▼
Sous-directeur
   │
   ├── Refus → Justification
   │
   ▼
Directeur
   │
   ├── Refus → Justification
   │
   ▼
Ressources Humaines
   │
   ▼
Demande approuvée
```

Chaque niveau possède des droits correspondant à son rôle.

---

#  Gestion des employés

Le système centralise les informations relatives aux employés.

Les données peuvent notamment être utilisées pour :

* Identifier les compétences.
* Consulter les expériences.
* Analyser les activités réalisées.
* Exploiter les évaluations.
* Identifier les domaines d'intérêt.
* Calculer la pertinence d'une activité pour un employé.

Ces informations constituent la base du système de recommandation.

---

#  Model / AI Service

Le projet contient un service indépendant dédié au traitement intelligent des données.

Ce service est développé avec :

* Python
* Flask
* Machine Learning
* NLP selon les besoins du modèle

Il communique avec le backend via une API REST.

Exemple :

```text
Backend Spring Boot
        │
        │ HTTP Request
        ▼
   Model Service
        │
        │ Analyse
        ▼
    Résultats
```

L'objectif du service est de traiter les informations relatives aux employés et aux activités afin de fournir des données exploitables par le système de recommandation.

---

#  Recommandation des activités

Une fonctionnalité importante du projet est la **recommandation d'activités aux employés**.

Le système exploite différentes informations :

```text
                 Employé
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
    Compétences  Expérience   Activités
        │           │            │
        └───────────┼────────────┘
                    ▼
              Model / AI
                    │
                    ▼
          Matching / Scoring
                    │
                    ▼
       Recommandations d'activités
```

Le système peut ainsi déterminer quelles activités sont pertinentes pour un employé en fonction de son profil et des informations disponibles.

### Exemple

```text
Employé
 ├── Java
 ├── Spring Boot
 ├── MongoDB
 └── 2 ans d'expérience

             ↓

Analyse du profil

             ↓

Activités disponibles

             ↓

Calcul de pertinence

             ↓

Recommandations
```

Cette fonctionnalité permet d'aider les responsables à identifier les employés pouvant être associés à certaines activités internes.

---

#  Données utilisées

MongoDB constitue la **base de données principale du projet**.

Elle permet de stocker notamment :

* Utilisateurs
* Employés
* Demandes de congé
* Activités
* Notifications
* Sessions
* Historique des recommandations
* Logs d'audit
* Informations nécessaires au système de recommandation

Exemples de collections :

```text
users
employees
activities
notifications
sessions
recommendationhistories
auditlogs
```

---

#  Authentification et sécurité

L'application utilise :

* Spring Security
* JWT
* Contrôle d'accès basé sur les rôles

Les rôles principaux sont :

```text
ROLE_EMPLOYEE
ROLE_CHEF
ROLE_SOUS_DIRECTEUR
ROLE_DIRECTEUR
ROLE_RH
ROLE_ADMIN
```

Chaque rôle possède des permissions spécifiques.

---

#  Statuts des demandes de congé

Les demandes peuvent prendre les statuts suivants :

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

Lorsqu'une demande est refusée, une justification est enregistrée.

---

#  Technologies

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

## Database

* **MongoDB 7**

## AI / Model

* Python
* Flask
* Machine Learning
* NLP

## DevOps / Cloud

* Docker
* Docker Compose
* Kubernetes
* Microsoft Azure
* Azure Container Registry (ACR)
* Azure Kubernetes Service (AKS)
* Kubernetes Ingress
* Helm

---

#  Docker

Chaque service peut être exécuté dans son propre conteneur :

```text
┌───────────────────────┐
│ Frontend Container    │
└───────────────────────┘

┌───────────────────────┐
│ Backend Container     │
└───────────────────────┘

┌───────────────────────┐
│ Model Container       │
└───────────────────────┘

┌───────────────────────┐
│ MongoDB Container     │
└───────────────────────┘
```

Les services peuvent être lancés avec :

```bash
docker compose up --build
```

Pour arrêter les services :

```bash
docker compose down
```

---

#  Architecture Azure

Le déploiement cloud prévu repose sur **Microsoft Azure**.

## Azure Resource Group

Les ressources du projet sont regroupées dans :

```text
stir-rg
```

## Azure Container Registry — ACR

L'**Azure Container Registry (ACR)** permet de stocker les images Docker des différents services :

```text
ACR
│
├── Frontend Image
├── Backend Image
└── Model Image
```

## Azure Kubernetes Service — AKS

Le projet utilise un cluster **Azure Kubernetes Service (AKS)** pour héberger les différents composants.

Cluster :

```text
stir-aks
```

Architecture cible :

```text
                    Internet
                       │
                       ▼
                  ┌─────────┐
                  │ Ingress │
                  └────┬────┘
                       │
        ┌──────────────┼───────────────┐
        ▼              ▼               ▼
   Frontend Pod   Backend Pod      Model Pod
                       │               │
                       │               │
                       ▼               ▼
                  MongoDB Pod     Recommendation
                                       Service
```

---

#  Kubernetes

Les composants sont organisés sous forme de ressources Kubernetes :

```text
AKS Cluster
│
├── Frontend Deployment
├── Backend Deployment
├── Model Deployment
├── MongoDB
│
├── Services
│
└── Ingress
```

Exemple d'organisation :

```text
k8s/
├── frontend.yaml
├── backend.yaml
├── model.yaml
├── mongodb.yaml
└── ingress.yaml
```

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

* Node.js
* npm
* Java JDK
* Maven
* Python
* Docker Desktop
* MongoDB

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

## Model / AI

```bash
cd projASSu
pip install -r requirements.txt
python app.py
```

Model Service :

```text
http://localhost:5000
```

---

#  API

## Authentification

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

Le serveur retourne un JWT permettant d'accéder aux ressources protégées.

## Analyse AI

```http
POST /analyze
```

Le backend peut communiquer avec le service Model via cet endpoint.

---

#  Variables d'environnement

Les informations sensibles sont stockées dans des fichiers `.env`.

Exemple :

```env
MONGO_URI=mongodb://localhost:27017/stirworkflow
JWT_SECRET=your_secret
AI_SERVICE_URL=http://localhost:5000
```

Les fichiers `.env` ne doivent pas être commités dans Git.

---

#  État actuel du projet

## Fonctionnalités développées

* [x] Authentification
* [x] JWT / Spring Security
* [x] Gestion des rôles
* [x] Gestion des employés
* [x] Gestion des demandes de congé
* [x] Workflow multi-niveaux
* [x] Gestion des refus et justifications
* [x] Dashboards selon les rôles
* [x] MongoDB
* [x] Service Model / AI
* [x] Gestion des activités
* [x] Système de recommandation des activités
* [x] Docker
* [x] Docker Compose

## DevOps / Cloud

* [x] Azure Resource Group
* [x] Azure Container Registry (ACR)
* [x] Préparation du cluster Azure Kubernetes Service (AKS)
* [x] Préparation des manifests Kubernetes
* [ ] Déploiement complet sur AKS
* [ ] CI/CD
* [ ] Monitoring

---

#  Contexte

Projet réalisé dans le cadre d'un **stage d'ingénieur à la Société Tunisienne des Industries de Raffinage (STIR)**.

Le projet permet de mettre en pratique :

* Développement Full Stack
* React
* Spring Boot
* MongoDB
* REST API
* Spring Security
* JWT
* Python
* Machine Learning / NLP
* Système de recommandation
* Docker
* Kubernetes
* Microsoft Azure
* Azure AKS
* Azure ACR
* Architecture microservices

---

##  Auteur

**Mohamed Dhia Romdhane**

Projet réalisé dans le cadre d'un stage d'ingénieur à la **STIR**.
