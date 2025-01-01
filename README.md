# Blockchain Price Tracker

A NestJS application that tracks cryptocurrency prices and provides price alerts.

## Features

- Track Ethereum and Polygon prices every 5 minutes
- Email notifications for price changes
- Historical price data API
- Price alert system
- ETH to BTC swap rate calculator
- Swagger API documentation

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (handled by Docker)
- Moralis API key
- SMTP email service

## Environment Setup

Create a `.env` file in the root directory with:

```env
MORALIS_API_KEY=your_moralis_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Running with Docker

1. Build and start the application:
```bash
docker-compose up --build
```

2. The application will be available at:
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start PostgreSQL:
```bash
docker-compose up postgres
```

3. Run migrations:
```bash
# Generate a new migration
npm run migration:generate src/database/migrations/MigrationName

# Run all pending migrations
npm run migration:run

# Show migration status
npm run migration:show

# Revert last migration
npm run migration:revert
```

4. Start the application:
```bash
npm run start:dev
```

## Database Migrations

The project uses TypeORM for database management. Available migration commands:

```bash
# Create a new blank migration
npm run migration:create src/database/migrations/MigrationName

# Generate a migration from entity changes
npm run migration:generate src/database/migrations/MigrationName

# Run pending migrations
npm run migration:run

# Show migration status
npm run migration:show

# Revert the last executed migration
npm run migration:revert
```

## API Endpoints

- `GET /prices/hourly?chain=ETH` - Get hourly prices for the last 24 hours
- `POST /prices/alerts` - Create price alert
- `GET /prices/swap-rate?ethAmount=1` - Get ETH to BTC swap rate

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Project Structure

```
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Main application module
│   ├── config/                    # Configuration files
│   ├── database/                  # Database entities and migrations
│   ├── price/                     # Price tracking module
│   ├── email/                     # Email notification module
│   └── blockchain/                # Blockchain service module
├── test/                          # Test files
├── docker-compose.yml             # Docker configuration
├── Dockerfile                     # Docker build file
├── .env                           # Environment variables
└── README.md                      # Project documentation
```

## Monitoring Prices

The application automatically:
- Tracks ETH and MATIC prices every 5 minutes
- Sends email alerts when price increases by >3% in an hour
- Sends email alerts when price reaches target values
- Stores all price data in PostgreSQL

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details