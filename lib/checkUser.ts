// lib/checkUser.ts
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export const checkUser = async () => {
  const user = await currentUser();
  // console.log(user); // Logs the current Clerk user

  // Check if the user is logged in with Clerk
  if (!user) {
    console.log('No user logged in');
    return null;
  }

  // Check if the user already exists in the database
  const loggedInUser = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  // If the user exists in the database, return the user
  if (loggedInUser) {
    console.log('User already exists in the database');
    return loggedInUser;
  }

  // If user does not exist in the database, create a new user
  try {
    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),

        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    console.log('New user created:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user in the database:', error);
    throw error;  // Re-throw to propagate the error
  }
};
