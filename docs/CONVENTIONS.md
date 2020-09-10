# 基本约定

## Git

项目启用了提交信息格式检查：

```properties
<type>(<scope>): <subject>
```

推荐使用以下命令进行提交

```shell
$ yarn commit
```

使用约定式提交信息，一次提交的 scope 应该唯一

### 提交类型 (type)

常用

- feat: 新特性 / 新功能
- fix: 缺陷 (bug) 修复
- refactor: 无新功能添加，也不属于 bug 修复的代码修改。
- docs: 仅影响文档的提交
- test: 添加缺失的测试文件或修改已有测试 (单元测试应在提交 feature 时就附带)

其他

- style: 不影响代码含义的修改 (空格, 格式, 分号等)
- perf: 影响性能的修复
- build: 影响构建系统和外部依赖的修改
- ci: 影响持续集成配置及脚本的提交

### 范围 (scope)

定期维护，只允许使用约定的范围。

#### 以一级业务划分

> 基本对应 `@/domain` 的一级子目录

- app: 应用
- form: 表单
- org: 组织
- role: 角色
- account: 账号
- home: 首屏/首页
- workflow: 流程 **(TBD)**

#### 以二级业务划分

> 基本对应各项业务下的子路由
>
> 在能使用二级业务精确表达时应优先使用二级业务

首页

- login: 登录
- register: 注册

表单设计器页面

- form-design: 表单模板设计
- list-design: 表单记录列表设计
- workflow-design: 工作流设计 **(TBD)**
- form-setting: 表单设置 **(TBD)**

应用页面

> 目前一个模板对应一个表单实例

- form-inst: 表单实例 **(TBD)**
- form-record: 表单实例记录

组织页面

- org-dept: 部门管理
- org-member: 成员管理

#### 以项目模块划分

- i18n: `@/locales` 下国际化资源的修改
- layout: `@/layout` 下公共布局组件
- comp: `@comp` 下公共组件的修改
- util: `@/utils` 下工具函数的修改
- config: `@/config` 下配置文件的修改
- asset: `@/assets` 下静态资源文件的修改

如无上述所约定的范围，请留空。

### 标题 (subject)

- 不要使用笼统的语言，如 "code update", "fixes", "wip" 等作为标题。
- 约定 Jira Issue ID (如: lcp-123) 在 title 最前面
- 提交类型已经表明的含义不需要赘述

以下为例子：

```properties
# Bad, 赘述
fix(app): fix app bug lcp-121

# Bad, 赘述
test(form-record): add test for form-inst

# Bad, 不存在的类型或范围
css(hello-world): adjust styles

# Good
fix(app): lcp-2333 broken css
fix(app): lcp-456

# Good
feat(form-tpl): assoc-form canvas

```

---

## 命名

### 普通变量

小驼峰 ( camelCase )

```typescript
let fooBar = 'foobar';
```

### 常量

大写下划线

```typescript
const api = {
  GET_FORM: '/api/form',
  CREATE_FORM: '/api/form',
};
```

### 类名/类型名/React 组件名

大驼峰 (UpperCamelCase)

```typescript
class ClassName {}

interface ClassProps {}
```

### 文件命名

文件命名请勿出现小驼峰

#### React 组件 (.tsx)

大驼峰 (PascalCase)

```
目录 (有样式等)
- ComponentA/index.tsx
- ComponentA/index.scss

文件 (纯TSX)
- ComponentA.tsx
```

```tsx
import ComponentA from '../ComponentA';
```

#### 普通模块 (.ts)

使用横杠连接 (kebab-case)

```
目录
- utils/database-helper/

文件
- database-helper.ts
```

```tsx
import DatabaseHelper from '../utils/database-helper';
```

---

## 样式

- 项目开启 CSS Modules ，样式复用请抽离公共样式文件，然后在各个组件的样式文件内 `@import`，请勿在某个组件里直接引用其它组件的样式

- 如有特殊需求，如在组件内覆盖第三方库的样式，需要局部覆盖样式的话，使用以下语法：

```scss
.someClass {
  :global {
    .ant-tab .ant-tab-item {
      color: #eee;
    }
  }
  // Or
  :global(.ant-tab .ant-tab-item) {
    color: #eee;
  }
}
```

- 如果有特别的需求（如定制组件）需要定义全局样式，定义 `xxx.global.scss`，在相应的模块导入。

> 注：这样命名的样式文件导入后是全局生效的，注意命名避免污染全局

- SCSS 全局变量定义在 `@/resource.scss`，会自动处理

- 避免写内联样式

推荐阅读 [CSS Modules](http://www.ruanyifeng.com/blog/2016/06/css_modules.html) 和 [SCSS 文档](https://www.sass-lang.com/documentation)

---

## 国际化 ID

项目使用 `react-intl` 进行国际化。

国际化按照页面进行划分，命名约定按层级进行描述，一般为 `[业务].[功能].[组件].[字段]`，视情况扩展或缩减。

例如：

```js
// zh-CN.ts
export default {
  'form.tpl.title': '表单设计'
  'form.tpl.panel.common.input': '单行文本'
  'app.drawer.dropmenu.design-form': '设计表单'
}

// en-US.ts
export default {
  'form.tpl.title': 'Form Design'
  'form.tpl.panel.common.input': 'Input',
  'app.drawer.dropdown.design-form': 'Form design'
}
```

其中 form 为表单业务，tpl 为 form-template 功能，panel 为页面左侧面板，common 为面板的通用组件区域，input 指 单行文本。

- 统一为小写，词组用横杠连接
- 命名并不是越详细越长越好，重点在于唯一性，不混淆。
