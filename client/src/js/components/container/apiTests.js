import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';

const ApiTests = () => {
  const [data, setData] = useState(null);
  const [checkBox, setCheckBox] = useState(true);

  const issueReq = async (input, formEle, formType) => {
    if (formType === 'submitForm') {
      try {
        const request = await axios.post('http://localhost:3000/api/issues/apitest', input);
        if (request.data.err !== undefined) {
          setData(request.data.err);
          return;
        }
        if (request.data.result !== undefined) {
          setData(JSON.stringify([request.data.result[request.data.result.length - 1]]));
        }
      } catch (error) {
        setData('An error occurred while connecting to MongoDB Atlas');
        return;
      }
    }
    if (formType === 'updateForm') {
      try {
        const request = await axios.put('http://localhost:3000/api/issues/apitest', input);
        if (request.data.err !== undefined) {
          setData(request.data.err);
          return;
        }
        if (request.data.result !== undefined) {
          const displayIssue = request.data.result.filter(item => item._id === input.issue_id);
          setData(`Updated Issue: ${JSON.stringify(displayIssue[0])}`);
        }
      } catch (error) {
        setData('An error occurred while connecting to MongoDB Atlas');
        return;
      }
    }
    if (formType === 'deleteForm') {
      try {
        const request = await axios.delete('http://localhost:3000/api/issues/apitest', {
          data: { issue_id: input.issue_id },
        });
        if (request.data.err !== undefined) {
          setData(request.data.err);
          return;
        }
        if (request.data.result !== undefined) {
          setData(request.data.result);
        }
      } catch (error) {
        setData('An error occurred while connecting to MongoDB Atlas');
      }
    }
    if (formEle === null) {
      return;
    } /* ^ For testing purposes ^ */
    formEle.reset();
  };

  const submitFunc = event => {
    event.preventDefault();
    let body = null;
    if (event.target.issue_title === undefined) {
      issueReq(body, null, 'submitForm');
      return;
    } /* ^ For testing purposes ^ */
    body = {
      issue_title: event.target.issue_title.value,
      issue_text: event.target.issue_text.value,
      created_by: event.target.created_by.value,
      assigned_to: event.target.assigned_to.value,
      status_text: event.target.status_text.value,
    };
    issueReq(body, event.target, 'submitForm');
  };
  const updateFunc = event => {
    event.preventDefault();
    let body = { issue_id: '5d033feoa78a992482ecf464' };
    if (event.target.issue_id === undefined) {
      issueReq(body, null, 'updateForm');
      return;
    } /* ^ For testing purposes ^ */
    body = {
      issue_id: event.target.issue_id.value,
      issue_title: event.target.issue_title.value,
      issue_text: event.target.issue_text.value,
      created_by: event.target.created_by.value,
      assigned_to: event.target.assigned_to.value,
      status_text: event.target.status_text.value,
      open: event.target.check_box.value,
    };
    issueReq(body, event.target, 'updateForm');
  };
  const deleteFunc = event => {
    event.preventDefault();
    if (event.target.issue_id === undefined) {
      issueReq({ data: { issue_id: null } }, null, 'deleteForm');
      return;
    } /* ^ For testing purposes ^ */
    const body = {
      issue_id: event.target.issue_id.value,
    };
    issueReq(body, event.target, 'deleteForm');
  };
  const toggleCheckbox = event => {
    event.preventDefault();
    if (checkBox === true) {
      setCheckBox(false);
      return;
    }
    setCheckBox(true);
  };
  return (
    <div id="apiTestsId">
      <h2>API Tests:</h2>
      <div data-testid="submitIssue" className="formContainer">
        <h3>
          Submit issue on <em>apitest</em>
        </h3>
        <form id="submitForm" onSubmit={event => submitFunc(event)}>
          <input type="text" placeholder="*Title" name="issue_title" />
          <textarea placeholder="*Text" name="issue_text" />
          <input type="text" placeholder="*Created by" name="created_by" />
          <input type="text" placeholder="(opt)Assigned to" name="assigned_to" />
          <input type="text" placeholder="(opt)Status text" name="status_text" />
          <button type="submit" name="submitButton">
            Submit Issue
          </button>
        </form>
      </div>
      <div data-testid="updateIssue" className="formContainer">
        <h3>
          Update issue on <em>apitest</em> (Change any or all to update issue on the _id supplied)
        </h3>
        <form id="updateForm" onSubmit={event => updateFunc(event)}>
          <input type="text" placeholder="*_id" name="issue_id" />
          <input type="text" placeholder="(opt)Title" name="issue_title" />
          <textarea placeholder="(opt)Text" name="issue_text" />
          <input type="text" placeholder="(opt)Created by" name="created_by" />
          <input type="text" placeholder="(opt)Assigned to" name="assigned_to" />
          <input type="text" placeholder="(opt)Status text" name="status_text" />
          <span>
            <input
              type="checkbox"
              id="checkBox"
              name="check_box"
              onInput={event => toggleCheckbox(event)}
              value={checkBox}
            />
            <span id="checkBoxText">Check to close issue</span>
          </span>
          <button type="submit" name="updateButton">
            Submit Issue
          </button>
        </form>
      </div>
      <div data-testid="deleteIssue" className="formContainer">
        <h3>
          Delete issue on <em>apitest</em>
        </h3>
        <form id="deleteFrom" onSubmit={event => deleteFunc(event)}>
          <input type="text" placeholder="_id" name="issue_id" />
          <button type="submit" name="deleteButton">
            Delete Issue
          </button>
        </form>
      </div>
      <div id="returnedData" name="axiosData">
        {data === null ? null : data}
      </div>
    </div>
  );
};

export default ApiTests;
