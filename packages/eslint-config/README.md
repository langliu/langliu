# @langliu/eslint-config

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

基于 ESLint 9.x 版本的个人 ESLint 规则配置，支持 `.js`、`.jsx`、`.ts`、`.tsx` 后缀的文件。集成了 [**JavaScript Standard Style**](http://standardjs.com/) 规则

> `typescript-eslint` 已经停止维护，但是在使用官方的脚本进行初始化的时候还是在继续使用 `typescript-eslint`，这里采用社区维护的 [eslint-stylistic
> ](https://github.com/eslint-stylistic/eslint-stylistic) 进行对 typescript 规则的配置

## 安装

```bash
npm install --save-dev @langliu/eslint-config
```

## 使用

```js
import langliuESLintConfig from '@langliu/eslint-config';

export default [...langliuESLintConfig];
```
