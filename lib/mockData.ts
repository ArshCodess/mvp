
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Summit 2024',
    description: 'Annual technology conference featuring industry leaders and innovative startups',
    date: '2024-03-15',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    category: 'Technical',
    max_participants: 200,
    image_url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Cultural Night',
    description: 'Celebrate diversity with performances, food, and cultural exhibitions',
    date: '2024-03-20',
    time: '6:00 PM',
    venue: 'Open Ground',
    category: 'Cultural',
    max_participants: 500,
    image_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Hackathon 2024',
    description: '24-hour coding marathon with exciting prizes and mentorship opportunities',
    date: '2024-03-25',
    time: '9:00 AM',
    venue: 'Computer Lab Building',
    category: 'Technical',
    max_participants: 150,
    image_url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Sports Fest',
    description: 'Inter-college sports competition with cricket, football, and athletics',
    date: '2024-04-01',
    time: '8:00 AM',
    venue: 'Sports Complex',
    category: 'Sports',
    max_participants: 300,
    image_url: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date().toISOString(),
  },
];

export const mockRegistrations: Registration[] = [
  {
    id: 'r1',
    student_id: 'student-1',
    event_id: '1',
    status: 'confirmed',
    registered_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    event: mockEvents[0],
  },
  {
    id: 'r2',
    student_id: 'student-1',
    event_id: '2',
    status: 'pending',
    registered_at: new Date(Date.now() - 43200000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    event: mockEvents[1],
  },
  {
    id: 'r3',
    student_id: 'student-1',
    event_id: '3',
    status: 'confirmed',
    registered_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
    event: mockEvents[2],
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    event_id: '1',
    title: 'Tech Summit - Schedule Updated',
    message: 'The keynote session has been moved to 11:00 AM. Please check your email for the updated schedule.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    event: mockEvents[0],
    isNew: true,
  },
  {
    id: 'a3',
    event_id: '1',
    title: 'Tech Summit - Schedule Updated',
    message: 'The keynote session has been moved to 11:00 AM. Please check your email for the updated schedule.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    event: mockEvents[0],
    isNew: true,
  },
  {
    id: 'a2',
    event_id: '3',
    title: 'Hackathon - Team Formation',
    message: 'Team formation will begin at 9:30 AM. Make sure to arrive early to find your teammates!',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    event: mockEvents[2],
    isNew: true,
  },
];












export interface Student {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  max_participants: number;
  image_url?: string;
  created_at: string;
}

export interface Registration {
  id: string;
  student_id: string;
  event_id: string;
  status: 'pending' | 'confirmed' | 'rejected';
  registered_at: string;
  updated_at: string;
  event?: Event;
}

export interface Announcement {
  id: string;
  event_id: string;
  title: string;
  message: string;
  created_at: string;
  event?: Event;
  isNew?: boolean;
}

export interface NotificationRead {
  id: string;
  student_id: string;
  announcement_id: string;
  read_at: string;
}

export interface DashboardStats {
  eventsRegistered: number;
  pendingApprovals: number;
  confirmedEvents: number;
  unreadAnnouncements: number;
}
