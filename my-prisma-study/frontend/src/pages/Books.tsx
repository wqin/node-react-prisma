import { useState, useEffect } from "react";
import axios from "axios";
import {
  Trash2,
  Edit2,
  Plus,
  CornerUpLeft,
  Save,
  BookOpen,
  Hash,
} from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:5001";
const API_URL = `${API_BASE.replace(/\/$/, "")}/api/books`;

interface Book {
  id: number;
  title: string;
  quantity: number;
  author?: string | { id: number; name: string };
  updatedAt: string;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);
  const [newAuthor, setNewAuthor] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editQuantity, setEditQuantity] = useState(0);
  const [editAuthor, setEditAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const payload =
        response && response.data && response.data.data !== undefined
          ? response.data.data
          : response.data;
      if (
        response &&
        response.data &&
        typeof response.data.code !== "undefined"
      ) {
        if (response.data.code !== 1) {
          const apiMessage =
            response.data.message || "请检查后端服务或数据库连接配置";
          alert(`无法获取书籍列表：${apiMessage}`);
          setBooks([]);
        } else {
          setBooks(payload);
        }
      } else {
        setBooks(payload);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      if (axios.isAxiosError(error)) {
        const apiMessage =
          typeof error.response?.data?.error === "string"
            ? error.response.data.error
            : "请检查后端服务或数据库连接配置";
        alert(`无法获取书籍列表：${apiMessage}`);
      } else {
        alert("无法获取书籍列表，请检查后端服务或数据库连接配置。");
      }
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await axios.post(API_URL, {
        title: newTitle,
        quantity: newQuantity,
        author: newAuthor,
      });
      setNewTitle("");
      setNewQuantity(1);
      setNewAuthor("");
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const deleteBook = async (id: number) => {
    if (window.confirm("确定要删除这本书吗？")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const startEdit = (book: Book) => {
    setEditingId(book.id);
    setEditTitle(book.title);
    setEditQuantity(book.quantity);
    setEditAuthor(
      typeof book.author === "string" ? book.author : (book.author?.name ?? ""),
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: number) => {
    if (!editTitle.trim()) return;
    try {
      await axios.put(`${API_URL}/${id}`, {
        title: editTitle,
        quantity: editQuantity,
        author: editAuthor,
      });
      setEditingId(null);
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <div className="app-container">
      <header className="site-header">
        <h1 className="site-title">
          <BookOpen size={40} color="#2563eb" /> 小型私人图书馆
        </h1>
        <p className="site-sub">轻松管理您的图书收藏和库存</p>
      </header>

      {/* Add Form Card */}
      <section className="card">
        <h3 className="card-title">入库新书</h3>
        <form onSubmit={addBook} className="form-grid">
          <div>
            <label className="form-label">书籍名称</label>
            <div className="input-container">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="请输入书名..."
                className="input"
                required
              />
            </div>
          </div>
          <div>
            <label className="form-label">作者</label>
            <div className="input-container">
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="请输入作者姓名..."
                className="input"
              />
            </div>
          </div>
          <div className="quantity-input-container">
            <label className="form-label">初始库存储备</label>
            <input
              type="number"
              min="1"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
              className="input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Plus size={20} /> 添加书目
          </button>
        </form>
      </section>

      {/* Book List Section */}
      <section>
        <div className="books-hero">
          <h2 className="books-hero-title">馆藏清单</h2>
          <span className="books-count">共 {books.length} 本书目</span>
        </div>

        {loading ? (
          <div className="fade-in loading-state">加载中...</div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} className="empty-icon" />
            <p>书库空空的，快去添加第一本书吧！</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div
                key={book.id}
                className={`book-card ${editingId === book.id ? "editing" : ""}`}
                role="article"
              >
                {editingId === book.id ? (
                  <div className="edit-mode-container">
                    <div className="edit-input-title">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="edit-input-field"
                        autoFocus
                      />
                    </div>
                    <div className="edit-input-author">
                      <input
                        type="text"
                        value={editAuthor}
                        onChange={(e) => setEditAuthor(e.target.value)}
                        className="edit-input-field"
                        placeholder="作者"
                      />
                    </div>
                    <div className="edit-input-quantity">
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) =>
                          setEditQuantity(parseInt(e.target.value) || 0)
                        }
                        className="edit-input-field"
                      />
                    </div>
                    <div className="edit-actions">
                      <button
                        onClick={() => saveEdit(book.id)}
                        className="btn-save-edit"
                        title="保存"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn-cancel-edit"
                        title="取消"
                      >
                        <CornerUpLeft size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="book-info-container">
                      <div className="book-icon-wrapper">
                        <Hash size={20} />
                      </div>
                      <div>
                        <h4 className="book-title-text">{book.title}</h4>
                        <div className="book-author-text">
                          作者:{" "}
                          {typeof book.author === "string"
                            ? book.author
                            : (book.author?.name ?? "未知")}
                        </div>
                        <div className="book-meta-info">
                          <span
                            className={`book-badge ${book.quantity > 0 ? "badge-in" : "badge-out"}`}
                          >
                            库存: {book.quantity}
                          </span>
                          <span>•</span>
                          <span>
                            最后更新:{" "}
                            {new Date(book.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="controls">
                      <button
                        onClick={() => startEdit(book)}
                        className="book-btn-edit btn-edit"
                        title="修改书籍信息"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteBook(book.id)}
                        className="book-btn-delete"
                        title="从库中移除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
