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
            <tr v-for="category in categories" :key="category.id">
              <td>{{ category.id }}</td>
              <td>{{ category.text }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="populatePurposeToEdit(category)">Edit</a> -
                <a href="#" @click.prevent="deletePurpose(category.id)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>

        <!-- Form -->  
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Category ' + model.text : 'Add new category')">
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
      categories: [],
      model: {}
    }
  },
  async created () {
    this.refreshPurposes()
  },
  methods: {
    async refreshPurposes () {
      this.loading = true
      this.categories = await api.getManyREST("categories")
      this.loading = false
    },
    async populatePurposeToEdit (category) {
      this.model = Object.assign({}, category)
    },
    async savePurpose () {
        if (this.model.id) {
            await api.updateREST("categories",this.model.id,this.model)
        }
        else{
            await api.createREST("categories", this.model)

            // Check new category has been added to the database.
            this.categories = await api.getManyREST("categories")
            if (this.categories[this.categories.length-1].text == this.model.text){
                alert("Category added: "+this.model.text);
            }
            else{
                alert("Failed to add: "+this.model.text);
            }
        }
        this.model = {} // reset form
        this.refreshPurposes()
    },
    async deletePurpose (id) {
      if (confirm('Are you sure you want to delete this category?')) {
        // if we are editing a category we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deleteREST('categories', id)
        await this.refreshPurposes()
      }
    }
  }
}
</script>