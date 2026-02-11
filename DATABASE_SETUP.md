# Echo Database Setup for Render

This guide covers setting up the Echo database for deployment on Render with PostgreSQL and pgvector support.

## 🚀 Quick Setup

### 1. Create PostgreSQL Database on Render

1. Go to your Render dashboard
2. Click "New +" → "PostgreSQL"
3. Choose a name (e.g., `echo-db`)
4. Select a region close to your users
5. Choose a plan (Free tier is fine for development)
6. Add database user and password
7. Create the database

### 2. Configure Environment Variables

Add these to your Render service environment:

```bash
# Database (automatically provided by Render)
DATABASE_URL=postgresql://username:password@host:port/database

# Gemini AI (required for AI features)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# NextAuth (for authentication)
NEXTAUTH_URL=https://your-app.onrender.com
NEXTAUTH_SECRET=your_random_secret_here
```

### 3. Database Setup Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations (includes pgvector setup)
psql $DATABASE_URL -f scripts/migrate.sql

# Seed with test data
npm run db:seed
```

## 📁 Database Schema

The database includes:

### Tables
- **User**: User accounts with entitlements and usage tracking
- **Memory**: Stored memories with full metadata and embeddings
- **Answer**: Generated responses with supporting evidence

### Key Features
- **pgvector Extension**: For similarity search on embeddings
- **Row Level Security**: User data isolation
- **Soft Deletes**: Memories marked as deleted rather than removed
- **JSON Fields**: Flexible storage for complex data

## 🔧 Migration Script

The `scripts/migrate.sql` file includes:

- PostgreSQL extensions (uuid-ossp, pgvector)
- Performance indexes
- Custom functions for similarity search
- Atomic operations for user statistics

## 🌱 Seed Data

The seed script creates:
- Test user (`test@echo.dev`)
- Sample memories covering different source types
- Sample answer demonstrating the full response structure

## 🏥‍🫄 Health Check

Access `/api/health` to verify:
- Database connection
- Required extensions
- Basic functionality

## 🚨 Troubleshooting

### Common Issues

1. **"relation does not exist"**
   - Run `npm run db:push` to create tables
   - Check DATABASE_URL is correct

2. **"extension does not exist"**
   - Ensure PostgreSQL has pgvector extension
   - Run migration script manually

3. **"PrismaClient not found"**
   - Run `npm run db:generate`
   - Check @prisma/client dependency

4. **Connection refused**
   - Check Render database status
   - Verify connection string format
   - Ensure IP whitelisting if applicable

### Environment-Specific Notes

#### Development
```bash
# Use local database
DATABASE_URL="postgresql://localhost:5432/echo_dev"
```

#### Production (Render)
```bash
# Use Render-provided database
# DATABASE_URL is automatically set by Render
```

## 📊 Monitoring

Set up these monitoring endpoints:

- `/api/health` - Database and service health
- `/api/stats` - Usage statistics (protected)
- Render dashboard - Database performance metrics

## 🔐 Security

- All connections use SSL
- Row Level Security prevents data access between users
- API keys stored in environment variables only
- Regular security updates applied

## 📈 Scaling Considerations

- **Connection Pooling**: Prisma handles this automatically
- **Read Replicas**: Configure in Render for scaling reads
- **Index Optimization**: Included in migration script
- **Caching**: Consider Redis for frequent queries

---

**Next Steps:**
1. Run the setup script: `npm run db:setup`
2. Test locally: `npm run dev`
3. Deploy to Render
4. Monitor health endpoint
