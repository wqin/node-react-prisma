import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="app-container">
      <header className="site-header">
        <h1 className="site-title">
          <BookOpen size={40} color="#2563eb" /> 小型私人图书馆
        </h1>
        <p className="site-sub">
          欢迎！在这里您可以管理个人藏书、查看库存并进行增删改操作。
        </p>
      </header>

      <section className="card">
        <h2 className="card-title">关于本项目</h2>
        <p>
          这是一个简单的示例应用，用于演示使用 Prisma + Express 提供的 API
          与前端交互。
        </p>
        <p>可用功能：添加新书、修改库存、删除书目以及查看最后更新时间。</p>
        <div style={{ marginTop: 18 }}>
          <Link to="/books" className="btn btn-primary">
            查看图书列表
          </Link>
        </div>
      </section>
    </div>
  );
}
