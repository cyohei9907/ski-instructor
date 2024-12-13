<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { uploadData } from "aws-amplify/storage";

const client = generateClient<Schema>();

// 响应式变量
const instructors = ref<Array<Schema['Instructor']["type"]>>([]); // 教练列表
const isUploading = ref(false);
const form = ref({
  nickname: '',
  location: '',
  skiResorts: '',
  bloodType: '',
  zodiac: '',
  bio: '',
  specialties: '',
  avatar: '',
  phonenumber: '',
  photoWall: '',
  skiCertificates: '',
  qrCode: '',
});

const uuid = generateId();

function generateId() {
  return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// 创建教练
function createInstructor() {
  // 检查 avatar 和 photoWall 是否为空
  if (!form.value.avatar) {
    alert("请上传头像！");
    return; // 中止操作
  }

  if (!form.value.photoWall) {
    alert("请上传展示用照片墙！");
    return; // 中止操作
  }

  if (!form.value.qrCode) {
    alert("请上传联络用QRcode！");
    return; // 中止操作
  }
  const newInstructor = {
    nickname: form.value.nickname,
    location: form.value.location.split(',').map((s) => s.trim()),
    skiResorts: form.value.skiResorts.split(',').map((s) => s.trim()),
    bloodType: form.value.bloodType,
    zodiac: form.value.zodiac,
    bio: form.value.bio,
    specialties: form.value.specialties.split(',').map((s) => s.trim()),
    avatar: form.value.avatar,
    phonenumber: form.value.phonenumber,
    photoWall: form.value.photoWall,
    skiCertificates: form.value.skiCertificates.split(',').map((s) => s.trim()),
  };

  client.models.Instructor.create(newInstructor).then((r) => {
    console.log("Instructor created", r);
    alert("教练创建成功！");
    window.location.reload();
  });
}

// 照片墙上传
function uploadPhotoWallImage() {
  const photoWall = document.getElementById('photoWall') as HTMLInputElement;
  isUploading.value = true; // 设置上传中状态
  if (photoWall?.files && photoWall.files.length > 0) {
    const files = Array.from(photoWall.files); // 将 FileList 转换为数组
    const uploadedUrls: string[] = []; // 存储上传成功后的文件路径

    files.forEach((file) => {
      const fileReader = new FileReader();

      fileReader.readAsArrayBuffer(file); // 读取文件为 ArrayBuffer

      fileReader.onload = async (event) => {
        if (event.target) {
          console.log(`Complete File read successfully: ${file.name}`, event.target.result);

          try {
            // 上传文件到 S3
            const result = await uploadData({
              data: event.target.result as ArrayBuffer,
              path: `picture-submissions/${uuid}/${file.name}`,
            });

            console.log(`Upload successful: ${file.name}`, result);

            // 将上传成功的文件路径添加到数组
            const fileUrl = `https://amplify-d2o7poh9es00p9-ma-amplifyteamdrivebucket28-rgerxapapxsr.s3.ap-northeast-1.amazonaws.com/picture-submissions/${uuid}/${file.name}`;
            uploadedUrls.push(fileUrl);

            // 更新 form.value.photoWall
            form.value.photoWall = uploadedUrls.join(',');
          } catch (error) {
            console.error(`Error uploading file: ${file.name}`, error);
          } finally {
            isUploading.value = false; // 恢复状态
          }
        }
      };

      fileReader.onerror = (error) => {
        console.error(`Error reading file: ${file.name}`, error);
        isUploading.value = false; // 恢复状态
      };
    });
  } else {
    console.log("No file selected");
  }
}

function uploadAvatarImage() {
  isUploading.value = true; // 设置上传中状态
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
        if (avatar?.files && avatar.files.length > 0) {
          form.value.avatar = `https://amplify-d2o7poh9es00p9-ma-amplifyteamdrivebucket28-rgerxapapxsr.s3.ap-northeast-1.amazonaws.com/picture-submissions/${uuid}/avatar/${avatar?.files[0].name}`;
        } else {
          console.log("No file selected");
        }
      } catch (e) {
        console.log("error", e);
      } finally {
        isUploading.value = false; // 恢复状态
      }
    }
  };
  fileReader.onerror = (error) => {
    isUploading.value = false; // 恢复状态
  };
}

