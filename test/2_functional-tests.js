/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const MongoClient = require('mongodb').MongoClient;
const CONNECTION_STRING = process.env.DB;

chai.use(chaiHttp);

describe('Functional Tests', function() {
  this.timeout(10000);
  describe('POST /api/issues/{project} => object with issue data', function() {
    
    it('Every field filled in', function(done) {
     chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'testObject1',
        issue_text: 'First MongoDB test object',
        created_by: 'Testing Team',
        assigned_to: 'Repair Team',
        status_text: 'In Progress'
      })
      .end(function(err, res) {
        assert.equal(res.body.result[0].issue_title, 'testObject1');
        assert.equal(res.body.result[0].issue_text, 'First MongoDB test object');
        assert.equal(res.body.result[0].created_by, 'Testing Team');
        assert.equal(res.body.result[0].assigned_to, 'Repair Team');
        assert.equal(res.body.result[0].status_text, 'In Progress');
        done();
      });
    });
    it('Required fields filled in', function(done) {
      chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'testObject2',
        issue_text: 'Second MongoDB test object',
        created_by: 'Testing Team',
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.result[1].issue_title, 'testObject2');
        assert.equal(res.body.result[1].issue_text, 'Second MongoDB test object');
        assert.equal(res.body.result[1].created_by, 'Testing Team');
        assert.equal(res.body.result[1].assigned_to, null);
        assert.equal(res.body.result[1].status_text, null);
        done();
      });
    });
    it('Missing required fields', function(done) {
      chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: '',
        issue_text: '',
        created_by: 'Testing Team',
        assigned_to: 'Repair Team',
        status_text: 'Incomplete'
      })
      .end(function(err, res){
        assert.equal(res.body.err, 'Please fill out all required fields')
        done();
      });
    }); 
  
  });

  describe('GET /api/issues/{project} => Array of objects with issue data', function() {
    it('No filter', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({})
      .end(function(err, res) {
        assert.isArray(res.body.result);
        assert.property(res.body.result[0], 'issue_title');
        assert.property(res.body.result[0], 'issue_text');
        assert.property(res.body.result[0], 'created_by');
        assert.property(res.body.result[0], 'updated_on');
        assert.property(res.body.result[0], 'created_on');
        assert.property(res.body.result[0], 'assigned_to');
        assert.property(res.body.result[0], 'open');
        assert.property(res.body.result[0], 'status_text');
        assert.property(res.body.result[0], '_id');
        done();
      });
    }); 
    it('One filter', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({issue_title: 'testObject2'})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.result);
        assert.lengthOf(res.body.result, 1);
        assert.equal(res.body.result[0].issue_title, 'testObject2');
        assert.equal(res.body.result[0].issue_text, 'Second MongoDB test object');
        assert.equal(res.body.result[0].created_by, 'Testing Team');
        assert.equal(res.body.result[0].assigned_to,  null);
        assert.equal(res.body.result[0].status_text, null);

        assert.property(res.body.result[0], 'issue_title');
        assert.property(res.body.result[0], 'issue_text');
        assert.property(res.body.result[0], 'created_on');
        assert.property(res.body.result[0], 'updated_on');
        assert.property(res.body.result[0], 'created_by');
        assert.property(res.body.result[0], 'assigned_to');
        assert.property(res.body.result[0], 'open');
        assert.property(res.body.result[0], 'status_text');
        assert.property(res.body.result[0], '_id');
        done();
      });
    });
  
    it('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
      chai.request(server)      
      .get('/api/issues/test')
      .query({issue_title: 'testObject1', issue_text: 'First MongoDB test object'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body.result);
        assert.lengthOf(res.body.result, 1);
        assert.equal(res.body.result[0].issue_title, 'testObject1');
        assert.equal(res.body.result[0].issue_text, 'First MongoDB test object');
        assert.equal(res.body.result[0].created_by, 'Testing Team');
        assert.equal(res.body.result[0].assigned_to, 'Repair Team');
        assert.equal(res.body.result[0].status_text, 'In Progress');

        assert.property(res.body.result[0], 'issue_title');
        assert.property(res.body.result[0], 'issue_text');
        assert.property(res.body.result[0], 'created_on');
        assert.property(res.body.result[0], 'updated_on');
        assert.property(res.body.result[0], 'created_by');
        assert.property(res.body.result[0], 'assigned_to');
        assert.property(res.body.result[0], 'open');
        assert.property(res.body.result[0], 'status_text');
        assert.property(res.body.result[0], '_id');
        done();
      });
    });
  }); 

  describe('PUT /api/issues/{project} => text', function() {
    this.timeout(4000);
    it('No body', function(done) {
      chai.request(server)
      .put('/api/issues/test')
      .send({})
      .end(function(err, res) {
      assert.equal(res.body.err, 'Please fill out all required fields');
      done();
      });
    });
    it('One field to update', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({})
      .end(function(err, res) {
        chai.request(server)
        .put('/api/issues/test')
        .send({issue_id: res.body.result[0]._id, issue_title: 'testObject1_updated'})
        .end(function(err, res) {
          assert.equal(res.body.result[0].issue_title, 'testObject1_updated');
          assert.equal(res.body.result[0].issue_text, 'First MongoDB test object');
          assert.equal(res.body.result[0].created_by, 'Testing Team');
          assert.equal(res.body.result[0].assigned_to, 'Repair Team');
          assert.equal(res.body.result[0].status_text, 'In Progress');
          done();
        });
      });
    });
    it('Multiple fields to update', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({})
      .end(function(err, res) {
        chai.request(server)
        .put('/api/issues/test')
        .send({issue_id: res.body.result[1]._id, issue_title: 'testObject2_updated', issue_text: 'Second MongoDB test object has been updated'})
        .end(function(err, res) {
          assert.equal(res.body.result[1].issue_title, 'testObject2_updated');
          assert.equal(res.body.result[1].issue_text, 'Second MongoDB test object has been updated');
          assert.equal(res.body.result[1].created_by, 'Testing Team');
          assert.equal(res.body.result[1].assigned_to,  null);
          assert.equal(res.body.result[1].status_text, null);
          done();
        });
      });
    });
  });

  describe('DELETE /api/issues/{project} => text', function() {
    it('No _id', function(done) {
      chai.request(server)
      .delete('/api/issues/test')
      .send({issue_id: ''})
      .end(function(err, res) {
        assert.equal(res.body.err, 'no updated field sent')
        done();
      });
    });
    it('Valid _id', function(done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res) {
          const deleteObj = Object.create(res.body.result[0]);
          chai.request(server)
            .delete('/api/issues/test')
            .send({issue_id: deleteObj._id})
            .end(function(err, res) {
            assert.equal(res.body.result, 'Issue: ' + deleteObj.issue_title + '(_id: ' + deleteObj._id + ')' + ' has been deleted');
            done();
          });
        });
      });
  });  
      
  /* Clear DB */
  MongoClient.connect(CONNECTION_STRING, function(err, db) {
    if (err) {
      console.log(err);
      return;
    }
    db.db('issueTrackerDB').collection('test').drop(function(err) {
      if (err) {
        console.log(err);
      }
      db.close();
    });
  });

}); 
