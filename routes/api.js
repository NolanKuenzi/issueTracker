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
const { body, sanitizeBody, validationResult } = require('express-validator');

module.exports = function (app) {

  app.route('/api/issues/:project?')
    .get(function (req, res) {
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

    .post([
      body('issue_title')
        .not().isEmpty().withMessage('Please fill out all required fields')
        .trim()
        .isLength({max: 140}).withMessage('Title character limit of 140 has been exceeded'),
      sanitizeBody('issue_title')
        .escape(),
      body('issue_text')
        .not().isEmpty().withMessage('Please fill out all required fields')
        .trim()
        .isLength({max: 140}).withMessage('Issue text character limit of 140 has been exceeded'),
      sanitizeBody('issue_text')
        .escape(),
      body('created_by')
        .not().isEmpty().withMessage('Please fill out all required fields')
        .trim()
        .isLength({max: 140}).withMessage('"Created By" character limit of 140 has been exceeded'),
      sanitizeBody('created_by')
        .escape(),
      body('assigned_to')
        .optional()
        .trim()
        .isLength({max: 140}).withMessage('"Assigned To" character limit of 140 has been exceeded'),
      sanitizeBody('assigned_to')
        .escape(),
      body('status_text')
        .optional()
        .trim()
        .isLength({max: 140}).withMessage('"Status Text" character limit of 140 has been exceeded'),
      sanitizeBody('status_text')
        .escape(),
    ], 
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({err: errors.array()[0].msg});
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
        const issue_obj = {issue_title: req.body.issue_title, issue_text: req.body.issue_text, created_on: new Date(new Date(new Date().toDateString("UTC-7")).setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds(), new Date().getMilliseconds())), updated_on: new Date(new Date(new Date().toDateString("UTC-7")).setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds(), new Date().getMilliseconds())), created_by: req.body.created_by, assigned_to: req.body.assigned_to, open: true, status_text: req.body.status_text};
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
    
    .put([
      body('issue_id')
        .not().isEmpty().withMessage('Please fill out all required fields')
        .trim()
        .isLength({max: 140}).withMessage('Id character limit of 140 has been exceeded')
        .custom(function(issueId, bodyObj) {
          const response  = Object.assign({}, bodyObj.req.body);
          if (response.issue_title === "" && response.issue_text === "" && response.created_by === "" && response.assigned_to === "" && response.status_text === "") {
            throw new Error('No updated field sent');
          }
          return true;
        }),
      sanitizeBody('issue_id')
        .escape(),
      body('issue_title')
        .optional()
        .trim()
        .isLength({max: 140}).withMessage('Title character limit of 140 has been exceeded'),
      sanitizeBody('issue_title')
        .escape(),
      body('issue_text')
        .optional()
        .trim()
        .isLength({max: 140}).withMessage('Issue text character limit of 140 has been exceeded'),
      sanitizeBody('issue_text')
        .escape(),
      body('created_by')
        .optional()
        .trim()
        .isLength({max: 140}).withMessage('"Created By" character limit of 140 has been exceeded'),
      sanitizeBody('created_by')
        .escape(),
      body('assigned_to')
        .optional()
        .trim()
        .isLength({max: 140}).withMessage('"Assigned To" character limit of 140 has been exceeded'),
      sanitizeBody('assigned_to')
        .escape(),
      body('status_text')
        .optional()
        .trim()
        .isLength({max: 140}).withMessage('"Status Text" character limit of 140 has been exceeded'),
      sanitizeBody('status_text')
        .escape(),
    ], 
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({err: errors.array()[0].msg});
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
          update_data.updated_on = new Date(new Date(new Date().toDateString("UTC-7")).setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds(), new Date().getMilliseconds()));
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
    
    .delete([
      body('issue_id')
        .not().isEmpty().withMessage('Please fill out all required fields')
        .trim()
        .isLength({max: 140}).withMessage('Id character limit of 140 has been exceeded'),
      sanitizeBody('issue_id')
        .escape(),
    ],
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({err: errors.array()[0].msg});
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