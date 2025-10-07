# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS Todo List API using TypeScript, TypeORM, and PostgreSQL. The project is currently used for evaluating JavaScript/TypeScript full-stack candidates at Crunchloop.

## Development Commands

```bash
# Installation
npm install

# Running the application
npm run start          # Standard mode
npm run start:dev      # Watch mode (development)
npm run start:debug    # Debug mode with watch
npm run start:prod     # Production mode

# Testing
npm run test           # Run all unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage report
npm run test:e2e       # Run end-to-end tests
npm run test:debug     # Debug tests

# Code Quality
npm run lint           # Lint and auto-fix issues
npm run format         # Format code with Prettier

# Build
npm run build          # Build the project
```

### Running a Single Test File

```bash
npm test -- src/todo_lists/todo_lists.controller.spec.ts
```

## Database Setup

The application uses PostgreSQL and is configured to run with Docker Compose:

```bash
docker-compose up -d    # Start PostgreSQL container
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DB_HOST=localhost       # Use 'postgres' when running in Docker
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nestjs_db
```

When running via Docker Compose, the environment variables are pre-configured in `docker-compose.yml`.

## Architecture

### Module Structure

The codebase follows NestJS's module-based architecture. Each feature is organized into its own module with the standard pattern:

```
src/
  todo_lists/
    todo_lists.module.ts       # Module definition
    todo_lists.controller.ts   # HTTP endpoints
    todo_lists.service.ts      # Business logic
    todo_list.entity.ts        # TypeORM entity
    dtos/
      create-todo_list.ts      # Create DTO
      update-todo_list.ts      # Update DTO
    todo_lists.controller.spec.ts  # Unit tests
  interfaces/
    todo_list.interface.ts     # Shared interface
```

### TypeORM Integration

The application uses TypeORM with PostgreSQL. Key configuration is in `app.module.ts`:

- **Database configuration**: Uses environment variables for connection details
- **Entity registration**: All entities must be registered in the `entities` array
- **Synchronize**: Currently set to `true` for development (auto-syncs schema changes)
- **Logging**: Enabled for debugging SQL queries

### Service Layer Pattern

Services use the repository pattern with TypeORM:

1. Inject repository using `@InjectRepository(Entity)` decorator
2. Repository methods: `find()`, `findOneBy()`, `create()`, `save()`, `delete()`
3. Services return Promises for all async operations

### DTOs and Interfaces

- **Entities** (`*.entity.ts`): TypeORM classes with decorators for database mapping
- **Interfaces** (`*.interface.ts`): TypeScript interfaces for type safety across modules
- **DTOs** (`*.dto.ts`): Data Transfer Objects for request/response validation

Note: DTOs currently don't use class-validator decorators but follow the DTO pattern.

## Testing Patterns

### Mocking TypeORM Repositories

When testing controllers or services that use TypeORM repositories, mock the repository using `getRepositoryToken`:

```typescript
import { getRepositoryToken } from '@nestjs/typeorm';

const mockRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const module = await Test.createTestingModule({
  providers: [
    YourService,
    {
      provide: getRepositoryToken(YourEntity),
      useValue: mockRepository,
    },
  ],
}).compile();
```

### Test Structure

Unit tests follow the pattern:

1. Mock repository methods before each test
2. Set up test module with mocked dependencies
3. Test individual controller/service methods
4. Verify repository methods were called correctly

## API Structure

- **Base path**: `/api/todolists`
- **Port**: 3000
- **Routes follow RESTful conventions**:
  - `GET /api/todolists` - List all
  - `GET /api/todolists/:todoListId` - Get one
  - `POST /api/todolists` - Create
  - `PUT /api/todolists/:todoListId` - Update
  - `DELETE /api/todolists/:todoListId` - Delete

## TypeScript Configuration

- Target: ES2023
- Module: CommonJS
- Decorators enabled (required for NestJS)
- Strict null checks enabled
- noImplicitAny: false (for flexibility)

## Integration Tests

External integration tests are maintained separately at: https://github.com/crunchloop/interview-tests

## Communication language

- Spanish

## Official Documentation

- [NestJs](https://docs.nestjs.com)
- [TypeORM](https://typeorm.io/docs/getting-started)
