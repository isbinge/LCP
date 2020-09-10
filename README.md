# Low-code ERP Platform

![PR Test & Build](https://github.com/allsworth/LCP.Web/workflows/PR%20Test%20&%20Build/badge.svg) ![Sprint Branch Test](https://github.com/allsworth/LCP.Web/workflows/Sprint%20Branch%20Test/badge.svg) ![Test Server Deploy](https://github.com/allsworth/LCP.Web/workflows/Test%20Server%20Deploy/badge.svg?branch=develop) [![codecov](https://codecov.io/gh/allsworth/LCP.Web/branch/develop/graph/badge.svg?token=IXOG5KFP44)](https://codecov.io/gh/allsworth/LCP.Web)

## 开发准备

环境要求

| 环境      | 版本                              |
| --------- | --------------------------------- |
| `node.js` | >= 12.16.1                        |
| `yarn`    | >= 1.22.4                         |
| browser   | Chrome > 78 & Firefox > 72 during beta |
| OS        | Windows 64-bit, macOS             |

安装依赖

```shell
$ yarn
```

开发前请现在项目根目录下配置一个 `.env` 文件，指定 API 服务器地址

```properties
API_SERVER=http://0.0.0.0 # 开发环境下的 API 服务器地址
PORT=9000 # 本地开发服务器端口, 可选
```

启动本地开发服务器

```shell
$ yarn start
```

## 基本约定

包含 Git / 变量 等命名的约定，请移步[这里](./docs/CONVENTIONS.md)查看

## 开发参考

包含一些开发时的内部组件使用问题，请移步[这里](./docs/DEVELOPMENT_GUIDE.md)

## 项目专有名词表

请移步[这里](./docs/DICTIONARY.md)

---

2019-present © Allsworth Inc.
