/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';

const Issues = () => {
  const [defaultData, setDefaultData] = useState(false);
  const [issueData, updateIssueData] = useState(null);
  const currentProject = window.location.pathname.replace(/\//g, '');
  const query = window.location.search;
  const url = query === '' ? `/api/issues/${currentProject}` : `/api/issues/${currentProject}${query}`;
  
  const getFunc = async () => {
    try {
      const request = await axios.get(`https://shrouded-waters-89012.herokuapp.com${url}`);
      if (request.data.err !== undefined) {
        updateIssueData(request.data.err);
        return;
      }
      updateIssueData(request.data.result);
    } catch (error) {
      console.log(error);
      updateIssueData('An error occurred while connecting to MongoDB Atlas');
    }
  };

  const submitFunc = async event => {
    event.preventDefault();
    event.persist();
    const upperInputs = document.getElementsByClassName('upperInputs');
    const lowerInputs = document.getElementsByClassName('lowerInputs');
    const body = {
      issue_title: upperInputs[0].value,
      issue_text: upperInputs[1].value,
      created_by: lowerInputs[0].value,
      assigned_to: lowerInputs[1].value,
      status_text: lowerInputs[2].value,
    };
    try {
      const request = await axios.post(`https://shrouded-waters-89012.herokuapp.com${url}`, body);
      if (request.data.err !== undefined) {
        alert(request.data.err);
        return;
      }
      event.target.reset();
      updateIssueData(request.data.result);
    } catch(error) {
      console.log(error);
      updateIssueData('An error occurred while connecting to MongoDB Atlas');
    }
  };

  const closeFunc = async event => {
    event.persist();
    try {
      const request = await axios.put(`https://shrouded-waters-89012.herokuapp.com${url}`, {issue_id: event.target.id, updated_on: new Date(), open: false});
      if (request.data.err !== undefined) {
        updateIssueData(request.data.err);
        return;
      }
      alert(`Issue: ${request.data.result[0].issue_title}(_id: ${request.data.result[0]._id}) has been closed`);
    } catch(error) {
      console.log(error);
      updateIssueData('An error occurred while connecting to MongoDB Atlas');
    }
  };

  const deleteFunc = async event => {
    if (event.target.id ===  "") {
      const request = await axios.delete(`https://shrouded-waters-89012.herokuapp.com${url}`, null);
      updateIssueData(request.data.result);
      return;
      /* ^ For testing purposes ^ */
    } 
    try {
      event.persist();
      const request = await axios.delete(`https://shrouded-waters-89012.herokuapp.com${url}`, { 
        data: { issue_id: event.target.id },
      });
      if (request.data.err !== undefined) {
        updateIssueData(request.data.err);
        return;
      }
      alert(request.data.result);
      setDefaultData(false);
    } catch(error) {
      console.log(error);
      updateIssueData('An error occurred while connecting to MongoDB Atlas');
    }
  }

  useEffect(() => {
    if (defaultData === false) {
      getFunc();
      setDefaultData(true);
    }
  }, [defaultData]);

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
            <input className="upperInputs" type="text" id="topInput" placeholder="*Title " name="issue_title" />
            <br />
            <textarea className="upperInputs" type="text" id="textArea" placeholder="*Text" name="issue_text" />
          </div>
          <div id="bottomInputs">
            <input type="text" placeholder="*Created by" className="lowerInputs" name="created_by" />
            <input
              type="text"
              placeholder="(opt)Assigned to"
              className="lowerInputs"
              name="assigned_to"
            />
            <input
              type="text"
              placeholder="(opt)Status text"
              className="lowerInputs"
              name="status_text"
            />
          </div>
          <button type="submit" name="submitButton">
            Submit Issue
          </button>
        </form>
      </div>
      <div id="issueListSection">
        {issueData === null ? null : typeof issueData === 'string' ? <div id="errDiv">{issueData}</div> : (
          <ul data-testid="ulData">
            {issueData.map((item, index) => (
              <li id={item._id} key={item._id} style={item.open === true ? liStyleOpen : liStyleClosed}>
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
                    {item.created_on} <b>Last updated:</b> {item.updated_on} <b> Status:</b> {item.status_text}
                  </div>
                  <div>
                    <span id={item._id} className="smallText close_Del" onClick={event => closeFunc(event)}>Close?</span>{' '}
                    <span id={item._id} data-testid={"deleteSpan"+index} className="smallText close_Del" onClick={event => deleteFunc(event)}>Delete?</span>
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