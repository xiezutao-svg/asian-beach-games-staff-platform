<template>
  <el-button
    type="primary"
    size="small"
    :loading="loading"
    @click="handleDownload"
  >
    <el-icon v-if="!loading">
      <Download />
    </el-icon>
    {{ loading ? '下载中...' : '下载报告' }}
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import type { Notice } from '../../types/notice'
import { useUserStore } from '@/stores'
import { UserRole } from '../../types/notice'

interface Props {
  notice?: Notice
}

interface Emits {
  (e: 'success'): void
  (e: 'error', error: Error): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const userStore = useUserStore()

async function handleDownload() {
  // 权限检查
  const userRole = userStore.userInfo?.role

  if (userRole !== UserRole.ADMIN && props.notice) {
    // 普通用户只能下载与自己相关的报告
    // 这里模拟检查：假设普通用户只能下载某些特定类型的报告
    ElMessage.warning('您没有权限下载此报告')
    return
  }

  loading.value = true

  try {
    // 模拟下载过程
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 在实际项目中，这里应该：
    // 1. 调用后端API获取文件
    // 2. 创建Blob对象
    // 3. 创建下载链接并触发下载

    // 模拟成功下载
    ElMessage.success('下载成功！')

    emit('success')
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败，请重试')
    emit('error', error as Error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.download-button {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
}
</style>
