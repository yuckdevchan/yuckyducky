/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testThreadId = '';
  
  suite('API ROUTING FOR /api/threads/:board', function() {
    
    
    suite('POST', function() {
      test('Test POST /api/threads/:board',  function(done){
        chai.request(server)
        .post(`/api/threads/testForum`)
        .send({board: 'testForum', text: 'test suite test posting a thread', delete_password: 'delete'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.include(res.redirects[0], 'testForum');
          done();
        })
      });
      
    });
    
    suite('GET', function() {
      test('Test GET /api/threads/:board',  function(done){
        chai.request(server)
        .get(`/api/threads/testForum`)
        .end(function(err, res){
          assert.equal(res.status, 200 || 304);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'replies');
          assert.notProperty(res.body[0], 'reported');
          assert.notProperty(res.body[0], 'delete_password');

          //find testThread and record _id to testThreadId
          testThreadId = res.body.find(thread => {
            return (thread.text === 'test suite test posting a thread');
          })
          ._id;
          
          done();
        })
      });
      
    });
    
    suite('DELETE', function() {
      test('Test DELETE /api/threads/:board with invalid password', function(done) {
        chai.request(server)
        .delete('/api/threads/testForum')
        .send({thread_id: testThreadId, delete_password: 'create'})
        .end(function (err, res) {
          assert.equal(res.status, 200);   
          assert.equal(res.text, 'incorrect password');
          done();     
        });
      });
      
      test('Test DELETE /api/threads/:board with valid password', function(done) {
        chai.request(server)
        .delete('/api/threads/testForum')
        .send({thread_id: testThreadId, delete_password: 'delete'})
        .end(function (err, res) {
          assert.equal(res.status, 200);   
          assert.equal(res.text, 'success');
          done();   
        });
      });
    });
    
    suite('PUT', function() {
      test('Test PUT /api/threads/:board to report a thread', function (done) {
        //make new post, find id, and re-save to testThreadId
        const requester = chai.request(server);
        requester.post(`/api/threads/testForum`)
        .send({board: 'testForum', text: 'test suite test posting a thread', delete_password: 'delete'})
        
        requester.get(`/api/threads/testForum`)
        .end(function(err, res){
          //find testThread and record _id to testThreadId
          testThreadId = res.body.find(thread => {
            return (thread.text === 'test suite test posting a thread');
          })._id;
        })
        
        requester.put('/api/threads/testForum')
        .send({thread_id: testThreadId})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        })
        
      })
    });
  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    let testReplyId = '';
    
    suite('POST', function() {
      test('Test POST on /api/replies/:board', function (done) {
        chai.request(server)
        .post('/api/replies/testForum')
        .send({text: `I don't have much to say`, delete_password: `delete`, thread_id: testThreadId})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.include(res.redirects[0], 'testForum');
          done();
        })
      })
    });
    
    suite('GET', function() {
      test('Test GET on /api/replies/:board?thread_id= to retrieve all replies to thread_id',
      function (done) {
        chai.request(server)
        .get('/api/replies/testForum')
        .query({thread_id: testThreadId})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body.replies[0], '_id');
          assert.property(res.body.replies[0], 'text');
          assert.property(res.body.replies[0], 'created_on');
          assert.notProperty(res.body.replies[0], 'reported');
          assert.notProperty(res.body.replies[0], 'delete_password');
          
          //set testReplyId to a real _id
          testReplyId = res.body.replies.find(reply => {
            return (reply.text === `I don't have much to say`)
          })._id;
          done();
        })
      })
      
    });
    
    suite('PUT', function() {
      test('Test put on /api/replies/testForum to report reply by id', function(done){
        chai.request(server)
        .put('/api/replies/testForum')
        .send({thread_id: testThreadId, reply_id: testReplyId})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        })
      })
    });
    
    suite('DELETE', function() {
      test('Test DELETE on /api/replies/:board with an invaild delete_password', function(done){
        chai.request(server)
        .delete('/api/replies/testforum')
        .send({thread_id: testThreadId, reply_id: testReplyId, delete_password: 'create'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        })
      })
      
      test('Test DELETE on /api/replies/:board with a vaild delete_password', function(done){
        chai.request(server)
        .delete('/api/replies/testforum')
        .send({thread_id: testThreadId, reply_id: testReplyId, delete_password: 'delete'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        })
      })
    });
    
  });
  
});
