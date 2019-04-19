<template>
<div class="mt-4">
    <div class="assign-row-outer">
        
        <b-row class="assign-row">
            <h1 v-if="!selectedOption">Please select an option</h1>
        </b-row>

        <b-row class="assign-row pb-3">
            <b-button v-if="selectedOption" class="mr-1" @click="chooseOption(null)">Reset</b-button>
        </b-row >

        <b-row class="assign-row">

        <b-col lg="3">
            <b-card :style="{ border: techStyle}" v-on:click="chooseOption('techs')" :class="{ 'assign-item':  selectedOption == null}" :title="'Technologies'">
            <form enctype="multipart/form-data" @submit.prevent="savePurpose">
                <div v-if="selectedOption == 'techs'">
                    <b-form-select v-model="selected" class="mr-1" >
                        <option v-for="tech in techs" :key="tech.id" :value="tech">{{ tech.name }}</option>
                    </b-form-select>
                    <!--<b-button class="mr-1 mt-2" @click="addTech()">Add</b-button>-->
                </div>
                <div v-if="(selectedOption == 'events') && (selected.name != null)">

                    <b-form-select v-model="selectedToAdd" class="mr-1" >
                        <option v-for="tech in techs" :key="tech.id" :value="tech">{{ tech.name }}</option>
                    </b-form-select>

                    <b-button class="mr-1 mt-2" @click="addTech()">Add</b-button>

                    <b-form-group class="mt-2" label="Assigned Technologies:">
                            <div v-for="assignment in assignments" :key="assignment.id" :value="assignment">
                                <tbody v-if="assignment.event_id == selected.id">
                                    <tr v-for="tech in techs" :key="tech.id">
                                        <td v-if="assignment.technology_id == tech.id">
                                            {{tech.name}}
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

        <b-col lg="3">
            <b-card :style="{ border: eventStyle}" v-on:click="chooseOption('events')" :class="{ 'assign-item':  selectedOption == null}" :title="'CTF Events'">
            <form enctype="multipart/form-data" @submit.prevent="savePurpose">
                <div v-if="selectedOption == 'events'">
                    <b-form-select v-model="selected" class="mr-1" >
                        <option v-for="event in events" :key="event.id" :value="event">{{ event.name }}</option>
                    </b-form-select>
                    <!--<b-button class="mr-1 mt-2" @click="addTech()">Add</b-button>-->
                </div>
                <div v-if="(selectedOption == 'techs') && (selected.name != null)">

                    <b-form-select v-model="selectedToAdd" class="mr-1" >
                        <option v-for="event in events" :key="event.id" :value="event">{{ event.name }}</option>
                    </b-form-select>

                    <b-button class="mr-1 mt-2" @click="addEvent()">Add</b-button>

                    <b-form-group class="mt-2" label="Assigned Events:">
                        <div v-for="assignment in assignments" :key="assignment.id" :value="assignment">
                            <tbody v-if="assignment.technology_id == selected.id">
                                <tr v-for="event in events" :key="event.id">
                                    <td v-if="assignment.event_id == event.id">
                                        {{event.name}}
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
import api from '@/api'
export default {
  data () {
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
    }
  },
  async created () {
    this.refresh ()
  },
  methods: {
    async showModal(value){
        this.$modal.show('dialog', {
            text: value,
        })
    },  
    async refresh () {
      this.techs = await api.getManyREST("techs")
      this.events = await api.getManyREST("events")
      this.assignments = await api.getManyREST("eventTechnologies")
    },
    async refreshAssignments (){
        this.assignments = await api.getManyREST("eventTechnologies")
    },
    async chooseOption (option){
        if (!option){
            this.selectedOption = option
            this.techStyle = ""
            this.eventStyle = ""
            this.selected = []
            this.selectedToAdd = []
        }
        if (!this.selectedOption){
            this.refresh()
            this.refreshAssignments()
            this.selectedOption = option
        }

        if (this.selectedOption == "techs"){
            this.techStyle = "2px solid #E43230"
        }
        else if (this.selectedOption == "events"){
            this.eventStyle = "2px solid #E43230"
        }
    },
    async savePurpose () {
        if (this.model.id) {
            await api.updateREST("purposes",this.model.id,this.model)
        }
        else{
            this.model = await api.createREST("purposes", this.model)

        }
        this.model = {} // reset form
        this.refreshPurposes()
    },
    async addTech(){
        if((this.selected.id != null) && (this.selectedToAdd.id != null)){
            this.model.event_id = this.selected.id
            this.model.technology_id = this.selectedToAdd.id

            // Test whether the technology assignment already excists.
            var test = await api.getManyREST("eventTechnologies?technology_id="+this.selectedToAdd.id+"&event_id="+this.selected.id)
            if (test[0] == undefined){
                await this.save()
            }
            else{
                this.showModal("This technology is already assigned.")
            }
        }
    },
    async addEvent(){
        if((this.selected.id != null) && (this.selectedToAdd.id != null)){
            this.model.technology_id = this.selected.id
            this.model.event_id = this.selectedToAdd.id

            // Test whether the event assignment already excists.
            var test = await api.getManyREST("eventTechnologies?technology_id="+this.selected.id+"&event_id="+this.selectedToAdd.id)
            if (test[0] == undefined){
                await this.save()
            }
            else{
                this.showModal("This event is already assigned.")
            }
        }
    },
    async deleteItem(id){
        await api.deleteREST('eventTechnologies', id)
        this.refreshAssignments()
    },
    async save(){
        this.model = await api.createREST("eventTechnologies", this.model)
        this.refreshAssignments()
        this.model = {}
    }
  }
}
</script>

<!--<style>
#assign-item-technology{
    border: var(--techStyle) !important;
}
</style>-->