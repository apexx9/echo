# Echo Database Setup on Render

Your database is already running on Render! Here's how to complete the setup:

## 🎯 Current Status

✅ **Prisma Client Generated** - Ready to connect
✅ **Database on Render** - PostgreSQL instance active
✅ **Schema Ready** - All tables and relationships defined

## 🚀 Next Steps

### 1. Push Schema to Render Database

```bash
# Push your schema to the Render database
npx prisma db push
```

This will create:
- User table with entitlements
- Memory table with pgvector support
- Answer table with JSON fields
- All indexes for performance

### 2. Run Migration Script

```bash
# Execute the custom migration for pgvector and functions
psql $DATABASE_URL -f scripts/migrate.sql
```

This adds:
- pgvector extension (if not already installed)
- Performance indexes
- Custom similarity search functions
- Atomic user operations

### 3. Seed Database (Optional)

```bash
# Add test data to verify everything works
npm run db:seed
```

### 4. Test Database Connection

```bash
# Test your database health endpoint
curl https://your-app-name.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "extensions": {
      "uuid-ossp": true,
      "pgvector": true
    }
  }
}
```

## 🔗 Connect Your Application

Update your application to use the Render database:

1. **Set DATABASE_URL** - Render automatically provides this
2. **Add Gemini API Key** - Set `GOOGLE_GENERATIVE_AI_API_KEY`
3. **Configure Authentication** - Set `NEXTAUTH_URL` and `NEXTAUTH_SECRET`

### Environment Variables for Render

In your Render dashboard, add these to your service environment:

```bash
DATABASE_URL=postgresql://username:password@host:port/database
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=your_secure_secret
NODE_ENV=production
```

## 🧪 Verify Setup

### Database Schema Check
```sql
-- Connect to your database and verify tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Extension Check
```sql
-- Verify pgvector is installed
SELECT extname FROM pg_extension WHERE extname = 'pgvector';
```

### Index Verification
```sql
-- Check that indexes were created
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('User', 'Memory', 'Answer');
```

## 🚨 Troubleshooting for Render

### Connection Issues
If you get "cannot connect" errors:

1. **Check DATABASE_URL format**
   - Must be: `postgresql://user:pass@host:port/dbname`
   - Render provides this automatically

2. **Verify database status**
   - Check Render dashboard for database status
   - Ensure it's not in maintenance mode

3. **Network issues**
   - Ensure your application can reach Render database
   - Check firewall rules

### Prisma Issues
If Prisma commands fail:

1. **Regenerate client**
   ```bash
   npx prisma generate
   ```

2. **Check schema compatibility**
   - Ensure PostgreSQL version supports pgvector
   - Verify schema syntax is correct

3. **Permission issues**
   - Check database user has CREATE permissions
   - Verify extension installation permissions

### Performance Issues
For slow queries:

1. **Check indexes** - Run migration script if missing
2. **Monitor connections** - Use connection pooling
3. **Optimize queries** - Use EXPLAIN ANALYZE

## 📊 Monitoring on Render

Render provides built-in monitoring:

1. **Database Metrics** - In your Render dashboard
2. **Error Logs** - Application and database logs
3. **Performance Metrics** - Query performance and connection counts
4. **Health Endpoint** - `/api/health` for custom checks

## 🎉 Success Criteria

Your setup is complete when:

- [ ] `npx prisma db push` succeeds
- [ ] Migration script runs without errors
- [ ] Health endpoint returns "healthy"
- [ ] Sample data can be created and retrieved
- [ ] Gemini AI integration works with real data

## 🔄 Maintenance Commands

### Reset Database
```bash
# Clear all data (development only!)
npx prisma db push --force-reset
```

### Refresh Schema
```bash
# Update schema changes
npx prisma generate
npx prisma db push
```

### Backup Database
```bash
# Create backup (Render has automatic backups)
pg_dump $DATABASE_URL > backup.sql
```

---

**Need Help?**
- Check: `DATABASE_SETUP.md` for detailed setup
- Review: `RENDER_DEPLOYMENT.md` for deployment guide
- Test: `scripts/simple-seed.tsx` for data verification
- Monitor: `/api/health` for system status
