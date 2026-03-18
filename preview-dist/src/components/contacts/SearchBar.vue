<template>
  <div class="search-bar">
    <input
      v-model="searchText"
      type="text"
      :placeholder="placeholder"
      class="search-input"
      @input="handleInput"
    />
    <button v-if="searchText" @click="clearSearch" class="clear-btn">
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    debounce?: number
  }>(),
  {
    modelValue: '',
    placeholder: '搜索联系人...',
    debounce: 300
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

const searchText = ref(props.modelValue)

let debounceTimer: number | null = null

const handleInput = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    emit('search', searchText.value)
    emit('update:modelValue', searchText.value)
  }, props.debounce) as unknown as number
}

const clearSearch = () => {
  searchText.value = ''
  emit('search', '')
  emit('update:modelValue', '')
}

watch(
  () => props.modelValue,
  (newValue) => {
    searchText.value = newValue
  }
)
</script>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-input {
  flex: 1;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
  background: white;
}

.search-input:focus {
  border-color: #FF6B35;
}

.clear-btn {
  position: absolute;
  right: 12px;
  width: 24px;
  height: 24px;
  border: none;
  background: #e5e7eb;
  border-radius: 50%;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.clear-btn:hover {
  background: #d1d5db;
}
</style>
