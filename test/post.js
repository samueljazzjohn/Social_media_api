const chai = require('chai')
const chaiHttp = require('chai-http')
const { describe } = require('mocha')
const server = require('../router/index')

chai.should()

chai.use(chaiHttp)


describe('posts Api',()=>{

    describe("POST /api/authenticate",()=>{
        it("")
    })


})