const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index');

chai.use(chaiHttp);
chai.should();

const expect = chai.expect;

describe('POST /api/comment/:id', () => {
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


    it('should create a comment for a post', (done) => {
        chai.request(server)
            .post(`/api/comment/${postId}`)
            .set('authorization', 'Bearer ' + token)
            .send({'comment':'nice one'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('commentId');
                done();
            });
        
    });

    it('should return 500 if post is not found', (done) => {
        chai.request(server)
            .post(`/api/comment/123456`)
            .set('authorization', 'Bearer ' + token)
            .send({'comment':'nice one'})
            .end((err, res) => {
                res.should.have.status(500);
                done();
            })
    });

    it('should return 403 if comment is not given', (done) => {
        chai.request(server)
            .post(`/api/comment/${postId}`)
            .set('authorization', 'Bearer ' + token)
            .send({'comment':''})
            .end((err, res) => {
                res.should.have.status(403);
                expect(res.body.message).to.equal('Please give proper comment')
                done();
            })
    });

    it('should return 401 if user is not authenticated', (done) => {
        chai.request(server)
            .post(`/api/comment/${postId}`)
            .send({'comment':'nice one'})
            .end((err, res) => {
                res.should.have.status(401);
                expect(res.body.message).to.equal('Access token not provided');
                done();
            })

    });
});
