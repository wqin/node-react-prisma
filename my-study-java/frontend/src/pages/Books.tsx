import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Input, Button, Table, Avatar, Select, useToast } from "../ui";

type Book = {
  id?: number;
  title: string;
  author: string;
  number?: number;
  description?: string;
};

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState<Book>({
    title: "",
    author: "",
    number: 1,
    description: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { show } = useToast();

  useEffect(() => {
    fetchBooks(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  function fetchBooks(page?: number, size?: number) {
    const p = page ?? currentPage;
    const s = size ?? pageSize;
    const params = { page: String(p - 1), size: String(s) };
    axios
      .get("/api/books", { params })
      .then((r) => {
        const body =
          r.data && typeof r.data === "object" && "code" in r.data
            ? r.data
            : { code: 0, data: r.data };
        if (body.code !== 0) throw new Error(body.message || "error");
        const d = body.data;
        if (d && d.content && Array.isArray(d.content)) {
          setBooks(d.content);
          setTotal(Number(d.totalElements || 0));
          setTotalPages(Number(d.totalPages || 1));
          setCurrentPage((d.number || 0) + 1);
        } else if (Array.isArray(d)) {
          setBooks(d);
          setTotal(d.length);
          setTotalPages(Math.max(1, Math.ceil(d.length / s)));
        } else {
          setBooks([]);
          setTotal(0);
          setTotalPages(1);
        }
      })
      .catch(() => {
        setBooks([]);
        setTotal(0);
        setTotalPages(1);
      });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      axios
        .put(`/api/books/${editingId}`, form)
        .then((res) => {
          const body =
            res.data && typeof res.data === "object" && "code" in res.data
              ? res.data
              : { code: 0, data: res.data };
          if (body.code === 0) {
            setForm({ title: "", author: "", number: 1, description: "" });
            setEditingId(null);
            fetchBooks(1, pageSize);
            show("Updated book");
          } else {
            show(body.message || "Update failed");
          }
        })
        .catch(() => show("Update failed"));
    } else {
      axios
        .post("/api/books", form)
        .then((res) => {
          const body =
            res.data && typeof res.data === "object" && "code" in res.data
              ? res.data
              : { code: 0, data: res.data };
          if (body.code === 0) {
            setForm({ title: "", author: "", number: 1, description: "" });
            setCurrentPage(1);
            fetchBooks(1, pageSize);
            show("Added book");
          } else {
            show(body.message || "Add failed");
          }
        })
        .catch(() => show("Add failed"));
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ title: "", author: "", number: 1, description: "" });
  }

  async function exportBooks() {
    try {
      const res = await axios.get("/api/books/export", {
        responseType: "blob",
      });
      const disposition = (res.headers &&
        (res.headers["content-disposition"] ||
          res.headers["Content-Disposition"])) as string | undefined;
      let filename = "books.xlsx";
      if (disposition) {
        const m = disposition.match(/filename="?([^";]+)"?/);
        if (m && m[1]) filename = m[1];
      }
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      show("Export started");
    } catch (err) {
      console.error("Export failed", err);
      show("Export failed");
    }
  }

  function remove(id?: number) {
    if (!id) return;
    axios
      .delete(`/api/books/${id}`)
      .then((res) => {
        const body =
          res.data && typeof res.data === "object" && "code" in res.data
            ? res.data
            : { code: 0, data: res.data };
        if (body.code === 0) {
          fetchBooks();
          show("Deleted");
        } else {
          show(body.message || "Delete failed");
        }
      })
      .catch(() => show("Delete failed"));
  }

  const columns = [
    { key: "title", title: "Title" },
    { key: "author", title: "Author" },
    { key: "quantity", title: "Quantity" },
    { key: "description", title: "Description" },
    { key: "actions", title: "" },
  ];

  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + books.length, total);
  const pageItems = books;

  const data = pageItems.map((b) => ({
    title: (
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Avatar name={b.author} />
        <div>
          <div style={{ fontWeight: 700 }}>{b.title}</div>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>
            {b.description}
          </div>
        </div>
      </div>
    ),
    author: b.author,
    quantity: b.number ?? 0,
    description: b.description || "-",
    actions: (
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          variant="ghost"
          onClick={() => {
            setEditingId(b.id ?? null);
            setForm({
              title: b.title,
              author: b.author,
              number: b.number ?? 1,
              description: b.description,
            });
          }}
        >
          Edit
        </Button>
        <Button variant="ghost" onClick={() => remove(b.id)}>
          Delete
        </Button>
      </div>
    ),
  }));

  return (
    <div className="pageShell">
      <section className="pageIntro pageIntro-books">
        <div>
          <p className="eyebrow">Books Workspace</p>
          <h2 className="pageHeading">图书管理</h2>
          <p className="pageSubheading">
            管理馆藏图书信息，维护库存并导出 Excel，同时自动记录关键操作轨迹。
          </p>
        </div>
        <div className="booksSummaryCard">
          <span className="history-summaryLabel">当前总数</span>
          <strong className="history-summaryValue">{total}</strong>
          <span className="history-summaryHint">
            分页数据与导出能力保持同步
          </span>
        </div>
      </section>

      <Card className="panelCard">
        <form onSubmit={submit} className="bookFormGrid">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            required
          />
          <Input
            type="number"
            min={0}
            placeholder="Quantity"
            value={form.number ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                number:
                  e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
            required
          />
          <Input
            placeholder="Description"
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="bookFormActions">
            <Button type="submit" variant="primary">
              {editingId ? "Save" : "Add"}
            </Button>
            {editingId ? (
              <Button type="button" variant="ghost" onClick={cancelEdit}>
                Cancel
              </Button>
            ) : (
              <Button type="button" variant="neutral" onClick={exportBooks}>
                Export Excel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="tableSection">
        <Table columns={columns} data={data} />

        <div className="paginationBar">
          <div className="paginationLeft">
            <div className="paginationLabel">Rows:</div>
            <Select
              value={String(pageSize)}
              onChange={(v) => {
                setPageSize(Number(v));
                setCurrentPage(1);
              }}
              options={[
                { value: "5", label: "5" },
                { value: "10", label: "10" },
                { value: "20", label: "20" },
              ]}
            />
          </div>

          <div className="paginationControls">
            <div className="paginationInfo">
              Showing {start + 1}-{end} of {total}
            </div>

            <div className="paginationButtonGroup">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <div className="paginationPage">
                Page {currentPage} / {totalPages}
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
