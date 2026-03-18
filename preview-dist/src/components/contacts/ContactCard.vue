<template>
  <div class="contact-card">
    <div class="avatar" @click="viewDetail">
      <img v-if="contact.avatar" :src="contact.avatar" :alt="contact.name" />
      <div v-else class="avatar-placeholder">
        {{ contact.name.charAt(0) }}
      </div>
    </div>

    <div class="info" @click="viewDetail">
      <h3 class="name">{{ contact.name }}</h3>
      <p class="department">{{ contact.department }}</p>
      <p class="phone">{{ contact.phone }}</p>
    </div>

    <div class="actions">
      <button @click="handleCall" class="action-btn call-btn" title="拨号">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      </button>
      <button @click="handleChat" class="action-btn chat-btn" title="聊天">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
      <button @click="handleEdit" class="action-btn edit-btn" title="编辑">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button @click="handleDelete" class="action-btn delete-btn" title="删除">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from '@/types/contact'

const props = defineProps<{
  contact: Contact
}>()

const emit = defineEmits<{
  call: [phone: string]
  chat: [contactId: string]
  edit: [contact: Contact]
  delete: [contactId: string]
  view: [contact: Contact]
}>()

const handleCall = () => {
  window.open(`tel:${props.contact.phone}`, '_self')
  emit('call', props.contact.phone)
}

const handleChat = () => {
  emit('chat', props.contact.id)
}

const handleEdit = () => {
  emit('edit', props.contact)
}

const handleDelete = () => {
  if (confirm(`确定要删除 ${props.contact.name} 吗？`)) {
    emit('delete', props.contact.id)
  }
}

const viewDetail = () => {
  emit('view', props.contact)
}
</script>

<style scoped>
.contact-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  gap: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.contact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #FF6B35;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.info {
  flex: 1;
  min-width: 0;
}

.name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.department {
  margin: 0 0 2px 0;
  font-size: 14px;
  color: #6b7280;
}

.phone {
  margin: 0;
  font-size: 14px;
  color: #FF6B35;
}

.actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn:active {
  transform: scale(0.95);
}

.call-btn {
  background: #10b981;
  color: white;
}

.chat-btn {
  background: #FF6B35;
  color: white;
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

@media (max-width: 768px) {
  .contact-card {
    padding: 12px;
    gap: 8px;
  }

  .avatar {
    width: 40px;
    height: 40px;
  }

  .action-btn {
    width: 36px;
    height: 36px;
  }
}
</style>
