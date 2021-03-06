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
              <th>Style</th>
              <th>Date</th>
              <th>Location</th>
              <th>Number of users</th>
              <th>Source</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

          <!-- Table body -->
          <tbody>
            <tr v-for="event in events" :key="event.id">
              <td>
                <img v-if="event.logo != null" class="smaller-image" :src="event.logo">
              </td>
              <td>{{ event.name }}</td>
              <td>{{ event.style }}</td>
              <td>{{ event.date }}</td>
              <td>{{ event.location }}</td>
              <td>{{ event.num_of_users }}</td>
              <td>{{ event.source }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="populateEventToEdit(event)">Edit</a> -
                <a href="#" @click.prevent="deleteEvent(event.id)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>

      <!-- Form -->
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Post ID#' + model.id : 'Add new CTF event')">
          <form enctype="multipart/form-data" @submit.prevent="saveEvent">
            <b-form-group label="Logo (50kb limit)">
              <b-form-file @change="onFileSelected" accept="image/*"></b-form-file>
            </b-form-group>

            <b-form-group label="Name">
              <b-form-input required debounce="500" v-model.lazy="model.name" type="text"></b-form-input>
            </b-form-group>

            <b-form-group label="Style">
              <b-form-select required v-model="model.style">
                <option>Jeopardy</option>
                <option>Attack-Defence</option>
                <option>Mixed</option>
                <option>Other</option>
              </b-form-select>
            </b-form-group>

            <b-form-group label="Date">
              <b-form-input required debounce="500" type="date" v-model.lazy="model.date"></b-form-input>
            </b-form-group>

            <b-form-group label="Location">
              <b-form-input required debounce="500" v-model.lazy="model.location"></b-form-input>
            </b-form-group>

            <b-form-group label="Number of users">
              <b-form-input required debounce="500" type="number" v-model.lazy="model.num_of_users"></b-form-input>
            </b-form-group>

            <b-form-group label="Challenge categories">
              <b-form-select v-model="selectedCategory" @change="addCategory()">
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category"
                >{{ category.text }}</option>
              </b-form-select>

              <tbody>
                <tr
                  class="new-categories"
                  v-for="chosenCategory in chosenCategories"
                  :key="chosenCategory.id"
                >
                  {{ chosenCategory.text }}
                  <a href="#" @click="removeCategory()">Remove</a>
                </tr>
              </tbody>
            </b-form-group>

            <b-form-group label="Source website">
              <b-form-input debounce="500" type="url" v-model.lazy="model.source"></b-form-input>
            </b-form-group>

            <b-form-group label="Additional info">
              <b-form-textarea debounce="500" rows="1" v-model.lazy="model.additional_info"></b-form-textarea>
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
import { isString } from "util";
export default {
  data() {
    return {
      loading: false,
      events: [],
      categories: [],
      categoryEvents: [],
      selectedCategory: null,
      chosenCategories: [],
      model: {}
    };
  },
  async created() {
    this.refresh();
  },
  methods: {
    // Show pop-up modal.
    async showModal(value) {
      this.$modal.show("dialog", {
        text: value
      });
    },

    // Refresh data from the database.
    async refresh() {
      this.loading = true;
      this.events = await api.getManyREST("events?sort=name");
      this.convertBlobs();

      // Event category assignment table.
      this.categoryEvents = await api.getManyREST("categoryEvents");
      // Input categories.
      this.categories = await api.getManyREST("categories?sort=text");
      this.loading = false;
    },

    // Convert blobs/images objects from the database to a binary string for displaying.
    async convertBlobs() {
      for (var event in this.events) {
        if (this.events[event].logo != null) {
          var binary = "";
          var bytes = new Uint8Array(this.events[event].logo.data);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          this.events[event].logo = binary;
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

    // For each event grab data on their challenge categories.
    async getCatsForEachEvent(id) {
      this.chosenCategories = [];
      var event = [];
      event = await api.getManyREST("categoryEvents");
      for (var e in event) {
        if (event[e].event_id == id) {
          var x = await api.getSingleREST("categories", event[e].category_id);
          if (!this.chosenCategories.includes(x)) {
            this.chosenCategories.push(x);
          }
        }
      }
    },

    // Add category on button click.
    async addCategory() {
      if (
        !this.chosenCategories.includes(this.selectedCategory) &&
        this.selectedCategory != undefined
      ) {
        this.chosenCategories.push(this.selectedCategory);
      }
      this.selectedCategory = undefined;
    },

    // Remove a category on button click.
    async removeCategory() {
      this.chosenCategories.pop(this.selectedCategory);
    },

    // Populate form with edit information.
    async populateEventToEdit(event) {
      this.model = Object.assign({}, event);
      if (this.chosenCategories != []) {
        this.chosenCategories = [];
      }
      this.getCatsForEachEvent(this.model.id);
    },

    // Save form data (categories) to database using API.
    async saveCategoryEvents() {
      var eventId = this.model.id;
      var model = {};
      for (var c in this.chosenCategories) {
        model.category_id = this.chosenCategories[c].id;
        model.event_id = eventId;
        //alert(this.chosenCategories.length+"sdf "+model.category_id+ " | "+model.event_id)
        api.createREST("categoryEvents", model);
        model = {};
      }
    },

    // Save form data to database using API.
    async saveEvent() {
      if (this.model.id) {
        await api.updateREST("events", this.model.id, this.model);
        //await this.deleteCategoryEvents(this.model.id);
        this.categoryEvents = await api.getManyREST("categoryEvents");
        for (var ce in this.categoryEvents) {
          if (this.categoryEvents[ce].event_id == this.model.id) {
            await api.deleteREST("categoryEvents", this.categoryEvents[ce].id);
          }
        }

        await this.saveCategoryEvents();
        this.showModal("Event edit completed: " + this.model.name);
      } else {
        this.model = await api.createREST("events", this.model);
        await this.saveCategoryEvents();

        // Check new event has been added to the database.
        this.events = await api.getManyREST("events");
        if (this.events[this.events.length - 1].id == this.model.id) {
          this.showModal("Event added: " + this.model.name);
        } else {
          this.showModal("Failed to add: " + this.model.name);
        }
      }
      this.chosenCategories = [];
      this.model = {}; // reset form
      this.refresh();
    },

    // Delete selected item from the database using API.
    async deleteEvent(id) {
      if (confirm("Are you sure you want to delete this event?")) {
        // if we are editing a event we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {};
        }
        await api.deleteREST("events", id);
        await this.refresh();
      }
    },

    // Delete selected categories from the selected item, from the database using the API.
    async deleteCategoryEvents(eventId) {
      // TODO fix the edit categories to show correctly.
      this.categoryEvents = await api.getManyREST("categoryEvents");
      for (var ce in this.categoryEvents) {
        if (this.categoryEvents[ce].event_id == eventId) {
          await api.deleteREST("categoryEvents", this.categoryEvents[ce].id);
        }
      }
    }
  }
};
</script>