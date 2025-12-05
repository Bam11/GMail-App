export type UserMetadata = {
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
  username: string;
  fullName: string;
  image: string;
  updated_at: Date;
};

export type User = {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  username: string;
  fullName: string;
  image: string;
  auth_user_id: string;
};

export type MailType = {
  from: string;
  time: string;
  subject: string;
  body: string;
};

export type Mail = {
  id: string;
  subject: string;
  sender: string;
  preview: string;
  date: string;
  body: string;
  read: boolean;
};