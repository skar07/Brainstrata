import { NextRequest, NextResponse } from 'next/server';
import { getUsersDatabase } from '@/lib/auth/serverAuth';

export async function GET(request: NextRequest) {
  try {
    const users = await getUsersDatabase();
    
    // Remove passwords for security
    const safeUsers = users.map(({ password, ...user }) => user);
    
    return NextResponse.json({
      total_users: users.length,
      users: safeUsers,
      storage_location: 'client/temp/users.json',
      message: users.length > 0 ? 'Users found in server storage' : 'No users in server storage'
    });
  } catch (error) {
    console.error('Error checking users:', error);
    return NextResponse.json({
      error: 'Failed to check server users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 