<template>
  <div class="test">
    <div>
      <!-- Close component button. -->
      <b-button v-if="currentComponent" class="mr-1" @click="currentComponent = null">Close</b-button>

      <!-- Details or Compare component bind. -->
      <div
        v-cloak
        v-bind:selectedTechnology="selectedTechnology"
        v-bind:modal="false"
        v-bind:compareTech1="compareTech1"
        v-bind:compareTech2="compareTech2"
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
              <div class="col-xs-6 mr-2">
                <!-- Reset button. -->
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
                    <option :value="'purpose'">Purpose</option>
                  </b-form-select>
                </b-form-group>
              </div>

              <div class="col-xs-6">
                <b-form-group label="Value">
                  <div v-if="filterCriteria == 'purpose'">
                    <b-form-select v-model="filterValue">
                      <option
                        v-for="purpose in purposes"
                        :key="purpose.id"
                        :value="purpose.id"
                      >{{purpose.text}}</option>
                    </b-form-select>
                  </div>
                </b-form-group>
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
              <div class="col-xs-6 mr-2">
                <!-- Submit button. -->
                <b-button
                  v-if="compareTech1 && compareTech2"
                  class="mt-1"
                  v-on:click="compareTechs()"
                >Submit</b-button>
              </div>
            </div>

            <div class="row ml-1">
              <!-- Technology option 1 dropdown. -->
              <div class="col-xs-6 mr-2">
                <b-form-group label="Technology 1">
                  <b-form-select v-model="compareTech1">
                    <option v-for="tech in filteredTechs" :key="tech.id" :value="tech">{{tech.name}}</option>
                  </b-form-select>
                </b-form-group>
              </div>

              <div class="col-xs-6 mr-3 ml-3 pt-4">
                <p class="pt-3">VS</p>
              </div>

              <!-- Technology option 2 dropdown. -->
              <div class="col-xs-6 ml-2">
                <b-form-group label="Technology 2">
                  <b-form-select v-model="compareTech2">
                    <option v-for="tech in filteredTechs" :key="tech.id" :value="tech">{{tech.name}}</option>
                  </b-form-select>
                </b-form-group>
              </div>
            </div>
          </b-card>
        </div>
      </div>

      <!-- Display clickable technologies. -->
      <div v-if="currentComponent == null">
        <hr>
        <div v-if="loading">
          <p>Loading...</p>
        </div>
        <div v-else>
          <div class="row card-row">
            <div class="col-md-2 mb-3 mt-3" v-for="tech in filteredTechs" :key="tech.id">
              <b-card v-on:click="viewDetails(tech)" class="card-item">
                <img class="card-img smaller-image" :src="tech.logo" alt="No Logo">
                <div class="card-body">
                  <p class="card-title">{{tech.name}}</p>
                  <!--<p class="card-text"><span class="card-purpose"> {{tech.purpose}}</span></p>-->
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
import TechnologyDetails from "./TechnologyDetails";
import TechnologyCompare from "./TechnologyCompare";
export default {
  data() {
    return {
      loading: false,
      techs: [], // Stores technologies.
      purposes: [], // Stores purposes.
      filteredTechs: [], // Stores technologies filtered by input filter.
      currentComponent: null, // Component to display.
      selectedTechnology: {}, // Technology selected for details.
      filterCriteria: null, // Filter criteria.
      filterValue: null, // Filter value.
      compareTech1: null, // First technology to compare.
      compareTech2: null // Second technology to compare.
    };
  },
  watch: {
    filterValue: function() {
      this.filterTechs();
    },
    filterCriteria: function() {
      this.filterValue = null;
    }
  },
  async created() {
    this.refreshTechs();
  },
  methods: {
    // Refresh data from the database.
    async refreshTechs() {
      this.loading = true;
      this.filteredTechs = [];
      this.techs = await api.getManyREST("techs?sort=name");
      await this.filterTechs();
      await this.convertBlobs();
      this.purposes = await api.getManyREST("purposes?sort=text");
      await this.addPurposes();
      this.loading = false;
    },
    // Convert blobs/images objects from the database to a binary string for displaying.
    async convertBlobs() {
      for (var tech in this.filteredTechs) {
        if (this.filteredTechs[tech].logo != null) {
          var binary = "";
          var bytes = new Uint8Array(this.filteredTechs[tech].logo.data);
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          this.filteredTechs[tech].logo = binary;
        }
      }
    },
    // Filter the techs by the filter input.
    async filterTechs() {
      this.filteredTechs = [];
      this.compareTech1 = null;
      this.compareTech2 = null;

      if (this.filterCriteria == "purpose") {
        for (var tech in this.techs) {
          if (this.techs[tech].purpose_id == this.filterValue) {
            this.filteredTechs.push(this.techs[tech]);
          }
        }
      } else {
        this.filteredTechs = this.techs;
      }
    },
    // Assign purposes to each technology.
    async addPurposes() {
      for (var tech in this.techs) {
        for (var purpose in this.purposes) {
          if (this.techs[tech].purpose == this.purposes[purpose].purpose_id) {
            this.techs[tech].purpose = this.purposes[purpose].text;
          }
        }
      }
    },
    // Change component to TechnologyDetails.
    async viewDetails(tech) {
      this.selectedTechnology = tech;
      this.currentComponent = TechnologyDetails;
    },
    // Change component to TechnologyCompare.
    async compareTechs() {
      this.currentComponent = TechnologyCompare;
    }
  }
};
</script>