# **ThreadHive**  

ThreadHive is a **scalable social media platform** built using a **microservices architecture**. It leverages **Docker** for containerization, **NestJS** for backend development, **GraphQL** for efficient data querying, and **Drizzle ORM** with **MySQL** for database management. The project is designed to be **robust, modular, and production-ready** with **security features**, **RBAC-based authentication**, **Redis caching**, **fast API response times**, and **user activity tracking**.

---

## **Table of Contents**  
- [Architecture Overview](#architecture-overview)  
- [Technologies Used](#technologies-used)  
- [Microservices & Features](#microservices--features)  
- [Security Features](#security-features)  
- [Prerequisites](#prerequisites)  
- [Getting Started](#getting-started)  
- [Usage](#usage)  
- [Testing](#testing)  
- [Docker & Deployment](#docker--deployment)  
- [Contributing](#contributing)  
- [License](#license)  

---

## **Architecture Overview**  

ThreadHive follows a **distributed microservices architecture** with independent services responsible for various functionalities. These services interact via **GraphQL APIs** and **message queues (Kafka, RabbitMQ)** for event-driven communication. The architecture supports **horizontal scaling, high availability, and modularity**.

Each microservice runs in its own **Docker container**, ensuring seamless deployment and orchestration.

---

## **Technologies Used**  

### **1. NestJS + Fastify**  
- **NestJS** provides a structured, modular backend with **Dependency Injection (DI)**.
- **Fastify** is used for high-speed, efficient request handling.

### **2. GraphQL (Code-First Approach) + Apollo Server**  
- **Subgraphs and Supergraph** implemented for a **federated GraphQL Gateway**.
- **Efficient data fetching** with **strongly typed schemas**.

### **3. Drizzle ORM with MySQL**  
- **Drizzle ORM** is used for type-safe database queries.
- **MySQL** ensures **ACID transactions** and relational data management.
- **Database Migration & Seeding** handled via Drizzle.

### **4. Redis for Caching & Performance Optimization**  
- **Reduces database load** and speeds up queries.
- **Session storage & user activity tracking**.

### **5. Containerization & Deployment**  
- **Docker + Docker Compose** used for microservice containerization.
- **Port mapping & service orchestration**.
- **Multi-stage builds for optimized image sizes**.

### **6. Kafka & WebSockets (Real-time Features & Notifications)**  
- Kafka is used for **event-driven communication** (e.g., post likes, user activity tracking).
- WebSockets provide **real-time notifications & live updates**.

### **7. Authentication & RBAC Authorization**  
- **JWT-based authentication** for secure user login.
- **RBAC (Role-Based Access Control)** for feature-level authorization.

### **8. Security Enhancements**  
- **Rate Limiting (`@fastify/rate-limit`)** to prevent DDoS attacks.
- **Helmet (`@fastify/helmet`)** for securing HTTP headers.
- **Input validation (`class-validator`)** to prevent SQL injection.
- **CORS enabled** for controlled API access.
- **Password hashing** for secure user data storage.

### **9. Code Quality & Best Practices**  
- **ESLint & Prettier** for consistent and maintainable code.
- **Data class validators (`class-validator`)** ensure type safety.

---

## **Microservices & Features**  

### **1. User Service**  
- **User authentication (Signup/Login)**.
- **RBAC-based Authorization**.
- **User Profile Management**.

### **2. Post Service**  
- **Create, update, delete posts**.
- **Like, comment, reply functionality**.
- **Real-time post activities tracking**.

### **3. Database Service**  
- **Handles MySQL connection & migrations**.
- **Exposes database queries via GraphQL API**.

### **4. Gateway API**  
- **Single entry point for clients**.
- **GraphQL Supergraph implementation**.
- **Authenticates and routes requests to subgraphs**.

### **5. User Activity Monitoring Service**  
- **Tracks user login/logout activities**.
- **Monitors post interactions, likes, comments, and replies**.
- **Stores logs in Redis for quick access**.

### **6. Notification Service (WebSockets/Kafka)**  
- **Real-time notifications for likes/comments**.
- **Event-driven architecture using Kafka**.

---

## **Security Features**  

1. **DDoS Protection** → `@fastify/rate-limit` for request throttling.
2. **Helmet Middleware** → Secure HTTP headers.
3. **CORS Policy** → Restrict access to allowed domains.
4. **Class Validators** → Prevent SQL injection & invalid input.
5. **JWT Authentication** → Secure token-based access.
6. **Password Hashing (bcrypt)** → Ensures user password security.
7. **Event Throttling** → Prevents excessive API usage from bots.

---

## **Prerequisites**  
- **Docker & Docker Compose** (for containerized deployment).
- **Node.js (v16+)** (for running the backend locally).
- **MySQL** (as the primary database).

---

## **Getting Started**  

1. **Clone the Repository**  
```bash
git clone https://github.com/arthgupta11/ThreadHive.git
cd ThreadHive
```

2. **Set Up Environment Variables**  
```ini
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=threadhive
```

3. **Run the Application using Docker Compose**  
```bash
docker-compose up --build
```

4. **Access the API**  
- **GraphQL Gateway** → `http://localhost:3000/graphql`

---

## **Usage**  
✅ **User Signup/Login** → via `/auth/signup`, `/auth/login`
✅ **CRUD operations on posts** → via `/post/create`
✅ **RBAC-based authorization** → Admins can **delete** posts, users **cannot**
✅ **Real-time notifications** → WebSockets for **post interactions**

---

## **Testing**  

```bash
# Run unit tests
yarn test

# Run e2e tests
yarn test:e2e
```

---

## **Docker & Deployment**  

- **How to write a Dockerfile** for optimized builds.
- **How to write docker-compose.yml** for multi-container setup.
- **Port mapping concepts**.
- **CLI Commands** to work with Docker:
```bash
docker-compose up --build
docker ps
docker logs container_id
docker exec -it container_id sh
```

---

## **Contributing**  
- Fork the repository.
- Create a feature branch.
- Submit a PR with meaningful commit messages.

---

## **License**  
ThreadHive is licensed under the **MIT License**.

---

🚀 **ThreadHive - Scalable, Secure, and Built for Developers!**

