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
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = () => {
  if (books.length === 0) {
    return {
      status: 'success',
      data: {
        books: [],
      },
    };
  }

  const newBooks = [];
  for (let index = 0; index < books.length; index += 1) {
    const { id, name, publisher } = books[index];
    newBooks.push({ id, name, publisher });
  }

  return {
    status: 'success',
    data: newBooks,
  };
};

const getBookByIDHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((item) => item.id === bookId);

  if (book !== undefined) {
    return {
      status: 'success',
      book: {
        book,
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
      message: 'Gagal memperbaharui buku. Id tidak ditemukan',
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
      message: 'Gagal memperbaharui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbaharui buku. readPage tidak boleh lebih besar dari pageCount',
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
    message: 'Buku berhasil diperbaharui',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIDHandler,
  editBookByIDHandler,
};
