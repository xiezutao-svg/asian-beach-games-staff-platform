<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'

const tasksStore = useTasksStore()
const isWorking = ref(false)
const location = ref('')

const todayClockRecord = computed(() => {
  const records = tasksStore.clockRecords.filter(r => r.date === tasksStore.currentDate)
  return records.length > 0 ? records[records.length - 1] : null
})

const workingTime = computed(() => {
  if (!todayClockRecord.value || !todayClockRecord.value.duration) return '00:00'
  const hours = Math.floor(todayClockRecord.value.duration / 60)
  const minutes = todayClockRecord.value.duration % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
})

async function getCurrentLocation() {
  if (navigator.geolocation) {
    return new Promise<string>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          // 在实际应用中，这里可以使用逆地理编码API获取地址
          resolve(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        },
        () => {
          resolve('未知位置')
        }
      )
    })
  }
  return '未知位置'
}

async function handleClockIn() {
  if (!('Notification' in window)) {
    alert('此浏览器不支持桌面通知')
    return
  }

  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }

  const currentLocation = await getCurrentLocation()
  location.value = currentLocation

  tasksStore.clockIn(currentLocation)
  isWorking.value = true

  if (Notification.permission === 'granted') {
    new Notification('签到成功', {
      body: `位置: ${currentLocation}`,
      icon: '/icon.png'
    })
  }
}

function handleClockOut() {
  if (todayClockRecord.value) {
    tasksStore.clockOut(todayClockRecord.value.id)
    isWorking.value = false

    if (Notification.permission === 'granted') {
      new Notification('签退成功', {
        body: `工作时长: ${workingTime.value}`,
        icon: '/icon.png'
      })
    }
  }
}

onMounted(() => {
  // 检查今天是否有未签退的记录
  if (todayClockRecord.value && !todayClockRecord.value.checkOutTime) {
    isWorking.value = true
  }
})
</script>

<template>
  <div class="clock-button-container">
    <div class="clock-info">
      <div class="time-display">{{ workingTime }}</div>
      <div class="location-display">
        {{ todayClockRecord?.location || '未签到' }}
      }}
      </div>
    </div>

    <button
      v-if="!isWorking"
      @click="handleClockIn"
      class="clock-btn clock-in"
    >
      <span class="icon">📍</span>
      <span>签到</span>
    </button>

    <button
      v-else
      @click="handleClockOut"
      class="clock-btn clock-out"
    >
      <span class="icon">🏁</span>
      <span>签退</span>
    </button>
  </div>
</template>

<style scoped>
.clock-button-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fff5eb 0%, #fff 100%);
  border-radius: 12px;
  border: 2px solid #FF6B35;
}

.clock-info {
  flex: 1;
}

.time-display {
  font-size: 1.5rem;
  font-weight: bold;
  color: #FF6B35;
}

.location-display {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.clock-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clock-in {
  background-color: #FF6B35;
  color: white;
}

.clock-in:hover {
  background-color: #e55a2b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.clock-out {
  background-color: #4CAF50;
  color: white;
}

.clock-out:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.clock-btn .icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .clock-button-container {
    flex-direction: column;
    text-align: center;
  }

  .time-display {
    font-size: 1.25rem;
  }
}
</style>
