// src/features/messaging/types.js
export const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read'
};

export const MessageTypes = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file'
};

export const messageInterface = {
  id: '',
  conversationId: '',
  senderId: '',
  text: '',
  type: MessageTypes.TEXT,
  status: MessageStatus.SENT,
  createdAt: null,
  updatedAt: null,
  deletedFor: []
};

export const conversationInterface = {
  id: '',
  participants: [],
  lastMessage: '',
  lastMessageTime: null,
  unreadCount: {},
  createdAt: null,
  updatedAt: null
};