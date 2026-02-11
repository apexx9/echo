# Render Environment Configuration

# Production Environment Variables for Render Deployment

## Required Variables

Copy these to your Render service environment settings:

```bash
# Database (automatically provided by Render PostgreSQL addon)
DATABASE_URL=postgresql://username:password@host:port/database

# AI Integration
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Authentication
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=your_secure_random_secret_at_least_32_characters

# Optional: Node environment
NODE_ENV=production
```

## Getting Your Values

### 1. Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add to environment variables

### 2. NextAuth Secret
Generate a secure random string:
```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Database URL
Render automatically provides this when you add a PostgreSQL addon.

## Render Service Configuration

### Build Settings
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18.x` or higher

### Environment Groups
Create these groups for organization:

#### **Database**
- `DATABASE_URL`

#### **AI Services**
- `GOOGLE_GENERATIVE_AI_API_KEY`

#### **Authentication**
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

#### **Application**
- `NODE_ENV`

## Deployment Steps

### 1. Prepare Your Repository
Ensure your code is pushed to GitHub with:
- All environment variables documented
- Proper build scripts in package.json
- Database migration scripts ready

### 2. Create Render Service
1. Connect your GitHub repository
2. Configure as a "Web Service"
3. Set build and start commands
4. Add environment variables
5. Add PostgreSQL addon

### 3. Deploy
1. Push changes to trigger deployment
2. Monitor build logs
3. Check service health endpoint

## Post-Deployment Checklist

- [ ] Database accessible via connection string
- [ ] pgvector extension installed
- [ ] Tables created and indexed
- [ ] Environment variables loaded
- [ ] Gemini API key working
- [ ] Health endpoint responding
- [ ] Authentication configured

## Environment-Specific Configurations

### Development
```bash
# Local development
DATABASE_URL="postgresql://localhost:5432/echo_dev"
GOOGLE_GENERATIVE_AI_API_KEY="dev_key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev_secret"
NODE_ENV="development"
```

### Staging
```bash
# Staging environment
DATABASE_URL="postgresql://staging-user:password@staging-host:5432/echo_staging"
GOOGLE_GENERATIVE_AI_API_KEY="staging_key"
NEXTAUTH_URL="https://echo-staging.onrender.com"
NEXTAUTH_SECRET="staging_secret"
NODE_ENV="staging"
```

### Production
```bash
# Production environment
DATABASE_URL="provided_by_render"
GOOGLE_GENERATIVE_AI_API_KEY="production_key"
NEXTAUTH_URL="https://echo.onrender.com"
NEXTAUTH_SECRET="production_secret"
NODE_ENV="production"
```

## Troubleshooting

### Common Issues

1. **"Database connection failed"**
   - Verify DATABASE_URL format
   - Check PostgreSQL addon status
   - Ensure database is running

2. **"Gemini API error"**
   - Verify API key is correct
   - Check API quota limits
   - Ensure key has proper permissions

3. **"Build failed"**
   - Check package.json scripts
   - Verify all dependencies installed
   - Review build logs

### Security Best Practices

- Never commit API keys to git
- Use Render's encrypted environment variables
- Rotate secrets regularly
- Monitor for unauthorized access
- Use HTTPS in production

## Monitoring

Set up monitoring for:
- Database performance
- API response times
- Error rates
- Resource usage

Render provides built-in monitoring at:
- Service metrics dashboard
- Log aggregation
- Alert notifications
