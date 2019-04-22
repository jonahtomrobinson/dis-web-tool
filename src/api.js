import Vue from 'vue'
import axios from 'axios'

// Setup for base axios client.
const client = axios.create({
    baseURL: 'http://localhost:8081/',
    json: true
})

export default {
    // Push the REST request to the server.
    async execute(method, resource, data) {
        let accessToken = await Vue.prototype.$auth.getAccessToken() // Inject the accessToken for each request.
        return client({
            method,
            url: resource,
            data,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        }).then(req => {
            return req.data
        })
    },

    // GET REST request for a single item.
    getManyREST(item) {
        return this.execute('get', '/' + item)
    },

    // GET REST request for many items.
    getSingleREST(item, id) {
        return this.execute('get', '/' + item + `/${id}`)
    },

    // POST REST request for a single item.
    createREST(item, data) {
        return this.execute('post', '/' + item, data)
    },

    // PUT REST request for a single item.
    updateREST(item, id, data) {
        return this.execute('put', '/' + item + `/${id}`, data)
    },

    // DELETE REST request for a single item.
    deleteREST(item, id) {
        return this.execute('delete', '/' + item + `/${id}`)
    },

}