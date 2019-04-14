<template>
<div class="mt-4">
    <b-row>
      <b-col>
        <table class="table table-striped">
            
          <!-- Table head -->  
          <thead>
            <tr>
              <th>ID</th>
              <th>Logo</th>
              <th>Name</th>
              <th>Cost</th>
              <th>Purpose</th>
              <th>Description</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

            <!-- Table body -->  
          <tbody>
            <tr v-for="tech in techs" :key="tech.id">
              <td>{{ tech.id }}</td>
              <td>{{ tech.logo }}</td>
              <td>{{ tech.name }}</td>
              <td>{{ tech.cost }}</td>
              <td>{{ tech.purpose }}</td>
              <td>{{ tech.description }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="populateTechToEdit(tech)">Edit</a> -
                <a href="#" @click.prevent="deleteTech(tech.id)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>

        <!-- Form -->  
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Technology ' + model.name : 'Add new technology')">
          <form enctype="multipart/form-data" @submit.prevent="saveTech">
            <b-form-group label="Logo">
              <!--<b-form-input type="blob" v-model="model.logo"></b-form-input>-->
                <div class="dropbox">
                <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                    accept="image/*" class="input-file">
                    <p v-if="isInitial">
                    Drag your file(s) here to begin<br> or click to browse
                    </p>
                    <p v-if="isSaving">
                    Uploading {{ fileCount }} files...
                    </p>
                </div>
            </b-form-group>
            <b-form-group label="Name">
              <b-form-input type="text" v-model="model.name"></b-form-input>
            </b-form-group>
            <b-form-group label="Cost">
              <b-form-input type="text" v-model="model.cost"></b-form-input>
            </b-form-group>
            <b-form-group label="Purpose">
              <b-form-textarea v-model="model.purpose"></b-form-textarea>
            </b-form-group>
            <b-form-group label="Description">
              <b-form-textarea rows="3" v-model="model.description"></b-form-textarea>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save Technology</b-btn>
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
      techs: [],
      model: {}
    }
  },
  async created () {
    this.refreshTechs()
  },
  methods: {
    async refreshTechs () {
      this.loading = true
      this.techs = await api.getManyREST("techs")
      this.loading = false
    },
    async populateTechToEdit (tech) {
      this.model = Object.assign({}, tech)
    },
    async saveTech () {
        if (this.model.id) {
            await api.updateREST("techs",this.model.id,this.model)
        }
        else{
            await api.createREST("techs",this.model)

            // Check new technology has been added to the database.
            this.techs = await api.getManyREST("techs")
            if (this.techs[this.techs.length-1].name == this.model.name){
                alert("Technology added: "+this.model.name);
            }
            else{
                alert("Failed to add: "+this.model.name);
            }
        }
        this.model = {} // reset form
        this.refreshTechs()
    },
    async deleteTech (id) {
      if (confirm('Are you sure you want to delete this technology?')) {
        // if we are editing a tech we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deleteREST('techs', id)
        await this.refreshTechs()
      }
    }
  }
}
</script>