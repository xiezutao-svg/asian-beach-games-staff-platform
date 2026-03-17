export interface Notice {
  id: string
  title: string
  content: string
  type: 'announcement' | 'notification' | 'event'
  date: string
  author: string
  read: boolean
  attachment?: string
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum NoticeType {
  ANNOUNCEMENT = 'announcement',
  NOTIFICATION = 'notification',
  EVENT = 'event'
}
