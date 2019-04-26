<template>
  <div class="test">
    <div>
      <!-- Close component button. -->
      <b-button v-if="currentComponent" class="mr-1" @click="currentComponent = null">Close</b-button>

      <!-- Details or Compare component bind. -->
      <div
        v-cloak
        v-bind:modal="false"
        v-bind:selectedEvent="selectedEvent"
        v-bind:compareEvent1="compareEvent1"
        v-bind:compareEvent2="compareEvent2"
        :is="currentComponent"
      ></div>

      <div v-if="!currentComponent" class="row card-row">
        <!-- Filter section. -->
        <div class="col-md-6 mb-3 mt-3">
          <b-card class="card-item-filter">
            <div class="row ml-1">
              <div class="col-xs-6 mr-2">
                <p class="card-title-header">Filter</p>
              </div>
              <!-- Reset button. -->
              <div class="col-xs-6 mr-2">
                <b-button
                  v-if="filterCriteria"
                  class="mr-1"
                  @click="filterCriteria = null; filterValue = null"
                >Reset</b-button>
              </div>
            </div>

            <div class="row ml-1">
              <div class="col-xs-6 mr-2">
                <b-form-group label="Criteria">
                  <b-form-select v-model="filterCriteria">
                    <option :value="'style'">Event Style</option>
                    <option :value="'categories'">Challenge Categories</option>
                    <option :value="'attendees'">Attendees</option>
                    <option :value="'years'">Year Ran</option>
                  </b-form-select>
                </b-form-group>
              </div>

              <div class="col-xs-6 mr-2">
                <b-form-group label="Value">
                  <div v-if="filterCriteria == 'style'">
                    <b-form-select v-model="filterValue">
                      <option :value="'Jeopardy'">Jeopardy</option>
                      <option :value="'Attack-Defence'">Attack-Defence</option>
                      <option :value="'Mixed'">Mixed</option>
                      <option :value="'Other'">Other</option>
                    </b-form-select>
                  </div>

                  <div v-if="filterCriteria == 'categories'">
                    <b-form-select v-model="filterValue">
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >{{category.text}}</option>
                    </b-form-select>
                  </div>

                  <div v-if="filterCriteria == 'attendees'">
                    <b-form-select v-model="filterStatus">
                      <option :value="'more'">more than</option>
                      <option :value="'less'">less than</option>
                    </b-form-select>
                  </div>

                  <div v-if="filterCriteria == 'years'">
                    <b-form-select v-model="filterValue">
                      <option
                        v-for="year in years"
                        :key="year.id"
                        :value="year"
                      >{{year}}</option>
                    </b-form-select>
                  </div>
                </b-form-group>
              </div>

              <div class="col-xs-6">
                <div v-if="filterCriteria == 'attendees'">
                  <b-form-group label="*">
                    <b-form-input type="text" v-model="filterValue"></b-form-input>
                  </b-form-group>
                </div>
              </div>
            </div>
          </b-card>
        </div>

        <!-- Compare section. -->
        <div class="col-md-6 mb-3 mt-3">
          <b-card class="card-item-filter">
            <div class="row ml-1">
              <div class="col-xs-6 mr-2">
                <p class="card-title-header">Compare</p>
              </div>
              <!-- Submit button -->
              <div class="col-xs-6 mr-2">
                <b-button
                  v-if="compareEvent1 && compareEvent2"
                  class="mt-1"
                  v-on:click="compareTechs()"
                >Submit</b-button>
              </div>
            </div>
            <div class="row ml-1">
              <!-- Event option 1 dropdown. -->
              <div class="col-xs-6 mr-2">
                <b-form-group label="Event 1">
                  <b-form-select v-model="compareEvent1">
                    <option
                      v-for="event in filteredEvents"
                      :key="event.id"
                      :value="event"
                    >{{event.name}}</option>
                  </b-form-select>
                </b-form-group>
              </div>

              <div class="col-xs-6 mr-3 ml-3 pt-4">
                <p class="pt-3">VS</p>
              </div>

              <!-- Event option 2 dropdown. -->
              <div class="col-xs-6 ml-2">
                <b-form-group label="Event 2">
                  <b-form-select v-model="compareEvent2">
                    <option
                      v-for="event in filteredEvents"
                      :key="event.id"
                      :value="event"
                    >{{event.name}}</option>
                  </b-form-select>
                </b-form-group>
              </div>
            </div>
          </b-card>
        </div>
      </div>

      <!-- Display clickable events. -->
      <div v-if="currentComponent == null">
        <hr>
        <div v-if="loading">
          <p>Loading...</p>
        </div>
        <div v-else>
          <div class="row card-row">
            <div class="col-md-2 mb-3 mt-3" v-for="event in filteredEvents" :key="event.id">
              <b-card v-on:click="viewDetails(event)" class="card-item">
                <img class="card-img" :height="150" :src="event.logo" alt="card image collar">
                <div class="card-body">
                  <p class="card-title">{{event.name}}</p>
                </div>
              </b-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import API for server access.
