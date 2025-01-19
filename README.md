![Frame 2693](https://github.com/user-attachments/assets/3bdf0b14-15c2-4fc7-b32a-c316525ce128)
![Rectangle 153](https://github.com/user-attachments/assets/f9a04c5c-c3a9-41b4-881b-ccce9cd1b0bc)

# Fluentoo - Language Learning Application

Fluentoo is an innovative, full-stack language learning application designed to help users expand their vocabulary and reinforce knowledge through interactive flashcards and engaging memory games.

## Key Features

- **Flashcards:**
  - Create custom flashcards with questions and answers.
  - Track detailed session statistics: accuracy, total cards practiced, and results history.
  - Earn points for correct answers and improve your score over time.

- **Matching Game:**
  - An interactive game for quick vocabulary learning.
  - Session stats include completion time, average pairing time, accuracy, and number of attempts.
  - Points awarded for correct matches to encourage progress.

- **User Dashboard:**
  - Track learning streaks, points earned, daily goals, and cards reviewed.
  - Visualize activity and progress through detailed graphs and statistics.

- **Deck Management:**
  - Create and edit decks with themes, descriptions, and public/private options.
  - Add, modify, or delete flashcards within decks.
  - View deck statistics and explore community-created decks.

- **Explore Section:**
  - Search, filter, and sort decks by popularity, category, or creation date.
  - Interact with decks shared by other users and discover new learning materials.

## Project Architecture

### Backend

- **Technology Stack:** Spring Boot (Java 17+), PostgreSQL, Maven, JWT-based authentication.
- **Key Features:**
  - Secure API endpoints with role-based access control.
  - Robust relational database design to support decks, users, and game data.

### Frontend

- **Technology Stack:** React, Axios, Material-UI.
- **Component Structure:**
  - Reusable components for layout, authentication, deck management, and games.
  - State management using Redux.

## Prerequisites

- **Backend:**
  - Java 17 or higher
  - Maven 3.8 or higher
  - PostgreSQL 13 or higher

- **Frontend:**
  - Node.js 18 or higher
  - npm or yarn

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

### Clone the Repository

```bash
git clone https://github.com/yourusername/fluentoo.git
cd fluentoo
```

### Backend Setup

```bash
cd src
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd fluentoo-frontend
npm install
npm run dev
```

## Deployment

### Backend Deployment

1. Configure environment variables on your deployment platform.
2. Build the application:

   ```bash
   mvn clean package -Pprod
   ```

3. Deploy the generated JAR file located in the `target/` directory.

### Frontend Deployment

1. Configure environment variables on your deployment platform.
2. Build the application:

   ```bash
   npm run build
   ```

3. Deploy the generated `dist/` folder to a static hosting service.

## Contributing

1. Fork the repository.
2. Create your feature branch:

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. Commit your changes:

   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. Push to the branch:

   ```bash
   git push origin feature/amazing-feature
   ```

5. Open a pull request.

## Security

- Authentication and authorization are handled using JWT.
- Secure API endpoints with role-based access control via Spring Security.

## Future Enhancements

- Social features like friend invitations and leaderboard competition.
- Additional games and quizzes to diversify learning experiences.
- Achievement system to reward user milestones.
- Teacher tools for group management and progress tracking.
