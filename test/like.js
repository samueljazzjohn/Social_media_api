const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index');

chai.use(chaiHttp);
const expect = chai.expect;

describe('POST /api/like/:id', () => {
  let token;
  let postId='6436be68cc6a8daabfc799c5';

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
        done();
      });
  });

  it('should like a user', (done) => {
    chai.request(server)
      .post(`/api/like/${postId}`)
      .set('authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should return 500 if post not found', (done) => {
    chai.request(server)
      .post('/api/like/123456789')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        console.log(res.status)
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should return 401 if user is not authenticated', (done) => {
    chai.request(server)
      .post(`/api/like/${postId}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Access token not provided');
        done();
      });
  });
});



describe('POST /api/unlike/:id', () => {

    let token;
  let postId='6436be68cc6a8daabfc799c5';

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
        done();
      });
  });

  it('should unlike a user', (done) => {
    chai.request(server)
      .post(`/api/unlike/${postId}`)
      .set('authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should return 500 if post not found', (done) => {
    chai.request(server)
      .post('/api/unlike/123456789')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        console.log(res.status)
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should return 401 if user is not authenticated', (done) => {
    chai.request(server)
      .post(`/api/unlike/${postId}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Access token not provided');
        done();
      });
  });
  });