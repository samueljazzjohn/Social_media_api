const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index');

chai.use(chaiHttp);
const expect = chai.expect;

describe('POST /api/authenticate', function() {
  it('should return a JWT token for valid credentials', function(done) {
    chai.request(server)
      .post('/api/authenticate')
      .send({ email: 'samuel@gmail.com', password: 'jazz2@1999' })
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.token).to.exist;
        done();
      });
  });

  it('should return an error for invalid credentials', function(done) {
    chai.request(server)
      .post('/api/authenticate')
      .send({ email: 'samuel@gmail.com', password: 'invalidpassword' })
      .end(function(err, res) {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Invalid credentials');
        done();
      });
  });

  it('should return an error for a nonexistent user', function(done) {
    chai.request(server)
      .post('/api/authenticate')
      .send({ email: 'nonexistent@gamil.com', password: 'password123' })
      .end(function(err, res) {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('User not found');
        done();
      });
  });
});
