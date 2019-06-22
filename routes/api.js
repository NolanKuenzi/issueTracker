/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

  app.route('/api/issues/:project?')
    .get(function (req, res){
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) {
          console.log('An error occurred while connecting to MongoDB Atlas');
          res.json({err: 'An error occurred while connecting to MongoDB Atlas'});
          return;
        }
        const data = db.db('issueTrackerDB').collection(req.params.project);
        if (req.query.created_on !== undefined || req.query.updated_on !== undefined) {
          res.send('Cannot filter by created_on or updated_on fields');
          return;
        }
        if (req.query._id !== undefined && req.query._id.toString().split('').length !== 24) {
          res.send('Invalid Query _id');
          return;
        }
        if (req.query._id !== undefined && req.query._id.toString().split('').length === 24) {
          req.query._id = ObjectId(req.query._id);
        }
        if (req.query.open === 'true') {
          req.query.open = true;
        }
        if (req.query.open === 'false') {
          req.query.open = false;
        }
        data.find(req.query).toArray(function(err, result) {
          if (err) {
          res.json({err: 'An error occurred while connecting to MongoDB Atlas'});
          return;
          }
          res.json({result: result.slice(0)});
          db.close();
        });
      });
    })

    .post(function (req, res){
      if (req.body.issue_title === '' || req.body.issue_text === '' || req.body.created_by === '') {
        res.json({err: 'Please fill out all required fields'});
        return;
      } 
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) {
          console.log('An error occurred while connecting to MongoDB Atlas');
          res.json({err: 'An error occurred while connecting to MongoDB Atlas'});
          return;
        }
        const data_base = db.db('issueTrackerDB').collection(req.params.project);
        const add_issue = new Promise(function(resolve, reject) {
          const issue_obj = {issue_title: req.body.issue_title, issue_text: req.body.issue_text, created_on: new Date(), updated_on: new Date(), created_by: req.body.created_by, assigned_to: req.body.assigned_to, open: true, status_text: req.body.status_text};
          data_base.insertOne(issue_obj, function(err) {
            if (err) {
              reject();
            }
          });
          resolve();
        });
        add_issue.then(function() {
          data_base.find({}).toArray(function(err, result) {
            if (err) {
              reject();
            }
            res.json({result: result.slice(0)});
            db.close();
          });
        }).catch(function() {
            console.log('An error occurred while connecting to MongoDB Atlas');
            res.json({err: 'An error occurred while connecting to MongoDB Atlas'});
            db.close();
          });
      }); 
    })
    
    .put(function (req, res){
      if (req.body.issue_id === '' || req.body.issue_id === undefined || req.body.issue_id === null) {
        res.json({err: 'Please fill out all required fields'});
        return;
      }
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) {
          console.log('An error occurred while connecting to MongoDB Atlas');
          res.json({err: 'An error occurred while connecting to MongoDB Atlas'});
          return;
        }
        const data_base = db.db('issueTrackerDB').collection(req.params.project);
        const get_data = new Promise(function(resolve, reject) {
          data_base.find({}).toArray(function(err, result) {
          const find_issue = result.filter(item => ObjectId(item._id).toString() === req.body.issue_id);
          if (find_issue.length === 0) {
            reject('Issue not found');
          }
          if (req.body.issue_title === '' && req.body.issue_text === '' && req.body.created_by === '' && req.body.assigned_to === '' && req.body.status_text === '' && req.body.open.toString() === find_issue[0].open.toString()) {
            reject('No updated field sent');
          }
          if (err) {
            reject('An error occurred while connecting to MongoDB Atlas');
          }
          resolve();
          });
        });
        get_data.then(function() {
          const update_data = {};
          for (let prop in req.body) {
            if (req.body[prop] !== '' && prop !== 'issue_id') {
             update_data[prop] = req.body[prop];
            }
          }
          if (update_data.open === 'true') {
            update_data.open = true;
          }
          if (update_data.open === 'false') {
            update_data.open = false;
          }
          update_data.updated_on = new Date();
          data_base.updateOne({_id: ObjectId(req.body.issue_id)}, {$set: update_data}, function(err) {
            if (err) {
              reject('An error occurred while connecting to MongoDB Atlas');
            }
          });
        }).then(function() {
          data_base.find({}).toArray(function(err, result) {
            res.json({result: result.slice(0)});
            db.close();
          });
        }).catch(function(input) {
          console.log(input);
          res.json({err: input});
          db.close();
        });
      });
    })
    
    .delete(function (req, res){
      if (req.body.issue_id === '') {
        res.json({err: 'no updated field sent'});
        return;
      }
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) {
          console.log('An error occurred while connecting to MongoDB Atlas');
          res.json({err: 'An error occurred while connecting to MongoDB Atlas'});
          return;
        }
        const data_base = db.db('issueTrackerDB').collection(req.params.project);
        let find_issue;
        const delete_issue = new Promise(function(resolve, reject) {
          data_base.find({}).toArray(function(err, result) {
            find_issue = result.filter(item => ObjectId(item._id).toString() === req.body.issue_id);
            if (find_issue.length === 0) {
              reject('Issue not found');
            }
            if (err) {
              reject('An error occurred while connecting to MongoDB Atlas');
            }
            resolve();
          });
        });
        delete_issue.then(function() {
          data_base.deleteOne({_id: ObjectId(req.body.issue_id)}, function(err, result) {
            if (err) {
              console.log('An error occurred while connecting to MongoDB Atlas');
              res.json({err: 'An error occurred while connecting to MongoDB Atlas'});
              return;
            }
          res.json({result: 'Issue: ' + find_issue[0].issue_title + '(_id: ' + req.body.issue_id + ')' + ' has been deleted'});
          db.close();
          });
        }).catch(function(err) {
          console.log(err);
          res.json({err: err});
          db.close();
        }); 
      });
    });  
};