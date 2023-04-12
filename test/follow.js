const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index');

chai.use(chaiHttp);
const expect = chai.expect;

describe('POST /api/follow/:id', () => {
  let token;
  let userId;
  before((done) => {
    // Login to obtain JWT token and user ID
    chai.request(server)
      .post('/api/authenticate')
      .send({
        email: 'samuel@gmail.com',
        password: 'jazz2@1999'
      })
      .end((err, res) => {
        token = res.body.token;
        userId = '6434f55cd6aca4a6444c8800';
        done();
      });
  });

  it('should follow a user', (done) => {
    chai.request(server)
      .post(`/api/follow/${userId}`)
      .set('authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should return 500 if user ID does not exist', (done) => {
    chai.request(server)
      .post('/api/follow/123456789')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        console.log(res.status)
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should return 401 if user is not authenticated', (done) => {
    chai.request(server)
      .post(`/api/follow/${userId}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Access token not provided');
        done();
      });
  });
});



describe('POST /api/unfollow/:id', () => {
    let token;
    let userId;
    before((done) => {
      // Login to obtain JWT token and user ID
      chai.request(server)
        .post('/api/authenticate')
        .send({
          email: 'samuel@gmail.com',
          password: 'jazz2@1999'
        })
        .end((err, res) => {
          token = res.body.token;
          userId = '6434f55cd6aca4a6444c8800';
          done();
        });
    });
  
    it('should unfollow a user', (done) => {
      chai.request(server)
        .post(`/api/unfollow/${userId}`)
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  
    it('should return 500 if user ID does not exist', (done) => {
      chai.request(server)
        .post('/api/unfollow/123456789')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          console.log(res.status)
          expect(res).to.have.status(500);
          done();
        });
    });
  
    it('should return 401 if user is not authenticated', (done) => {
      chai.request(server)
        .post(`/api/unfollow/${userId}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Access token not provided');
          done();
        });
    });
  });