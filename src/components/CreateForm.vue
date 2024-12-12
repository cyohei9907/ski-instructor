<script setup lang="ts">
import '@/assets/main.css';
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

// create a reactive reference to the array of todos
const Instructors = ref<Array<Schema['Instructor']["type"]>>([]);

function listInstructors() {
  client.models.Instructor.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
        Instructors.value = items
     },
  }); 
}

function createInstructor() {
  client.models.Instructor.create({
    nickname: window.prompt("Instructors nickname")
  }).then(() => {
    // After creating a new todo, update the list of todos
    listInstructors();
  });
}
    
// fetch todos when the component is mounted
 onMounted(() => {
    listInstructors();
});

</script>

<template>
  <main>
    <h1>My todos</h1>
    <button @click="createInstructor">+ new</button>
    <ul>
      <li 
        v-for="ins in Instructors" 
        :key="ins.id">
        {{ ins.nickname }}
      </li>
    </ul>
    <div>
      🥳 App successfully hosted. Try creating a new todo.
      <br />
      <a href="https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/">
        Review next steps of this tutorial.
      </a>
    </div>
  </main>
</template>
