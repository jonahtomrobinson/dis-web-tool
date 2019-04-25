<template>
  <div class="mt-4">
    <b-row>
      <b-col>
        <table class="table table-striped">
          <!-- Table head -->
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Cost</th>
              <th>Purpose</th>
              <th>Source</th>
              <th>Description</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

          <!-- Table body -->
          <tbody>
            <tr v-for="tech in techs" :key="tech.id">
              <td>
                <img v-if="tech.logo != null" class="smaller-image" :src="tech.logo">
              </td>
              <td>{{ tech.name }}</td>
              <td>{{ tech.cost }}</td>
              <td>{{ tech.purpose }}</td>
              <td>{{ tech.source }}</td>
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
            <b-form-group label="Logo (50kb limit)">
              <b-form-file @change="onFileSelected" v-model="initialFile" accept="image/*"></b-form-file>
            </b-form-group>

            <b-form-group label="Name">
              <b-form-input required debounce="500" type="text" v-model="model.name"></b-form-input>
            </b-form-group>

            <b-form-group label="Cost">
              <b-form-input required debounce="500" type="text" v-model="model.cost"></b-form-input>
            </b-form-group>

            <b-form-group label="Purpose">
              <b-form-select required type="integer" v-model="model.purpose_id">
                <option
                  v-for="purpose in purposes"
                  :key="purpose.id"
                  :value="purpose.id"
                >{{ purpose.text }}</option>
              </b-form-select>
            </b-form-group>

            <b-form-group label="Source Website">
              <b-form-input required debounce="500" type="url" v-model="model.source"></b-form-input>
            </b-form-group>

            <b-form-group label="Description">
              <b-form-textarea debounce="500" required rows="3" v-model="model.description"></b-form-textarea>
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
      techs: [],
      purposes: [],
      model: {},
      //addedImage: null,
      //image: null,
      initialFile: null,
      selectedFile: null
    };
  },
  async created() {
    this.refreshPurposes();
    this.refreshTechs();
  },
  methods: {
    // Show pop-up modal.
    async showModal(value) {
      this.$modal.show("dialog", {
        text: value
      });
    },

    // Refresh data from the database.
    async refreshTechs() {
      this.loading = true;
      this.techs = await api.getManyREST("techs?sort=name");
      this.convertBlobs();

      for (var i = 0; i < this.techs.length; i++) {
        for (var p = 0; p < this.purposes.length; p++) {
          if (this.techs[i].purpose_id == this.purposes[p].id) {
            this.techs[i].purpose = this.purposes[p].text;
          }
        }
        if (this.techs[i].purpose == null) {
          this.techs[i].purpose = "-";
        }
      }

      this.loading = false;
    },

    // Convert blobs/images objects from the database to a binary string for displaying.
    async convertBlobs() {
      for (var tech in this.techs) {
        if (this.techs[tech].logo != null) {
          var binary = "";
          var bytes = new Uint8Array(this.techs[tech].logo.data);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          this.techs[tech].logo = binary;
        }
      }
    },

    // Convert uploaded image to blob data.
    async onFileSelected(event) {
      var test = "";
      this.selectedFile = event.target.files[0];
      const fileReader = new FileReader();

      if (this.selectedFile.size > 61440) {
        alert("File too large");
        this.initialFile = null;
        return;
      }

      fileReader.addEventListener("load", () => {
        test = fileReader.result;
        this.model.logo = test;
      });
      await fileReader.readAsDataURL(this.selectedFile);
    },

    // Refresh purposes.
    async refreshPurposes() {
      this.purposes = await api.getManyREST("purposes?sort=text");
    },

    // Populate form with edit information.
    async populateTechToEdit(tech) {
      this.model = Object.assign({}, tech);
    },

    // Save form data to database using API.
    async saveTech() {
      if (this.model.id) {
        await api.updateREST("techs", this.model.id, this.model);
        this.showModal("Technology edit completed: " + this.model.name);
      } else {
        this.model = await api.createREST("techs", this.model);

        // Check new technology has been added to the database.
        this.techs = await api.getManyREST("techs");
        if (this.techs[this.techs.length - 1].id == this.model.id) {
          this.showModal("Technology added: " + this.model.name);
        } else {
          this.showModal("Failed to add: " + this.model.name);
        }
      }
      this.model = {}; // reset form
      this.initialFile = null;
      this.refreshTechs();
    },

    // Delete selected item from the database using API.
    async deleteTech(id) {
      if (confirm("Are you sure you want to delete this technology?")) {
        // if we are editing a tech we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {};
        }
        await api.deleteREST("techs", id);
        await this.refreshTechs();
      }
    }
  }
};
</script>