import React from 'react';
import Examples from './examples';
import Footer from './footer';

const UserStories = () => (
  <div>
    <div id="usrStoriesId">
      <ol data-testid="userStoriesOl">
        <li>I can prevent a cross site scripting(XSS attack).</li>
        <li>
          I can <b>POST</b> /api/issues/{`{projectname}`} with form data containing required{' '}
          <em>issue_title</em>, <em>issue_text</em>, <em>created_by</em>, and optional{' '}
          <em>assigned_to</em> and <em>status_text</em>.
        </li>
        <li>
          The object saved (and returned) will include all of those fields (blank for optional no
          input) and also include <em>created_on</em>(date/time), <em>updated_on</em>(date/time),{' '}
          <em>open</em>(boolean, true for open, false for closed), and <em>_id</em>.
        </li>
        <li>
          I can <b>PUT</b> /api/issues/{`{projectname}`} with a <em>_id</em> and any fields in the
          object with a value to object said object. Returned will be 'successfully updated' or
          'could not update '+_id. This should always update <em>updated_on</em>. If no fields are
          sent return 'no updated field sent'.
        </li>
        <li>
          I can <b>DELETE</b> /api/issues/{`{projectname}`} with a <em>_id</em> to completely delete
          an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could
          not delete '+_id.
        </li>
        <li>
          I can <b>GET</b> /api/issues/{`{projectname}`} for an array of all issues on that specific
          project with all the information for each issue as was returned when posted.
        </li>
        <li>
          I can filter my get request by also passing along any field and value in the query(ie.
          /api/issues/{`{project}`}?open=false). I can pass along as many fields/values as I want.
        </li>
        <li>All 11 functional tests are complete and passing.</li>
      </ol>
    </div>
    <Examples />
    <Footer />
  </div>
);

export default UserStories;
