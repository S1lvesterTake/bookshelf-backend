const {
  addBookHandler, getAllBooksHandler, getBookByIDHandler, editBookByIDHandler,
} = require('./handler');

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
    path: '/books/{bookId}',
    handler: getBookByIDHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIDHandler,
  },
];

module.exports = routes;
