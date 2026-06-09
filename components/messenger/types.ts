export interface Message {
  sender: 'me' | 'receiver' | string;
  senderName?: string;
  senderAvatar?: string;
  text: string;
  time: string;
  isImage?: boolean;
  isFile?: boolean;
  isAudio?: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  read?: boolean;
  isContactCard?: boolean;
  contactCardData?: {
    userId: string;
    username?: string;
    role?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
  };
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  initials?: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean | 'offline' | 'typing';
  isGroup: boolean;
  role?: string;
  messages: Message[];
  topic?: string;
  members?: Contact[];
  isAdmin?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials?: string;
  online: boolean | 'offline';
  suggested?: boolean;
  skills?: string[];
  activeAgo?: string;
}

export interface ProfileSettings {
  username: string;
  role: string;
  email: string;
  phone: string;
  language: string;
  twoFactor: boolean;
  readReceipts: boolean;
  avatarUrl?: string;
}
