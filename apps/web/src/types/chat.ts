export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  username?: string;
  photoURL?: string;
  isOnline?: boolean;
  lastSeen?: any;
}

export interface UserPresenceInfo {
  isOnline: boolean;
  statusText: string;
}

export interface ReplyPreview {
  id: string;
  senderName: string;
  text: string;
}

export interface ChatRoom {
  id: string;
  name?: string;
  isGroup: boolean;
  participants: string[];
  participantDetails?: Record<
    string,
    { displayName: string; username?: string; photoURL?: string; email?: string }
  >;
  lastMessage?: string;
  lastSenderId?: string;
  lastMessageStatus?: MessageStatus;
  lastMessageDeleted?: boolean;
  unreadCounts?: Record<string, number>;
  typingUsers?: Record<string, boolean>;
  updatedAt?: any;
  createdBy?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  status?: MessageStatus;
  isDeleted?: boolean;
  deletedFor?: string[];
  reactions?: Record<string, string>;
  replyTo?: ReplyPreview | null;
  createdAt?: any;
}

export const slimScrollbar =
  '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20';