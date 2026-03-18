<template>
  <div class="reports-page">
    <div class="page-header">
      <div class="header-left">
        <h1>每日报告</h1>
        <p class="header-subtitle">管理亚沙会工作日报</p>
      </div>
.

      <button class="btn-primary" @click="openCreateForm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        新建报告
      </button>
    </div>

    <div class="search-bar">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索报告标题或内容..."
          class="search-input"
        />
        <button
          v-if="searchQuery"
          class="clear-search"
          @click="searchQuery = ''"
          title="清除搜索"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <PDFGenerator
        :selected-ids="selectedReportIds"
        :reports="reportsStore.sortedReports"
        @merge-complete="selectedReportIds = []"
      />
    </div>

    <div class="content-wrapper">
      <ReportList
        :reports="reportsStore.sortedReports"
        :search-query="searchQuery"
        @edit="openEditForm"
        @delete="handleDelete"
        @select-change="handleSelectChange"
      />
    </div>

    <!-- 报告表单弹窗 -->
    <ReportForm
      v-if="showForm"
      :report="editingReport"
      @submit="handleSubmit"
      @cancel="closeForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReportsStore } from '@/stores/reports'
import type { Report } from '@/types/report'
import ReportList from '@/components/reports/ReportList.vue'
import ReportForm from '@/components/reports/ReportForm.vue'
import PDFGenerator from '@/components/reports/PDFGenerator.vue'

const reportsStore = useReportsStore()
const searchQuery = ref('')
const showForm = ref(false)
const editingReport = ref<Report | undefined>(undefined)
const selectedReportIds = ref<string[]>([])

onMounted(() => {
  reportsStore.init()
})

function openCreateForm() {
  editingReport.value = undefined
  showForm.value = true
}

function openEditForm(id: string) {
  const report = reportsStore.getReportById(id)
  if (report) {
    editingReport.value = report
    showForm.value = true
  }
}

function closeForm() {
  showForm.value = false
  editingReport.value = undefined
}

function handleSubmit(data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) {
  if (editingReport.value) {
    // 更新现有报告
    reportsStore.updateReport(editingReport.value.id, data)
  } else {
    // 创建新报告
    reportsStore.addReport(data)
  }
  closeForm()
}

function handleDelete(id: string) {
  if (confirm('确定要删除这份报告吗？此操作不可恢复。')) {
    reportsStore.deleteReport(id)
    // 从选中列表中移除
    const index = selectedReportIds.value.indexOf(id)
    if (index !== -1) {
      selectedReportIds.value.splice(index, 1)
    }
  }
}

function handleSelectChange(ids: string[]) {
  selectedReportIds.value = ids
}
</script>

<style scoped>
.reports-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f8f8;
  padding: 24px;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-left h1 {
  margin: 0 0 8px 0;
  font-size: 2rem;
  color: #333;
}

.header-subtitle {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #FF6B35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.btn-primary:hover {
  background: #e55a2b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
}

.btn-primary svg {
  width: 20px;
  height: 20px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #999;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #FF6B35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.clear-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #999;
  transition: all 0.2s;
}

.clear-search:hover {
  background: #f5f5f5;
  color: #666;
}

.clear-search svg {
  width: 16px;
  height: 16px;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .reports-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .header-left h1 {
    font-size: 1.5rem;
  }

  .header-subtitle {
    font-size: 0.9rem;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .search-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
  }

  .search-input-wrapper {
    max-width: 100%;
  }
}
</style>
