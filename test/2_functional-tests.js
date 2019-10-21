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
  /* Clear DB */
  after(function () {
    MongoClient.connect(CONNECTION_STRING).then(function(db) {
      db.db('issueTrackerDB').collection('test').drop(function(err) {
        if (err) {
          console.log(err);
        }
        db.close();
      })
    }).catch(function(error) {
      console.log(error);
    })
  });
  let issueId;
  describe('POST /api/issues/{project} => object with issue data', function() { 
    it('Every field filled in', function() {
      return chai.request(server) 
      .post('/api/issues/test')
      .send({
        issue_title: 'testObject1',
        issue_text: 'First MongoDB test object',
        created_by: 'Testing Team',
        assigned_to: 'Repair Team',
        status_text: 'In Progress'
      })
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result[0].issue_title, 'testObject1');
        assert.equal(res.body.result[0].issue_text, 'First MongoDB test object');
        assert.equal(res.body.result[0].created_by, 'Testing Team');
        assert.equal(res.body.result[0].assigned_to, 'Repair Team');
        assert.equal(res.body.result[0].status_text, 'In Progress');
        assert.equal(res.body.result[0].open, true);
        issueId = res.body.result[0]._id; // To be used in subsequent tests
        assert.equal(res.body.result[0]._id, issueId);
      })
    });
    it('Required fields filled in', function() {
      return chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'testObject2',
        issue_text: 'Second MongoDB test object',
        created_by: 'Testing Team',
      })
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result[1].issue_title, 'testObject2');
        assert.equal(res.body.result[1].issue_text, 'Second MongoDB test object');
        assert.equal(res.body.result[1].created_by, 'Testing Team');
        assert.equal(res.body.result[1].assigned_to, '');
        assert.equal(res.body.result[1].status_text, '');
      })
    });
    it('Missing required fields', function() {
      return chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: '',
        issue_text: '',
        created_by: 'Testing Team',
        assigned_to: 'Repair Team',
        status_text: 'Incomplete'
      })
      .then(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.err, 'Please fill out all required fields')
      })
    });
  });
  describe('GET /api/issues/{project} => Array of objects with issue data', function() {
    it('No filter', function() {
      return chai.request(server)
      .get('/api/issues/test?')
      .query({})
      .then(function(res) {
        assert.isArray(res.body.result);
        assert.equal(res.status, 200);
        assert.property(res.body.result[0], '_id');
        assert.property(res.body.result[0], 'issue_title');
        assert.property(res.body.result[0], 'issue_text');
        assert.property(res.body.result[0], 'created_by');
        assert.property(res.body.result[0], 'updated_on');
        assert.property(res.body.result[0], 'created_on');
        assert.property(res.body.result[0], 'assigned_to');
        assert.property(res.body.result[0], 'open');
        assert.property(res.body.result[0], 'status_text');

        assert.equal(res.body.result[0].issue_title, 'testObject1');
        assert.equal(res.body.result[0].issue_text, 'First MongoDB test object');
        assert.equal(res.body.result[0].created_by, 'Testing Team');
        assert.equal(res.body.result[0].assigned_to, 'Repair Team');
        assert.equal(res.body.result[0].status_text, 'In Progress');
        assert.equal(res.body.result[0].open, true);
      });
    });
    it('One filter', function() {
      return chai.request(server)
      .get('/api/issues/test?')
      .query({issue_title: 'testObject2'})
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.result);
        assert.lengthOf(res.body.result, 1);
        assert.equal(res.body.result[0].issue_title, 'testObject2');
        assert.equal(res.body.result[0].issue_text, 'Second MongoDB test object');
        assert.equal(res.body.result[0].created_by, 'Testing Team');
        assert.equal(res.body.result[0].assigned_to,  '');
        assert.equal(res.body.result[0].status_text, '');
        assert.equal(res.body.result[0].open, true);

        assert.property(res.body.result[0], '_id');
        assert.property(res.body.result[0], 'issue_title');
        assert.property(res.body.result[0], 'issue_text');
        assert.property(res.body.result[0], 'created_on');
        assert.property(res.body.result[0], 'updated_on');
        assert.property(res.body.result[0], 'created_by');
        assert.property(res.body.result[0], 'assigned_to');
        assert.property(res.body.result[0], 'status_text');
        assert.property(res.body.result[0], 'open');
      });
    });
    it('Multiple filters', function() {
      return chai.request(server)      
      .get('/api/issues/test?')
      .query({_id: issueId, issue_text: 'First MongoDB test object'})
      .then(function(res){
        assert.equal(res.status, 200);
        assert.isArray(res.body.result);
        assert.lengthOf(res.body.result, 1);
        assert.equal(res.body.result[0].issue_title, 'testObject1');
        assert.equal(res.body.result[0].issue_text, 'First MongoDB test object');
        assert.equal(res.body.result[0].created_by, 'Testing Team');
        assert.equal(res.body.result[0].assigned_to, 'Repair Team');
        assert.equal(res.body.result[0].status_text, 'In Progress');
        assert.equal(res.body.result[0].open, true);

        assert.property(res.body.result[0], '_id');
        assert.property(res.body.result[0], 'issue_title');
        assert.property(res.body.result[0], 'issue_text');
        assert.property(res.body.result[0], 'created_on');
        assert.property(res.body.result[0], 'updated_on');
        assert.property(res.body.result[0], 'created_by');
        assert.property(res.body.result[0], 'assigned_to');
        assert.property(res.body.result[0], 'status_text');
        assert.property(res.body.result[0], 'open');
      });
    });
    it('Invalid query field', function() {
      return chai.request(server)      
      .get('/api/issues/test?')
      .query({issue_number: issueId})
      .then(function(res){
        assert.equal(res.status, 400);
        assert.equal(res.body.err, 'Invalid filter field: issue_number');
      });
    });
    it('Invalid query value: _id', function() {
      return chai.request(server)      
      .get('/api/issues/test?')
      .query({_id: '2d0j3d0q'})
      .then(function(res){
        assert.equal(res.status, 400);
        assert.equal(res.body.err, 'Invalid _id');
      });
    });
    it('Invalid query value: created_on', function() {
      return chai.request(server)      
      .get('/api/issues/test?')
      .query({created_on: '2019-10-30'})
      .then(function(res){
        assert.equal(res.status, 400);
        assert.equal(res.body.err, 'Cannot filter by created_on or updated_on fields');
      });
    });
    it('Invalid query value: updated_on', function() {
      return chai.request(server)      
      .get('/api/issues/test?')
      .query({updated_on: '2019-11-13'})
      .then(function(res){
        assert.equal(res.status, 400);
        assert.equal(res.body.err, 'Cannot filter by created_on or updated_on fields');
      });
    });
    it('Invalid query values', function() {
      return chai.request(server)      
      .get('/api/issues/test?')
      .query({issue_title: 'testObject11', issue_text: 'First MySQL test object'})
      .then(function(res){
        assert.equal(res.status, 404);
        assert.equal(res.body.err, 'Filter field value(s) not found');
      });
    });
  });
  describe('PUT /api/issues/{project} => text', function() {
    it('No body', function() {
      return chai.request(server)
      .put('/api/issues/test')
      .send({})
      .then(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.err, 'Please fill out all required fields');
      })
    });
    it('One field to update', function() {
      return chai.request(server)
      .put('/api/issues/test')
      .send({issue_id: issueId, issue_title: 'testObject1_updated'})
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result[0].issue_title, 'testObject1_updated');
        assert.equal(res.body.result[0].issue_text, 'First MongoDB test object');
        assert.equal(res.body.result[0].created_by, 'Testing Team');
        assert.equal(res.body.result[0].assigned_to, 'Repair Team');
        assert.equal(res.body.result[0].status_text, 'In Progress');
        assert.equal(res.body.result[0].open, true);
      })
    });
    it('Multiple fields to update', function() {
      return chai.request(server)
      .put('/api/issues/test')
      .send({issue_id: issueId, issue_title: 'testObject1_updated_again', issue_text: 'First MongoDB test object has been updated again', open: false})
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result[0].issue_title, 'testObject1_updated_again');
        assert.equal(res.body.result[0].issue_text, 'First MongoDB test object has been updated again');
        assert.equal(res.body.result[0].created_by, 'Testing Team');
        assert.equal(res.body.result[0].assigned_to,  'Repair Team');
        assert.equal(res.body.result[0].status_text, 'In Progress');
        assert.equal(res.body.result[0].open, false);
      })
    });
  });
  describe('DELETE /api/issues/{project} => text', function() {
    it('No _id', function() {
      return chai.request(server)
      .delete('/api/issues/test')
      .send({issue_id: ''})
      .then(function(res) {
        assert.equal(res.status, 400); 
        assert.equal(res.body.err, 'Please fill out all required fields')
      });
    });
    it('Valid _id', function() {
      return chai.request(server)
      .delete('/api/issues/test')
      .send({issue_id: issueId})
      .then(function(res) {
        assert.equal(res.status, 200);  
        assert.equal(res.body.result, `Issue: testObject1_updated_again(_id: ${issueId}) has been deleted`);
      });
    });
  });
});
    