import api from "@/api";
// Import components.
import CtfEventDetails from "./CtfEventDetails";
import CtfEventCompare from "./CtfEventCompare";
export default {
  data() {
    return {
      loading: false,
      events: [], // Stores events.
      categories: [], // Stores categories.
      categoryEvents: [], // Stores categoryEvents.
      filteredEvents: [], // Stores events filtered by input filter.
      currentComponent: null, // Component to display.
      selectedEvent: {}, // Event selected for details.
      filterCriteria: null, // Filter criteria.
      filterStatus: null, // Filter status.
      filterValue: null, // Filter value.
      compareEvent1: null, // First event to compare.
      compareEvent2: null, // Second event to compare.
      years: []
    };
  },
  watch: {
    filterValue: function() {
      this.filterEvents();
    },
    filterCriteria: function() {
      this.filterValue = null;
      this.filterStatus = null;
    }
  },
  async created() {
    this.refresh();
  },
  methods: {
    // Refresh data from the database.
    async refresh() {
      this.loading = true;
      this.filteredEvents = [];
      this.events = await api.getManyREST("events?sort=name");
      await this.filterEvents();
      await this.convertBlobs();
      this.categories = await api.getManyREST("categories?sort=text");
      this.categoryEvents = await api.getManyREST("categoryEvents");
      await this.getYears()
      this.loading = false;
    },
    // Convert blobs/images objects from the database to a binary string for displaying.
    async convertBlobs() {
      for (var event in this.filteredEvents) {
        if (this.filteredEvents[event].logo != null) {
          var binary = "";
          var bytes = new Uint8Array(this.filteredEvents[event].logo.data);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          this.filteredEvents[event].logo = binary;
        }
      }
    },
    async getYears(){
        for (var event in this.events){
            var x = new Date(this.events[event].date)
            if (!this.years.includes(x.getFullYear())){
                this.years.push(x.getFullYear())
            }
        }
        this.years.sort()
    },
    // Filter the events by the filter input.
    async filterEvents() {
      this.filteredEvents = [];
      this.compareEvent1 = null;
      this.compareEvent2 = null;

      if (this.filterCriteria == "style") {
        for (var event in this.events) {
          if (this.events[event].style == this.filterValue) {
            this.filteredEvents.push(this.events[event]);
          }
        }
      } 
      else if (this.filterCriteria == "categories") {
        for (var e in this.categoryEvents) {
          if (this.categoryEvents[e].category_id == this.filterValue) {
            for (var event in this.events) {
              if (this.events[event].id == this.categoryEvents[e].event_id) {
                this.filteredEvents.push(this.events[event]);
              }
            }
          }
        }
      } 
      else if (this.filterCriteria == "attendees") {
        if (this.filterStatus == "more") {
          for (var event in this.events) {
            if (this.events[event].num_of_users > this.filterValue) {
              this.filteredEvents.push(this.events[event]);
            }
          }
        } 
        else if (this.filterStatus == "less") {
          for (var event in this.events) {
            if (this.events[event].num_of_users < this.filterValue) {
              this.filteredEvents.push(this.events[event]);
            }
          }
        }
      } 
      else if (this.filterCriteria == "years") {
        for (var event in this.events) {
        var x = new Date(this.events[event].date)
          if (x.getFullYear() == this.filterValue) {
            this.filteredEvents.push(this.events[event]);
          }
        }
      }
      else {
        this.filteredEvents = this.events;
      }
    },
    // Change component to CtfEventDetails.
    async viewDetails(event) {
      this.selectedEvent = event;
      this.currentComponent = CtfEventDetails;
    },
    // Change component to CtfEventCompare.
    async compareTechs() {
      this.currentComponent = CtfEventCompare;
    }
  }
};
</script>