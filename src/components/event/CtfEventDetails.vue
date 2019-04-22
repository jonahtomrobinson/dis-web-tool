<template>
  <div class="test">
    <div v-if="loading">
      <p class="loading">Loading...</p>
    </div>
    <div v-else>
      <div class="row item-row">
        <div class="col-md mb-3 mt-3">
          <b-card class="card-item-selected">
            <div class="card-body">
              <div class="row">
                <div class="col-xs-6 mr-2">
                  <a :href="selectedEvent.source">
                    <img
                      class="card-img-selected smaller-image"
                      :src="selectedEvent.logo"
                      alt="card image collar"
                    >
                  </a>
                </div>
                <div class="col-xs-6 ml-4 mr-5 pr-4">
                  <p class="card-title-selected" href="selectedEvent.source">{{selectedEvent.name}}</p>
                  <p class="card-text-selected">{{selectedEvent.style}}</p>
                  <p class="card-text-selected">{{selectedEvent.date}} | {{selectedEvent.location}}</p>
                  <p class="card-text-selected">{{selectedEvent.num_of_users}} users</p>
                  <a
                    v-if="selectedEvent.source != null"
                    class="card-text-selected"
                    :href="selectedEvent.source"
                  >{{selectedEvent.source}}</a>
                  <p
                    v-if="selectedEvent.source == null"
                    class="card-text-selected"
                  >No available website link</p>
                </div>
                <div class="col-xs-6">
                  <p class="card-title-sub">Additional information</p>
                  <b-card class="card-item-small">
                    <p class="card-text-selected">{{selectedEvent.additional_info}}</p>
                  </b-card>
                </div>
              </div>

              <hr>
              <p class="card-title-header">Categories {{chosenCategories.length}}</p>
              <div class="row item-row ml-1">
                <div v-for="category in chosenCategories" :key="category.id">
                  <p class="mt-2 card-text-selected">
                    <span class="card-categories-selected">{{category.text}}</span>
                  </p>
                </div>
              </div>

              <hr>
              <p class="card-title-header">Technologies {{assignTechs.length}}</p>
              <div
                v-if="modal == false"
                style="overflow-y: scroll; height:232px;"
                class="row item-row"
              >
                <div
                  class="col-md-4 mb-3 mt-3"
                  v-for="assignTech in assignTechs"
                  :key="assignTech.id"
                >
                  <b-card class="card-item-small">
                    <div class="row">
                      <div class="col-xs-6">
                        <img
                          class="card-img-small smaller-image"
                          :src="assignTech.logo"
                          alt="No logo"
                        >
                      </div>
                      <div class="col-xs-6 ml-3 mt-3">
                        <p class="card-title-small">{{assignTech.name}}</p>
                        <b-button class="mr-1" @click="showModal(assignTech.id)">See Details</b-button>
                      </div>
                    </div>
                  </b-card>
                </div>
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </div>
    <modals-container/>
  </div>
</template>

<script>
import api from "@/api";
import TechnologyDetails from "@/components/technology/TechnologyDetails";
export default {
  data() {
    return {
      loading: false,
      events: [],
      assignments: [],
      techs: [],
      categoryEvents: [],
      categories: [],
      chosenCategories: [],
      assignTechs: [],
      bestScalibility: 0,
      assignedCategories: {}
    };
  },
  props: ["selectedEvent", "modal"],
  watch: {
    selectedEvent: function() {
      this.refresh();
    }
  },
  async created() {
    this.refresh();
  },
  methods: {
    async refresh() {
      this.loading = true;
      this.events = await api.getManyREST("events");
      this.techs = await api.getManyREST("techs");
      this.assignments = await api.getManyREST("eventTechnologies");
      this.categoryEvents = await api.getManyREST("categoryEvents");
      this.categories = await api.getManyREST("categories");
      await this.getTechs();
      await this.convertBlobs();
      await this.getCategories(this.selectedEvent.id);
      this.loading = false;
    },
    // Convert blobs/images objects from the database to a binary string for displaying.
    async convertBlobs() {
      for (var tech in this.assignTechs) {
        if (this.assignTechs[tech].logo != null) {
          var binary = "";
          var bytes = new Uint8Array(this.assignTechs[tech].logo.data);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          this.assignTechs[tech].logo = binary;
        }
      }
    },
    async getCategories(id) {
      for (var e in this.categoryEvents) {
        if (this.categoryEvents[e].event_id == id) {
          for (var category in this.categories) {
            if (
              this.categories[category].id == this.categoryEvents[e].category_id
            ) {
              this.chosenCategories.push(this.categories[category]);
            }
          }
        }
      }
    },
    async getTechs() {
      this.assignTechs = [];

      for (var as in this.assignments) {
        if (this.assignments[as].event_id == this.selectedEvent.id) {
          for (var ev in this.techs) {
            if (this.techs[ev].id == this.assignments[as].technology_id) {
              this.assignTechs.push(this.techs[ev]);
            }
          }
        }
      }
    },
    async showModal(id) {
      var x = await api.getSingleREST("techs", id);
      this.$modal.show(
        TechnologyDetails,
        {
          selectedTechnology: x,
          modal: true
        },
        {
          width: 750,
          height: 640
        }
      );
      //this.$modal.hide;
      //this.modal = false
    }
  }
};
</script>