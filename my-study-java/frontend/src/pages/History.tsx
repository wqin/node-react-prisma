import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Input, Button, Select, Table } from "../ui";

type HistoryItem = {
  id: number;
  operationType: string;
  entityType: string;
  operatorName?: string;
  entityName?: string;
  detail?: string;
  createdAt: string;
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function History() {
  const [records, setRecords] = useState<HistoryItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory(currentPage, pageSize, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, keyword]);

  function fetchHistory(page: number, size: number, nextKeyword: string) {
    axios
      .get("/api/history", {
        params: {
          page: String(page - 1),
          size: String(size),
          keyword: nextKeyword || undefined,
        },
      })
      .then((res) => {
        const body =
          res.data && typeof res.data === "object" && "code" in res.data
            ? res.data
            : { code: 0, data: res.data };
        if (body.code !== 0) {
          throw new Error(body.message || "load history failed");
        }
        const pageData = body.data;
        setRecords(Array.isArray(pageData?.content) ? pageData.content : []);
        setTotal(Number(pageData?.totalElements || 0));
        setTotalPages(Math.max(1, Number(pageData?.totalPages || 1)));
      })
      .catch(() => {
        setRecords([]);
        setTotal(0);
        setTotalPages(1);
      });
  }

  const columns = [
    { key: "operation", title: "操作" },
    { key: "entity", title: "对象" },
    { key: "detail", title: "内容" },
    { key: "operator", title: "执行人" },
    { key: "time", title: "时间" },
  ];

  const data = records.map((item) => ({
    operation: (
      <div className="history-opCell">
        <span
          className={`history-badge history-badge-${item.operationType.toLowerCase()}`}
        >
          {item.operationType}
        </span>
      </div>
    ),
    entity: (
      <div>
        <div className="history-entityTitle">
          {item.entityName || item.entityType}
        </div>
        <div className="history-entityMeta">{item.entityType}</div>
      </div>
    ),
    detail: <div className="history-detail">{item.detail || "-"}</div>,
    operator: item.operatorName || "System",
    time: formatTime(item.createdAt),
  }));

  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(currentPage * pageSize, total);

  return (
    <div className="pageShell">
      <section className="pageIntro pageIntro-history">
        <div>
          <p className="eyebrow">Operation History</p>
          <h2 className="pageHeading">操作记录中心</h2>
          <p className="pageSubheading">
            集中查看图书新增、编辑、删除等关键动作，支持关键词搜索和时间回溯。
          </p>
        </div>
        <div className="history-summaryCard">
          <span className="history-summaryLabel">累计记录</span>
          <strong className="history-summaryValue">{total}</strong>
          <span className="history-summaryHint">
            实时记录最近的业务变更轨迹
          </span>
        </div>
      </section>

      <Card className="panelCard">
        <div className="toolbarRow">
          <div className="toolbarSearchGroup">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索操作类型、对象名称、详情"
            />
            <Button
              variant="primary"
              type="button"
              onClick={() => {
                setCurrentPage(1);
                setKeyword(searchText.trim());
              }}
            >
              搜索
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setSearchText("");
                setKeyword("");
                setCurrentPage(1);
              }}
            >
              清空
            </Button>
          </div>
          <div className="toolbarMeta">展示系统内所有新增、编辑、删除操作</div>
        </div>

        <div className="historyTableWrap">
          <Table columns={columns} data={data} />
        </div>

        <div className="paginationBar">
          <div className="paginationInfo">
            显示 {start}-{end} / {total}
          </div>
          <div className="paginationControls">
            <Select
              value={String(pageSize)}
              onChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
              options={[
                { value: "10", label: "10 / 页" },
                { value: "20", label: "20 / 页" },
                { value: "50", label: "50 / 页" },
              ]}
            />
            <Button
              variant="ghost"
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              上一页
            </Button>
            <div className="paginationPage">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="ghost"
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
            >
              下一页
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
