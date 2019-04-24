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
                <a href="#" @click.prevent="populateCategoryToEdit(category)">Edit</a> -
                <a href="#" @click.prevent="deleteCategory(category.id)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>

      <!-- Form -->
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Category ' + model.text : 'Add new category')">
          <form enctype="multipart/form-data" @submit.prevent="saveCategory">
            <b-form-group label="Text">
              <b-form-textarea required rows="3" v-model="model.text"></b-form-textarea>
            </b-form-group>

            <div>
              <b-btn type="submit" variant="success">Save</b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
    <v-dialog/>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      loading: false,
      categories: [],
      model: {}
    };
  },
  async created() {
    this.refreshCategory();
  },
  methods: {
    // Show pop-up modal.
    async showModal(value) {
      this.$modal.show("dialog", {
        text: value
      });
    },

    // Refresh data from the database.
    async refreshCategory() {
      this.loading = true;
      this.categories = await api.getManyREST("categories?sort=text");
      this.loading = false;
    },

    // Populate form with edit information.
    async populateCategoryToEdit(category) {
      this.model = Object.assign({}, category);
    },

    // Save form data to database using API.
    async saveCategory() {
      if (this.model.id) {
        await api.updateREST("categories", this.model.id, this.model);
        this.showModal("Category edit completed: " + this.model.text);
      } else {
        this.model = await api.createREST("categories", this.model);

        // Check new category has been added to the database.
        this.categories = await api.getManyREST("categories");
        if (this.categories[this.categories.length - 1].id == this.model.id) {
          this.showModal("Category added: " + this.model.text);
        } else {
          this.showModal("Failed to add: " + this.model.text);
        }
      }
      this.model = {}; // reset form
      this.refreshCategory();
    },

    // Delete selected item from the database using API.
    async deleteCategory(id) {
      if (confirm("Are you sure you want to delete this category?")) {
        // if we are editing a category we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {};
        }
        await api.deleteREST("categories", id);
        await this.refreshCategory();
      }
    }
  }
};
</script>