<template>
  <div class="test">
    <div>
 
        <b-button v-if="currentComponent" class="mr-1" @click="currentComponent = null">Close</b-button>

        <div v-cloak v-bind:selectedTechnology="selectedTechnology"  v-bind:compareTech1="compareTech1" v-bind:compareTech2="compareTech2" :is="currentComponent"></div>
        
        <div v-if="!currentComponent" class="row card-row">
            <div class="col-md-4 mb-3 mt-3">
                <b-card class="card-item-filter">
                    <div class="row ml-1">
                        <div class="col-xs-6 mr-2">
                            <p class="card-title-header">Filter</p>
                        </div>
                        <div class="col-xs-6 mr-2">
                            <b-button v-if="filterCriteria" class="mr-1" @click="filterCriteria = null; filterValue = null">Reset</b-button>
                        </div>
                    </div>
                        <div class="row ml-1">
                            <div class="col-xs-6 mr-2">
                                <b-form-group label="Criteria">
                                    <!--<b-form-select v-model="filter.criteria">
                                        <option :value="'type'">Event Type</option>
                                        <option :value="'purpose'">Purpose</option>
                                        <option :value="2">Other</option>
                                    </b-form-select>-->
                                    <b-form-select v-model="filterCriteria">
                                        <option :value="'purpose'">Purpose</option>
                                        <!--<option :value="'cost'">Cost less than</option>-->
                                    </b-form-select>
                                </b-form-group>
                            </div>

                            <div class="col-xs-6">
                                <b-form-group label="Value">
                                    <!--<div v-if="filter.criteria == 'type'">
                                        <b-form-select v-model="filter.type">
                                            <option :value="'Jeopardy'">Jeopardy</option>
                                            <option :value="'Attack-Defence'">Attack-Defence</option>
                                            <option :value="'Mixed'">Mixed</option>
                                            <option :value="'Other'">Other</option>
                                        </b-form-select>
                                    </div>-->

                                    <div v-if="filterCriteria == 'purpose'">
                                        <b-form-select v-model="filterValue">
                                            <option v-for="purpose in purposes" :key="purpose.id" :value="purpose.id">{{purpose.text}}</option>
                                        </b-form-select>
                                    </div>

                                    <!--<div v-if="filterCriteria == 'cost'">
                                        <b-form-select v-model="filterValue">
                                            <option v-for="purpose in purposes" :key="purpose.id" :value="purpose.id">{{purpose.text}}</option>
                                        </b-form-select>
                                        <b-form-input type="text" v-model="filterValue"></b-form-input>
                                    </div>-->

                                </b-form-group>
                            </div>
                        </div>
                </b-card>
            </div>

            <div class="col-md-4 mb-3 mt-3">
                <b-card class="card-item-filter">
                        <p class="card-title-header">Compare</p>
                        <div class="row ml-1">

                            <div class="col-xs-6 mr-2">
                                <b-form-group label="Technology 1">
                                    <b-form-select v-model="compareTech1" >
                                        <option  v-for="tech in filteredTechs" :key="tech.id" :value="tech">{{tech.name}}</option>
                                    </b-form-select>
                                </b-form-group>
                            </div>

                            <div class="col-xs-6 mr-3 ml-3 pt-4">
                                    <p class="pt-3">VS</p>
                            </div>

                            <div class="col-xs-6 ml-2">
                                <b-form-group label="Technology 2">
                                    <b-form-select v-model="compareTech2" >
                                        <option  v-for="tech in filteredTechs" :key="tech.id" :value="tech">{{tech.name}}</option>
                                    </b-form-select>
                                </b-form-group>
                            </div>

                            <div class="col-xs-6 mr-3 ml-3 pt-4">
                                    <b-button v-if="compareTech1 && compareTech2" class="mt-1" v-on:click="compareTechs()">Submit</b-button>
                            </div>
                        </div>
                </b-card>  
            </div>
        </div>

        <div v-if="currentComponent == null">
            <hr>
            <div class="row card-row">
                <div class="col-md-2 mb-3 mt-3" v-for="tech in filteredTechs" :key="tech.id">
                    <b-card v-on:click="viewDetails(tech)" class="card-item">
                        <img class="card-img" src="/static/img/icons/apple-touch-icon-180x180.png" alt="card image collar">
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
</template>

<script>
import api from '@/api'
import TechnologyDetails from '@/components/TechnologyDetails'
import TechnologyCompare from '@/components/TechnologyCompare'
export default {
  data () {
    return {
      loading: false,
      techs: [],
      purposes: [],
      filteredTechs: [],
      currentComponent: null,
      selectedTechnology: {},
      filterCriteria: null,
      filterValue : null,
      compareTech1: null,
      compareTech2: null
    }
  },
   watch: {
      filterValue : function() {
        this.filterTechs()
      },
      filterCriteria : function(){
          this.filterValue = null
      }
  },
  async created () {
    this.refreshTechs()
  },
  methods: {
    async filterTechs(){
        this.filteredTechs = []
        this.compareTech1 = null
        this.compareTech2 = null
        /*else if (this.filter.criteria == "type"){
            for (var tech in this.techs){
                if (this.techs[tech].type == this.filter.type){
                    this.filteredTechs.push(this.techs[tech])
                }
            }
        }*/
        if (this.filterCriteria == "purpose"){
            for (var tech in this.techs){
                if (this.techs[tech].purpose_id == this.filterValue){
                    this.filteredTechs.push(this.techs[tech])
                }
            }
        }
        else{
            this.filteredTechs = this.techs
        }
        
    },
    async refreshTechs () {
        this.loading = true
        this.filteredTechs = []
        this.techs = await api.getManyREST("techs")
        await this.filterTechs()
        this.purposes = await api.getManyREST("purposes")
        await this.addPurposes();
        this.loading = false
    },
    async addPurposes(){
        for (var tech in this.techs){
            this.techs[tech].purpose = (await api.getSingleREST("purposes", this.techs[tech].purpose_id)).text
        }
    },
    async viewDetails(tech){
        if (this.loading == false){
        this.selectedTechnology = tech
        this.currentComponent = TechnologyDetails
        }
    },
    async compareTechs(){
        this.currentComponent = TechnologyCompare
    }
  }
}
</script>