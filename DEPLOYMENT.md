# MOCK IDEA - Deployment Guide

## Quick Deploy to Render

### Prerequisites
- GitHub account
- Render account (free tier available)
- Repository pushed to GitHub

### 1. Push to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/mock-idea.git

# Push the code
git push -u origin main
```

### 2. Deploy on Render

#### Option A: Blueprint Deployment (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and deploy all services

#### Option B: Manual Service Creation
1. **Backend Service:**
   - Type: Web Service
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment: Node.js

2. **Frontend Service:**
   - Type: Web Service  
   - Build Command: `cd frontend && npm install && npm run build`
   - Start Command: `cd frontend && npm start`
   - Environment: Node.js

3. **Database:**
   - Type: PostgreSQL
   - Plan: Free tier

### 3. Environment Variables

#### Backend (.env)
```
NODE_ENV=production
DATABASE_URL=[Auto-filled by Render]
JWT_SECRET=[Generate secure random string]
FRONTEND_URL=[Your frontend URL from Render]
AWS_ACCESS_KEY_ID=[Your AWS key]
AWS_SECRET_ACCESS_KEY=[Your AWS secret]
S3_BUCKET_NAME=[Your S3 bucket]
STRIPE_SECRET_KEY=[Your Stripe key]
```

#### Frontend (.env)
```
NEXT_PUBLIC_API_URL=[Your backend URL from Render]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[Your Stripe public key]
```

### 4. Post-Deployment Setup

1. **Database Migration:**
   ```bash
   # Run in Render shell or locally with production DB URL
   npx prisma db push
   npx prisma db seed
   ```

2. **Test the deployment:**
   - Visit your frontend URL
   - Try logging in with demo credentials
   - Test core functionality

### 5. Custom Domain (Optional)
1. In Render dashboard, go to your frontend service
2. Click "Settings" → "Custom Domains"
3. Add your domain and configure DNS

## Alternative Deployment Options

### Vercel + Railway
- **Frontend:** Deploy to Vercel
- **Backend + DB:** Deploy to Railway

### AWS (Production)
- **Frontend:** S3 + CloudFront
- **Backend:** ECS or Lambda
- **Database:** RDS PostgreSQL
- **Cache:** ElastiCache Redis

### Docker Compose (Self-hosted)
```bash
docker-compose up -d
```

## Environment-Specific Notes

### Development
- Use local PostgreSQL and Redis
- Set `NODE_ENV=development`
- Enable debug logging

### Staging
- Use managed databases
- Set `NODE_ENV=staging`
- Test with production-like data

### Production
- Use managed databases with backups
- Set `NODE_ENV=production`
- Enable monitoring and alerts
- Configure CDN for assets

## Monitoring & Maintenance

### Health Checks
- Backend: `GET /health`
- Frontend: Built-in Next.js health checks

### Logs
- Check Render logs for errors
- Monitor database performance
- Track API response times

### Backups
- Database: Automated by Render
- User uploads: S3 versioning
- Code: GitHub repository

## Troubleshooting

### Common Issues
1. **Build failures:** Check Node.js version compatibility
2. **Database connection:** Verify DATABASE_URL format
3. **CORS errors:** Update allowed origins in backend
4. **Environment variables:** Ensure all required vars are set

### Support
- Check Render documentation
- Review application logs
- Test locally with production environment variables
