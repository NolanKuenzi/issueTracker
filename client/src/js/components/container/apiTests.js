import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import UserStories from '../presentational/userStories';

const ApiTests = () => {
  const [data, setData] = useState(null);
  const [checkBox, setCheckBox] = useState(true);
  const [usrStoriesIcon, setUsrStoriesIcon] = useState(false);

  const issueReq = async (input, formType) => {
    if (formType === 'submitForm') {
      try {
        const request = await axios.post(
          'https://shrouded-waters-89012.herokuapp.com/api/issues/apitest',
          input
        );
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
        const request = await axios.put(
          'https://shrouded-waters-89012.herokuapp.com/api/issues/apitest',
          input
        );
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
        const request = await axios.delete(
          'https://shrouded-waters-89012.herokuapp.com/api/issues/apitest',
          {
            data: { issue_id: input.issue_id },
          }
        );
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
    const clearForm = document.getElementById(formType);
    clearForm.reset();
  };

  const submitFunc = event => {
    event.preventDefault();
    const submitInputs = document.getElementsByClassName('submitInputs');
    const body = {
      issue_title: submitInputs[0].value,
      issue_text: submitInputs[1].value,
      created_by: submitInputs[2].value,
      assigned_to: submitInputs[3].value,
      status_text: submitInputs[4].value,
    };
    issueReq(body, 'submitForm');
  };
  const updateFunc = event => {
    event.preventDefault();
    const updateInputs = document.getElementsByClassName('updateInputs');
    const body = {
      issue_id: updateInputs[0].value,
      issue_title: updateInputs[1].value,
      issue_text: updateInputs[2].value,
      created_by: updateInputs[3].value,
      assigned_to: updateInputs[4].value,
      status_text: updateInputs[5].value,
      open: updateInputs[6].value,
    };
    issueReq(body, 'updateForm');
  };
  const deleteFunc = event => {
    event.preventDefault();
    const delInput = document.getElementById('deleteInput');
    const body = {
      issue_id: delInput.value,
    };
    issueReq(body, 'deleteForm');
  };
  const toggleCheckbox = event => {
    event.preventDefault();
    if (checkBox === true) {
      setCheckBox(false);
      return;
    }
    setCheckBox(true);
  };
  const userStoriesToggle = () => {
    if (usrStoriesIcon === false) {
      setUsrStoriesIcon(true);
    } else {
      setUsrStoriesIcon(false);
    }
  };
  return (
    <div id="apiTestsId">
      <h2>API Tests:</h2>
      <div data-testid="submitIssue" className="formContainer">
        <h3>
          Submit issue on <em>apitest</em>
        </h3>
        <form id="submitForm" onSubmit={event => submitFunc(event)}>
          <input className="submitInputs" type="text" placeholder="*Title" name="issue_title" />
          <textarea className="submitInputs" placeholder="*Text" name="issue_text" />
          <input className="submitInputs" type="text" placeholder="*Created by" name="created_by" />
          <input
            className="submitInputs"
            type="text"
            placeholder="(opt)Assigned to"
            name="assigned_to"
          />
          <input
            className="submitInputs"
            type="text"
            placeholder="(opt)Status text"
            name="status_text"
          />
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
          <input className="updateInputs" type="text" placeholder="*_id" name="issue_id" />
          <input className="updateInputs" type="text" placeholder="(opt)Title" name="issue_title" />
          <textarea
            className="updateInputs"
            type="text"
            placeholder="(opt)Text"
            name="issue_text"
          />
          <input
            className="updateInputs"
            type="text"
            placeholder="(opt)Created by"
            name="created_by"
          />
          <input
            className="updateInputs"
            type="text"
            placeholder="(opt)Assigned to"
            name="assigned_to"
          />
          <input
            className="updateInputs"
            type="text"
            placeholder="(opt)Status text"
            name="status_text"
          />
          <input
            className="updateInputs"
            type="checkbox"
            id="checkBox"
            name="check_box"
            onInput={event => toggleCheckbox(event)}
            value={checkBox}
          />
          <span>*Check to close/re-open issue</span>
          <button type="submit" name="updateButton">
            Submit Issue
          </button>
        </form>
      </div>
      <div data-testid="deleteIssue" className="formContainer">
        <h3>
          Delete issue on <em>apitest</em>
        </h3>
        <form id="deleteForm" onSubmit={event => deleteFunc(event)}>
          <input type="text" id="deleteInput" name="issue_id" placeholder="_id" />
          <button type="submit" name="deleteButton">
            Delete Issue
          </button>
        </form>
      </div>
      <div id="returnedData" name="axiosData">
        {data === null ? null : data}
      </div>
      <div>
        <div id="usrStoriesToggle" onClick={() => userStoriesToggle()}>
          <span>User Stories </span>
          <span id="arrowSpan">{usrStoriesIcon === false ? '▼' : '▲'}</span>
        </div>
        <div>{usrStoriesIcon === false ? null : <UserStories />}</div>
      </div>
    </div>
  );
};
export default ApiTests;
