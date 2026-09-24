<template>
  <div class="app-wrapper">
    <AppHeader />
    <div class="main-container">
      <Sidebar class="sidebar-container" />
      <main class="app-main">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import AppHeader from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'Layout',
  components: {
    AppHeader,
    Sidebar
  }
}
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}
.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.sidebar-container {
  width: 250px;
  background: var(--sidebar-bg, #001529); /* 图片中侧边栏是深色的 */
  transition: width 0.3s;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35); /* 增加一点阴影使其和右边区分 */
}
.app-main {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #f0f2f5; /* 主内容区稍微灰一点，地图会在里面 */
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  .sidebar-container {
    width: 100%;
    height: auto;
    border-right: none;
    border-top: 1px solid var(--border-color);
    display: flex;
    z-index: 10;
    order: 2; /* Move sidebar to bottom */
  }
  .app-main {
    height: auto;
    flex: 1;
    order: 1; /* Main content takes up remaining space */
  }
}
</style>
