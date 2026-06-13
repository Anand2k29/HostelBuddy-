import { Issue, IssueCategory, IssuePriority, IssueStatus, User, UserRole, Announcement, LostItem, GatePass, GatePassStatus, LeaveType } from '../types';

// Initial Mock Data
export const INITIAL_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex.j@university.edu',
  role: UserRole.STUDENT,
  roomNumber: '304-B'
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Water Supply Maintenance',
    content: 'Water supply will be unavailable on Block B from 2 PM to 5 PM today for maintenance.',
    date: '2023-10-25',
    priority: 'URGENT'
  },
  {
    id: 'a2',
    title: 'Weekend Curfew Update',
    content: 'Curfew extended to 11 PM for the upcoming festival weekend.',
    date: '2023-10-24',
    priority: 'NORMAL'
  }
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'i1',
    title: 'WiFi Down in 3rd Floor',
    description: 'The router on the 3rd floor north wing is blinking red. No internet since morning.',
    category: IssueCategory.WIFI,
    priority: IssuePriority.HIGH,
    status: IssueStatus.REPORTED,
    isPrivate: false,
    reporterId: 'u1',
    reporterName: 'Alex Johnson',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    upvotes: 5,
    upvotedBy: ['u2', 'u3', 'u5', 'u6', 'u7'],
    comments: []
  },
  {
    id: 'i2',
    title: 'Leaking Tap in Washroom',
    description: 'The tap in the second washroom is dripping continuously.',
    category: IssueCategory.PLUMBING,
    priority: IssuePriority.MEDIUM,
    status: IssueStatus.IN_PROGRESS,
    isPrivate: false,
    reporterId: 'u1',
    reporterName: 'Alex Johnson',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    upvotes: 3,
    upvotedBy: ['u2'],
    comments: []
  },
  {
    id: 'i3',
    title: 'Missing Wallet',
    description: 'I lost my wallet near the canteen. It has my ID.',
    category: IssueCategory.OTHER,
    priority: IssuePriority.HIGH,
    status: IssueStatus.REPORTED,
    isPrivate: true, // Private issue
    reporterId: 'u1',
    reporterName: 'Alex Johnson',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    upvotes: 0,
    upvotedBy: [],
    comments: []
  },
  {
    id: 'i4',
    title: 'WiFi Slow',
    description: 'Internet is very slow in room 302.',
    category: IssueCategory.WIFI,
    priority: IssuePriority.MEDIUM,
    status: IssueStatus.REPORTED,
    isPrivate: false,
    reporterId: 'u4',
    reporterName: 'Mike Ross',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    upvotes: 1,
    upvotedBy: ['u1'],
    comments: []
  }
];

export const INITIAL_LOST_ITEMS: LostItem[] = [
  { 
    id: 'l2', 
    name: 'Found Keys', 
    description: 'Bunch of keys found near the library entrance. Has a blue keychain.', 
    location: 'Canteen', 
    type: 'FOUND', 
    status: 'OPEN', 
    contact: 'Reception',
    date: '2023-10-27',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=500'
  },
  { 
    id: 'l3', 
    name: 'Lost Watch', 
    description: 'A silver-strapped analog watch. Last seen in the mess hall.', 
    location: 'Library', 
    type: 'LOST', 
    status: 'OPEN', 
    contact: 'Vihaan M. (Room 101)',
    date: '2023-10-26',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=500'
  }
];
export const INITIAL_GATE_PASSES: GatePass[] = [
    {
        id: 'gp1',
        studentId: 'u1',
        studentName: 'Alex Johnson',
        roomNumber: '304-B',
        leaveType: LeaveType.HOME,
        reason: 'Weekend trip to home.',
        departureDate: new Date(Date.now() + 86400000).toISOString(),
        returnDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        status: GatePassStatus.APPROVED,
        requestedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 'gp2',
        studentId: 'u1',
        studentName: 'Alex Johnson',
        roomNumber: '304-B',
        leaveType: LeaveType.OUTING,
        reason: 'Going out for a movie.',
        departureDate: new Date(Date.now() - 3600000).toISOString(),
        returnDate: new Date(Date.now() + 4 * 3600000).toISOString(),
        status: GatePassStatus.PENDING,
        requestedAt: new Date(Date.now() - 7200000).toISOString(),
    },
     {
        id: 'gp3',
        studentId: 'u1',
        studentName: 'Alex Johnson',
        roomNumber: '304-B',
        leaveType: LeaveType.EMERGENCY,
        reason: 'Urgent family matter.',
        departureDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        returnDate: new Date(Date.now() - 86400000).toISOString(),
        status: GatePassStatus.REJECTED,
        requestedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    }
];