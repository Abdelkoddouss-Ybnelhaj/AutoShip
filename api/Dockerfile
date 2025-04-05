# Stage 1: Build environment using Maven 3.9.6 and OpenJDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Create non-root user
RUN addgroup --system demogroup && adduser --system --ingroup demogroup demo
USER demo
WORKDIR /app

# Copy Maven project files
COPY --chown=demo:demogroup pom.xml ./
COPY --chown=demo:demogroup src ./src

# Build the application
RUN mvn clean install -DskipTests

# Stage 2: Runtime environment using Eclipse Temurin JRE 21
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the jar from builder stage
COPY --from=builder /app/target/*.jar /app/app.jar

# Expose application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
