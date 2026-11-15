export interface Author {
  id: number;
  firstname: string;
  lastname: string;
  full_name?: string;
  role?: string;
};

export type BlogCategory = 'relationship' | 'finance' | 'family' | 'spirituality' | 'prayer' | 'worship' | 'bible_study' | 'community' | 'youth' | 'giving' | 'envangelism';

export interface BlogList {
  id: number; // Read-only
  title: string; // Required, minLength: 1, maxLength: 255
  slug: string; // Pattern: ^[-a-zA-Z0-9_]+$, maxLength: 255
  excerpt?: string; // Optional, maxLength: 500
  featured_image?: string; // Optional, maxLength: 255
  author: Author;
  category: BlogCategory; // Enum of 11 possible values
  is_featured: boolean;
  reading_time: number; // Min: 0, Max: 2147483647
  published_at?: string; // ISO date-time format, optional
  created_at: string; // Read-only, ISO date-time format
  time_since_published?: string; // Read-only
  content?: string; // Optional, maxLength: 500
};

export interface Gallery {
  /** ID (read-only) */
  id?: number;

  /** Title (required, 1–255 characters) */
  title: string;

  /** Description (nullable) */
  description?: string | null;

  /** Media type (required: 'image' or 'video') */
  media_type: 'image' | 'video';

  /** File URL (required, 1–500 characters) */
  file_url: string;

  /** Event date (ISO date string) */
  event_date: string;

  /** Created at (read-only ISO date-time string) */
  created_at?: string;

  /** Updated at (read-only ISO date-time string) */
  updated_at?: string;
}

export interface EventPropType {
  id?: number; // Read-only
  title: string; // Required, 1–255 characters
  description?: string | null; // Optional
  banner?: string | null; // Optional, max 500 characters
  start_datetime: string; // Required, ISO 8601 format
  end_datetime?: string | null; // Optional, ISO 8601 format
  location?: string | null; // Optional, max 255 characters
  created_at?: string; // Read-only, ISO 8601 format
  updated_at?: string; // Read-only, ISO 8601 format
}

export interface SermonPropType {
  id?: number; // Read-only
  title: string; // Required, 1–255 characters
  minister: string; // Required, 1–255 characters
  sermon_type: string; // Required, must match one of the enum values
  file_url: string; // Required, 1–500 characters, URL or path to sermon file
  description?: string | null; // Optional
  created_at?: string; // Read-only, ISO 8601 format
  updated_at?: string; // Read-only, ISO 8601 format
}

export interface UserRegister {
  firstname: string; // Required, maxLength: 255, minLength: 1
  lastname: string;  // Required, maxLength: 255, minLength: 1
  phone_number: string; // Required, maxLength: 20, minLength: 1
  email?: string | null; // Optional, maxLength: 254, must be valid email
  gender: 'Male' | 'Female'; // Required, Enum
  marital_status: 'Single' | 'Married' | 'Divorced' | 'Widowed'; // Required, Enum
  date_of_birth?: string; // Optional, format: YYYY-MM-DD
  address?: string; // Optional, maxLength: 255, minLength: 1
  occupation?: string | null; // Optional, maxLength: 255
  date_joined?: string | null; // Optional, format: YYYY-MM-DD
  password: string; // Required, minLength: 6
}

export interface LoginResponse {
  message: string;
  user: User;
  tokens: {
    refresh: string;
    access: string;
  };
}

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  full_name?: string;
  email?: string | null;
  phone_number: string;
  role: userRole | userRole[];
  role_display: string;
  gender: string;
  marital_status?: string;
  created_at?: string;
  is_active?: boolean;
  is_verified?: boolean;
  membership_verified?: boolean;
  address: string;
  date_joined: string | null;
  date_of_birth: string;
  gender_display: string;
  is_staff: boolean;
  is_superuser: boolean;
  marital_status_display: string;
  occupation: string | null;
  updated_at: string;
};

