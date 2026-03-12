---
name: explain-code
description: 使用视觉图表和类比来解释代码。当解释代码工作原理、教授代码库或用户问"这是如何工作的？"时使用
---

# 代码解释专家

当解释代码时，始终遵循以下结构：

## 1. 类比先行

用日常生活中的事物比喻代码逻辑。例如：

- Promise就像餐厅的取餐号码牌
- React Hooks就像React组件的"记忆系统"

## 2. 绘制流程图

用ASCII艺术展示代码执行流程：

```
用户点击按钮
    ↓
触发handleClick
    ↓
发送API请求 ──→ 等待响应
    ↓              ↓
更新loading   收到数据
    ↓              ↓
    └──────→ 更新UI
```

## 3. 逐步讲解

把代码拆解成小步骤，一行一行解释发生了什么。

## 4. 指出常见陷阱

分享这种代码模式常见的错误和注意事项。

---

**语气要求**：像和朋友聊天一样，避免过度学术化的表达。

这是一个为 Java 开发者量身定制的 `explain-code` 技能模板，帮助你用类比、流程图和逐步讲解把 Java 代码和架构讲清楚。

## 结构说明

1. 类比先行 — 用生活化比喻建立直观印象（快速降低理解门槛）。
2. 绘制流程图 — 用 ASCII 流程图展示关键调用/数据流。适合描述请求处理、线程交互、生命周期等。
3. 逐步讲解 — 把复杂方法或类拆成小步骤，结合代码片段逐行解释。
4. 指出常见陷阱 — 列出 Java 常见错误与注意点（NPE、并发、类加载问题、资源泄漏等）。

---

## 1. 类比示例（先给直观印象）

- JVM 就像一个公寓楼：类是房间，类加载器是电梯，GC 是清洁工，线程是住户在不同房间走动。
- `CompletableFuture` 就像超市的叫号机：你下单（启动任务），拿到票（future），后台处理完成时广播取货（complete）。
- Spring Bean 生命周期像餐厅：点菜（创建 Bean）→ 上菜（注入）→ 用餐（运行）→ 收盘（销毁、@PreDestroy）。

## 2. 绘制流程图（ASCII）

示例：HTTP 请求在 Spring Boot 中的简单路径

Client -> DispatcherServlet
↓
HandlerMapping → 找到 Controller
↓
Controller.handlerMethod
↓
Service -> Repository（JPA）
↓
DB
↓
返回 → Controller → Response

示例：简单多线程任务（线程池 + Future）

Main线程
↓ submit(task)
线程池 worker ──→ 运行 task
↓
future.get()（阻塞或超时）

## 3. 逐步讲解模板（如何分解代码）

当解释一个方法或类时，请按该顺序讲解：

1. 目的（一句话）：说明方法/类要完成的事情。
2. 输入/输出：列出参数、返回值和边界条件（null、空集合等）。
3. 前置条件/后置条件：调用前需要满足的状态或调用后保证的状态。
4. 关键步骤（逐行或逐段）：
   - 展示代码片段（3-8 行为宜），然后逐行解释为什么这样写、每行做了什么。
   - 标注复杂逻辑（比如同步块、异常处理、流操作、中间态变换）。
5. 性能/复杂度：指出时间、空间复杂度与潜在瓶颈（IO、锁竞争、全表扫描）。
6. 可替代实现：给出 1-2 个简短替代方案（如使用 Streams、并行流、异步 API）。
7. 小结与测试建议：说明如何单元测试和集成测试关键路径。

示例：解释一个简单 DAO 方法

代码片段：

        public Optional<Book> findByIsbn(String isbn) {
                if (isbn == null || isbn.isBlank()) return Optional.empty();
                return repository.findByIsbn(isbn);
        }

逐步讲解：

- 目的：按 ISBN 查书，保证参数校验。
- 输入/输出：String -> Optional<Book>。空或空白 ISBN 返回空 Optional，避免 NPE。
- 关键步骤：先做参数校验，然后委托仓库。这样把边界条件从下层抽离。
- 可替代方案：抛出 IllegalArgumentException 而不是返回空 Optional（根据 API 语义选用）。

## 4. 常见陷阱与建议（针对 Java）

- NullPointerException：
  - 建议使用 `Optional` 明确表达可选值；参数校验使用 `Objects.requireNonNull` 或断言。
- equals/hashCode：
  - 实体类重写 `equals` 与 `hashCode` 时注意使用相同字段集合，且避免使用可变字段（如数据库主键在持久化前可能为 null）。
- 资源泄漏：
  - 使用 `try-with-resources` 管理 `InputStream`, `Connection`, `PreparedStatement` 等。
- 并发问题：
  - 谨慎使用 `synchronized` 与显式锁，优先考虑无锁算法或并发集合（`ConcurrentHashMap`）；警惕竞态和可见性问题（使用 `volatile`、原子类或适当的同步）。
- ClassLoader/依赖冲突：
  - 在容器环境（Tomcat、应用服务器）或模块化系统中，注意类加载器委托与不同版本的库冲突。
- 序列化兼容性：
  - 若实现 `Serializable`，注意 `serialVersionUID` 与字段变更的兼容性。
- 异常设计：
  - 区分受检异常（checked）与运行时异常（runtime）；不要吞掉异常，应记录并转换为有意义的应用异常。
- 性能误区：
  - 不要在热路径创建大量临时对象（频繁装箱/拆箱、字符串拼接）；使用批量操作避免多次 IO 或 DB 调用。

## 5. 样式与示例约定（对讲解者的建议）

- 保持示例小且可运行（方法级别即可）。
- 用真实但简化的代码片段（不要展示项目级别配置细节）。
- 对常见框架（Spring、Hibernate、Maven/Gradle）用实例说明其生命周期与常见问题。
- 给出快速测试建议：单元测试（Mockito）、集成测试（Spring Boot Test）、性能基准（JMH 简单示例）。

---

**语气要求**：像和朋友聊天一样，避免过度学术化的表达。
