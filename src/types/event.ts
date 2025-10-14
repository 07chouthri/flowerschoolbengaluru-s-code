// Event interface to match the database schema
export interface Event {
  id: string;
  title: string;
  event_type: string;
  event_date: string; // ISO date string or date format
  event_time?: string; // Time string
  duration?: string; // Duration interval
  instructor?: string;
  spots_left?: number;
  image?: string; // Base64 or URL
  booking_available: boolean;
  created_at?: string;
  updated_at?: string;
  amount: number;
}

// Event form data interface for creating/editing events
export interface EventFormData {
  title: string;
  event_type: string;
  event_date: string;
  event_time?: string;
  duration?: string;
  instructor?: string;
  spots_left?: number;
  image?: string;
  booking_available?: boolean;
  amount?: number;
}

// Event types enum for consistency
export enum EventType {
  WORKSHOP = 'Workshop',
  MASTERCLASS = 'Masterclass',
  BEGINNER = 'Beginner Course',
  INTERMEDIATE = 'Intermediate Course',
  ADVANCED = 'Advanced Course',
  PRIVATE = 'Private Session',
  GROUP = 'Group Session',
  ONLINE = 'Online Session',
  CORPORATE = 'Corporate Training'
}

// Event management response interface
export interface EventResponse {
  success: boolean;
  event?: Event;
  events?: Event[];
  message?: string;
  error?: string;
}