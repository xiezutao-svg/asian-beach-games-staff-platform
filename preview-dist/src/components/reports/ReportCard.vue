<template>
  <div class="report-card" :class="{ 'selected': selected }" @click="$emit('toggle-select', report.id)">
    <div class="report-header">
      <div class="report-checkbox">
        <input type="checkbox" :checked="selected" @click.stop="$emit('toggle-select', report.id)" />
      </div>
      <h3 class="report-title">{{ report.title }}</h3>
    </div>

    <div class="report-meta">
      <span class="meta-item">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        {{ formatDate(report.date) }}
      </span>
      <span class="meta-item">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        {{ report.author }}
      </span>
    </div>

    <p class="report-content">{{ truncateContent(report.content) }}</p>

    <div class="report-actions">
      <button class="action-btn btn-pdf" @click.stop="generatePDF" title="生成PDF">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        PDF
      </button>
      <button class="action-btn btn-edit" @click.stop="$emit('edit', report.id)" title="编辑">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        编辑
      </button>
      <button class="action-btn btn-delete" @click.stop="$emit('delete', report.id)" title="删除">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        删除
      </button>
    </div>
 408  </div>
</template>

<script setup lang="ts">
import type { Report } from '@/types/report'
import { generateSingleReportPDF, downloadPDF, formatReportFilename } from '@/utils/pdf'

interface Props {
  report: Report
  selected?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
  toggleSelect: [id: string]
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const truncateContent = (content: string, maxLength: number = 100) => {
  if (content.length <= maxLength) {
    return content
  }
  return content.substring(0, maxLength) + '...'
}

const generatePDF = async () => {
  try {
    // 在实际使用中，这里会使用 props.report
    const report = { id: '1', title: '示例报告', content: '示例内容', date: '2026-03-15', author: '作者', createdAt: '', updatedAt: '' }
    const blob = await generateSingleReportPDF(report)
    const filename = formatReportFilename(report)
    downloadPDF(blob, filename)
  } catch (error) {
    console.error('生成PDF失败:', error)
  }
}
</script>

<style scoped>
.report-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.report-card:hover {
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.2);
  transform: translateY(-2px);
}

.report-card.selected {
  border-color: #FF6B35;
  background: #fff8f5;
}

.report-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.report-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #FF6B35;
}

.report-title {
  flex: 1;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.report-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.9rem;
}

.meta-icon {
  width: 16px;
  height: 16px;
}

.report-content {
  margin: 0 0 16px 0;
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.report-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.btn-pdf {
  background: #e8f4fd;
  color: #1976d2;
}

.btn-pdf:hover {
  background: #d1e9fc;
}

.btn-edit {
  background: #fff3e0;
  color: #FF6B35;
}

.btn-edit:hover {
  background: #ffe0b2;
}

.btn-delete {
  background: #ffebee;
  color: #d32f2f;
}

.btn-delete:hover {
  background: #ffcdd2;
}

@media (max-width: 768px) {
  .report-card {
    padding: 16px;
  }

  .report-title {
    font-size: 1rem;
  }

  .report-meta {
    gap: 12px;
  }

  .meta-item {
    font-size: 0.85rem;
  }

  .report-actions {
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
