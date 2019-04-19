<template>
<div class="mt-4">
    <form ref="myform" enctype="multipart/form-data" @submit.prevent="attemptSave">
            <input type="file" name="avatar" />
            <div>
            <b-btn type="submit" variant="success">Save</b-btn>
            </div>
    </form>
    <v-dialog/>
    <b-button class="mr-1" @click="show()">Purposes</b-button>
    
</div>
</template>

<script>
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      techs: [],
      purposes: [],
      model: {},
    }
  },
  async created () {
    this.refreshTechs()
  },
  methods: {
      show () {
        this.$modal.show('dialog', {
            text: 'You are too awesome',
        })
    },
    hide () {
        this.$modal.hide('hello-world');
    }
  }
}
</script>