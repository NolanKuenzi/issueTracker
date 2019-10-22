import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';

const Issues = () => {
  const [issueData, updateIssueData] = useState([]);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueText, setIssueText] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [statusText, setStatusText] = useState('');
  const currentProject = window.location.pathname.replace(/\//g, '');

  const query = window.location.search;

  const url = query === '' ? `/api/issues/${currentProject}`: `/api/issues/${currentProject}${query}`; /* eslint-disable-line */
  const getFunc = async () => {
    try {
      const request = await axios.get(`https://shrouded-waters-89012.herokuapp.com${url}`);
      updateIssueData(request.data.result);
    } catch (error) {
      if (error.response !== undefined) {
        if (error.response.data.err !== undefined) {
          updateIssueData(error.response.data.err);
          return;
        }
      }
      updateIssueData('Error: Server Error');
    }
  };

  const submitFunc = async event => {
    event.preventDefault();
    event.persist();
    const body = {
      issue_title: issueTitle,
      issue_text: issueText,
      created_by: createdBy,
      assigned_to: assignedTo,
      status_text: statusText,
    };
    try {
      const request = await axios.post(
        `https://shrouded-waters-89012.herokuapp.com/${currentProject}?`,
        body
      );
      updateIssueData(request.data.result);
      setIssueTitle('');
      setIssueText('');
      setCreatedBy('');
      setAssignedTo('');
      setStatusText('');
    } catch (error) {
      if (error.response !== undefined) {
        if (error.response.data.err !== undefined) {
          updateIssueData(error.response.data.err);
          return;
        }
      }
      updateIssueData('Error: Network Error');
    }
  };

  const closeFunc = async event => {
    event.persist();
    try {
      const request = await axios.put(`https://shrouded-waters-89012.herokuapp.com${url}`, {
        issue_id: event.target.id,
        updated_on: new Date(),
        open: false,
      });
      alert(
        `Issue: ${request.data.result[0].issue_title}(_id: ${
          request.data.result[0]._id
        }) has been closed`
      );
      getFunc();
    } catch (error) {
      if (error.response !== undefined) {
        if (error.response.data.err !== undefined) {
          updateIssueData(error.response.data.err);
          return;
        }
      }
      updateIssueData('Error: Network Error');
    }
  };

  const deleteFunc = async event => {
    if (event.target.id === '') {
      const request = await axios.delete(`https://shrouded-waters-89012.herokuapp.com${url}`, null);
      updateIssueData(request.data.result);
      return;
      // ^ for testing
    }
    try {
      event.persist();
      const request = await axios.delete(`https://shrouded-waters-89012.herokuapp.com${url}`, {
        data: { issue_id: event.target.id },
      });
      alert(request.data.result);
      getFunc();
    } catch (error) {
      if (error.response !== undefined) {
        if (error.response.data.err !== undefined) {
          updateIssueData(error.response.data.err);
          return;
        }
      }
      updateIssueData('Error: Network Error');
    }
  };

  useEffect(() => {
    getFunc();
  }, []); /* eslint-disable-line */

  /* Styles */
  const liStyleOpen = {
    backgroundColor: 'white',
  };

  const liStyleClosed = {
    backgroundColor: 'grey',
  };
  /* Styles end */
  return (
    <div>
      <h1 id="currentIssueH1">All issues for: {currentProject}</h1>
      <div>
        <form id="submitForm" onSubmit={event => submitFunc(event)} data-testid="submitForm">
          <h3>Submit a new issue:</h3>
          <div id="topInputs">
            <input
              type="text"
              id="topInput"
              placeholder="*Title "
              value={issueTitle}
              onChange={e => setIssueTitle(e.target.value)}
            />
            <br />
            <textarea
              type="text"
              id="textArea"
              placeholder="*Text"
              name="issue_text"
              value={issueText}
              onChange={e => setIssueText(e.target.value)}
            />
          </div>
          <div id="bottomInputs">
            <input
              type="text"
              placeholder="*Created by"
              className="lowerInputs"
              value={createdBy}
              onChange={e => setCreatedBy(e.target.value)}
            />
            <input
              type="text"
              className="lowerInputs"
              placeholder="(opt)Assigned to"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
            />
            <input
              type="text"
              className="lowerInputs"
              placeholder="(opt)Status text"
              value={statusText}
              onChange={e => setStatusText(e.target.value)}
            />
          </div>
          <button type="submit" name="submitButton">
            Submit Issue
          </button>
        </form>
      </div>
      <div id="issueListSection">
        {typeof issueData === 'string' ? (
          <div id="errDiv">{issueData}</div>
        ) : (
          <ul id="ulData">
            {issueData.map((item, index) => (
              <li
                id={item._id}
                key={`li-Key-${index}`}
                style={item.open === true ? liStyleOpen : liStyleClosed}
              >
                <div>
                  <div>
                    <span className="smallText">id: {item._id}</span>
                    <span>
                      <h3 id="lih3">
                        {item.issue_title}- {item.open === true ? '(open)' : '(closed)'}
                      </h3>
                    </span>
                    <span>{item.issue_text}</span>
                    <br />
                    <br />
                  </div>
                  <div className="smallText" id="smallTextDiv">
                    <b>Created by: </b>
                    {item.created_by} <b>Assigned to:</b> {item.assigned_to} <b>Created on:</b>{' '}
                    {item.created_on} <b>Last updated:</b> {item.updated_on} <b> Status:</b>{' '}
                    {item.status_text}
                  </div>
                  <div>
                    <span
                      id={item._id}
                      className="smallText close_Del"
                      onClick={event => closeFunc(event)}
                    >
                      Close?
                    </span>{' '}
                    <span
                      id={item._id}
                      data-testid={`deleteSpan${index}`}
                      className="smallText close_Del"
                      onClick={event => deleteFunc(event)}
                    >
                      Delete?
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default Issues;
