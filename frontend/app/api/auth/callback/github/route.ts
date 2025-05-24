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
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      throw new Error('Failed to exchange code for token');
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'MOCK-IDEA-App',
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    // Get user email (GitHub might not include email in user object)
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'MOCK-IDEA-App',
      },
    });

    const emailData = await emailResponse.json();
    const primaryEmail = emailData.find((email: any) => email.primary)?.email || userData.email;

    // Send user data to our backend for authentication
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/oauth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'github',
        providerId: userData.id.toString(),
        email: primaryEmail,
        firstName: userData.name?.split(' ')[0] || userData.login,
        lastName: userData.name?.split(' ').slice(1).join(' ') || '',
        avatar: userData.avatar_url,
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
    console.error('GitHub OAuth error:', error);
    return NextResponse.redirect(new URL(`/auth/${state}?error=auth_failed`, request.url));
  }
}
