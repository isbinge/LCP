# 项目专有名词

为了统一概念，使 UI 国际化及变量命名时能保持统一，对于项目中的专有名词进行统一：

## 项目/业务

| 名称 | 缩写 | 中文 | 解释 |
| --- | --- | --- | --- |
| Low Code Platform | LCP | - | 低代码 ERP (企业资源计划) 平台 |
| App | - | 应用 | 是多个表单模板及对应表单数据的集合 |
| Form Designer | - | 表单设计器 | 设计表单的一系列工具，其下包含表单模板设计、列表设计、工作流设计、表单设置四个模块 |
| Form Template | formTpl, form-tpl | 表单模板 | 通过表单设计器设计而成, 用于生成表单收集数据 |
| Form Instance | formInst, form-inst | 表单实例（泛指） | 由于一个表单模板可能并不对应某一种表单, 所以把根据某一个表单模板生成的表单称作表单实例, 一个应用下会有很多表单实例 |
| Form Record(s) | - | 表单记录 | 指一个表单实例下，用户提交到表单实例的数据[^注1] |
| Form | - | 表单（特指） | 特指某一用户 _填写时_ 的表单 |
| Workflow | - | 工作流 | 通过工作流组织流程管理及权限管理等功能 |
| Organization | org | 组织 | 一个组织可以是物理划分的 (公司等), 也可以是逻辑上的 (团队等) |
| Department | dept | 部门 | 组织下的基本划分单位 |
| Sub-department | subdept | 子部门 | 部门下的基本划分单位 |

[^注1]: Form Data 已过时，请勿使用 Form Data 指代该数据，容易造成混淆。

## Form Designer 表单设计器

| 名称                    | 缩写        | 中文       | 解释               |
| ----------------------- | ----------- | ---------- | ------------------ |
| Form Design             | -           | 表单设计   | 设计表单布局及行为 |
| Form Record List Design | List Design | 列表设计   | 设计表单记录列表   |
| Workflow Design         | -           | 工作流设计 | 为表单集成工作流   |
| Form Settings           | -           | 表单设置   | 配置表单相关属性   |

## Form Template 表单模板

| 名称 | 缩写 | 中文 | 解释 |
| --- | --- | --- | --- |
| Associated Form | Assoc. Form / AssocForm | 关联表单 |  |
| Associated Field | Assoc. Field / AssocField | 关联属性 | Assoc. Props 或 Assoc. Attr 已过时, 请勿使用 |
| Multi-select Associated Form | Multi-Select Assoc. Form / MSAF | 多选关联表单 |  |
| Data Title | - | 数据标题 |  |
| Data Linkage | DataLkg | 数据联动 | 数据之间的高级联动关系。数据联动比一般的关联表单条件更复杂，更可配置。是自发性的，所以对于用户而言没有 "联动" 这个动作 [^ 注 2 ] |
| Hide Condition | HideCond | 隐藏条件 |  |
| Form (Template) Item Panel | - | 表单组件盘 | 表单设计器左部分, 可拖拽组件到画布上进行设计 |
| Form (Template) Canvas | - | 表单画布 | 表单设计器居中部分, 从组件盘拖拽过来的组件将在这里生成预览组件 |
| Form (Template) Control | - | 表单控制区 | 表单设计器右部分, 控制表单及每个组件的行为, 一些属性可以实时体现在画布上 |

[^ 注2 ]: `DataLink` 已过时，请勿使用

## Form Record 表单记录

| 名称          | 缩写 | 中文                 | 解释                 |
| ------------- | ---- | -------------------- | -------------------- |
| Fill in       | -    | 新增 (填写) 表单记录 | 拉取表单模板进行填写 |
| Edit          | -    | 编辑表单记录         | 编辑已提交的表单     |
| Examine       | -    | 检视表单记录         | 查看已提交的表单     |
| Save as draft | -    | 暂存                 | 将表单记录保存为草稿 |
