<template>
  <div class="report-list-container">
    <div v-if="filteredReports.length === 0" class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <line x1="10" y1="9" x2="8" y2="9"></line>
      </svg>
      <h3>{{ searchQuery ? '未找到匹配的报告' : '暂无报告' }}</h3>
      <p v-if="!searchQuery">点击上方"新建报告"按钮创建第一份报告</p>
    </div>

    <div v-else class="report-cards">
      <ReportCard
        v-for="report in paginatedReports"
        :key="report.id"
        :report="report"
        :selected="selectedReports.has(report.id)"
        @edit="$emit('edit', report.id)"
        @delete="$emit('delete', report.id)"
        @toggle-select="toggleSelect"
      />
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        上一页
      </button>
      <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Report } from '@/types/report'
import ReportCard from './ReportCard.vue'

interface Props {
  reports: Report[]
  searchQuery: string
  itemsPerPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10
})

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
  'select-change': [selectedIds: string[]]
}>()

const currentPage = ref(1)
const selectedReports = ref<Set<string>>(new Set())

const filteredReports = computed(() => {
  if (!props.searchQuery.trim()) {
    return props.reports
  }
  const lowerQuery = props.searchQuery.toLowerCase()
  return props.reports.filter(report =>
    report.title.toLowerCase().includes(lowerQuery) ||
    report.content.toLowerCase().includes(lowerQuery)
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredReports.value.length / props.itemsPerPage)
})

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredReports.value.slice(start, end)
})

function toggleSelect(id: string) {
  if (selectedReports.value.has(id)) {
    selectedReports.value.delete(id)
  } else {
    selectedReports.value.add(id)
  }
  emit('select-change', Array.from(selectedReports.value))
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 当搜索查询变化时，重置到第一页
watch(() => props.searchQuery, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.report-list-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  color: #666;
}

.empty-state p {
  margin: 0;
  color: #999;
  font-size: 0.9rem;
}

.report-cards {
  display: flex;
  flex-direction: column;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  margin-top: auto;
}

.pagination-btn {
  padding: 8px 16px;
  background: #fff;
  border: 2px solid #FF6B35;
  color: #FF6B35;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #FF6B35;
  color: white;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

@media (max-width: 768px) {
  .empty-state {
    padding: 40px 20px;
  }

  .empty-icon {
    width: 60px;
    height: 60px;
  }

  .pagination {
    padding: 16px;
  }

  .pagination-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
</style>
