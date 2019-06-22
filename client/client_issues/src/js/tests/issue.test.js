import React from 'react';
import { render, cleanup, wait, fireEvent } from '@testing-library/react';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import Issues from '../components/container/issues';

jest.mock('axios');
afterEach(cleanup);

describe('<Issues /> component', () => {
  test('It displays correct axios.get data', async () => {
    console.error = jest.fn(); /* eslint-disable-line */
    const { getByTestId } = render(<Issues />);
    await wait(() => {
      const ulData = getByTestId('ulData');
      expect(ulData.textContent).toContain('Formatting err');
      expect(ulData.textContent).toContain('Mongoose Schema incorrectly written');
      expect(ulData.textContent).toContain('Database Err');
      expect(ulData.textContent).toContain('Collection not found');
    });
  });
  test('It displays correct axios.post data', async () => {
    console.error = jest.fn(); /* eslint-disable-line */
    const { getByTestId } = render(<Issues />);
    const submitForm = getByTestId('submitForm');
    fireEvent.submit(submitForm);
    await wait(() => {
      const ulData = getByTestId('ulData');
      expect(ulData.textContent).toContain('Website Menu Data');
      expect(ulData.textContent).toContain('Website Menu data is out of date');
      expect(ulData.textContent).toContain('Tech Support');
      expect(ulData.textContent).toContain('Upper Management');
    });
  });
  test('It dispalys correct axios.delete data', async () => {
    const { getByTestId } = render(<Issues />);
    await wait(async () => {
      const ulData = getByTestId('ulData');
      expect(ulData.textContent).toContain('Formatting err');
      expect(ulData.textContent).toContain('Mongoose Schema incorrectly written');
      expect(ulData.textContent).toContain('Database Err');
      const deleteSpan0 = getByTestId('deleteSpan0');
      fireEvent.click(deleteSpan0);
      await wait(() => {
        expect(ulData.textContent).not.toContain('Formatting err');
        expect(ulData.textContent).not.toContain('Mongoose Schema incorrectly written');
      });
    });
  });
});
