/* Prevents jest from testing client_issues sub directory by not testing .test files */
module.exports = {
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec).js?(x)'],
};
