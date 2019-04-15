<template>
<div class="mt-4">
    <b-row>
      <b-col>
        <table class="table table-striped">
            
          <!-- Table head -->  
          <thead>
            <tr>
              <th>ID</th>
              <th>Text</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

            <!-- Table body -->  
          <tbody>
            <tr v-for="purpose in purposes" :key="purpose.id">
              <td>{{ purpose.id }}</td>
              <td>{{ purpose.text }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="populatePurposeToEdit(purpose)">Edit</a> -
                <a href="#" @click.prevent="deletePurpose(purpose.id)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>

        <!-- Form -->  
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Purpose ' + model.text : 'Add new purpose')">
          <form enctype="multipart/form-data" @submit.prevent="savePurpose">
            <b-form-group label="Text">
              <b-form-textarea rows="3" v-model="model.text"></b-form-textarea>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save</b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
</div>
</template>

<script>
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      purposes: [],
      model: {}
    }
  },
  async created () {
    this.refreshPurposes()
  },
  methods: {
    async refreshPurposes () {
      this.loading = true
      this.purposes = await api.getManyREST("purposes")
      this.loading = false
    },
    async populatePurposeToEdit (purpose) {
      this.model = Object.assign({}, purpose)
    },
    async savePurpose () {
        if (this.model.id) {
            await api.updateREST("purposes",this.model.id,this.model)
        }
        else{
            this.model = await api.createREST("purposes", this.model)

            // Check new purpose has been added to the database.
            this.purposes = await api.getManyREST("purposes")
            if (this.purposes[this.purposes.length-1].id == this.model.id){
                alert("Purpose added: "+this.model.text);
            }
            else{
                alert("Failed to add: "+this.model.text);
            }
        }
        this.model = {} // reset form
        this.refreshPurposes()
    },
    async deletePurpose (id) {
      if (confirm('Are you sure you want to delete this purpose?')) {
        // if we are editing a purpose we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deleteREST('purposes', id)
        await this.refreshPurposes()
      }
    }
  }
}
</script>