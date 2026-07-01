# Этап 1 — сборка jar файла
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Сначала копируем pom.xml и скачиваем зависимости
# Это позволяет кэшировать слой с зависимостями
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Копируем исходный код и собираем
COPY src ./src
RUN mvn clean package -DskipTests

# Этап 2 — запуск
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Копируем jar из этапа сборки
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]