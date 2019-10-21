import React from 'react';
import { render, cleanup, fireEvent, act, waitForDomChange, wait } from '@testing-library/react';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import Issues from '../components/container/issues';

jest.mock('axios');
afterEach(cleanup);

describe('<Issues /> component', () => {
  test('It displays correct axios.get data', async () => {
    const { container } = render(<Issues />);
    await act(async () => {
      await waitForDomChange();
      const ulData = container.querySelector('[id="ulData"]');
      expect(ulData.textContent).toContain('Formatting err');
      expect(ulData.textContent).toContain('Mongoose Schema incorrectly written');
      expect(ulData.textContent).toContain('Database Err');
      expect(ulData.textContent).toContain('Collection not found');
    });
  });
  test('It displays correct axios.post data', async () => {
    const { container } = render(<Issues />);
    await act(async () => {
      await waitForDomChange();
      const submitForm = container.querySelector('[id="submitForm"]');
      fireEvent.submit(submitForm);
      await waitForDomChange();
      const ulData = container.querySelector('[id="ulData"]');
      expect(ulData.textContent).toContain('Website Menu Data');
      expect(ulData.textContent).toContain('Website Menu data is out of date');
      expect(ulData.textContent).toContain('Tech Support');
      expect(ulData.textContent).toContain('Upper Management');
    });
  });
  test('It dispalys correct axios.delete data', async () => {
    const { container, getByTestId } = render(<Issues />);
    await act(async () => {
      await waitForDomChange();
      const ulData = container.querySelector('[id="ulData"]');
      expect(ulData.textContent).toContain('Formatting err');
      expect(ulData.textContent).toContain('Mongoose Schema incorrectly written');
      expect(ulData.textContent).toContain('Database Err');
      const deleteSpan0 = getByTestId('deleteSpan0');
      fireEvent.click(deleteSpan0);
      await waitForDomChange();
      expect(ulData.textContent).not.toContain('Formatting err');
      expect(ulData.textContent).not.toContain('Mongoose Schema incorrectly written');
    });
  });
});
