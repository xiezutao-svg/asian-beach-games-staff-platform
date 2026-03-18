export interface Contact {
  id: string
  name: string
  department: string
  phone: string
  email: string
  avatar?: string
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: 'text' | 'system'
}

export interface Chat {
  id: string
  name: string
  type: 'private' | 'group'
  participants: string[]
  messages: Message[]
}
