const requestPromise = require('request-promise')
const request = require('request')

const BASE_URL = 'http://swapi.co/api'

// ASYNC
async function run() {
    try {
        const result = await requestPromise(`${BASE_URL}/people/1`)
        console.log('ASYNC function')
        console.log(JSON.parse(result))
        console.log('----')
    } catch(err) {
        console.log('Error async')
        console.log('----')
    } 
}

run()

// Promises
requestPromise(`${BASE_URL}/people/1`).then((data) => {
    console.log('Promises')
    console.log(JSON.parse(data))
    console.log('----')
}).catch(() => {
    console.log('Error promise')
    console.log('----')
})

// Callback
request(`${BASE_URL}/people/1`,{json : true}, (err, response, data) => {
    if(response.statusCode !== 200 || err) {
        console.log(`Error callback ${response.statusCode}`)
        console.log('----')

        return
    }
    console.log('Callback')
    console.log(data);
    console.log('----')
})