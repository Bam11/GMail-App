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

export type MailAttachment = {
  name: string;
  url: string;
};

export type MailUser = {
  fullname: string;
  email?: string;
};

export type Mail = {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject: string;
  body: string;
  attachments: { name: string; url: string }[];
  read: boolean;
  deleted: boolean;
  is_draft: boolean;
  created_at: string;

  sender?: MailUser;
  receiver?: MailUser;
};

// export type Mail = {
//   id: string;
//   subject: string;
//   from: {
//     name: string;
//     email: string;
//     avatar?: string;
//   };
//   to: string[];
//   bodyHtml: string;
//   bodyText?: string;
//   attachments: {
//     id: string;
//     mail_id: string
//     name: string;
//     url: string;
//     type: "image" | "file";
//   }[];
//   createdAt: string;
//   isRead: boolean;
// };