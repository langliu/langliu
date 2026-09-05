# @langliu/ui

Monorepo 公共组件包。shadcn/ui 基于 **Base UI**（`style: base-nova`）。

```ts
import { Button } from '@langliu/ui/ui/button'
import { cn } from '@langliu/ui/lib/utils'
```

新增组件（在仓库根目录）：

```bash
pnpm dlx shadcn@latest add dialog -c packages/ui
```

各应用的 `components.json` 已把 `ui` / `utils` 指到本包，从 app 里 `shadcn add` 也会写到 `packages/ui`。
