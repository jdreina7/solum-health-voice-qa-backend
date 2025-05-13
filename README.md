# Voice QA API

A robust API for managing voice calls, evaluations, and user management with role-based access control.



## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- `npm` or `yarn` package manager


## Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd voice-qa-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/voice_qa?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/voice_qa?schema=public"
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:3000"
```
**NOTE:** These URL connections correspond to the supabase connection URL to your project

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database with initial data:
```bash
npm run prisma:seed
```

6. In order to use the `import/sheets` endpoint to import data from Google Sheets origin, you must config the `credentials.json` file, based on the `credential.example.json` file and in the next guide:
```
1. Create a project in the Google Cloud Console:
  * Go to the Google Cloud Console
  * Click "Select a project" at the top
  * Click "New Project"
  * Give it a name (for example, "Voice QA Import")
  * Click "Create"
2. Enable the Google Sheets API:
  * In the side menu, go to "APIs & Services" > "Library"
  * Search for "Google Sheets API"
  * Click "Enable"
3. Create a service account:
  * In the side menu, go to "APIs & Services" > "Credentials"
  * Click "Create Credentials" > "Service Account"
  * Complete the fields:
  * Service account name: "voice-qa-import"
  * Service account ID: will be automatically generated
  * Role: "Editor" (or a more restrictive role if you prefer)
  * Click "Done"
4. Create and download the key:
  * In the list of service accounts, click the one you just created
  * Go to the "Keys" tab
  * Click "Add Key" > "Create new key"
  * Select "JSON"
  * Click "Create"
  * A JSON file will automatically download
5. Configure the project:
  * Rename the downloaded JSON file to credentials.json
  * Place it in the root of the voice-qa-backend project
```

## Running the Application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```


## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Validation**: class-validator & class-transformer
- **Rate Limiting**: @nestjs/throttler
- **Health Checks**: @nestjs/terminus

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Authentication guards
│   └── decorators/      # Custom decorators
├── users/               # Users module
│   └── dto/             # User-related DTOs
├── health/              # Health check module
├── prisma/              # Database configuration
└── main.ts             # Application entry point
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

The documentation provides:
- Detailed API endpoints
- Request/response schemas
- Authentication requirements
- Interactive testing interface

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (ADMIN, EVALUATOR, USER)
  - Secure password hashing

- **User Management**
  - User registration and login
  - Role assignment
  - Profile management

- **Call Management**
  - Record and store voice calls
  - Associate calls with agents
  - Track call metadata

- **Evaluation System**
  - Create and manage evaluations
  - Score calls based on criteria
  - Generate evaluation reports

- **Security**
  - Rate limiting (5 requests per minute per IP)
  - CORS protection
  - Input validation
  - Secure password storage

## Health Checks

The API includes health check endpoints to monitor system status:
- Database connectivity
- Application status
- System resources

Access health check at:
```
http://localhost:3000/health
```

## API Rate Limiting

The API implements rate limiting to prevent abuse:
- 5 requests per minute per IP address
- Applies to all endpoints
- Custom limits can be set per endpoint

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## License

This project is licensed under the MIT License.
