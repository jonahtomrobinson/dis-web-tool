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
              <th>Categories</th>
              <th>Source</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

            <!-- Table body -->  
          <tbody>
            <!--<b-alert :show="loading" variant="info">Loading...</b-alert>-->
            <tr v-for="event in events" :key="event.id">
              <td>{{ event.logo }}</td>
              <td>{{ event.name }}</td>
              <td>{{ event.style }}</td>
              <td>{{ event.date }}</td>
              <td>{{ event.location }}</td>
              <td>{{ event.num_of_users }}</td>
              <td>
              <div v-for="catEve in categoryEvents" :key="catEve">
                    <div v-for="cat in categories" :key="cat">
                        <p class="displayedCategory" v-if="catEve.category_id == cat.id && catEve.event_id == event.id">{{ cat.text }}</p>
                    </div>
                </div>
              </td>
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
            <!--<b-form-group label="Logo">
                <div class="dropbox">
                <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                    accept="image/*" class="input-file">
                    <p v-if="isInitial">
                    Drag your file(s) here to begin<br> or click to browse
                    </p>
                    <p v-if="isSaving">
                    Uploading {{ fileCount }} files...
                    </p>
                </div>
            </b-form-group>-->
            <b-form-group label="Name">
              <b-form-input type="text" v-model="model.name"></b-form-input>
            </b-form-group>
            <b-form-group label="Style">
                <b-form-select v-model="model.style">
                    <option>Jeopardy</option>
                    <option>Attack-Defence</option>
                    <option>Mixed</option>
                    <option>Other</option>
                </b-form-select>
            </b-form-group>
            <b-form-group label="Date">
              <b-form-input type="date" v-model="model.date"></b-form-input>
            </b-form-group>

            <b-form-group label="Location">
              <b-form-input v-model="model.location"></b-form-input>
            </b-form-group>

            <b-form-group label="Number of users">
              <b-form-input v-model="model.num_of_users"></b-form-input>
            </b-form-group>

            <b-form-group label="Challenge categories">
                <b-form-select v-model="selectedCategory">
                    <option v-for="category in categories" :key="category" :value="category">{{ category.text }}</option>
                </b-form-select>
                <b-button class="mr-1 mt-2 mb-2" @click="addCategory()">Add</b-button>
                <tbody>
                    <tr class= "new-categories" v-for="chosenCategory in chosenCategories" :key="chosenCategory">
                        {{ chosenCategory.text }}
                        <a href="#" @click="removeCategory()">Remove</a>
                        <!--<b-button class="mr-1" @click="removeCategory()">X</b-button>-->
                    </tr>
                </tbody>  
            </b-form-group>
            
            <b-form-group label="Source website">
              <b-form-input v-model="model.source"></b-form-input>
            </b-form-group>

            <b-form-group label="Additional info">
              <b-form-textarea rows="1" v-model="model.additional_info"></b-form-textarea>
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
import api from '@/api'
import { isString } from 'util';
export default {
  data () {
    return {
      loading: false,
      events: [],
      categories: [],
      categoryEvents: [],
      selectedCategory : null,
      chosenCategories : [],
      model: {}
    }
  },
  async created () {
    this.refreshCategories()
    this.refreshEvents()
  },
  methods: {
    async showModal(value){
        this.$modal.show('dialog', {
            text: value,
        })
    },
    /*async showModalConfirm(value){
        var result = false
        this.$modal.show('dialog', {
            text: value,
             buttons: [
                {
                title: 'Confirm',
                handler: () => {  $model.hide(dialog)},
                },
                {
                title: 'Cancel',
                //handler: () => { return false }
                }
             ]
        })
        return result
    },*/
    async getCatsForEachEvent(id){
        this.chosenCategories = []
        var event = []
        event = await api.getManyREST('categoryEvents')
        for (var e in event){
          if (event[e].event_id == id){
              this.chosenCategories.push(await api.getSingleREST('categories', event[e].category_id))
          }
        }
    },
    async addCategory(){
        if ((!this.chosenCategories.includes(this.selectedCategory)) && (this.selectedCategory != undefined)){
            this.chosenCategories.push(this.selectedCategory)

        }
    },
    async removeCategory(){
        this.chosenCategories.pop(this.selectedCategory)
    },

    
    async refreshEvents () {
      this.loading = true
      this.events = await api.getManyREST("events")
      this.loading = false
    },
    async refreshCategories () {
        // Event category assignment table.
        this.categoryEvents = await api.getManyREST("categoryEvents")
        
        // Input categories.
        this.categories = await api.getManyREST("categories")
    },

    // Edit event.
    async populateEventToEdit (event) {
      this.model = Object.assign({}, event)
      if (this.chosenCategories != []){
          this.chosenCategories = []
      }
      this.getCatsForEachEvent(this.model.id)
    },
    async saveCategoryEvents(){
        var eventId = this.model.id
        var model = {}
        for (var c in this.chosenCategories){
            model.category_id = this.chosenCategories[c].id
            model.event_id = eventId
            //alert(this.chosenCategories.length+"sdf "+model.category_id+ " | "+model.event_id)
            api.createREST("categoryEvents", model)
            model = {}
        }
    },
    async saveEvent () {
        if (this.model.id) {
            await api.updateREST("events", this.model.id,this.model)
            await this.deleteCategoryEvents(this.model.id)
            this.saveCategoryEvents()
        }
        else{
            this.model = await api.createREST("events",this.model)
            this.saveCategoryEvents()

            // Check new event has been added to the database.
            this.events = await api.getManyREST("events")
            if (this.events[this.events.length-1].id == this.model.id){
                this.showModal("Event added: "+this.model.name)
            }
            else{
                this.showModal("Failed to add: "+this.model.name);
            }
        }
        this.chosenCategories = []
        this.model = {} // reset form
        this.refreshCategories()
        this.refreshEvents()
    },
    async deleteEvent (id) {
      if (confirm('Are you sure you want to delete this event?')) {
        // if we are editing a event we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deleteREST('events', id)
        await this.refreshEvents()
      }
    },

    // TODO fix the edit categories to show correctly.
    async deleteCategoryEvents(eventId){
        this.categoryEvents = await api.getManyREST("categoryEvents")
        for (var ce in this.categoryEvents){
            if (this.categoryEvents[ce].event_id == eventId){
                await api.deleteREST('categoryEvents', this.categoryEvents[ce].id)
            }
        }
    },
  }
}
</script>