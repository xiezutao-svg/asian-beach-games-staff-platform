<template>
  <div class="contact-form-container" @click.self="close">
    <div class="contact-form">
      <div class="form-header">
        <h2>{{ title }}</h2>
        <button @click="close" class="close-btn">×</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">姓名 *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="请输入姓名"
          />
        </div>

        <div class="form-group">
          <label for="department">部门 *</label>
          <input
            id="department"
            v-model="formData.department"
            type="text"
            required
            placeholder="请输入部门"
          />
        </div>

        <div class="form-group">
          <label for="phone">电话 *</label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            required
            placeholder="请输入电话号码"
          />
        </div>

        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="请输入邮箱（可选）"
          />
        </div>

        <div class="form-footer">
          <button type="button" @click="close" class="btn btn-cancel">取消</button>
          <button type="submit" class="btn btn-submit">{{ submitText }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Contact } from '@/types/contact'

const props = defineProps<{
  contact?: Contact
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Omit<Contact, 'id'>]
}>()

const title = computed(() => (props.contact ? '编辑联系人' : '添加联系人'))
const submitText = computed(() => (props.contact ? '保存' : '添加'))

const formData = ref({
  name: props.contact?.name || '',
  department: props.contact?.department || '',
  phone: props.contact?.phone || '',
  email: props.contact?.email || ''
})

const handleSubmit = () => {
  emit('submit', {
    name: formData.value.name,
    department: formData.value.department,
    phone: formData.value.phone,
    email: formData.value.email
  })
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.contact-form-container {
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

.contact-form {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.form-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #FF6B35;
}

.form-footer {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit {
  background: #FF6B35;
  color: white;
}

.btn-submit:hover {
  background: #ff8555;
}

@media (max-width: 768px) {
  .contact-form {
    padding: 20px;
  }
}
</style>
