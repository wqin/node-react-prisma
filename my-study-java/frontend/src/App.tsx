import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Books from "./pages/Books";
import History from "./pages/History";
import "./styles.css";
import cardStyles from "./ui/Card.module.css";
import {
  Button,
  Card,
  Input,
  Select,
  Modal,
  ToastProvider,
  useToast,
  Table,
  Avatar,
} from "./ui";
import { ThemeProvider, useTheme } from "./theme/ThemeProvider";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <div className="appShell">
            <div className="ambientGlow ambientGlow-left" />
            <div className="ambientGlow ambientGlow-right" />
            <div className="container">
              <header className="header appHeader">
                <div>
                  <p className="brandKicker">Library Console</p>
                  <div className="brandRow">
                    <h1 className="brandTitle">图书资产管理台</h1>
                    <span className="brandPill">Live</span>
                  </div>
                </div>
                <nav className="mainNav">
                  <Link to="/">首页</Link>
                  <Link to="/books">图书管理</Link>
                  <Link to="/history">操作记录</Link>
                </nav>
                <div className="headerActions">
                  <div className="ui-demo">
                    <Input placeholder="全局搜索暂未接入" disabled />
                    <Button variant="ghost" type="button">
                      Insights
                    </Button>
                  </div>
                  <ThemeToggle />
                </div>
              </header>

              <main className="appMain">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/history" element={<History />} />
                </Routes>
              </main>

              <section className="systemSection">
                <Card className="systemCard">
                  <div className="systemCardHeader">
                    <div>
                      <p className="eyebrow">UI System</p>
                      <h3 className={cardStyles.title}>控制台组件预览</h3>
                    </div>
                    <p className={cardStyles.body}>
                      统一的按钮、筛选、弹窗和表格语言，覆盖图书管理与操作审计页面。
                    </p>
                  </div>
                  <DemoControls />
                </Card>
              </section>
            </div>
          </div>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <div style={{ marginLeft: 12 }}>
      <Button variant="neutral" onClick={toggle}>
        {theme === "dark" ? "切换到浅色" : "切换到深色"}
      </Button>
    </div>
  );
}

function DemoControls() {
  const [open, setOpen] = React.useState(false);
  const [sel, setSel] = React.useState("all");
  const { show } = useToast();

  const columns = [
    { key: "title", title: "Title" },
    { key: "author", title: "Author" },
  ];
  const data = [
    { title: "The Pragmatic Programmer", author: "Andrew Hunt" },
    { title: "Clean Code", author: "Robert C. Martin" },
  ];

  return (
    <div className="demoControls">
      <div className="demoControlsRow">
        <Select
          options={[
            { value: "all", label: "All" },
            { value: "fav", label: "Favorites" },
          ]}
          value={sel}
          onChange={setSel}
        />
        <Button variant="neutral" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
        <Button variant="ghost" onClick={() => show("已保存")}>
          Show Toast
        </Button>
        <Avatar name="Ada Lovelace" />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="示例模态">
        <p className="mutedText">这是一个示例模态窗口。</p>
      </Modal>

      <Table columns={columns} data={data} />
    </div>
  );
}
