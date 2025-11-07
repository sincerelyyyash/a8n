# a8n

A visual workflow automation platform that enables users to design, connect, and automate complex workflows without writing code. Build powerful automations by connecting nodes visually, managing credentials securely, and executing workflows through a distributed execution engine.

## Overview

a8n (automation) is an automation platform that provides a no-code solution for creating and managing automated workflows. The platform consists of three main components: a web-based visual workflow builder, a RESTful API backend, and an asynchronous execution engine that processes workflows using a queue-based architecture.

## Architecture

The platform follows a microservices architecture with clear separation of concerns:

- **Frontend**: Next.js application providing the visual workflow builder interface
- **Backend API**: FastAPI service handling authentication, workflow management, and execution orchestration
- **Executor Engine**: Asynchronous worker service that processes workflow executions from a Redis queue

### System Flow

1. Users design workflows visually in the frontend using a node-based interface
2. Workflows are persisted in PostgreSQL with nodes, connections, and metadata
3. Workflow executions are queued in Redis
4. The executor engine processes queued executions asynchronously
5. Execution status and results are tracked and updated in real-time

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5.3 with React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS 4.1
- **Workflow Builder**: React Flow 


### Backend API
- **Framework**: FastAPI
- **Language**: Python 3.13+
- **Database**: PostgreSQL with SQLAlchemy (async)
- **ORM**: SQLAlchemy 2.0 with async support
- **Migrations**: Alembic
- **Cache/Queue**: Redis
- **Package Management**: Poetry

### Executor Engine
- **Framework**: FastAPI
- **Language**: Python 3.13+
- **Queue System**: Redis
- **AI Integration**: LangChain, LangGraph
- **Services**: Email (SMTP), Telegram Bot API
- **Package Management**: Poetry

## Features

### Workflow Management
- Visual workflow builder with drag-and-drop interface
- Node-based workflow design with custom node types
- Connection management between workflow nodes
- Workflow versioning and persistence
- Workflow enable/disable controls

### Authentication & Security
- User registration and authentication
- JWT-based session management
- Secure credential storage and management
- Role-based access control

### Execution Engine
- Asynchronous workflow execution
- Queue-based task processing
- Execution status tracking
- Retry mechanism with configurable attempts
- Real-time execution updates

### Supported Services
- **AI Models**: Integration with LLM providers via LangChain
- **Email**: Send emails and wait for replies with polling
- **Telegram**: Send messages via Telegram Bot API
- **Webhooks**: Trigger workflows via HTTP webhooks

### Credential Management
- Secure storage of service credentials
- Credential association with workflows
- Support for multiple credential types per service

## Project Structure

```
a8n/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # Next.js app router pages
│   │   ├── (auth)/          # Authentication pages
│   │   └── (home)/          # Protected application pages
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── workflow/       # Workflow builder components
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions and configurations
│
├── backend/                 # FastAPI backend service
│   ├── src/app/
│   │   ├── api/            # API route handlers
│   │   ├── core/           # Core configurations
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── utils/          # Utility functions
│   └── alembic/            # Database migration scripts
│
└── executor-engine/         # Workflow execution service
    └── src/app/
        ├── main.py         # Entry point
        └── services/       # Service implementations
            ├── ai_agent_service.py
            ├── email_service.py
            ├── redis_service.py
            └── telegram_service.py
```

## Prerequisites

- **Node.js**: 18.x or higher
- **Python**: 3.13 or higher
- **PostgreSQL**: 12.x or higher
- **Redis**: 6.x or higher
- **Poetry**: For Python dependency management
- **Bun** or **npm**: For Node.js dependency management

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sincerelyyyash/a8n
cd a8n
```

### 2. Backend Setup

```bash
cd backend
poetry install
```

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/a8n_db
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:3000
```

Run database migrations:

```bash
cd backend
alembic upgrade head
```

### 3. Executor Engine Setup

```bash
cd executor-engine
poetry install
```

Create a `.env` file in the `executor-engine` directory:

```env
REDIS_URL=redis://localhost:6379
BACKEND_API_URL=http://localhost:8000
```

### 4. Frontend Setup

```bash
cd frontend
bun install
# or
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the Application

### Development Mode

1. **Start PostgreSQL and Redis**

Ensure PostgreSQL and Redis are running on your system.

2. **Start the Backend API**

```bash
cd backend
poetry run uvicorn src.app.main:app --reload --port 8000
```

3. **Start the Executor Engine**

```bash
cd executor-engine
poetry run executor
```

4. **Start the Frontend**

```bash
cd frontend
bun run dev
# or
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Production Build

**Frontend:**

```bash
cd frontend
bun run build
bun run start
```

**Backend:**

```bash
cd backend
poetry run uvicorn src.app.main:app --host 0.0.0.0 --port 8000
```

**Executor Engine:**

```bash
cd executor-engine
poetry run executor
```

## Configuration

### Environment Variables

#### Backend
- `DATABASE_URL`: PostgreSQL connection string (asyncpg driver)
- `REDIS_URL`: Redis connection URL
- `JWT_SECRET_KEY`: Secret key for JWT token signing
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

#### Executor Engine
- `REDIS_URL`: Redis connection URL for queue access
- `BACKEND_API_URL`: Backend API base URL for status updates

#### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API base URL

## Database Migrations

Database migrations are managed using Alembic. To create a new migration:

```bash
cd backend
alembic revision --autogenerate -m "description of changes"
alembic upgrade head
```

To rollback a migration:

```bash
alembic downgrade -1
```

## API Endpoints

The backend API provides the following main endpoints:

- `/api/users/*` - User management and authentication
- `/api/workflows/*` - Workflow CRUD operations
- `/api/nodes/*` - Node management within workflows
- `/api/connections/*` - Connection management between nodes
- `/api/credentials/*` - Credential management
- `/api/webhooks/*` - Webhook configuration and triggering
- `/api/executions/*` - Workflow execution management

Interactive API documentation is available at `/docs` when the backend is running.

## Workflow Execution

Workflows are executed asynchronously through the following process:

1. User triggers workflow execution via the frontend or webhook
2. Backend validates the workflow and queues execution in Redis
3. Executor engine picks up the execution from the queue
4. Nodes are processed in topological order based on connections
5. Each node executes its configured service (AI, Email, Telegram, etc.)
6. Results are passed to downstream nodes via context
7. Execution status is updated in real-time
8. Final results are stored and returned

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Credentials are stored securely and encrypted
- CORS is configured to restrict allowed origins
- Input validation is performed using Pydantic schemas
- SQL injection protection via SQLAlchemy ORM