export interface FullUserProfile extends User {
  address: string;
  date_of_birth: string;
  date_joined: string | null;
  updated_at: string;
  gender_display: string;
  marital_status_display: string;
  occupation: string | null;
  role_display: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface Member extends User {
  id: number; // readOnly
  last_login: string | null; // ISO date-time, nullable
  firstname: string; // required, 1–255 chars
  lastname: string; // required, 1–255 chars
  phone_number: string; // required, 1–20 chars
  email: string | null; // optional, max 254 chars
  gender: "male" | "female"; // enum of 2 values (example assumption)
  marital_status: "single" | "married" | "divorced" | "widowed"; // enum of 4 values (example assumption)
  date_of_birth: string; // ISO date
  address: string; // optional, 1–255 chars
  occupation: string | null; // optional, max 255 chars
  membership_verified: boolean;
  role: userRole[] | userRole; // array of roles (expand if schema defines)
  date_joined: string | null; // ISO date, nullable
  is_active: boolean;
  is_verified: boolean;
}

export type userRole = 'super_admin' | 'church_presbytery' | 'parish_admin' | 'pastor' | 'church_staff' | 'leader' | 'worker' | 'member';

//|-------------------|
//| MinisterPropType  |
//|-------------------|


export interface MinisterPropType {
  branch: null | number | string;
  created_at: string;
  full_name: string;
  id: number;
  title: string;
  updated_at: string;
  user: User;
}


export interface StaffPropType {
  branch: null | number | string;
  created_at: string;
  full_name: string;
  id: number;
  position: string;
  updated_at: string;
  user: User;
}

export interface CreateStaffResponse {
  message: string;
  data: {
    branch: null | number | string;
    branch_details: null | string;
    created_at: string;
    id: number;
    position: string;
    updated_at: string;
    user: User;
  };
}

// Enum for appointment types
export type AppointmentType =
  | "counseling"
  | "spiritual_guidance"
  | "marriage_issues"
  | "family_matters"
  | "general"
  | "other";

// Interface for appointment creation
export interface AppointmentCreate {
  minister_id: number;              // Required integer
  appointment_type: AppointmentType; // Enum string
  subject: string;                  // Required, 1–255 chars
  description: string;              // Required, min 1 char
  preferred_date: string;           // Date string (ISO format recommended)
  preferred_time: string;           // Time string (e.g., "14:00")
}

export interface AppointmentResponse {
  appointment_type: string;
  appointment_type_display: string;
  approved_date: string | null;
  approved_time: string | null;
  created_at: string;
  id: number;
  member: {
    email: string;
    firstname: string;
    full_name: string;
    id: number;
    lastname: string;
    phone_number: string;
  }
  minister: {
    branch: null;
    email: string;
    full_name: string;
    id: number;
    title: string;
    user_id: number;
  }
  preferred_date: string;
  preferred_time: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  status_display: string;
  subject: string;
  description: string;
}

// PrayerRequestCreate model from Lifeline Assembly CMS
export interface PrayerRequestCreate {
  minister_id?: number; // Minister ID, optional (nullable)
  category?: "health" | "family" | "finances" | "spiritual" | "relationship" | "career" | "general" | "thanksgiving" | "other"; // Optional category enum
  priority?: "low" | "medium" | "high" | "urgent"; // Optional priority enum
  title: string; // Required, 1–255 characters
  description: string; // Required, minimum length 1
  is_anonymous?: boolean; // Optional, indicates if request is anonymous
}

export type statusType = 'pending' | 'praying' | 'answered' | 'closed';

export interface PrayerRequestResponse {
  id: number;
  created_at: string;
  updated_at: string;
  member: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
  };
  minister: {
    id: number;
    full_name: string;
    title: string;
    email: string;
  } | null;
  category: "health" | "family" | "finances" | "spiritual" | "relationship" | "career" | "general" | "thanksgiving" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  priority_display: string;
  title: string;
  description: string;
  is_anonymous: boolean;
  status: statusType;
  status_display: string;
}

export interface PrayerRequestByIdResponse extends PrayerRequestResponse {
  category: "health" | "family" | "finances" | "spiritual" | "relationship" | "career" | "general" | "thanksgiving" | "other";
  category_display: string;
  created_at: string;
  updated_at: string;
  description: string;
  id: number;
  is_anonymous: boolean;
  member: {
    id: number;
    firstname: string;
    lastname: string;
    full_name: string;
    email: string;
    phone_number: string;
  }
  minister: {
    id: number;
    user_id: number;
    title: string;
    full_name: string;
    email: string;
    branch: number | null;
  }
  minister_comment: string | null;
  prayer_points: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  priority_display: string;
  scripture_references: string | null;
  status: statusType;
  status_display: string;
  testimony: string | null;
  testimony_date: string | null;
  title: string;
}
