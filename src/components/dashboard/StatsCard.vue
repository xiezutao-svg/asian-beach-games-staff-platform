<template>
  <div class="stats-card">
    <div class="card-icon">
      <el-icon :size="24">
        <component :is="iconComponent" />
      </el-icon>
    </div>
    <div class="card-content">
      <div class="card-title">{{ title }}</div>
      <div class="card-value">
        <span class="value">{{ value }}</span>
        <span v-if="unit" class="unit">{{ unit }}</span>
      </div>
      <div v-if="trend" class="card-trend" :class="trendClass">
        <el-icon :size="12">
          <component :is="trendIcon" />
        </el-icon>
        <span>{{ trend }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Calendar,
  CircleCheck,
  Loading,
  Timer
} from '@element-plus/icons-vue'

interface Props {
  title: string
  value: string | number
  unit?: string
  icon: string
  trend?: string
  trendUp?: boolean
}

const props = defineProps<Props>()

const iconMap: Record<string, any> = {
  'calendar': Calendar,
  'check': CircleCheck,
  'loading': Loading,
  'timer': Timer
}

const iconComponent = computed(() => iconMap[props.icon] || Calendar)

const trendIcon = computed(() => props.trendUp ? CircleCheck : Calendar)

const trendClass = computed(() => ({
  'trend-up': props.trendUp,
  'trend-down': !props.trendUp
}))
</script>

<style scoped>
.stats-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #FF6B35, #FF8C61);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.card-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.value {
  font-size: 28px;
  font-weight: 600;
  color: #FF6B35;
}

.unit {
  font-size: 14px;
  color: #999;
}

.card-trend {
  display: flex;
;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.trend-up {
  color: #67C23A;
}

.trend-down {
  color: #F56C6C;
}

@media (max-width: 768px) {
  .stats-card {
    padding: 16px;
  }

  .card-icon {
    width: 48px;
    height: 48px;
  }

  .value {
    font-size: 24px;
  }
}
</style>
