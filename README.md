# README

## Project Overview

This project is a backend service using Node.js (TypeScript) and PostgreSQL, designed to manage user accounts and community posts. Its a community feature for a platform.

## Approach

### Initial Steps

1. **Understanding Requirements**: I carefully read the test requirements to grasp the scope and deliverables.
2. **Database Schema**: Designed the database schema with clear entity relationships.

### Project Setup

1. **Project Initialization**: Created the project, installed necessary dependencies, and structured directories for controllers, routes, middleware, and services.

### Development

1. **Database Configuration**: Set up TypeORM, defined entities, and resolved relationship issues by reviewing documentation.
2. **Middleware and Services**: Implemented `isLogin` middleware for authentication and developed services to handle business logic.
3. **Controllers and Routes**: Created controllers and defined routes. Fixed method binding issues with `.bind()`.

### Challenges and Solutions

1. **Entity Relationships**: Faced issues with incorrect relationships, resolved by consulting stack overflow, senior developers and chatgpt.
2. **Method Bindings**: Fixed context loss in controller methods by using `.bind(this)`.
3. **File Casing Issues**: Ensured consistent file casing to avoid TypeScript errors.
4. **Middleware Errors**: Debugged and fixed authentication middleware.



## Conclusion

This project enhanced my understanding of Node.js, TypeScript, and TypeORM. Despite some challenges, the end result is a functional and well-documented backend service.

Feel free to reach out for any further questions or clarifications.