function uploadQrcodeImage() {
  isUploading.value = true; // 设置上传中状态
  const qrcode = document.getElementById('qrcode') as HTMLInputElement;
  const fileReader = new FileReader();
  if (qrcode?.files && qrcode.files.length > 0) {
    fileReader.readAsArrayBuffer(qrcode.files[0]);
  } else {
    console.log("No file selected");
  }

  fileReader.onload = async (event) => {
    if (event.target) {
      console.log("Complete File read successfully!", event.target.result);
      try {
        const result = await uploadData({
          data: event.target.result as ArrayBuffer,
          path: `picture-submissions/${uuid}/qrcode/${qrcode?.files?.[0]?.name || 'default-filename'}`
        });
        console.log("Upload successful", result);
        if (qrcode?.files && qrcode.files.length > 0) {
          form.value.qrCode = `https://amplify-d2o7poh9es00p9-ma-amplifyteamdrivebucket28-rgerxapapxsr.s3.ap-northeast-1.amazonaws.com/picture-submissions/${uuid}/qrcode/${avatar?.files[0].name}`;
        } else {
          console.log("No file selected");
        }
      } catch (e) {
        console.log("error", e);
      } finally {
        isUploading.value = false; // 恢复状态
      }
    }
  };
  fileReader.onerror = (error) => {
    isUploading.value = false; // 恢复状态
  };
}

// 获取教练列表
function fetchInstructors() {
  client.models.Instructor.list().then((data) => {
    instructors.value = data.data || [];
  });
}

// 在组件挂载时获取教练列表
onMounted(() => {
  fetchInstructors();
})
</script>

<template>
    <!-- 全屏遮罩 -->
    <div v-if="isUploading" class="overlay">
      <div class="loading">Uploading... Please wait</div>
    </div>
    <!-- 添加教练表单 -->
    <div class="form-container">
    <h3>教练信息表</h3><text style="color:coral;">(如果创建后想修改可重复创建)</text>
      <form @submit.prevent="createInstructor" style="width: 350px;">
        <div class="input-area">
          <label for="nickname">昵称：</label>
          <input id="nickname" v-model="form.nickname" type="text" required />
        </div>
        <div class="input-area">
          <label for="avatar">头像：</label>
          <div style="display: flex; width: 100%;">
            <input id="avatar" type="file"  required/>
            <button @click="uploadAvatarImage" type="button">上传</button>
          </div>
        </div>
        <div class="input-area">
          <label for="location">地区：</label>
          <input id="location" v-model="form.location" type="text" placeholder="用逗号分隔" />
        </div>
        <div class="input-area">
          <label for="specialties">擅长板：</label>
          <input id="specialties" v-model="form.specialties" type="text" placeholder="用逗号分隔" />
        </div>
        <div class="input-area">
          <label for="skiCertificates">滑雪证件：</label>
          <input id="skiCertificates" v-model="form.skiCertificates" type="text" placeholder="用逗号分隔" />
        </div>
        <div class="input-area">
          <label for="skiResorts">所在雪场：</label>
          <input id="skiResorts" v-model="form.skiResorts" type="text" placeholder="用逗号分隔" />
        </div>        
        <div class="input-area">
          <label for="phonenumber">电话号码</label>
          <input id="phonenumber" v-model="form.phonenumber" type="text" ></input>
        </div>
        <div class="input-area">
          <label for="photoWall">展示用照片墙：</label>
          <div style="display: flex; width: 100%;">
            <input id="photoWall" type="file" multiple />
            <button @click="uploadPhotoWallImage" type="button">上传</button>
          </div>
        </div>
        <div class="input-area">
          <label for="qrcode">联络用微信QRCode：</label>
          <div style="display: flex; width: 100%;">
            <input id="qrcode" type="file" />
            <button  @click="uploadQrcodeImage" type="button">上传</button>
          </div>
        </div>
        <div  class="input-area">
          <label for="bio">自我介绍：</label>
          <textarea id="bio" v-model="form.bio" style="height: 100px;"></textarea>
        </div>



        <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="submit" style="width:220px;">提交</button>
        </div>
      </form>
    </div>
</template>

<style scoped>
.input-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.form-container {
  margin-top: 20px;
  padding: 0px 20px 0px 20px ;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
}

form div {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

label {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
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
  background-color: #4397b6;
}

button[type="button"]:hover {
  background-color: #5a6268;
}

button[type="submit"] {
  width: 50%; /* 按钮宽度 50% */
  margin: 0 auto; /* 居中对齐 */
  display: block; /* 独占一行 */
}

.form-container div:last-child {
  display: flex;
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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading {
  font-size: 20px;
  color: #fff;
  font-weight: bold;
}

</style>