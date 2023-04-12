const chai = require('chai');
const chaiHttp = require('chai-http');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = require('../config/appconfig').auth.jwt_secret
const server = require('../server/index')

chai.use(chaiHttp);
const expect = chai.expect;

describe('/GET user', () => {
    it('should return user information', (done) => {

        // Create a user and authenticate the request
        const user = new userModel({
            email: 'samuel@gmail.com',
            password: 'password',
        });

        const data = { userId: '6434f55cd6aca4a6444c8800', email: 'samuel@gmail.com' }

        // Create a JWT token with user ID and email
        const token = jwt.sign(
            data,
            JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        
        userModel.findById('6434f55cd6aca4a6444c8800').then((userprofile)=>{
            chai.request(server)
            .get('/api/user')
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.username).to.equal(userprofile.name);
                expect(res.body.followers).to.equal(userprofile.followers.length);
                expect(res.body.following).to.equal(userprofile.following.length);
                done();
            });
        })
    });
});

it('should return 403 if it is invalid token', (done) => {

    // Create a user and authenticate the request
    const user = new userModel({
        email: 'samuel@gmail.com',
        password: 'password',
    });

    const data = { userId: '6434f55cd6aca4a6444c8800', email: 'samuel@gmail.com' }

    // Setting a JWT token with user ID and email
    const token = 'qfewkjnq34r45';


    chai.request(server)
        .get('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body.message).to.equal('Invalid token');
            done();
        });
});
