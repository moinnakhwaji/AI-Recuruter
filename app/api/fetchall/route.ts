import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { db } from '@/lib/db'; // Assuming you're using Prisma or another ORM

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
  }

  try {
    // Retrieve users matching the provided email
    const users = await clerkClient.users.getUserList({
      emailAddress: [email],
    });

    if (users.length === 0) {
      return NextResponse.json({ error: 'No user found with the provided email' }, { status: 404 });
    }

    // Assuming you want the first user if multiple users exist with the same email
    const user = users[0];

    // Query your interview database to find records associated with this user
    const userInterviews = await db.interview.findMany({
      where: {
        useremail: user.emailAddresses[0].emailAddress,
      },
    });

    return NextResponse.json({
      message: 'User found',
      user: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        createdAt: user.createdAt
      },
      interviews: userInterviews,
    });
  } catch (error) {
    console.error('Error fetching user or interviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
