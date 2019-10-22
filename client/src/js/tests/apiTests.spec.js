import React from 'react';
import { render, cleanup, waitForDomChange, fireEvent, act } from '@testing-library/react';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import ApiTests from '../components/container/apiTests';

jest.mock('axios');
afterEach(cleanup);

describe('<ApiTests /> component', () => {
  test('Page displays the correct text', () => {
    const { container } = render(<ApiTests />);
    const apiTestsId = container.querySelector('[id="apiTestsId"]');
    expect(apiTestsId.textContent).toContain('Submit issue on apitest');
    expect(apiTestsId.textContent).toContain(
      'Update issue on apitest (Change any or all to update issue on the _id supplied'
    );
    expect(apiTestsId.textContent).toContain('Delete issue on apitest');
  });
  test('Page renders post data recieved from axios', async () => {
    const { container } = render(<ApiTests />);
    await act(async () => {
      const submitButton = container.querySelector('[id="submitButton"]');
      fireEvent.click(submitButton);
      await waitForDomChange();
      const axiosData = container.querySelector('[id="returnedData"]');
      expect(axiosData.textContent).toContain('Database Err');
      expect(axiosData.textContent).toContain('Collection not found');
      expect(axiosData.textContent).toContain('Pending');
    });
  });
  test('Page renders put data recieved from axios', async () => {
    const { container } = render(<ApiTests />);
    await act(async () => {
      const issueId = container.querySelector('[id="issue_id"]');
      fireEvent.change(issueId, { target: { value: '5d033feoa78a992482ecf464' } });
      const updateButton = container.querySelector('[id="updateButton"]');
      fireEvent.click(updateButton);
      await waitForDomChange();
      const axiosData = container.querySelector('[id="returnedData"]');
      expect(axiosData.textContent).toContain('Updated Issue:');
      expect(axiosData.textContent).toContain('5d033feoa78a992482ecf464');
      expect(axiosData.textContent).toContain('It is throwing a 403 error');
      expect(axiosData.textContent).toContain('Bethany');
    });
  });
  test('Page renders delete data recieved from axios', async () => {
    const { container } = render(<ApiTests />);
    await act(async () => {
      const deleteButton = container.querySelector('[id="deleteButton"]');
      fireEvent.click(deleteButton);
      await waitForDomChange();
      const axiosData = container.querySelector('[id="returnedData"]');
      expect(axiosData.textContent).toBe(
        'Issue: Server Error (_id: 5d033feoa78a992482ecf464) has been deleted'
      );
    });
  });
});
