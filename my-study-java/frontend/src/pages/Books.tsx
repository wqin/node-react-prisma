import React, { useEffect, useState } from "react";
import axios from "axios";

type Book = {
  id?: number;
  title: string;
  author: string;
  description?: string;
};

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Book>({ title: "", author: "" });

  useEffect(() => {
    fetchBooks();
  }, []);

  function fetchBooks() {
    axios
      .get("/api/books")
      .then((r) => setBooks(r.data))
      .catch(() => setBooks([]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    axios.post("/api/books", form).then(() => {
      setForm({ title: "", author: "" });
      fetchBooks();
    });
  }

  function remove(id?: number) {
    if (!id) return;
    axios.delete(`/api/books/${id}`).then(() => fetchBooks());
  }

  return (
    <div>
      <h2>Books</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            <strong>{b.title}</strong> — {b.author}
            <button onClick={() => remove(b.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
