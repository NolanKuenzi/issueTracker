import React from 'react';

const Examples = () => (
  <div id="examplesId">
    <div>
      <h3>Example get usage:</h3>
      <div data-testid="exampleUsage">
        <span>/api/issues/{`{project}`}</span>
        <br />
        <span>
          /api/issues/{`{project}`}?open=true{'&'}assigned_to=Joe
        </span>
      </div>
    </div>
    <div data-testid="exampleReturn">
      <h3>Example return:</h3>
      <span>{`[{"_id":"5871dda29faedc3491ff93bb","issue_title":"Fix error in posting data","issue_text":"When we post data it has an error.","created_on":"2017-01-08T06:35:14.240Z","updated_on":"2017-01-08T06:35:14.240Z","created_by":"Joe","assigned_to":"Joe","open":true,"status_text":"In QA"},...]`}</span>
    </div>
    <div data-testid="exampleLink">
      <br />
      <a
        href="https://shrouded-waters-89012.herokuapp.com/apitest"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2>EXAMPLE: Go to /apitest/ project issues</h2>
      </a>
    </div>
  </div>
);
export default Examples;
