# 高级简洁 UI 设计系统

概述

- 基调：深色背景（深炭灰）+ 冷色高光（天蓝），营造简洁高级感。
- 视觉要点：统一间距、柔和圆角、轻微玻璃感、饱和度低的文字色。

设计代币（CSS 变量）

- `--bg`, `--surface`, `--text`, `--muted`, `--accent` 等。

组件说明（快速上手）

- `Button`：三种变体 `primary|ghost|neutral`，用法：

```tsx
import { Button } from "./ui";
<Button variant="primary">保存</Button>;
```

- `Input`：带 focus 高亮，用于表单与搜索。
- `Card`：通用容器，适合展示模块信息。

风格原则

- 保持色彩节制：用 1-2 个强调色。
- 间距用变量 `--space-1/2/3` 统一。
- 交互动效轻微位移和阴影，避免过度运动。

示例

- 请参见 `src/App.tsx` 中的演示区域。
