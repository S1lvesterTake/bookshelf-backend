const { nanoid } = require('nanoid');
const books = require('./book');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  let finished = false;

  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (readPage === pageCount) {
    finished = true;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// eslint-disable-next-line no-unused-vars
const getAllBooksHandler = (request, h) => {
  const params = request.query;
  if (books.length === 0) {
    return {
      status: 'success',
      data: {
        books: [],
      },
    };
  }

  let tempBooks = books;
  if (params.reading === '0') {
    tempBooks = tempBooks.filter((book) => book.reading === false);
  }

  if (params.reading === '1') {
    tempBooks = tempBooks.filter((book) => book.reading === true);
  }

  if (params.finished === '0') {
    tempBooks = tempBooks.filter((book) => book.finished === false);
  }

  if (params.finished === '1') {
    tempBooks = tempBooks.filter((book) => book.finished === true);
  }

  if (params.name !== '' && params.name !== undefined) {
    const pattern = String(params.name).toLowerCase();
    tempBooks = tempBooks.filter((book) => book.name.toLowerCase().includes(pattern));
  }

  const newBooks = [];
  for (let index = 0; index < tempBooks.length; index += 1) {
    const {
      id, name, publisher,
    } = books[index];
    newBooks.push({ id, name, publisher });
  }

  return {
    status: 'success',
    data: {
      books: newBooks,
    },
  };
};

const getBookByIDHandler = (request, h) => {
  const { bookId } = request.params;
  const bookItem = books.filter((item) => item.id === bookId);
  if (bookItem.length > 0) {
    return {
      status: 'success',
      data: {
        book: bookItem[0],
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIDHandler = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  let finished = false;
  const updatedAt = new Date().toISOString();
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (readPage === pageCount) {
    finished = true;
  }

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIDHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIDHandler,
  editBookByIDHandler,
  deleteBookByIDHandler,
};
