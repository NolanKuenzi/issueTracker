import React from 'react';
import { render, cleanup } from '@testing-library/react';
import UserStories from '../components/presentational/userStories';

afterEach(cleanup);

describe('<UserStories /> component', () => {
  test('It displays user stories text', () => {
    const { getByTestId } = render(<UserStories />);
    const userStoriesOl = getByTestId('userStoriesOl');
    expect(userStoriesOl.textContent).toContain(
      `I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.`
    );
    expect(userStoriesOl.textContent).toContain(
      `I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.`
    );
  });
});
