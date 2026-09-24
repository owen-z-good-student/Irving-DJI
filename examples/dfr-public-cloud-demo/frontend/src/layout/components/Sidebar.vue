<template>
  <aside class="sidebar">
    <nav>
      <ul class="nav-list">
        <li
          v-for="route in menuRoutes"
          :key="route.path"
          class="nav-item"
          :class="{ active: $route.path.includes(route.path) }"
          @click="navigate(route.path)"
        >
          <i :class="route.meta.icon"></i>
          <span>{{ route.meta.title }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  computed: {
    menuRoutes() {
      const layoutRoute = this.$router.options.routes.find(r => r.path === '/')
      return layoutRoute ? layoutRoute.children : []
    }
  },
  methods: {
    navigate(path) {
      if (this.$route.path !== `/${path}`) {
        this.$router.push(`/${path}`)
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  padding: 0; /* 图片中没有上下的留白 */
  display: flex;
  flex-direction: column;
}
.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}
.nav-item {
  padding: 18px 25px; /* 稍微加宽一点 padding */
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 15px;
  color: var(--sidebar-text, rgba(255, 255, 255, 0.65)); /* 默认暗色文字 */
  font-size: 1rem; /* 字体稍微调小一点符合专业感 */
}
.nav-item:hover {
  color: #ffffff; /* hover变白 */
}
.nav-item.active {
  background: var(--primary-color); /* 选中项整个背景是主色 */
  color: #ffffff; /* 选中项文字白色 */
  font-weight: normal; /* 不加粗，靠背景色区分 */
}
.nav-item i {
  width: 24px;
  text-align: center;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .sidebar {
    padding: 0;
    width: 100%;
    height: 60px;
    background: var(--sidebar-bg, #001529); /* 手机端底部栏也用深色 */
    /* border-top handled in layout/index.vue */
  }
  .nav-list {
    flex-direction: row;
    height: 100%;
    width: 100%;
    justify-content: space-around;
    align-items: center;
  }
  .nav-item {
    padding: 5px 10px;
    flex: 1;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
    font-size: 0.75rem;
    border-left: none;
    border-top: 3px solid transparent;
  }
  .nav-item.active {
    border-left-color: transparent;
    border-top-color: var(--primary-color);
  }
  .nav-item i {
    font-size: 1.2rem;
  }
}
</style>
