# Deploy MOCK IDEA to Render - Step by Step Guide

## Current Issue
Render is still trying to use Docker mode instead of Blueprint mode. Here's how to fix it:

## Solution 1: Use Blueprint Deployment (Recommended)

### Step 1: Create New Blueprint Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Blueprint"**
3. Connect to your GitHub repository: `NOVUMSOLVO/MOCK-IDEA`
4. Render will automatically detect the `render.yaml` file
5. Click **"Apply"** to create all services

### Step 2: Configure Environment Variables
After Blueprint deployment, add these environment variables to the backend service:
- `AWS_ACCESS_KEY_ID` (your AWS access key)
- `AWS_SECRET_ACCESS_KEY` (your AWS secret key)
- `STRIPE_SECRET_KEY` (if using Stripe)
- OAuth secrets for social login (optional)

## Solution 2: Fix Existing Service

### If you want to keep the existing service:
1. Go to your existing service in Render
2. Go to **Settings** → **Build & Deploy**
3. Set **Build Command** to: `cd frontend && npm ci --include=dev && npm run build`
4. Set **Start Command** to: `cd frontend && npm start`
5. Set **Root Directory** to: `/` (root)
6. Save changes and redeploy

## Solution 3: Delete and Recreate

### If other solutions don't work:
1. Delete the existing service in Render
2. Wait a few minutes for cleanup
3. Follow Solution 1 to create a new Blueprint deployment

## Expected Services After Blueprint Deployment

The render.yaml will create:
- **mock-idea-backend** (Node.js API)
- **mock-idea-frontend** (Next.js app)
- **mock-idea-ai** (Python AI service)
- **mock-idea-db** (PostgreSQL database)
- **mock-idea-redis** (Redis cache)

## Verification

After successful deployment, you should see:
- All 5 services running in Render dashboard
- Frontend accessible via the provided URL
- Backend API responding to health checks
- Database and Redis connected

## Troubleshooting

If you still see Docker errors:
1. Ensure no Dockerfile exists in root directory
2. Check that render.yaml is in root directory
3. Try creating a completely new Blueprint service
4. Contact Render support if the issue persists

The `.render-buildpacks.yml` file has been added to explicitly disable Docker detection.
