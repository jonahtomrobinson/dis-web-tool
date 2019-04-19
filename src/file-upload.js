// file-upload.js

import * as axios from 'axios';

const BASE_URL = 'http://localhost:8081/'

async function upload(formData) {
    let accessToken = await Vue.prototype.$auth.getAccessToken()
    const url = `${BASE_URL}/photos/upload`;
    return axios.post({
        url, 
        formData,
        headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        // get data
        .then(x => x.data)
        // add url field
        .then(x => x.map(img => Object.assign({},
            img, { url: `${BASE_URL}/images/${img.id}` })));
}

export { upload }