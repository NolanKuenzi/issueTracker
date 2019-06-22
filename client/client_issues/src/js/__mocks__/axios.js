export default {
  get: () =>
    Promise.resolve({
      data: {
        result: [
          {
            issue_title: 'Formatting err',
            issue_text: 'Mongoose Schema incorrectly written',
            created_on: 'new date()',
            updated_on: 'new date()',
            created_by: 'Jake',
            assigned_to: 'William',
            status_text: 'Pending',
            open: true,
          },
          {
            issue_title: 'Database Err',
            issue_text: 'Collection not found',
            created_on: 'new Date()',
            updated_on: 'new Date()',
            created_by: 'Nolan',
            assigned_to: 'Jonathan',
            status_text: 'Pending',
            open: true,
          },
        ],
      },
    }),
  post: () =>
    Promise.resolve({
      data: {
        result: [
          {
            issue_title: 'Syntax err',
            issue_text: 'Mongoose Schema incorrectly written',
            created_on: 'new date()',
            updated_on: 'new date()',
            created_by: 'Jake',
            assigned_to: 'William',
            status_text: 'Pending',
            open: true,
          },
          {
            issue_title: 'Database Err',
            issue_text: 'Collection not found',
            created_on: 'new Date()',
            updated_on: 'new Date()',
            created_by: 'Nolan',
            assigned_to: 'Jonathan',
            status_text: 'Pending',
            open: true,
          },
          {
            issue_title: 'Website Menu Data',
            issue_text: 'Website Menu data is out of date',
            created_on: 'new date()',
            updated_on: 'new date()',
            created_by: 'Tech Support',
            assigned_to: 'Upper Management',
            status_text: 'Under further review',
            open: true,
          },
        ],
      },
    }),
  delete: () =>
    Promise.resolve({
      data: {
        result: [
          /* deleted */
          /*  {
            issue_title: 'Formatting err',
            issue_text: 'Mongoose Schema incorrectly written',
            created_on: 'new date()',
            updated_on: 'new date()',
            created_by: 'Jake',
            assigned_to: 'William',
            status_text: 'Pending',
            open: true,
          },  */
          {
            issue_title: 'Database Err',
            issue_text: 'Collection not found',
            created_on: 'new Date()',
            updated_on: 'new Date()',
            created_by: 'Nolan',
            assigned_to: 'Jonathan',
            status_text: 'Pending',
            open: true,
          },
        ],
      },
    }),
};
