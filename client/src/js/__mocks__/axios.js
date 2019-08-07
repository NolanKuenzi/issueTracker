export default {
  post: () =>
    Promise.resolve({
      data: {
        result: [
          {
            issue_title: 'Syntax err',
            issue_text: 'Mongoose Schema incorrectly written',
            created_on: 'new Date()',
            updated_on: 'new Date()',
            created_by: 'Jake',
            assigned_to: 'William',
            status_text: 'Pending',
          },
          {
            issue_title: 'Database Err',
            issue_text: 'Collection not found',
            created_on: 'new Date()',
            updated_on: 'new Date()',
            created_by: 'Nolan',
            assigned_to: 'Jonathan',
            status_text: 'Pending',
          },
        ],
      },
    }),
  put: () =>
    Promise.resolve({
      data: {
        result: [
          {
            _id: '5d033feoa78a992482ecf464',
            issue_title: 'Server Error',
            issue_text: 'It is throwing a 403 error',
            created_on: 'new Date()',
            updated_on: 'new Date()',
            created_by: 'Brenda',
            assigned_to: 'Bethany',
            status_text: 'Pending',
            open: true,
          },
        ],
      },
    }),
  delete: () =>
    Promise.resolve({
      data: {
        result: 'Issue: Server Error (_id: 5d033feoa78a992482ecf464) has been deleted',
      },
    }),
};
