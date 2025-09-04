# PayPilot Backend

This project is our PayPilot Spring Boot backend application managed with Maven.

## Prerequisites

- Java 17+ (JDK)
- Maven 3.8+
- Git

## Getting Started

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/paypilot-backend.git
    cd paypilot-backend
    ```
If you have downloaded as zip then no need to clone AGAIN!

## Important Configuration

Since our app has 
1) Mail sender using SMTP to send mails for Forget Password function
2) Recaptcha verification during Login
3) Local SQL database (I had used Oracle, you users can use H2 db to reduce setup)

So we need to add some more configurations that are to be added in [application.properties](https://github.com/Excalibur02/PayPilot.git/paypilot-backend/src/main/resources/application.properties)
Make sure to configure this file else there will be trouble.


2. **Build the project**
    ```bash
    mvn clean install
    ```

3. **Run the application**
    ```bash
    mvn spring-boot:run
    ```
    Or, run the generated jar:
    ```bash
    java -jar target/paypilot-backend-*.jar
    ```


## Useful Maven Commands

- Run tests: `mvn test`
- Package: `mvn package`
- Clean: `mvn clean`

## Documentation

- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Maven Documentation](https://maven.apache.org/guides/index.html)
