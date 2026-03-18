<template>
  <div class="contact-list">
    <div v-if="contacts.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <p>没有找到联系人</p>
    </div>

    <div v-else class="contacts-grid">
      <ContactCard
        v-for="contact in contacts
        :key="contact.id"
        :contact="contact"
        @call="handleCall"
        @chat="handleChat"
        @edit="handleEdit"
        @delete="handleDelete"
        @view="handleView"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from '@/types/contact'
import ContactCard from './ContactCard.vue'

defineProps<{
  contacts: Contact[]
}>()

const emit = defineEmits<{
  call: [phone: string]
  chat: [contactId: string]
  edit: [contact: Contact]
  delete: [contactId: string]
  view: [contact: Contact]
}>()

const handleCall = (phone: string) => {
  emit('call', phone)
}

const handleChat = (contactId: string) => {
  emit('chat', contactId)
}

const handleEdit = (contact: Contact) => {
  emit('edit', contact)
}

const handleDelete = (contactId: string) => {
  emit('delete', contactId)
}

const handleView = (contact: Contact) => {
  emit('view', contact)
}
</script>

<style scoped>
.contact-list {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #9ca3af;
}

.empty-state p {
  margin-top: 16px;
  font-size: 16px;
}

.contacts-grid {
  display: grid;
  gap: 12px;
}

@media (min-width: 768px) {
  .contacts-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}
</style>
