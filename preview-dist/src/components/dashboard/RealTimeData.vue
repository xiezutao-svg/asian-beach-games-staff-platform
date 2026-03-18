<template>
  <div class="realtime-data">
    <div class="data-header">
      <h3 class="data-title">实时任务数据</h3>
      <div class="last-update">
        最后更新: {{ formattedTime }}
      </div>
    </div>
    <el-table :data="venueData" stripe style="width: 100%">
      <el-table-column prop="name" label="场馆名称" min-width="120" />
      <el-table-column prop="totalTasks" label="总任务" width="80" align="center" />
      <el-table-column label="完成率" width="120" align="center">
        <template #default="{ row }">
          <el-progress
            :percentage="completionRate(row)"
            :color="progressColor"
            :stroke-width="8"
          />
        </template>
      </el-table-column>
      <el-table-column prop="completedTasks" label="已完成" width="80" align="center">
        <template #default="{ row }">
          <span class="status-completed">{{ row.completedTasks }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="inProgressTasks" label="进行中" width="80" align="center">
        <template #default="{ row }">
          <span class="status-in-progress">{{ row.inProgressTasks }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pendingTasks" label="待处理" width="80" align="center">
        <template #default="{ row }">
          <span class="status-pending">{{ row.pendingTasks }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VenueStats } from '../../types/stats'

interface Props {
  venueData: VenueStats[]
  lastUpdateTime: Date
}

const props = defineProps<Props>()

const progressColor = '#FF6B35'

const formattedTime = computed(() => {
  const date = props.lastUpdateTime
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
})

const completionRate = (venue: VenueStats) => {
  return venue.totalTasks > 0 ? Math.round((venue.completedTasks / venue.totalTasks) * 100) : 0
}
</script>

<style scoped>
.realtime-data {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.data-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.last-update {
  font-size: 12px;
  color: #999;
}

.status-completed {
  color: #67C23A;
  font-weight: 600;
}

.status-in-progress {
  color: #FF6B35;
  font-weight: 600;
}

.status-pending {
  color: #F56C6C;
  font-weight: 600;
}

@media (max-width: 768px) {
  .realtime-data {
    padding: 16px;
  }

  .data-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .data-title {
    font-size: 14px;
  }
}
</style>
