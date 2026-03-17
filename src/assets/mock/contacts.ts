import type { Contact, Chat } from '@/types/contact'

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: '张三',
    department: '裁判组',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangSan'
  },
  {
    id: '2',
    name: '李四',
    department: '竞赛组',
    phone: '13800138002',
    email: 'lisi@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiSi'
  },
  {
    id: '3',
    name: '王五',
    department: '安保组',
    phone: '13800138003',
    email: 'wangwu@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangWu'
  },
  {
    id: '4',
    name: '赵六',
    department: '医疗组',
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhaoLiu'
  },
  {
    id: '5',
    name: '孙七',
    department: '后勤组',
    phone: '13800138005',
    email: 'sunqi@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunQi'
  }
]

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    name: '裁判组工作群',
    type: 'group',
    participants: ['1', '2', '3'],
    messages: [
      {
        id: 'msg-1',
        senderId: '1',
        content: '明天的比赛时间确定了吗？',
        timestamp: '2026-03-17T09:00:00',
        type: 'text'
      },
      {
        id: 'msg-2',
        senderId: '2',
        content: '已经确认，上午10点开始',
        timestamp: '2026-03-17T09:05:00',
        type: 'text'
      }
    ]
  },
  {
    id: 'chat-2',
    name: '张三',
    type: 'private',
    participants: ['1', 'current'],
    messages: [
      {
        id: 'msg-3',
        senderId: '1',
        content: '你好，请问有什么需要帮助的吗？',
        timestamp: '2026-03-17T10:00:00',
        type: 'text'
      }
    ]
  }
]
