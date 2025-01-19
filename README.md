# Fluentoo - Language Learning Application

Fluentoo is a full-stack language learning application built with Spring Boot and React.

## Project Structure

- `src/` - Spring Boot backend
- `fluentoo-frontend/` - React frontend

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 13 or higher
- Maven 3.8 or higher

## Environment Variables

### Backend (Production)

```env
DATABASE_URL=your_database_url
DATABASE_USERNAME=your_database_username
DATABASE_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret
CORS_ALLOWED_ORIGINS=your_frontend_url
```

### Frontend (Production)

```env
VITE_API_URL=your_backend_api_url
```

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fluentoo.git
cd fluentoo
```

2. Backend Setup:

```bash
cd src
mvn clean install
mvn spring-boot:run
```

3. Frontend Setup:

```bash
cd fluentoo-frontend
npm install
npm run dev
```

## Deployment

### Backend Deployment

1. Set up environment variables in your deployment platform
2. Build the application:

```bash
mvn clean package -Pprod
```

3. The JAR file will be generated in `target/` directory

### Frontend Deployment

1. Set up environment variables in your deployment platform
2. Build the application:

```bash
npm run build
```

3. The build files will be generated in `dist/` directory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
#   f l u e n t o o  
 