import { OAuth2Client } from 'google-auth-library';
import { NextResponse } from 'next/server';
import payload from 'payload';
import { NextRequest } from 'next/server';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const oAuth2Client = new OAuth2Client(CLIENT_ID);

export const POST = async (req: NextRequest) => {
  const { idToken } = await req.json(); // Expecting the ID token from the frontend

  try {
    // Verify the ID Token received from Google OAuth
    const ticket = await oAuth2Client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payloadData = ticket.getPayload();
    if (!payloadData) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 });
    }

    const { email, name, picture } = payloadData;
    if (!email) {
      return NextResponse.json({ error: 'Email not found in token' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    });

    if (existingUser.totalDocs > 0) {
      return NextResponse.json({ user: existingUser.docs[0] });
    }

    // Create a new user if not found
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        username: name,
        authProvider: 'google',
        role: 'user',
        ...(picture && { picture }),
      },
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error('Google authentication error:', error);
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 400 });
  }
};
