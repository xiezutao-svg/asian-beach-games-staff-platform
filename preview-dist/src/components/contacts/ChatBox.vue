<template>
  <div class="chat-box-container" @click.self="close">
    <div class="chat-box">
      <div class="chat-header">
        <div class="chat-info">
          <h2>{{ chat?.name }}</h2>
          <span class="chat-type">
            {{ chat?.type === 'group' ? '群聊' : '私聊' }}
          </span>
        </div>
        <button @click="close" class="close-btn">×</button>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div v-if="!chat || chat.messages.length === 0" class="empty-messages">
          <p>暂无消息</p>
        </div>

        <div v-else class="messages-list">
          <div
            v-for="message in chat.messages"
            :key="message.id"
            :class="['message', message.senderId === 'current' ? 'message-sent' : 'message-received']"
          >
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSendMessage" class="chat-input-form">
        <input
          v-model="newMessage"
          type="text"
          placeholder="输入消息..."
          class="message-input"
        />
        <button type="submit" class="send-btn" :disabled="!newMessage.trim()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Chat } from '@/types/contact'
import { useContactsStore } from '@/stores/contacts'

const props = defineProps<{
  chatId: string
}>()

const emit = defineEmits<{
  close: []
}>()

const contactsStore = useContactsStore()
const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()

const chat = ref<Chat | null>(
  contactsStore.chats.find((c) => c.id === props.chatId) || null
)

const handleSendMessage = () => {
  if (!newMessage.value.trim() || !props.chatId) return

  contactsStore.sendMessage(props.chatId, newMessage.value)
  newMessage.value = ''

  // 更新本地引用
  chat.value = contactsStore.chats.find((c) => c.id === props.chatId) || null

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const close = () => {
  emit('close')
}

// 监听聊天更新
watch(
  () => contactsStore.chats,
  () => {
    chat.value = contactsStore.chats.find((c) => c.id === props.chatId) || null
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true }
)

// 初始滚动
nextTick(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-box-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.chat-box {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.chat-info h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.chat-type {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.empty-messages {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  max-width: 80%;
}

.message-sent {
  align-self: flex-end;
}

.message-received {
  align-self: flex-start;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-text {
  padding: 10px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
}

.message-sent .message-text {
  background: #FF6B35;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-received .message-text {
  background: #f3f4f6;
  color: #1f2937;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  padding: 0 4px;
}

.message-sent .message-time {
  text-align: right;
}

.chat-input-form {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
}

.message-input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #FF6B35;
}

.send-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: #FF6B35;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.1s;
}

.send-btn:hover:not(:disabled) {
  background: #ff8555;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #ffccbb;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .chat-box {
    max-height: 90vh;
  }

  .chat-header {
    padding: 12px 16px;
  }

  .chat-messages {
    padding: 16px;
  }

  .chat-input-form:has {
    padding: 12px 16px;
  }
}
</style>
