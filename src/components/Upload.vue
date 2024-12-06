<template>
    <main>
        <h1>Upload File</h1>
        <input type="file" id="file" />
        <button id="upload">Upload</button>
    </main>
</template>
<script setup >
    import { onMounted, ref } from 'vue';
    import type { Schema } from '../../amplify/data/resource';
    import { uploadData } from "aws-amplify/storage";

    const file = document.getElementById("file");
    const upload = document.getElementById("upload");

    upload.addEventListener("click", () => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file.files[0]);

        fileReader.onload = async (event) => {
            console.log("Complete File read successfully!", event.target.result);
            try {
            await uploadData({
                        data: event.target.result,
                        path: file.files[0].name
                    });
            } catch (e) {
            console.log("error", e);
            }
        };
    });
</script>
