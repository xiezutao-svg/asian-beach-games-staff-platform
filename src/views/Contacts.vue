<template>
  <div class="contacts-page">
    <div class="page-header">
      <h1>通讯录</h1>
      <p class="page-subtitle">亚沙会工作人员联系方式</p>
    </div>

    <div class="toolbar">
      <SearchBar
        v-model="searchQuery"
        placeholder="搜索联系人..."
        :debounce="300"
        @search="handleSearch"
      />
      <button @click="openAddForm" class="add-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        添加联系人
      </button>
    </div>

    <ContactList
      :contacts="filteredContacts"
      @call="handleCall"
      @chat="handleChat"
      @edit="handleEdit"
      @delete="handleDelete"
      @view="handleView"
    />

    <!-- 联系人表单弹窗 -->
    <ContactForm
      v-if="showForm"
      :contact="editingContact"
      @close="closeForm"
      @submit="handleSubmit"
    />

    <!-- 聊天弹窗 -->
    <ChatBox
      v-if="currentChatId"
      :chat-id="currentChatId"
      @close="closeChat"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import SearchBar from '@/components/contacts/SearchBar.vue'
import ContactList from '@/components/contacts/ContactList.vue'
import ContactForm from '@/components/contacts/ContactForm.vue'
import ChatBox from '@/components/contacts/ChatBox.vue'
import type { Contact } from '@/types/contact'

const contactsStore = useContactsStore()

const searchQuery = ref('')
const showForm = ref(false)
const editingContact = ref<Contact | undefined>(undefined)
const currentChatId = ref<string | null>(null)

const filteredContacts = computed(() => {
  if (!searchQuery.value.trim()) {
    return contactsStore.contacts
  }
  const query = searchQuery.value.toLowerCase()
  return contactsStore.contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(query) ||
      contact.department.toLowerCase().includes(query) ||
      contact.phone.includes(query)
  )
})

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const openAddForm = () => {
  editingContact.value = undefined
  showForm.value = true
}

const handleEdit = (contact: Contact) => {
  editingContact.value = contact
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingContact.value = undefined
}

const handleSubmit = (data: Omit<Contact, 'id'>) => {
  if (editingContact.value) {
    // 编辑模式
    contactsStore.updateContact(editingContact.value.id, data)
  } else {
    // 添加模式
    contactsStore.addContact(data)
  }
  closeForm()
}

const handleDelete = (contactId: string) => {
  contactsStore.deleteContact(contactId)
}

const handleCall = (phone: string) => {
  // 拨号已在 ContactCard 中处理
  console.log('拨号:', phone)
}

const handleChat = (contactId: string) => {
  const chatId = contactsStore.createPrivateChat(contactId)
  if (chatId) {
    currentChatId.value = chatId
  }
}

const closeChat = () => {
  currentChatId.value = null
}

const handleView = (contact: Contact) => {
  // 可以在这里显示联系人详情
  console.log('查看联系人详情:', contact)
}
</script>

<style scoped>
.contacts-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
}

.page-subtitle {
  margin: 0;
  font-size: 16px;
  color: #6b7280;
}

.toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.toolbar > :first-child {
  flex: 1;
  min-width: 200px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #FF6B35;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  white-space: nowrap;
}

.add-btn:hover {
  background: #ff8555;
  transform: translateY(-2px);
}

.add-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .contacts-page {
    padding: 16px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .toolbar {
    gap: 12px;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
