const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index');

chai.use(chaiHttp);
chai.should();

const expect = chai.expect;

describe('POST /api/posts', () => {
    let token;
    let postId;
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
    it('should create a new post', (done) => {
        chai.request(server)
            .post('/api/posts')
            .set('Authorization', 'Bearer ' + token)
            .send({
                title: 'My new post',
                description: 'This is my first post'
            })
            .end((err, res) => {
                postId=res.body.id
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('createdAt');
                done();
            });
        
    });

    it('should delete a post', (done) => {
        chai.request(server)
            .delete(`/api/posts/${postId}`)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.message).to.equal('Post deleted successfully.');
                done();
            })
    });

    it('should return an error if post not found', (done) => {
        chai.request(server)
            .delete(`/api/posts/12345`)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            })

    });
});
