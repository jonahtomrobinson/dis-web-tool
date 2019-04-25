<template>
  <div class="mt-4">
    <div class="assign-row-outer">
      <b-row class="assign-row">
        <h1 v-if="!selectedOption">Please select an option</h1>
      </b-row>

      <!-- Reset button. -->
      <b-row class="assign-row pb-3">
        <b-button v-if="selectedOption" class="mr-1" @click="chooseOption(null)">Reset</b-button>
      </b-row>

      <!-- Form for technologies. -->
      <b-row class="assign-row">
        <b-col lg="3">
          <b-card
            :style="{ border: techStyle}"
            v-on:click="chooseOption('techs')"
            :class="{ 'assign-item':  selectedOption == null}"
            :title="'Technologies'"
          >
            <!-- List all available technologies in a dropdown menu -->
            <form enctype="multipart/form-data" @submit.prevent="savePurpose">
              <div v-if="selectedOption == 'techs'">
                <b-form-select v-model="selected" class="mr-1">
                  <option v-for="tech in techs" :key="tech.id" :value="tech">{{ tech.name }}</option>
                </b-form-select>
              </div>

              <!-- List all available events in a dropdown menu -->
              <div v-if="(selectedOption == 'events') && (selected.name != null)">
                <b-form-select v-model="selectedToAdd" class="mr-1">
                  <option v-for="tech in techs" :key="tech.id" :value="tech">{{ tech.name }}</option>
                </b-form-select>

                <!-- Add button. -->
                <b-button class="mr-1 mt-2" @click="addTech()">Add</b-button>

                <!-- List all assigned events. -->
                <b-form-group class="mt-2" label="Assigned Technologies:">
                  <div v-for="tech in techs" :key="tech.id" >
                    <tbody v-for="assignment in assignments" :key="assignment.id" :value="assignment" >
                      <tr v-if="assignment.event_id == selected.id">
                        <td v-if="assignment.technology_id == tech.id">
                          {{tech.name}}
                          <!-- Delete link/button. -->
                          <a href="#" @click="deleteItem(assignment.id)">Remove</a>
                        </td>
                      </tr>
                    </tbody>
                  </div>
                </b-form-group>
              </div>
            </form>
          </b-card>
        </b-col>

        <!-- Form for events. -->
        <b-col lg="3">
          <b-card
            :style="{ border: eventStyle}"
            v-on:click="chooseOption('events')"
            :class="{ 'assign-item':  selectedOption == null}"
            :title="'CTF Events'"
          >
            <!-- List all available events in a dropdown menu -->
            <form enctype="multipart/form-data" @submit.prevent="savePurpose">
              <div v-if="selectedOption == 'events'">
                <b-form-select v-model="selected" class="mr-1">
                  <option v-for="event in events" :key="event.id" :value="event">{{ event.name }}</option>
                </b-form-select>
              </div>

              <!-- List all available technologies in a dropdown menu -->
              <div v-if="(selectedOption == 'techs') && (selected.name != null)">
                <b-form-select v-model="selectedToAdd" class="mr-1">
                  <option v-for="event in events" :key="event.id" :value="event">{{ event.name }}</option>
                </b-form-select>

                <b-button class="mr-1 mt-2" @click="addEvent()">Add</b-button>

                <!-- List all assigned technologies. -->
                <b-form-group class="mt-2" label="Assigned Events:">
                  <div v-for="assignment in assignments" :key="assignment.id" :value="assignment">
                    <tbody v-if="assignment.technology_id == selected.id">
                      <tr v-for="event in events" :key="event.id">
                        <td v-if="assignment.event_id == event.id">
                          {{event.name}}
                          <!-- Delete link/button. -->
                          <a href="#" @click="deleteItem(assignment.id)">Remove</a>
                        </td>
                      </tr>
                    </tbody>
                  </div>
                </b-form-group>
              </div>
            </form>
          </b-card>
        </b-col>
      </b-row>
    </div>
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
      events: [],
      assignments: [],
      model: {},
      selectedOption: null,
      selected: [],
      selectedToAdd: [],
      techStyle: "",
      eventStyle: "",
      test: []
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
      this.techs = await api.getManyREST("techs?sort=name");
      this.events = await api.getManyREST("events?sort=name");
      this.assignments = await api.getManyREST("eventTechnologies");
    },

    // Refresh assignemnt data from the database, independantly of total refresh.
    async refreshAssignments() {
      this.assignments = await api.getManyREST("eventTechnologies");
    },

    // Select option, technologies or ctf events.
    async chooseOption(option) {
      if (!option) {
        this.selectedOption = option;
        this.techStyle = "";
        this.eventStyle = "";
        this.selected = [];
        this.selectedToAdd = [];
      }
      if (!this.selectedOption) {
        this.refresh();
        this.refreshAssignments();
        this.selectedOption = option;
      }

      if (this.selectedOption == "techs") {
        this.techStyle = "2px solid #E43230";
      } else if (this.selectedOption == "events") {
        this.eventStyle = "2px solid #E43230";
      }
    },

    // Save form data (purposes) to database using API.
    async savePurpose() {
      if (this.model.id) {
        await api.updateREST("purposes", this.model.id, this.model);
      } else {
        this.model = await api.createREST("purposes", this.model);
      }
      this.model = {}; // reset form
      this.refreshPurposes();
    },

    // Save form data (techs) to database using API.
    async addTech() {
      if (this.selected.id != null && this.selectedToAdd.id != null) {
        this.model.event_id = this.selected.id;
        this.model.technology_id = this.selectedToAdd.id;

        // Test whether the technology assignment already excists.
        var test = await api.getManyREST(
          "eventTechnologies?technology_id=" +
            this.selectedToAdd.id +
            "&event_id=" +
            this.selected.id
        );
        if (test[0] == undefined) {
          await this.save();
          this.showModal("Technology added" + this.selectedToAdd.name);
        } else {
          this.showModal("This technology is already assigned.");
        }
      }
    },
    // Save form data (events) to database using API.
    async addEvent() {
      if (this.selected.id != null && this.selectedToAdd.id != null) {
        this.model.technology_id = this.selected.id;
        this.model.event_id = this.selectedToAdd.id;

        // Test whether the event assignment already excists.
        var test = await api.getManyREST(
          "eventTechnologies?technology_id=" +
            this.selected.id +
            "&event_id=" +
            this.selectedToAdd.id
        );
        if (test[0] == undefined) {
          await this.save();
          this.showModal("Event added" + this.selectedToAdd.name);
        } else {
          this.showModal("This event is already assigned.");
        }
      }
    },

    // Delete selected item from the database using API.
    async deleteItem(id) {
      await api.deleteREST("eventTechnologies", id);
      this.refreshAssignments();
    },

    // Save form data to database using API.
    async save() {
      this.model = await api.createREST("eventTechnologies", this.model);
      this.refreshAssignments();
      this.model = {};
    }
  }
};
</script>