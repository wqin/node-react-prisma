import { Link, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Books from "./pages/Books";

export default function App() {
  return (
    <div>
      <nav
        style={{
          padding: 12,
          borderBottom: "1px solid #e6edf3",
          background: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <strong style={{ fontSize: 18 }}>小型私人图书馆</strong>
          </Link>
          <div style={{ marginLeft: 12, display: "flex", gap: 8 }}>
            <Link to="/" className="btn btn-ghost">
              首页
            </Link>
            <Link to="/books" className="btn btn-ghost">
              图书列表
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
        </Routes>
      </main>
    </div>
  );
}
