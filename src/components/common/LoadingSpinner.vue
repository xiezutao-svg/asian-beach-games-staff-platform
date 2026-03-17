<template>
  <div class="loading-spinner" :class="{ full: fullScreen }">
    <div class="spinner-container">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  fullScreen?: boolean
}

withDefaults(defineProps<Props>(), {
  fullScreen: false
})
</script>

<style scoped lang="scss">
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;

  &.full {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: $z-index-modal;
  }

  .spinner-container {
    position: relative;
    width: 60px;
    height: 60px;

    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 4px solid transparent;
      border-top-color: $primary-orange;
      border-radius: 50%;
      animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

      &:nth-child(1) {
        animation-delay: -0.45s;
      }

      &:nth-child(2) {
        width: 80%;
        height: 80%;
        top: 10%;
        left: 10%;
        animation-delay: -0.3s;
      }

      &:nth-child(3) {
        width: 60%;
        height: 60%;
        top: 20%;
        left: 20%;
        animation-delay: -0.15s;
      }
    }
  }

  .loading-text {
    margin-top: $spacing-lg;
    font-size: $font-size-md;
    color: $text-secondary;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
