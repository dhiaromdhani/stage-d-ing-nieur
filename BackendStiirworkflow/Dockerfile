# ---- Étape 1 : build ----
# Adapte la version du JDK si ton projet en utilise une autre (17, 21...)
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copié séparément pour profiter du cache Docker sur les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# ---- Étape 2 : image finale (runtime léger) ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
