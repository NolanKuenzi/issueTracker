import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Examples from '../components/presentational/examples';

afterEach(cleanup);

describe('<Examples /> component', () => {
  test('It displays examples text', () => {
    const { getByTestId } = render(<Examples />);
    const exampleUsage = getByTestId('exampleUsage');
    const exampleReturn = getByTestId('exampleReturn');
    const exampleLink = getByTestId('exampleLink');
    expect(exampleUsage.textContent).toContain(
      '/api/issues/{project}/api/issues/{project}?open=true&assigned_to=Joe'
    );
    expect(exampleReturn.textContent).toContain(
      '"Fix error in posting data","issue_text":"When we post data it has an error.","created_on":"2017-01-08T06:35:14.240Z","updated_on":"2017-01-08T06:35:14.240Z"'
    );
    expect(exampleLink.textContent).toBe('EXAMPLE: Go to /apitest/ project issues');
  });
});
