const { addBookHandler, getAllBooksHandler, getBookByIDHandler } = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookID}',
    handler: getBookByIDHandler,
  },
];

module.exports = routes;
