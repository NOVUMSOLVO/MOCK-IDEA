import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // 'login' or 'register'
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/auth/${state}?error=oauth_error`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL(`/auth/${state}?error=missing_code`, request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/microsoft`,
        scope: 'openid email profile',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    // Get user info from Microsoft Graph
    const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    // Send user data to our backend for authentication
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/oauth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'microsoft',
        providerId: userData.id,
        email: userData.mail || userData.userPrincipalName,
        firstName: userData.givenName,
        lastName: userData.surname,
        avatar: null, // Microsoft Graph doesn't provide avatar in basic profile
        mode: state,
      }),
    });

    const authResult = await backendResponse.json();

    if (!backendResponse.ok) {
      throw new Error(authResult.message || 'Authentication failed');
    }

    // Redirect to frontend with token
    const redirectUrl = new URL('/auth/callback', request.url);
    redirectUrl.searchParams.set('token', authResult.data.token);
    redirectUrl.searchParams.set('user', JSON.stringify(authResult.data.user));
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Microsoft OAuth error:', error);
    return NextResponse.redirect(new URL(`/auth/${state}?error=auth_failed`, request.url));
  }
}
