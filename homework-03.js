'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const JsonSchema = require('jsonschema').Validator
const dogs = require('./dogs.json')

const app = new Koa()
const router = new Router()
const validator = new JsonSchema()

const dogCreateSchema = { 
    type : "Object",
    properties : {
        id : {type: "number"},
        name : {type: "string"},
        race : {type: "string"}
    },
    required : ['id', 'name', 'race'],
    additionalProperties: false
}

const dogUpdateSchema = { 
    type : "Object",
    properties : {
        name : {type: "string"},
        race : {type: "string"}
    },
    additionalProperties: false
} 

router
  .get('/', ctx => {
    ctx.status = 200
    ctx.body = 'Allowed methods /dogs, /dogs/{id}'
  })
  .get('/dogs', ctx => {
    ctx.status = 200
    ctx.body = dogs
  })
  .get('/dogs/:id', ctx => {
    const dog = dogs.find(obj => obj.id === parseInt(ctx.params.id))

    if(dog) {
        ctx.status = 200
        ctx.body = dog
        return
    }

    ctx.body = `Dog with id: ${ctx.params.id} doesnt exist.`
    ctx.status = 404
  })
  .post('/dogs', ctx => { 
    const duplicity = dogs.find(obj => obj.id === parseInt(ctx.request.body.id))

    if(duplicity) {
        ctx.status = 409
        ctx.body = 'Dog with this id already exists. You cannot rewrite this dog.'

        return
    }

    if(!validator.validate(ctx.request.body, dogCreateSchema).valid) {
        ctx.status = 400
        ctx.body = 'You cannot insert invalid dog'

        return
    }

    dogs.push(ctx.request.body)

    ctx.body = ctx.request.body
    ctx.status = 201

    console.log(dogs)
  })
  .put('/dogs/:id', ctx => {
    let dog = dogs.find(obj => obj.id === parseInt(ctx.params.id))
    const updateData = ctx.request.body 

    if(dog) {
        if(!validator.validate(ctx.request.body, dogUpdateSchema).valid) {
            ctx.status = 400
            ctx.body = 'You cannot insert invalid dog'

            return
        }

        dog = Object.assign(dog, updateData) 
        
        ctx.status = 200
        ctx.body = dog

        console.log(dogs)
        return
    }

    ctx.body = `Dog with id: ${ctx.params.id} doesnt exist.`
    ctx.status = 404
  })
  .delete('/dogs/:id', ctx => {
    let dogIndex = dogs.findIndex(obj => obj.id === parseInt(ctx.params.id)) 

    if(Number.isInteger(dogIndex)) { 
        dogs.splice(dogIndex, 1) 
        ctx.status = 204

        console.log(dogs)
        return
    }

    ctx.body = `Dog with id: ${ctx.params.id} doesnt exist.`
    ctx.status = 404
  })

// App start
app
  .use(koaBody())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)