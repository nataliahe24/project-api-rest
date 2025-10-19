# Project API REST

RESTful API for project management with CRUD operations, built with Node.js, TypeScript, Express, Prisma, and PostgreSQL.

## 🚀 Features

- ✅ **CRUD Operations** for Project entity
- ✅ **TypeScript** with strict mode and ESM
- ✅ **Prisma ORM** with PostgreSQL
- ✅ **Express Validator** for request validation
- ✅ **Swagger UI** for API documentation at `/docs`
- ✅ **Business Logic Validation** (endDate requirements based on status)
- ✅ **Custom Error Handling** with structured error responses
- ✅ **Jest Tests** with 100% coverage on utils and validation
- ✅ **Clean Code** architecture (controllers, services, middlewares)

## 📋 Prerequisites

- Node.js >= 18
- PostgreSQL database
- npm or yarn

## ⚡ Quick Start

Visit `http://localhost:3000/docs` for Swagger documentation.

## 🛠️ Detailed Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/nataliahe24/project-api-rest.git
cd project-api-rest
```

### Step 2: Install production dependencies

```bash
npm install express cors @prisma/client dotenv swagger-ui-express swagger-jsdoc express-validator
```

### Step 3: Install development dependencies

```bash
npm install -D typescript ts-node tsx nodemon prisma @types/node @types/express @types/cors @types/swagger-jsdoc @types/swagger-ui-express
```

### Step 4: Install testing dependencies

```bash
npm install -D jest ts-jest @jest/globals @types/jest
```

### Step 5: Configure environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/name_db"
PORT=?
```

**Database URL Format:**

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### Step 6: Initialize Prisma (if starting from scratch)

```bash
npx prisma init --datasource-provider postgresql
```

### Step 7: Run Prisma migrations

This command creates the database tables based on your schema:

```bash
npx prisma migrate dev --name init
```

> **Note:** If you make changes to `prisma/schema.prisma`, run migrations again:
>
> ```bash
> npx prisma migrate dev --name your_migration_name
> ```

### Step 8: Generate Prisma Client

```bash
npx prisma generate
```

> **Note:** Run this command every time you change the Prisma schema.

## 🏃 Running the Application

### Available Scripts

| Script            | Command                 | Description                              |
| ----------------- | ----------------------- | ---------------------------------------- |
| **Development**   | `npm run dev`           | Start development server with hot reload |
| **Test**          | `npm test`              | Run all tests with Jest                  |
| **Test Watch**    | `npm run test:watch`    | Run tests in watch mode                  |
| **Test Coverage** | `npm run test:coverage` | Run tests with coverage report           |

### Development Mode

```bash
npm run dev
```

🚀 **Server running at:** http://localhost:${PORT}

### Available Endpoints

- 🌐 **API Base URL:** http://localhost:${PORT}
- 📘 **Swagger Documentation:** http://localhost:${PORT}/docs
- 🔍 **Example Endpoint:** http://localhost:${PORT}/project

## 🧪 Testing

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Test Coverage

Current coverage for core business logic:

- **Utils**: 100% coverage (AppError, DateIsRequired) - 20 tests
- **Validations**: 100% coverage (body.validation) - 15 tests
- **Service**: Mocked Prisma tests - 20 tests

**Total: 55 tests** ✅

## 📚 API Endpoints

### Projects

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| GET    | `/project`     | Get all projects     |
| GET    | `/project/:id` | Get project by ID    |
| POST   | `/project`     | Create a new project |
| PUT    | `/project/:id` | Update a project     |
| DELETE | `/project/:id` | Delete a project     |

### Request/Response Examples

#### POST `/project` - Create Project

**Request Body:**

```json
{
  "name": "New Project",
  "description": "Project description",
  "status": "in progress",
  "startDate": "2025-01-01T00:00:00.000Z"
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "name": "New Project",
  "description": "Project description",
  "status": "in progress",
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": null,
  "createdAt": "2025-10-19T06:00:00.000Z",
  "updatedAt": "2025-10-19T06:00:00.000Z"
}
```

#### POST `/project` - Create Completed Project

**Request Body:**

```json
{
  "name": "Completed Project",
  "description": "This project is done",
  "status": "completed",
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-12-31T00:00:00.000Z"
}
```

#### PUT `/project/:id` - Update Project (Partial Update)

**Request Body:**

```json
{
  "status": "completed",
  "endDate": "2025-12-31T00:00:00.000Z"
}
```

### Business Rules

#### Project Status Validation

1. **Status: "in progress"**

   - `endDate` is **optional** (can be null or omitted)
   - If `endDate` is provided → **400 Error**

2. **Status: "completed"**
   - `endDate` is **required**
   - If `endDate` is missing/null → **400 Error**

#### Validation Examples

❌ **Invalid** - Completed without endDate:

```json
{
  "name": "Project",
  "status": "completed",
  "startDate": "2025-01-01T00:00:00.000Z"
}
```

**Response: 400 Bad Request**

```json
{
  "message": "End date is required when status is Completed"
}
```

❌ **Invalid** - In progress with endDate:

