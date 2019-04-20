<template>
<div class="mt-4">
    <form @submit.prevent="onUpload" enctype="multipart/form-data">
        
        <input type="file" @change="onFileSelected">
    <button class="button is-info">Upload</button>
    
    <img :src="imageUrl">
    </form>
</div>
</template>

<script>
import axios from 'axios'
import api from '@/api'
export default {
  data () {
    return {
      selectedFile: null,
      imageUrl: null,
      blobImage : null
    }
  },
  async created () {
    this.refresh()
  },
  methods: {
      async refresh(){

      },
      onFileSelected(event){
        this.selectedFile = event.target.files[0]
      },
      onUpload(){
            let filename = this.selectedFile.name
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
                this.imageUrl = fileReader.result
            })
            fileReader.readAsDataURL(this.selectedFile)

            console.log(this.imageUrl)

          /*axios.post('/profile', upload.single('test'), fd)
          .then(res => {
              console.log(res)
          })*/
      },
      async sendFile(){
          const formData = new FormData()
          formData.append('file', this.selectedFile)
          try{
            await axios.post('/upload', formData)
          } catch (err){
              console.log(err)
          }
          
      }
  }
}
</script>