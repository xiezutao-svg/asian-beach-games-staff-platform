<template>
  <div class="notice-list">
    <div v-if="filteredNotices.length === 0" class="empty-state">
      <el-empty description="暂无公告" />
    </div>
    <NoticeCard
      v-for="notice in filteredNotices"
      :key="notice.id"
      :notice="notice"
      @click="handleNoticeClick"
      @download="handleNoticeDownload"
    />
  </div>
</template>

<script setup lang="ts">
import type { Notice } from '../../types/notice'
import NoticeCard from './NoticeCard.vue'

interface Props {
  filteredNotices: Notice[]
}

interface Emits {
  (e: 'noticeClick', notice: Notice): void
  (e: 'noticeDownload', notice: Notice): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleNoticeClick(notice: Notice) {
  emit('noticeClick', notice)
}

function handleNoticeDownload(notice: Notice) {
  emit('noticeDownload', notice)
}
</script>

<style scoped lang="scss">
.notice-list {
  min-height: 400px;
}

.empty.empty-state {
  padding: $spacing-xxl 0;
}
</style>
