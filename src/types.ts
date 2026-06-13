export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum IssueStatus {
  REPORTED = 'REPORTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum IssueCategory {
  WIFI = 'WIFI',
  PLUMBING = 'PLUMBING',
  ELECTRICAL = 'ELECTRICAL',
  FURNITURE = 'FURNITURE',
  CLEANING = 'CLEANING',
  OTHER = 'OTHER'
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  isPrivate: boolean;
  reporterId: string;
  reporterName: string;
  createdAt: string;
  upvotes: number;
  upvotedBy: string[];
  comments: Comment[];
  mergedInto?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'NORMAL' | 'URGENT';
}

export interface LostItem {
  id: string;
  name: string;
  description: string;
  location: string;
  type: 'LOST' | 'FOUND';
  status: 'OPEN' | 'RETURNED';
  contact: string;
  image?: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roomNumber: string;
  photoURL?: string;
}