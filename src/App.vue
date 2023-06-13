<template>
  <div id="app">
    <el-container v-if="$route.meta.keepAlive">
      <el-header>
        <keep-alive>
          <head></head>
        </keep-alive>
      </el-header>
    </el-container>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.router-view {
  width: 100%;
  height: 100%;
}
</style>
