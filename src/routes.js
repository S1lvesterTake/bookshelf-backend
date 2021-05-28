const { addBookHandler } = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: () => {},
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
];

module.exports = routes;
