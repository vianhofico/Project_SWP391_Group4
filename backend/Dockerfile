# Use Eclipse Temurin JDK 21 base image
FROM eclipse-temurin:21-jdk as build

# Set working directory inside container
WORKDIR /app

# Copy Maven wrapper and pom.xml first to cache dependencies
COPY pom.xml ./

# Copy all source code into container
COPY src ./src

# Build the application using Maven
RUN apt-get update && apt-get install -y maven && mvn clean package -DskipTests


# ---- Production stage ----
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy jar file from build stage
COPY --from=build /app/target/swp_project-1.0.0.jar app.jar


# Expose port (change if needed)
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
