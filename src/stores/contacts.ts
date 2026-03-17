import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Contact, Chat, Message } from '@/types/contact'
import { mockContacts, mockChats } from '@/assets/mock/contacts'

export const useContactsStore = defineStore('contacts', () => {
  // 状态
  const contacts = ref<Contact[]>([...mockContacts])
  const chats = ref<Chat[]>([...mockChats])
  const searchQuery = ref('')
  const currentChatId = ref<string | null>(null)

  // 计算属性
  const filteredContacts = computed(() => {
    if (!searchQuery.value.trim()) {
      return contacts.value
    }
    const query = searchQuery.value.toLowerCase()
    return contacts.value.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.department.toLowerCase().includes(query) ||
        contact.phone.includes(query)
    )
  })

  const currentChat = computed(() => {
    if (!currentChatId.value) return null
    return chats.value.find((chat) => chat.id === currentChatId.value)
  })

  // 操作方法
  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString()
    }
    contacts.value.push(newContact)
    return newContact
  }

  const updateContact = (id: string, updates: Partial<Contact>) => {
    const index = contacts.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      contacts.value[index] = { ...contacts.value[index], ...updates }
    }
  }

  const deleteContact = (id: string) => {
    contacts.value = contacts.value.filter((c) => c.id !== id)
  }

  const getContact = (id: string) => {
    return contacts.value.find((c) => c.id === id)
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  // 聊天相关方法
  const sendMessage = (chatId: string, content: string) => {
    const chat = chats.value.find((c) => c.id === chatId)
    if (chat) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'current',
        content,
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      chat.messages.push(message)

      // 保存到本地存储
      saveChatsToLocalStorage()
    }
  }

  const openChat = (chatId: string) => {
    currentChatId.value = chatId
  }

  const closeChat = () => {
    currentChatId.value = null
  }

  const createPrivateChat = (contactId: string) => {
    const contact = getContact(contactId)
    if (!contact) return null

    // 检查是否已有私聊
    const existingChat = chats.value.find(
      (chat) =>
        chat.type === 'private' &&
        chat.participants.includes(contactId) &&
        chat.participants.includes('current')
    )

    if (existingChat) {
      return existingChat.id
    }

    // 创建新聊天
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      name: contact.name,
      type: 'private',
      participants: [contactId, 'current'],
      messages: []
    }
    chats.value.push(newChat)
    saveChatsToLocalStorage()
    return newChat.id
  }

  const saveChatsToLocalStorage = () => {
    try {
      localStorage.setItem('chats', JSON.stringify(chats.value))
    } catch (error) {
      console.error('Failed to save chats to localStorage:', error)
    }
  }

  const loadChatsFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('chats')
      if (stored) {
        chats.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load chats from localStorage:', error)
    }
  }

  // 初始化时加载聊天记录
  loadChatsFromLocalStorage()

  return {
    contacts,
    chats,
    searchQuery,
    currentChatId,
    filteredContacts,
    currentChat,
    addContact,
    updateContact,
    deleteContact,
    getContact,
    setSearchQuery,
    sendMessage,
    openChat,
    closeChat,
    createPrivateChat
  }
})
