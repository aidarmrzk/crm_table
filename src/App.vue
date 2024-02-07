<template>
  <MainBoard />
</template>

<script>
import MainBoard from './components/MainBoard.vue'

export default {
  name: 'App',
  components: {
    MainBoard
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "Ubuntu", sans-serif;
  font-style: normal;
  font-weight: 400;
}
a {
  color: inherit;
  text-decoration: none;
}
img {
  vertical-align: bottom;
}
</style>
