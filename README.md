# Post Service – RabbitMQ Producer (Direct + Fanout)
## Event-Driven Microservices using NestJS + PostgreSQL

This Post Service acts as the **producer service** in a RabbitMQ-based microservices architecture.
It is responsible for publishing events when a post is created, without directly calling any other service.

This project demonstrates how **real-world backend systems** use message brokers to decouple services
and achieve scalability, reliability, and fault tolerance.

The goal of this service is to show **how real production systems decouple services**
using message queues instead of tight API-to-API communication.

---

## What is RabbitMQ (Easy Explanation)

RabbitMQ is a **message broker** that sits between services.

Instead of one service directly calling another service,
messages flow through RabbitMQ like this:

Producer → Exchange → Queue → Consumer

This approach ensures:
- Loose coupling between services
- Asynchronous communication
- Better scalability
- No dependency on consumer availability

---

## RabbitMQ Exchange Types (Concept)

RabbitMQ supports **4 types of exchanges**:

1. Direct Exchange  
2. Fanout Exchange  
3. Topic Exchange  
4. Headers Exchange  

In this project, I have implemented **2 exchange types**:

- Direct Exchange
- Fanout Exchange

These two are the most commonly used patterns in real production systems.

---

## Why Direct and Fanout Only?

Direct and Fanout exchanges cover most backend use cases:

- **Direct Exchange**
  - One message → one queue → one consumer
  - Used for task-based or command-based processing

- **Fanout Exchange**
  - One message → multiple queues → multiple consumers
  - Used for event broadcasting (publish-subscribe)

Topic and Headers exchanges are intentionally skipped
to keep the architecture simple and focused.

---

## Messaging Patterns Implemented

### 1. Direct Exchange (Point-to-Point)

Used when **only one service** should process a message.

Flow:
Post Service → Direct Exchange → Single Queue → Single Consumer

Use cases:
- Order processing
- Background jobs
- Inventory updates
- Payment handling

In this project:
- Post Service emits a message
- Only one bound consumer receives it

---

### 2. Fanout Exchange (Publish-Subscribe)

Used when **multiple services** need to react to the same event.

Flow:
Post Service → Fanout Exchange → Multiple Queues → Multiple Consumers

Each service gets its **own copy** of the message.

Use cases:
- Send email
- Send notification
- Update analytics
- Audit logging

---

## Real-World Flow Implemented

When a post is created:

1. Post is saved in PostgreSQL
2. An event is published to RabbitMQ
3. Other services react independently

Post Service does NOT care:
- Which service consumes the message
- How many services consume it
- Whether a consumer is currently down

This is how large-scale systems are designed.

---

## Tech Stack Used

- NestJS
- RabbitMQ
- @nestjs/microservices
- PostgreSQL
- TypeORM
- amqplib
- amqp-connection-manager
- Docker (RabbitMQ)
- RabbitMQ Management UI
- Postman

---

## Project Folder Structure

src/
├── database/
│   └── entities/
│       └── post.entity.ts
├── modules/
│   └── post/
│       ├── post.controller.ts
│       └── post.service.ts
├── app.module.ts
└── main.ts

---

## Setup Instructions

### Clone Repository
git clone <repository-url>
cd post-service
npm install

---

### Start RabbitMQ using Docker
docker run -d \
--hostname rabbitmq \
--name rabbitmq \
-p 5672:5672 \
-p 15672:15672 \
rabbitmq:3-management

RabbitMQ Dashboard:
http://localhost:15672  
Username: guest  
Password: guest  

---

### Start Post Service
npm run start:dev

---

## API Endpoint

POST /posts

Request Body:
{
  "content": "Hello RabbitMQ"
}

---

## Internal Working (Step-by-Step)

1. Post is saved in PostgreSQL using TypeORM
2. Post Service publishes an event to RabbitMQ
3. Exchange routes the message:
   - Direct → single queue
   - Fanout → multiple queues
4. Consumer services process the message independently

---

## RabbitMQ Management UI Verification

Open:
http://localhost:15672

Check:
- Exchanges → Direct / Fanout exchanges
- Queues → Consumer-specific queues
- Bindings → Exchange-to-queue mapping
- Message rates → publish / deliver metrics

Note:
If consumers are running with acknowledgements enabled,
messages may not stay visible in queues — this is expected behavior.

---

## Production-Level Concepts Applied

- Event-driven architecture
- Loose coupling
- Asynchronous messaging
- Fault tolerance
- Horizontal scalability
- Clean separation of concerns
- No direct service-to-service dependency

---

## What I Learned from This Project

- How RabbitMQ works internally
- Difference between Direct and Fanout exchanges
- How publish-subscribe systems work
- How NestJS integrates RabbitMQ
- How real backend systems avoid tight coupling
- How to debug message flow using RabbitMQ UI

---

## Made By Deeksha

This Post Service demonstrates real-world RabbitMQ integration
using NestJS with both Direct and Fanout messaging patterns.
It acts as a clean producer service in an event-driven architecture.
