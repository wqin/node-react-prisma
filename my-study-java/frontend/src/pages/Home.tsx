import React from "react";
import { Card, Button } from "../ui";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="pageShell">
      <section className="homeHero">
        <div className="homeHeroContent">
          <p className="eyebrow">Smart Collection Workspace</p>
          <h1 className="homeTitle">
            把图书管理和操作审计放进同一个精致的工作台
          </h1>
          <p className="homeLead">
            在一个页面体系里完成图书维护、Excel
            导出和全量操作回溯，减少日常维护的切换成本。
          </p>
          <div className="homeActions">
            <Link to="/books">
              <Button variant="primary" className="lg">
                进入图书管理
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="neutral" className="lg">
                查看操作记录
              </Button>
            </Link>
          </div>
        </div>
        <div className="homeMetricGrid">
          <Card className="metricCard">
            <span className="metricLabel">管理能力</span>
            <strong className="metricValue">CRUD</strong>
            <p className="metricText">新增、编辑、删除与导出统一处理</p>
          </Card>
          <Card className="metricCard accent">
            <span className="metricLabel">审计能力</span>
            <strong className="metricValue">History</strong>
            <p className="metricText">记录每次变更，支持快速搜索定位</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
