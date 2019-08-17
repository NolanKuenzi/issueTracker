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
const { query, body, sanitizeQuery, sanitizeBody, validationResult } = require('express-validator');

module.exports = function (app) {

  app.route('/api/issues/:project?')
    .get([
      query()
        .custom(function(undefined, queryObj) {
          if (Object.keys(queryObj.req.query).length === 0) {
            return true;
          }
          const queryObject = queryObj.req.query;
          for (let queryParam in queryObject) {
            if (queryParam === 'created_on' || queryParam === 'updated_on') {
              throw new Error('Cannot filter by created_on or updated_on fields');
            }
          }
          for (let queryParam in queryObject) {
            const Params = ['_id', 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'open', 'status_text'];
            if (Params.indexOf(queryParam) === -1) {
              throw new Error('Invalid filter field: ' + queryParam);
            } 
          }
          return true;
        }),
      query('_id')
        .optional()
        .custom(function(undefined, queryObj) {
          try {
            queryObj.req.query._id = ObjectId(queryObj.req.query._id);
          } catch(error) {
            throw new Error('Invalid _id');
          }
          return true;
        }),
      sanitizeQuery('_id')
        .escape(),
      query('issue_title')
        .optional(),
      sanitizeQuery('issue_title')
        .escape(),
      query('issue_text')
        .optional(),
      sanitizeQuery('issue_text')
        .escape(),
      query('created_by')
        .optional(),
      sanitizeQuery('created_by')
        .escape(),
      query('assigned_to')
        .optional(),
      sanitizeQuery('assigned_to')
        .escape(),
      query('open')
        .optional(),
      sanitizeQuery('open')
        .escape(),
      sanitizeQuery('status_text')
        .escape(),
      query()
        .custom(function(undefined, queryObj) {
          for (let field in queryObj.req.query) {
            if (queryObj.req.query[field] === '') {
              delete queryObj.req.query[field];
            } 
          }
          return true;   
        }),
    ],
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({err: errors.array()[0].msg});
        return;
      }
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) {
          res.status(500).json({err: 'An error occurred while connecting to MongoDB Atlas'});
          return;
        }
        if (req.query._id !== undefined) {
          req.query._id = ObjectId(req.query._id);;
        }
        if (req.query.open === 'true') {
          req.query.open = true; 
        }
        if (req.query.open === 'false') {
          req.query.open = false; 
        }
        const data_base = db.db('issueTrackerDB').collection(req.params.project);
        data_base.find(Object.keys(req.query).length > 0 ? req.query : {}).toArray(function(err, data) {
          if (err) {
            res.status(500).json({err: 'An error occurred while connecting to MongoDB Atlas'});
            return;
          }
          if (Object.keys(data).length === 0 && Object.keys(req.query).length !== 0) {
            res.status(404).json({err: 'Filter field value(s) not found'})
            return;
          }
          res.status(200).json({result: data.slice(0)});
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
      body()
        .custom(function(undefined, bodyObj) {
          for (let key in bodyObj.req.body) {
            bodyObj.req.body[key] = bodyObj.req.body[key].replace(/\s+/g, ' '); 
          }
          return true;
        })
    ], 
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({err: errors.array()[0].msg});
        return;
      }
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) {
          res.status(500).json({err: 'An error occurred while connecting to MongoDB Atlas'});
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
            res.status(200).json({result: result.slice(0)});
            db.close();
          });
        }).catch(function(error) {
            res.status(500).json({err: 'An error occurred while connecting to MongoDB Atlas'});
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
      body('open')
        .optional(),
    ], 
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({err: errors.array()[0].msg});
        return;
      }
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) {
          res.status(500).json({err: 'An error occurred while connecting to MongoDB Atlas'});
          return;
        }
        const data_base = db.db('issueTrackerDB').collection(req.params.project);
        const get_data = new Promise(function(resolve, reject) {
          data_base.find({}).toArray(function(err, result) {
          const find_issue = result.filter(item => ObjectId(item._id).toString() === req.body.issue_id);
          if (find_issue.length === 0) {
            res.status(404).json({err: 'Issue not found'});
            return;
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
          for (let prop in update_data) {
            if (update_data[prop] !== true && update_data[prop] !== false) {
              update_data[prop] = update_data[prop].replace(/\s+/g, ' ');
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
          data_base.find({_id: ObjectId(req.body.issue_id)}).toArray(function(err, result) {
            res.status(200).json({result: result.slice(0)});
            db.close();
          });
        }).catch(function(error) {
          res.status(500).json({err: error});
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
        res.status(400).json({err: errors.array()[0].msg});
        return;
      }
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) {
          res.status(500).json({err: 'An error occurred while connecting to MongoDB Atlas'});
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
              res.status(500).json({err: 'An error occurred while connecting to MongoDB Atlas'});
              return;
            }
            res.status(200).json({result: 'Issue: ' + find_issue[0].issue_title + '(_id: ' + req.body.issue_id + ')' + ' has been deleted'});
            db.close();
          })
        }).catch(function(error) {
          res.status(500).json({err: error});
          db.close();
        }); 
      });
    });  
}; 