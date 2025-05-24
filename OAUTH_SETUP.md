# OAuth Setup Guide for MOCK IDEA

This guide will help you set up social authentication with Google, Microsoft, and GitHub for the MOCK IDEA application.

## 🔧 Quick Setup

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret

### 2. Microsoft OAuth Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Set redirect URI to:
   - `http://localhost:3000/api/auth/callback/microsoft` (development)
   - `https://yourdomain.com/api/auth/callback/microsoft` (production)
5. Go to "Certificates & secrets" → "New client secret"
6. Copy the Application (client) ID and Client Secret

### 3. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: "MOCK IDEA"
   - Homepage URL: `http://localhost:3000` (development)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret

## 📝 Environment Configuration

### Frontend (.env.local)

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# OAuth Public Keys
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here

# OAuth Secrets (for API routes)
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

### Backend (.env)

Update your backend `.env` file:

```env
# Existing variables...
DATABASE_URL="postgresql://username:password@localhost:5432/mock_idea"
JWT_SECRET=your_jwt_secret_here

# OAuth Configuration (if needed for backend validation)
GOOGLE_CLIENT_ID=your_google_client_id_here
MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
GITHUB_CLIENT_ID=your_github_client_id_here
```

## 🚀 Testing OAuth

1. Start both frontend and backend servers:
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm run dev
   ```

2. Navigate to `http://localhost:3000/auth/login`

3. Click on any of the social login buttons:
   - "Continue with Google"
   - "Continue with Microsoft"
   - "Continue with GitHub"

4. Complete the OAuth flow and verify successful authentication

## 🔒 Security Notes

- Never commit OAuth secrets to version control
- Use different OAuth apps for development and production
- Regularly rotate OAuth secrets
- Ensure redirect URIs match exactly (including protocol and port)

## 🐛 Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Check that the redirect URI in your OAuth app matches exactly
   - Ensure protocol (http/https) and port are correct

2. **"Invalid client"**
   - Verify Client ID and Client Secret are correct
   - Check environment variables are loaded properly

3. **"Access denied"**
   - Ensure OAuth app has proper permissions
   - Check if the OAuth app is enabled/published

4. **CORS errors**
   - Verify API URL in frontend environment variables
   - Check backend CORS configuration

## 📚 Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft OAuth Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)

## ✅ Verification Checklist

- [ ] Google OAuth app created and configured
- [ ] Microsoft OAuth app created and configured  
- [ ] GitHub OAuth app created and configured
- [ ] Frontend environment variables set
- [ ] Backend environment variables set
- [ ] OAuth buttons appear on login/register pages
- [ ] OAuth flow completes successfully
- [ ] User data is stored correctly in database
- [ ] JWT tokens are generated and stored

---

**Note**: This implementation provides a secure OAuth flow that creates or links user accounts automatically. Users authenticated via OAuth will have their email marked as verified and can access all application features.
