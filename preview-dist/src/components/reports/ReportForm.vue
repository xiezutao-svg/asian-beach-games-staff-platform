<template>
  <div class="form-overlay" @click.self="handleCancel">
    <div class="form-container">
      <div class="form-header">
        <h2>{{ isEdit ? '编辑报告' : '新建报告' }}</h2>
        <button class="close-btn" @click="handleCancel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="report-form">
        <div class="form-group">
          <label for="title">报告标题 *</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            placeholder="请输入报告标题"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="author">作者 *</label>
          <input
            id="author"
            v-model="formData.author"
            type="text"
            placeholder="请输入作者姓名"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="date">报告日期 *</label>
          <input
            id="date"
            v-model="formData.date"
            type="date"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="content">报告内容 *</label>
          <textarea
            id="content"
            v-model="formData.content"
                       placeholder="请输入报告内容..."
            required
            class="form-textarea"
            rows="10"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-cancel" @click="handleCancel">
            取消
          </button>
          <button type="submit" class="btn btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting">提交中...</span>
            <span v-else>{{ isEdit ? '更新' : '创建' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Report } from '@/types/report'

interface Props {
  report?: Report
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>]
  cancel: []
}>()

const isSubmitting = ref(false)
const formData = ref({
  title: '',
  content: '',
  date: '',
  author: ''
})

const isEdit = computed(() => !!props.report)

onMounted(() => {
  if (props.report) {
    formData.value = {
      title: props.report.title,
      content: props.report.content,
      date: props.report.date,
      author: props.report.author
    }
  } else {
    // 设置默认日期为今天
    formData.value.date = new Date().toISOString().split('T')[0]
  }
})

const handleSubmit = () => {
  if (!formData.value.title.trim() || !formData.value.content.trim() || !formData.value.date.trim() || !formData.value.author.trim()) {
    alert('请填写所有必填字段')
    return
  }

  isSubmitting.value = true

  // 模拟异步提交
  setTimeout(() => {
    emit('submit', {
      title: formData.value.title.trim(),
      content: formData.value.content.trim(),
      date: formData.value.date,
      author: formData.value.author.trim()
    })
    isSubmitting.value = false
  }, 500)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.form-container {
  background: #ffffff;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #eee;
}

.form-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2x;
  color: #666;
}

.close-btn:hover {
  background: #f5f5f5;
}

.close-btn svg {
  width: 24px;
  height: 24px;
}

.report-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #FF6B35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 200px;
  line-height: 1.6;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  background: #FF6B35;
  color: white;
}

.btn-submit:hover {
  background: #e55a2b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .form-container {
    max-width: 100%;
    margin: 10px;
  }

  .form-header {
    padding: 16px;
  }

  .report-form {
    padding: 16px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
