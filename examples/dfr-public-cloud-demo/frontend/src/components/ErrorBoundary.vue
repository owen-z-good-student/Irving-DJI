<template>
  <div>
    <slot v-if="!hasError"></slot>
    <div v-else class="error-boundary">
      <h2><i class="el-icon-warning"></i> 发生了一些错误</h2>
      <p>{{ error && error.message }}</p>
      <el-button type="primary" @click="resetError">重试</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorBoundary',
  data() {
    return {
      hasError: false,
      error: null
    }
  },
  errorCaptured(err, vm, info) {
    this.hasError = true
    this.error = err
    // eslint-disable-next-line no-console
    console.error('Error captured:', err, info)
    return false // prevent propagation
  },
  methods: {
    resetError() {
      this.hasError = false
      this.error = null
    }
  }
}
</script>

<style scoped>
.error-boundary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--danger-color);
  padding: 20px;
  text-align: center;
}
</style>
