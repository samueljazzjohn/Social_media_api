const chai = require('chai')
const chaiHttp = require('chai-http')
const { describe } = require('mocha')
const server = require('../router/index')


chai.should()

chai.use(chaiHttp)


describe('Users Api', () => {

    describe("Get /api/user", () => {
        it("it should get user profile", (done) => {
            chai.request(server)
                .get("/api/user")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    done();
                })
        })
    })


})