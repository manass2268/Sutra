export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  username?: string;
  photoURL?: string;
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
  unreadCounts?: Record<string, number>;
  updatedAt?: any;
  createdBy?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  createdAt?: any;
}

export const slimScrollbar =
  '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20';