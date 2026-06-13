import { User, UserRole } from '../types';
import { INITIAL_USER } from './mockStore';

// Simulating Network Delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSignInWithGoogle = async (): Promise<User> => {
  await delay(800);
  return INITIAL_USER;
};

export const mockSignInWithEmail = async (email: string): Promise<User> => {
  await delay(800);
  
  // Return Admin if email contains 'admin', otherwise Student
  if (email.toLowerCase().includes('admin')) {
    return {
      id: 'u_admin_999',
      name: 'Hostel Admin',
      email: email,
      role: UserRole.ADMIN,
      roomNumber: 'Office-101',
      photoURL: 'https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=fce7f3'
    };
  }

  return {
    id: 'u_student_new',
    name: 'New Student',
    email: email,
    role: UserRole.STUDENT,
    roomNumber: '101-A',
    photoURL: `https://api.dicebear.com/7.x/notionists/svg?seed=${email}&backgroundColor=e0e7ff`
  };
};