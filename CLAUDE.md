# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS Todo List API using TypeScript, TypeORM, and PostgreSQL. The project is currently used for evaluating JavaScript/TypeScript full-stack candidates at Crunchloop.

**Important**: This is an evaluation/interview project, not a production application. Some features like migrations, validation, and e2e tests are intentionally minimal or pending implementation.

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
npm run test:debug     # Debug tests

# Code Quality
npm run lint           # Lint and auto-fix issues
npm run format         # Format code with Prettier

# Build
npm run build          # Build the project
```

**Note**: `npm run test:e2e` is defined but e2e tests are not implemented locally.

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
  app.module.ts              # Root module with TypeORM configuration
  main.ts                    # Application entry point
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

**Key Architecture Decisions**:
- TypeORM entities and interfaces are kept separate (entity in module, interface in shared folder)
- Controllers define their own route prefix (no global prefix)
- Services are exported from modules for potential reuse
- All database configuration is centralized in `app.module.ts`

### TypeORM Integration

The application uses TypeORM with PostgreSQL. Key configuration is in `app.module.ts`:

- **Database configuration**: Uses environment variables for connection details
- **Entity registration**: All entities must be registered in the `entities` array
- **Synchronize**: Set to `true` (auto-syncs schema changes). This is acceptable for this evaluation project. Migrations are not configured.
- **Logging**: Enabled for debugging SQL queries

### Service Layer Pattern

Services use the repository pattern with TypeORM:

1. Inject repository using `@InjectRepository(Entity)` decorator
2. Repository methods: `find()`, `findOneBy()`, `create()`, `save()`, `delete()`
3. Services return Promises for all async operations

### DTOs and Interfaces

- **Entities** (`*.entity.ts`): TypeORM classes with decorators for database mapping
- **Interfaces** (`*.interface.ts`): TypeScript interfaces for type safety across modules
- **DTOs** (`*.dto.ts`): Data Transfer Objects for request/response structure

Check DTOs to see if class-validator decorators are being used for validation.

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

- **Base path**: `/api/todolists` (defined in controller, not global prefix)
- **Port**: 3000
- **Routes follow RESTful conventions**:
  - `GET /api/todolists` - List all
  - `GET /api/todolists/:todoListId` - Get one
  - `POST /api/todolists` - Create
  - `PUT /api/todolists/:todoListId` - Update
  - `DELETE /api/todolists/:todoListId` - Delete

## Code Quality Configuration

### ESLint

Uses `eslint.config.mjs` with:
- TypeScript ESLint with type checking enabled
- Prettier integration
- Custom rules:
  - `@typescript-eslint/no-explicit-any`: off
  - `@typescript-eslint/no-floating-promises`: warn
  - `@typescript-eslint/no-unsafe-argument`: warn
- Configured for Node.js and Jest globals

### Prettier

Configuration in `.prettierrc`:
- `singleQuote: true`
- `trailingComma: "all"`

### Jest

Configuration in `package.json`:
- Test runner: `ts-jest`
- Root directory: `src/`
- Test pattern: `*.spec.ts`
- Coverage directory: `coverage/`

## TypeScript Configuration

- Target: ES2023
- Module: CommonJS
- Decorators enabled (required for NestJS)
- Strict null checks enabled
- noImplicitAny: false (for flexibility)

## Integration Tests

External integration tests are maintained separately at: https://github.com/crunchloop/interview-tests

## Communication Language

Spanish

## Official Documentation

- [NestJS](https://docs.nestjs.com)
- [TypeORM](https://typeorm.io)

## Development Guidelines

### Role and Behavior

When working in this codebase, Claude Code should:

- Act as an experienced senior engineer familiar with NestJS, TypeScript, and TypeORM
- Provide objective, factual information without inventing details
- Ask for clarification or documentation links when uncertain
- Follow existing code patterns and conventions in the project
- Prioritize code quality and maintainability

### Code Standards

- Always follow the existing module structure pattern
- Use async/await for all asynchronous operations
- Follow TypeScript best practices and leverage type safety
- Write unit tests for new controllers and services using the established mocking patterns
- Ensure ESLint and Prettier rules are satisfied before considering work complete

### Important Constraints

- NEVER create files unless absolutely necessary for the task
- ALWAYS prefer editing existing files over creating new ones
- Do NOT create documentation files (*.md) or README files unless explicitly requested
- Respect the evaluation/interview nature of this project - some features are intentionally minimal
