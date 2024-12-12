<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { uploadData } from "aws-amplify/storage";


const client = generateClient<Schema>();

// 响应式变量
const instructors = ref<Array<Schema['Instructor']["type"]>>([]); // 教练列表
const form = ref({
  nickname: '',
  location: '',
  skiResorts: '',
  bloodType: '',
  zodiac: '',
  bio: '',
  specialties: '',
  avatar: '',
  photoWall: '',
  skiCertificates: '',
});

const uuid = generateId();

function generateId() {
  return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// 创建教练
function createInstructor() {
  const newInstructor = {
    nickname: form.value.nickname,
    location: form.value.location.split(',').map((s) => s.trim()),
    skiResorts: form.value.skiResorts.split(',').map((s) => s.trim()),
    bloodType: form.value.bloodType,
    zodiac: form.value.zodiac,
    bio: form.value.bio,
    specialties: form.value.specialties.split(',').map((s) => s.trim()),
    avatar: form.value.avatar,
    photoWall: form.value.photoWall,
    skiCertificates: form.value.skiCertificates.split(',').map((s) => s.trim()),
  };

  client.models.Instructor.create(newInstructor).then((r) => {
    fetchInstructors();
    resetForm();
  });
}

// 照片墙上传
function uploadPhotoWallImage() {
  const photoWall = document.getElementById('photoWall') as HTMLInputElement;
  const fileReader = new FileReader();
  if (photoWall?.files && photoWall.files.length > 0) {
    fileReader.readAsArrayBuffer(photoWall.files[0]);
  } else {
    console.log("No file selected");
  }

  fileReader.onload = async (event) => {
    if (event.target) {
      console.log("Complete File read successfully!", event.target.result);
      try {
        const result = await uploadData({
          data: event.target.result as ArrayBuffer,
          path: `picture-submissions/${uuid}/${photoWall?.files?.[0]?.name || 'default-filename'}`
        });
        console.log("Upload successful", result);
      } catch (e) {
        console.log("error", e);
      }
    }
  };
}

function uploadAvatarImage() {
  const avatar = document.getElementById('avatar') as HTMLInputElement;
  const fileReader = new FileReader();
  if (avatar?.files && avatar.files.length > 0) {
    fileReader.readAsArrayBuffer(avatar.files[0]);
  } else {
    console.log("No file selected");
  }

  fileReader.onload = async (event) => {
    if (event.target) {
      console.log("Complete File read successfully!", event.target.result);
      try {
        const result = await uploadData({
          data: event.target.result as ArrayBuffer,
          path: `picture-submissions/${uuid}/avatar/${avatar?.files?.[0]?.name || 'default-filename'}`
        });
        console.log("Upload successful", result);
      } catch (e) {
        console.log("error", e);
      }
    }
  };
}

// 获取教练列表
function fetchInstructors() {
  client.models.Instructor.list().then((data) => {
    instructors.value = data.data || [];
  });
}

// 重置表单
function resetForm() {
  form.value = {
    nickname: '',
    location: '',
    skiResorts: '',
    bloodType: '',
    zodiac: '',
    bio: '',
    specialties: '',
    avatar: '',
    photoWall: '',
    skiCertificates: '',
  };
}

// 在组件挂载时获取教练列表
onMounted(() => {
  fetchInstructors();
})
</script>

<template>
  <main>
    <h1>教练信息表</h1>

    <!-- 添加教练表单 -->
    <div class="form-container">
      <h2>新增教练</h2>
      <form @submit.prevent="createInstructor" style="width: 450px;">
        <div>
          <label for="nickname">昵称：</label>
          <input id="nickname" v-model="form.nickname" type="text" required />
        </div>
        <div>
          <label for="avatar">头像：</label>
          <input id="avatar" type="file" style="width: 100px;"/>
          <button id="upload-display-picture" @click="uploadAvatarImage" type="button">上传</button>
        </div>
        <div>
          <label for="location">地区：</label>
          <input id="location" v-model="form.location" type="text" placeholder="用逗号分隔" />
        </div>
        <div>
          <label for="specialties">擅长板：</label>
          <input id="specialties" v-model="form.specialties" type="text" placeholder="用逗号分隔" />
        </div>
        <div>
          <label for="skiCertificates">滑雪证件：</label>
          <input id="skiCertificates" v-model="form.skiCertificates" type="text" placeholder="用逗号分隔" />
        </div>
        <div>
          <label for="skiResorts">所在雪场：</label>
          <input id="skiResorts" v-model="form.skiResorts" type="text" placeholder="用逗号分隔" />
        </div>
        <div>
          <label for="bloodType">血型：</label>
          <input id="bloodType" v-model="form.bloodType" type="text" />
        </div>
        <div>
          <label for="zodiac">星座：</label>
          <input id="zodiac" v-model="form.zodiac" type="text" />
        </div>
        <div>
          <label for="bio">自我介绍：</label>
          <textarea id="bio" v-model="form.bio"></textarea>
        </div>
        <div>
          <label for="photoWall">展示用照片墙：</label>
          <input id="photoWall" type="file" multiple style="width: 100px;"/>
          <button id="upload-display-picture" @click="uploadPhotoWallImage" type="button">上传</button>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <div>
            <button type="submit">提交</button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
.form-container {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

form div {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

label {
  width: 30%;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

input, textarea {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

textarea {
  resize: vertical; /* 允许垂直调整大小 */
}

button {
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button[type="button"] {
  background-color: #6c757d;
}

button[type="button"]:hover {
  background-color: #5a6268;
}

button[type="submit"] {
  margin-right: 10px;
}

.form-container div:last-child {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

td img {
  border-radius: 5px;
}

p {
  font-size: 16px;
  color: #666;
  margin-top: 10px;
}

</style>