```json
{
  "name": "Project",
  "status": "in progress",
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-12-31T00:00:00.000Z"
}
```

**Response: 400 Bad Request**

```json
{
  "message": "End date is not allowed when status is In Progress"
}
```

## 🏗️ Project Structure

```
project-api-rest/
├── src/
│   ├── app.ts                      # Express application setup
│   ├── configurations/
│   │   └── swagger.ts              # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   └── project.controller.ts  # Request handlers
│   ├── interfaces/
│   │   └── project.interface.ts   # TypeScript interfaces
│   ├── middlewares/
│   │   ├── body.validation.ts     # Express-validator rules
│   │   ├── global.error.handle.ts # Global error handler
│   │   ├── validate.request.ts    # Validation middleware
│   │   └── __tests__/             # Middleware tests
│   ├── routes/
│   │   ├── index.ts               # Dynamic route loader
│   │   └── project.ts             # Project routes
│   ├── services/
│   │   └── project.service.ts
|   |   |__ __tests__/
|   |
|   |
│   └── utils/
│       ├── app.error.ts           # Custom error class
│       ├── validate.date.ts       # Date validation utility
│       └── __tests__/             # Utility tests
├── prisma/
│   ├── schema.prisma              # Prisma schema
│   └── migrations/                # Database migrations
├── jest.config.cjs                # Jest configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Project dependencies
```

## 🔧 Technologies

- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Express 5** - Web framework
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **Swagger UI Express** - API documentation
- **Express Validator** - Request validation
- **Jest** - Testing framework
- **ts-jest** - TypeScript preprocessor for Jest

## 🔨 Useful Commands

### Prisma Commands

```bash
# View your database in Prisma Studio (GUI)
npx prisma studio

# Create a new migration after schema changes
npx prisma migrate dev --name migration_name

# Apply pending migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate Prisma Client after schema changes
npx prisma generate

# Format your Prisma schema file
npx prisma format

# Validate your Prisma schema
npx prisma validate
```

### Development Commands

```bash
# Run development server
npm run dev

# Run tests once
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** `P1001: Can't reach database server`

**Solution:**

1. Ensure PostgreSQL is running
2. Check your `.env` file has correct credentials
3. Verify database exists: `psql -U postgres -c "CREATE DATABASE projects_db;"`

### Prisma Client Not Found

**Problem:** `Cannot find module '@prisma/client'`

**Solution:**

```bash
npm install @prisma/client
npx prisma generate
```

### Migration Errors

**Problem:** Schema drift detected

**Solution:**

```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Test Failures

**Problem:** Tests failing due to module resolution

**Solution:**
Ensure you're using Node.js >= 18 and run:

```bash
npm install
npm test
```

## 📖 Database Schema

```prisma
model Project {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  status      String
  startDate   DateTime
  endDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## 🎯 Testing Strategy

Tests focus on critical business logic:

1. **DateIsRequired Utility** (`validate.date.test.ts`)

- ✅ Status "completed" requires endDate
- ✅ Status "in progress" rejects endDate
- ✅ Proper error throwing with AppError
- ✅ Edge cases (empty strings, null values)
- ✅ ISO date string handling

2. **AppError Class** (`app.error.test.ts`)

- ✅ Default values (statusCode: 400, type: "AppError")
- ✅ Custom statusCode and type
- ✅ Error inheritance from Error class
- ✅ Throwable and catchable
- ✅ Stack trace preservation

### 3. **Request Validations** (`body.validation.test.ts`)

- ✅ POST: Required fields validation
- ✅ PUT: Optional fields (partial updates)
- ✅ Status enum validation (case-insensitive)
- ✅ Date format validation (ISO8601)
- ✅ Empty body handling for PUT

### 4. **Service with Mocked Prisma** (`project.service.test.ts`)

- ✅ **getProjects**: Returns all projects, handles empty arrays
- ✅ **getProjectById**: Returns project by ID, throws AppError (404) when not found
- ✅ **createProject**: Creates in progress/completed projects, validates endDate rules
- ✅ **updateProject**: Updates fields, validates status transitions, enforces business rules
- ✅ **deleteProject**: Deletes projects, validates existence before deletion
- ✅ Uses mocked PrismaClient for isolated unit testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Test Results

```
Test Suites: 4 passed, 4 total
Tests:       52 assed, 52total
Snapshots:   0 total
Time:        ~10s
```

## 🐛 Error Handling

The API uses structured error responses:

```json
{
  "message": "Error message",
  "statusCode": 400,
  "type": "ValidationError"
}
```

**Error Types:**

- `ValidationError` (400) - Input validation failed
- `NotFoundError` (404) - Resource not found
- `AppError` (400) - General application error

## 📝 Git Commit Strategy

- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code changes without affecting functionality
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
- `docs:` Documentation changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC

## 👤 Author

**Natalia Henao**

- GitHub: [@nataliahe24](https://github.com/nataliahe24)
- Repository: [project-api-rest](https://github.com/nataliahe24/project-api-rest)

---

**Built with ❤️ using TypeScript, Express, and Prisma**
