<template>
  <div class="venue-map">
    <div class="map-header">
      <h3 class="map-title">场馆分布概览</h3>
    </div>
    <div class="map-content">
      <div
        v-for="venue in venueData"
        :key="venue.id"
        class="venue-marker"
        :style="{
          left: venuePositions[venue.id]?.x + '%',
          top: venuePositions[venue.id]?.y + '%'
        }"
      >
        <el-tooltip
          :content="getTooltipContent(venue)"
          placement="top"
          effect="dark"
        >
          <div class="marker-dot" :class="getMarkerClass(venue)">
            <span class="marker-text">{{ venue.name.charAt(0) }}</span>
          </div>
        </el-tooltip>
      </div>
      <div class="map-background">
        <div class="map-grid"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VenueStats } from '../../types/stats'

interface Props {
  venueData: VenueStats[]
}

const props = defineProps<Props>()

const venuePositions: Record<string, { x: number; y: number }> = {
  '1': { x: 20, y: 30 },
  '2': { x: 50, y: 20 },
  '3': { x: 80, y: 35 },
  '4': { x: 30, y: 70 },
  '5': { x: 65, y: 65 }
}

const getTooltipContent = (venue: VenueStats) => {
  const rate = Math.round((venue.completedTasks / venue.totalTasks) * 100)
  return `${venue.name} - 完成率: ${rate}%`
}

const getMarkerClass = (venue: VenueStats) => {
  const rate = (venue.completedTasks / venue.totalTasks) * 100
  if (rate >= 90) return 'marker-success'
  if (rate >= 70) return 'marker-warning'
  return 'marker-danger'
}
</script>

<style scoped>
.venue-map {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
}

.map-header {
  margin-bottom: 16px;
}

.map-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.map-content {
  position: relative;
  height: 300px;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
}

.map-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.map-grid {
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(255, 107, 53, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 107, 53, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.venue-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.marker-dot {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.marker-dot:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.marker-success {
  background: linear-gradient(135deg, #67C23A, #85CE61);
  border: 3px solid #67C23A;
}

.marker-warning {
  background: linear-gradient(135deg, #FF6B35, #FF8C61);
  border: 3px solid #FF6B35;
}

.marker-danger {
  background: linear-gradient(135deg, #F56C6C, #F78989);
  border: 3px solid #F56C6C;
}

.marker-text {
  color: white;
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .venue-map {
    padding: 16px;
  }

  .map-title {
    font-size: 14px;
  }

  .map-content {
    height: 250px;
  }

  .marker-dot {
    width: 40px;
    height: 40px;
  }

  .marker-text {
    font-size: 14px;
  }
}
</style>
