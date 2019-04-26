<template>
  <div class="test">
    <div v-if="!loading">
      <p class="loading">Loading...</p>
    </div>
    <div v-else>
      <div class="row item-row">
        <!-- Event 1 column. -->
        <div class="col-md-6 mb-3 mt-3">
          <b-card class="card-item-selected">
            <div class="card-body">
              <!-- Event 1 details. -->
              <div class="row">
                <b-card class="card-compare-clear">
                  <div class="col-xs-6 mr-2">
                    <a :href="compareEvent1.source">
                      <img
                        class="card-img-compare"
                        :src="compareEvent1.logo"
                        alt="card image collar"
                      >
                    </a>
                  </div>
                </b-card>
              </div>
              <hr>

              <div class="row">
                <div class="col-xs-6 ml-4 mr-5 pr-1" style="max-width: 250px">
                  <p class="card-title-selected" href="compareEvent1.source">{{compareEvent1.name}}</p>
                  <p class="card-text-selected">{{compareEvent1.style}}</p>
                  <p class="card-text-selected">{{compareEvent1.date}} | {{compareEvent1.location}}</p>
                  <p class="card-text-selected">{{compareEvent1.num_of_users}} attendees</p>
                  <a
                    v-if="compareEvent1.source != null"
                    class="card-text-selected"
                    :href="compareEvent1.source"
                  >{{compareEvent1.source}}</a>
                  <p
                    v-if="compareEvent1.source == null"
                    class="card-text-selected"
                  >No available website link</p>
                </div>
                <div class="col-xs-6">
                  <p class="card-title-sub">Additional information</p>
                  <b-card class="card-item-small">
                    <p class="card-text-selected">{{compareEvent1.additional_info}}</p>
                  </b-card>
                </div>
              </div>

              <!-- Categories assigned to event 1. -->
              <hr>
              <p class="card-title-header">Categories {{event1chosenCategories.length}}</p>
              <div class="row item-row ml-1">
                <div v-for="category in event1chosenCategories" :key="category.id">
                  <p class="mt-2 card-text-selected">
                    <span class="card-categories-selected">{{category.text}}</span>
                  </p>
                </div>
              </div>

              <!-- Technologies assigned to event 1. -->
              <hr>
              <p class="card-title-header">Technologies {{event1assignTechs.length}}</p>
              <div style="overflow-y: scroll; height:232px;" class="row item-row">
                <div
                  class="col-md-4 mb-3 mt-3"
                  v-for="assignTech in event1assignTechs"
                  :key="assignTech.id"
                >
                  <b-card class="card-item-compare">
                    <img class="card-img-compare smaller-image" :src="assignTech.logo" alt>
                    <p class="card-title-compare">{{assignTech.name}}</p>
                  </b-card>
                </div>
              </div>
            </div>
          </b-card>
        </div>

        <!-- Event 2 column. -->
        <div class="col-md-6 mb-3 mt-3">
          <b-card class="card-item-selected">
            <div class="card-body">
              <!-- Event 2 details. -->
              <div class="row">
                <b-card class="card-compare-clear">
                  <div class="col-xs-6 mr-2">
                    <a :href="compareEvent2.source">
                      <img
                        class="card-img-compare"
                        :src="compareEvent2.logo"
                        alt="card image collar"
                      >
                    </a>
                  </div>
                </b-card>
              </div>
              <hr>

              <div class="row">
                <!-- Event 2 details. -->
                <div class="col-xs-6 ml-4 mr-5 pr-1" style="max-width: 250px">
                  <p class="card-title-selected" href="compareEvent2.source">{{compareEvent2.name}}</p>
                  <p class="card-text-selected">{{compareEvent2.style}}</p>
                  <p class="card-text-selected">{{compareEvent2.date}} | {{compareEvent2.location}}</p>
                  <p class="card-text-selected">{{compareEvent2.num_of_users}} attendees</p>
                  <a
                    v-if="compareEvent2.source != null"
                    class="card-text-selected"
                    :href="compareEvent2.source"
                  >{{compareEvent2.source}}</a>
                  <p
                    v-if="compareEvent2.source == null"
                    class="card-text-selected"
                  >No available website link</p>
                </div>
                <div class="col-xs-6">
                  <p class="card-title-sub">Additional information</p>
                  <b-card class="card-item-small">
                    <p class="card-text-selected">{{compareEvent2.additional_info}}</p>
                  </b-card>
                </div>
              </div>

              <!-- Categories assigned to event 2. -->
              <hr>
              <p class="card-title-header">Categories {{event2chosenCategories.length}}</p>
              <div class="row item-row ml-1">
                <div v-for="category in event2chosenCategories" :key="category.id">
                  <p class="mt-2 card-text-selected">
                    <span class="card-categories-selected">{{category.text}}</span>
                  </p>
                </div>
              </div>

              <!-- Technologies assigned to event 2. -->
              <hr>
              <p class="card-title-header">Technologies {{event2assignTechs.length}}</p>
              <div style="overflow-y: scroll; height:232px;" class="row item-row">
                <div
                  class="col-md-4 mb-3 mt-3"
                  v-for="assignTech in event2assignTechs"
                  :key="assignTech.id"
                >
                  <b-card class="card-item-compare">
                    <img class="card-img-compare smaller-image" :src="assignTech.logo" alt>
                    <p class="card-title-compare">{{assignTech.name}}</p>
                  </b-card>
                </div>
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import API for server access.
import api from "@/api";
export default {
  data() {
    return {
      loading: false,
      techs: [], // Stores technologies.
      assignments: [], // Stores eventTechnology assignments.
      events: [], // Stores events.
      categories: [], // Stores categories.
      categoryEvents: [], // Stores categoryEvent assignments.
      event1chosenCategories: [], // Stores the assigned categories for event 1.
      event1assignTechs: [], // Stores the assigned technologies for event 1.
      event2chosenCategories: [], // Stores the assigned categories for event 2.
      event2assignTechs: [] // Stores the assigned technologies for event 2.
    };
  },
  // Props containing the passed event objects to compare.
  props: ["compareEvent1", "compareEvent2"],
  watch: {
    compareEvent1: function() {
      this.refresh();
    }
  },
  async created() {
    this.refresh();
  },
  methods: {
    // Refresh data from the database.
    async refresh() {
      this.loading = false;
      this.techs = await api.getManyREST("techs");
      this.events = await api.getManyREST("events");
      this.assignments = await api.getManyREST("eventTechnologies");
      this.categoryEvents = await api.getManyREST("categoryEvents");
      this.categories = await api.getManyREST("categories");
      this.convertBlobs();
      this.chosenCategories = [];
      await this.getCategories();
      await this.getTechs();
      this.loading = true;
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
    // GET assigned categories from the database server using the API.
    async getCategories(id, event) {
      for (var e in this.categoryEvents) {
        if (this.categoryEvents[e].event_id == this.compareEvent1.id) {
          for (var category in this.categories) {
            if (
              this.categories[category].id == this.categoryEvents[e].category_id
            ) {
              this.event1chosenCategories.push(this.categories[category]);
            }
          }
        }

        if (this.categoryEvents[e].event_id == this.compareEvent2.id) {
          for (var category in this.categories) {
            if (
              this.categories[category].id == this.categoryEvents[e].category_id
            ) {
              this.event2chosenCategories.push(this.categories[category]);
            }
          }
        }
      }
    },
    // GET assigned technologies from the database server using the API.
    async getTechs() {
      this.event1assignTechs = [];
      this.event2assignTechs = [];

      for (var as in this.assignments) {
        for (var t in this.techs) {
          if (this.assignments[as].event_id == this.compareEvent1.id) {
            if (this.techs[t].id == this.assignments[as].technology_id) {
              this.event1assignTechs.push(this.techs[t]);
            }
          }
          if (this.assignments[as].event_id == this.compareEvent2.id) {
            if (this.techs[t].id == this.assignments[as].technology_id) {
              this.event2assignTechs.push(this.techs[t]);
            }
          }
        }
      }
    }
  }
};
</script>