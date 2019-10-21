import React, { useState } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import UserStories from '../presentational/userStories';

const ApiTests = () => {
  const [data, setData] = useState(null);
  const [usrStoriesIcon, setUsrStoriesIcon] = useState(false);

  const [submitTitle, setSubmitTitle] = useState('');
  const [submitText, setSubmitText] = useState('');
  const [submitCreated, setSubmitCreated] = useState('');
  const [submitAssigned, setSubmitAssigned] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  const [updateId, setUpdateId] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateText, setUpdateText] = useState('');
  const [updateCreated, setUpdateCreated] = useState('');
  const [updateAssigned, setUpdateAssigned] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [checkBox, setCheckBox] = useState(true);

  const [deleteIssue, setDeleteIssue] = useState('');

  const issueReq = async (input, formType) => {
    if (formType === 'submitForm') {
      try {
        const request = await axios.post(
          'https://shrouded-waters-89012.herokuapp.com/api/issues/apitest',
          input
        );
        setData(JSON.stringify([request.data.result[request.data.result.length - 1]]));
        setSubmitTitle('');
        setSubmitText('');
        setSubmitCreated('');
        setSubmitAssigned('');
        setSubmitStatus('');
      } catch (error) {
        if (error.response !== undefined) {
          if (error.response.data.err !== undefined) {
            setData(error.response.data.err);
            return;
          }
        }
        setData('Error: Network Error');
      }
    }
    if (formType === 'updateForm') {
      try {
        const request = await axios.put(
          'https://shrouded-waters-89012.herokuapp.com/api/issues/apitest',
          input
        );
        if (request.data.result !== undefined) {
          setData(`Updated Issue: ${JSON.stringify(request.data.result[0])}`);
        }
      } catch (error) {
        if (error.response !== undefined) {
          if (error.response.data.err !== undefined) {
            setData(error.response.data.err);
            return;
          }
        }
        setData('Error: Network Error');
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
        if (request.data.result !== undefined) {
          setData(request.data.result);
        }
      } catch (error) {
        if (error.response !== undefined) {
          if (error.response.data.err !== undefined) {
            setData(error.response.data.err);
            return;
          }
        }
        setData('Error: Network Error');
      }
    }
    const clearForm = document.getElementById(formType);
    clearForm.reset();
  };

  const submitFunc = event => {
    event.preventDefault();
    const body = {
      issue_title: submitTitle,
      issue_text: submitText,
      created_by: submitCreated,
      assigned_to: submitAssigned,
      status_text: submitStatus,
    };
    issueReq(body, 'submitForm');
  };
  const updateFunc = event => {
    event.preventDefault();
    const body = {
      issue_id: updateId,
      issue_title: updateTitle,
      issue_text: updateText,
      created_by: updateCreated,
      assigned_to: updateAssigned,
      status_text: updateStatus,
      open: checkBox,
    };
    issueReq(body, 'updateForm');
  };
  const deleteFunc = event => {
    event.preventDefault();
    const body = {
      issue_id: deleteIssue,
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
      <div className="formContainer">
        <h3>
          Submit issue on <em>apitest</em>
        </h3>
        <form id="submitForm" onSubmit={event => submitFunc(event)}>
          <input
            type="text"
            placeholder="*Title"
            value={submitTitle}
            onChange={e => setSubmitTitle(e.target.value)}
          />
          <textarea
            placeholder="*Text"
            value={submitText}
            onChange={e => setSubmitText(e.target.value)}
          />
          <input
            type="text"
            placeholder="*Created by"
            value={submitCreated}
            onChange={e => setSubmitCreated(e.target.value)}
          />
          <input
            type="text"
            placeholder="(opt)Assigned to"
            value={submitAssigned}
            onChange={e => setSubmitAssigned(e.target.value)}
          />
          <input
            type="text"
            placeholder="(opt)Status text"
            value={submitStatus}
            onChange={e => setSubmitStatus(e.target.value)}
          />
          <button type="submit" name="submitButton">
            Submit Issue
          </button>
        </form>
      </div>
      <div className="formContainer">
        <h3>
          Update issue on <em>apitest</em> (Change any or all to update issue on the _id supplied)
        </h3>
        <form id="updateForm" onSubmit={event => updateFunc(event)}>
          <input
            type="text"
            placeholder="*_id"
            value={updateId}
            onChange={e => setUpdateId(e.target.value)}
          />
          <input
            type="text"
            placeholder="(opt)Title"
            value={updateTitle}
            onChange={e => setUpdateTitle(e.target.value)}
          />
          <textarea
            type="text"
            placeholder="(opt)Text"
            value={updateText}
            onChange={e => setUpdateText(e.target.value)}
          />
          <input
            type="text"
            placeholder="(opt)Created by"
            value={updateCreated}
            onChange={e => setUpdateCreated(e.target.value)}
          />
          <input
            type="text"
            placeholder="(opt)Assigned to"
            value={updateAssigned}
            onChange={e => setUpdateAssigned(e.target.value)}
          />
          <input
            type="text"
            placeholder="(opt)Status text"
            value={updateStatus}
            onChange={e => setUpdateStatus(e.target.value)}
          />
          <input
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
      <div className="formContainer">
        <h3>
          Delete issue on <em>apitest</em>
        </h3>
        <form id="deleteForm" onSubmit={event => deleteFunc(event)}>
          <input
            type="text"
            placeholder="_id"
            value={deleteIssue}
            onChange={e => setDeleteIssue(e.target.value)}
          />
          <button type="submit" name="deleteButton">
            Delete Issue
          </button>
        </form>
      </div>
      <div id="returnedData" name="axiosData">
        {data === null ? null : data}
      </div>
      <div id="viewProjIssues">
        <h3>To access a project issue page:</h3>
        <span>{'/{projectName}'}</span>
        <h3>To filter issues:</h3>
        <h4>Example:</h4>
        <span>{'/{projectName}?open=true&assigned_to=Joe'}</span>
        <h4>Filterable fields:</h4>
        <ul id="filterUl">
          <li>_id</li>
          <li>issue_title</li>
          <li>issue_text</li>
          <li>created_by</li>
          <li>assigned_to</li>
          <li>open</li>
          <li>status_text</li>
        </ul>
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
