<script setup lang="ts">
// import Todos from './components/Todos.vue'
import CreateForm from './components/CreateForm.vue'

</script>

<template>
  <main>
    <CreateForm />  
  </main>
</template>
<style>
  main {
    display: flex;
    height: 100vh;
    font-family: Arial, sans-serif;
  }
  html, body {
    overscroll-behavior: none; /* 禁用回弹 */
    height: 100%;
  }
</style>