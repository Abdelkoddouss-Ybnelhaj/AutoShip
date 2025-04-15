# Stage 1: Build environment using Maven 3.9.6 and OpenJDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set working directory
WORKDIR /app

# Copy Maven project files
COPY pom.xml ./
COPY src ./src

# Install Git and OpenSSH
RUN apt-get update && \
    apt-get install -y git openssh-client && \
    rm -rf /var/lib/apt/lists/*

# Build the application
RUN mvn clean install -DskipTests

# Stage 2: Runtime environment using Eclipse Temurin JRE 21
FROM eclipse-temurin:21-jre

# Set working directory
WORKDIR /app

# Copy the jar from builder stage
COPY --from=builder /app/target/*.jar /app/app.jar

# Install Docker CLI (to build and push images from container)
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# Expose application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
