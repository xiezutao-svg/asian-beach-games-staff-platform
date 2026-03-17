<template>
  <div class="pdf-generator">
    <button
      v-if="selectedCount > 0"
      class="merge-pdf-btn"
      @click="handleMergePDF"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <path d="M8 13h8"></path>
        <path d="M8 17h8"></path>
      </svg>
      合并PDF ({{ selectedCount }})
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Report } from '@/types/report'
import { mergeReportsPDF, downloadPDF, formatMergeFilename } from '@/utils/pdf'

interface Props {
  selectedIds: string[]
  reports: Report[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'merge-complete': []
}>()

const isGenerating = ref(false)

const selectedCount = computed(() => props.selectedIds.length)

async function handleMergePDF() {
  if (selectedCount.value === 0) return

  const selectedReports = props.reports.filter(r =>
    props.selectedIds.includes(r.id)
  )

  isGenerating.value = true

  try {
    const blob = await mergeReportsPDF(selectedReports)
    const filename = formatMergeFilename(selectedReports)
    downloadPDF(blob, filename)
    emit('merge-complete')
  } catch (error) {
    console.error('合并PDF失败:', error)
    alert('合并PDF失败，请重试')
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.pdf-generator {
  display: flex;
  align-items: center;
}

.merge-pdf-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #FF6B35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.merge-pdf-btn:hover {
  background: #e55a2b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
}

.merge-pdf-btn svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .merge-pdf-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .merge-pdf-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>
