import { useState } from "react";
import axios from "axios";
import BookCreate from "./components/BookCreate";
import BookList from "./components/BookList";
import { useEffect } from "react";

function App() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    const response = await axios.get("http://localhost:3001/books");
    setBooks(response.data);
  };

  //if we call the function fetchBooks() simply it will be an infinite loop as it will rerender the app component every time so we3 shud intoduce such
  //a way that onl one time the fetchbook is rendered whenever we render component for the first time for thuis we have to use the react property useEffect()

  useEffect(() => {
    fetchBooks();
  }, []);
  //called only after first render since an empty array is placed in second parameter of useEffect

  const editBookById = async (id, newTitle) => {
    const response = await axios.put(`http://localhost:3001/books/${id}`, {
      title: newTitle,
    });

    console.log(response);

    const updatedBooks = books.map((book) => {
      if (book.id === id) {
        return { ...book, title: newTitle };
        //if we had multiple parameters to book and always have the latest updated value of book
        //parameters then instead of updating only title we can update whole other parameters by placing
        // ...response.data instead of title
      }

      return book;
    });
    setBooks(updatedBooks);
  };
  const deleteBookById = async (id) => {
    await axios.delete(`http://localhost:3001/books/${id}`);
    //filter method gives new array does not update existing aray
    const updatedBooks = books.filter((book) => {
      return book.id !== id;
    });
    setBooks(updatedBooks);
  };

  const createBook = async (title) => {
    const response = await axios.post("http://localhost:3001/books", {
      title,
    });

    const updatedBooks = [...books, response.data];
    setBooks(updatedBooks);

    //BAD CODE
    //books.push({id:123,title: title});
    //setBooks(books);

    // const updatedBooks = [
    //   ...books,
    //   {
    //     id: Math.round(Math.random() * 999),
    //     title,
    //   },
    // ];
    // setBooks(updatedBooks);
  };

  return (
    <div className="app">
      <h1>Reading List</h1>
      <BookList books={books} onDelete={deleteBookById} onEdit={editBookById} />
      <BookCreate onCreate={createBook} />
    </div>
  );
}
export default App;
