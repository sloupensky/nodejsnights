const requestPromise = require('request-promise')
const request = require('request')

const BASE_URL = 'http://swapi.co/api'

// ASYNC
async function run() {
    try {
        const result = await requestPromise(`${BASE_URL}/people/1`)
        const resultObj = JSON.parse(result)
        console.log(resultObj)

        for(vehicleUrl of resultObj.vehicles) {
            const vehicle = await requestPromise(vehicleUrl)
            
            console.log('ASYNC function')
            console.log(JSON.parse(vehicle)) 
            console.log('----')
        }
    } catch(err) {
        console.log('Error async')
        console.log(err)
        console.log('----')
    } 
}

run()

// Promises
requestPromise(`${BASE_URL}/people/1`).then((data) => {
    const resultObj = JSON.parse(data)

    Promise.all(resultObj.vehicles.map(url => requestPromise(url))).then(data => {
        console.log('Promises')
        for(vehicle of data) {
            console.log(JSON.parse(vehicle))
        }
        console.log('----')
    })
}).catch((err) => {
    console.log('Error promise')
    console.log(err)
    console.log('----')
})

// Callback
request(`${BASE_URL}/people/1`,{json : true}, (err, response, result) => {
    if(response.statusCode !== 200 || err) {
        console.log(`Error callback ${response.statusCode}`)
        console.log('----')

        return
    }

    for (vehicleUrl of result.vehicles) {
        request(vehicleUrl,{json : true}, (err, response, result) => {
            if(response.statusCode !== 200 || err) {
                console.log(`Error callback ${response.statusCode}`)

                return
            }

            console.log('Callback')
            console.log(result)
            console.log('----')
        })
    }
})