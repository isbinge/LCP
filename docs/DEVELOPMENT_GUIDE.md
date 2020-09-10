# 项目模块使用参考

## Web API 定义

API 配置位于 `./src/config/api.ts` ，定义方式遵循以下语法：

### 定义

```properties
API_NAME: `METHOD /api/path/{params}`
```

其中 `API_NAME` 为导出的 API 名称，`METHOD` 为 HTTP 方法，如 `GET` / `POST` / `PUT` 等，`{params}` 为约定式的含参路径定义方式

有时候后端 API 名称不是我们想要的，这里可以做二次命名。且有父级属性名约束，所以可以简化命名，使代码更清晰。如：

```js
export const API = {
  app: {
    CREATE: 'POST /app',
  },
};
```

### 使用

含参路由使用 `pathParams` 传递对应替换参数的 map

```js
// 假设 API 定义为 'POST /app/{appId}/form'

return httpRequest({
  api: API.app.CREATE_FORM,
  pathParams: {
    appId: payload.appId,
  },
});
```

## 国际化

相关约定请查看[国际化约定](./CONVENTIONS.md)

```tsx
// 优先使用组件式的国际化
import { FormattedMessage } from 'react-intl';

// 组件内仅接受 string 类型之处使用 hook
import { useIntl } from 'react-intl';

function Foo() {
  const intl = useIntl();
}

// 在组件外回调使用 LcpIntl
import LcpIntl from '@/utils/locale';

function Foo() {
  const { intl } = LcpIntl;
}
```

## 路由

### 定义

集中声明式路由配置，位于 `./src/config/router.ts`，定义方式请参考先前的配置

### 使用

#### 一般路由

```tsx
// 声明式
function Foo() {
  return <Link to="/path">foo</Link>;
}

// 命令式
const history = useHistory();
history.push('/path');
```

#### 含参路由

请使用已经封装好的组件及函数进行跳转:

```tsx
// 声明式
function Foo() {
  return <LinkR to="/path/:id" values={{ id: 1 }}>foo</Link>
}

// 命令式
const history = useHistoryR();
history.push('/path/:id', { id: 1 });
```
