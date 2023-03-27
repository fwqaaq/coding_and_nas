# TS Config

## ESM

> ESM 是 JavaScript 最新的模块化标准，在使用 TypeScript 配置 ESM 的时候，常常会有一些问题。

以下是使用 `tsconfig.json` 配置的 ESM 模块导入规范。首先 `moduleResolution` 是必要的，且必须设置为 `NodeNext` 才是正确的 ESM 的规范，并且还需要开启 `esModuleInterop` 选项才行。

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "ESNext",
    "rootDir": "./src",
    "lib": ["ESNext"],
    "typeRoots": ["./dist"],
    "types": ["node", "typescript/lib/lib", "typescript/lib/lib.es2022"],
    "outDir": "./dist",
    "declaration": true,
    "esModuleInterop": true,
    "moduleResolution": "NodeNext",
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "exclude": ["src/script/**/*"]
}
```

## 导入断言

> JavaScript 规范中，最新规定的导入断言，可以将 json 视为 JavaScript 模块。

* 静态导入

   ```js
   import json from "./package.json" assert {type: "json"}
   ```

* 动态导入

   ```js
   import json from "./package.json" assert {type: "json"}
   ```

**<span style="color:red">注意</span>**：如果是使用的 TypeScript，那么必须在配置文件中添加以下字段

```json
{
  "resolveJsonModule": true,
}
```

## TypeScript 模块

>在一个项目 `src` 目录下有两个相对独立的模块，分别是 `src1` 和 `src2`，其中他们都包含一系列的 `.ts` 文件

* 此时，在根目录需要使用 `tsconfig.json` 来配置编译的方式

   ```json
   {
      "compilerOptions":{
        "lib":["es2015","dom"],
        "types":[],
        "outDir":"dist",
      },
      "include":["src/**/*.ts"]
   }
   ```

  * 此时编译后的文件会分别到 `dist/src1` 和 `dist/src2` 目录下.但是如果 `src1` 变化了，`src2` 同时也会再次被编译，这时候我们需要做一些缓存设置

1. 在 `src1` 和 `src2` 目录下分别创建 `tsconfig.json` 文件，其中需要添加 `composite:true` 这样的配置

   ```json
   //src1 目录下 `tsconfig.json`，src2 目录同理
   {
      "compilerOptions":{
        "composite":"true",
        "lib":["es2015","dom"],
        "types":[],
        "outDir":"dist",
      },
      "include":["../../dist/src1"]
   }
   ```

2. 然后在根目录的 `tsconfig.json` 里加上一个 `references` 的配置

   ```json
   // 根目录下`tsconfig.json`
   {
      "compilerOptions":{
        "lib":["es2015","dom"],
        "types":[],
        "outDir":"dist",
      },
      "references":[
        {"path":"./src/src1"},
        {"path":"./src/src2"}
      ]
   }
   ```

3. 运行 `tsc --build`，编译的结果会多出 `.d.ts` 文件，和缓存文件 `tsconfig.tsbuildinfo`(此文件会记录这些文件的hash值)
   * 使用 `Project Refrence` 需要使用 `tsc --build | -b` 来编译，并且需要在子模块中设置 `composite:true` 来指定
   * 当然，也可以通过 `prepend` 来指定编译顺序.此时可以优先编译 `src2`

   ```json
   {
    ...,
    "references":[
        {"path":"./src/src1"},
        {"path":"./src/src2","prepend":true}
      ]
   }
   ```

## [TS类型来源](https://zhuanlan.zhihu.com/p/531084864)

> ts 中的 `declare` 语法可以单独声明变量的类型

   ```js
   //object
   interface Person {
       name: string
       age?: number
   }
   
   declare const guang: Person
   
   //function
   declare function add(num1: number, num2: number): number
   ```
  
* 但是像浏览器中内置的类型，基本都是必用的.所以 typescript 中内置了这些类型声明，在 typescript 下的 `lib` 文件下
  * 因为是内置的，所以很容易就可以配置

   ```json
   //stsconfig.json`
   {
      "compilerOptions":{
        "lib":["es2015","dom"],
        ...
      },
      ...
   }
   ```

* 像 `node` 这种非内置的类型，使用时需要下载 `@types/node` 才可以使用，这些包会默认放置在 `node_modules` 目录下的 `@types` 中
  * 当然也是需要引入才可以使用

   ```json
   //stsconfig.json`
   {
      "compilerOptions":{
        "types":["node"],
        ...
      },
      ...
   }
   ```

* 如果像 `vue3` 这种使用 typescript 编写的，可以自动生成内置的 `.d.ts` 文件

* 注意:
  * `module` 后一般接一个路径，而 `namespace` 后一般是一个命名空间名字
  * 但是，现在一般推荐使用 `esmodule`，**如果在 dts 中没有 `import` 或者 `export`，那么所有的类型声明都是全局的，否则是模块内部的**

   ```json
   //tsconfig.json
   {
      "files":["./global.d.ts"],
      "include":[
         "./types/**/*",
         "./src/**/*"
      ]
   }
   ```

  * 以下如果不注释 import，那么 .d.ts 不会是全局的

   ```ts
   //global.d.ts
   import * as fs from "fs"
   declare const fn:(a:number,b:number) => number
   ```

* `reference` 可以指定使用的模块的类型，所以在 `.d.ts` 文件中使用的是 reference，而不是 import

   ```ts
   /// <reference types="node">
   declare const fn:(a:number,b:number) => number
   ```

  * 或者在一些配置文件中也可以使用，例如 vite 中的 `env.d.ts`

   ```ts
   /// <reference types="vite/client" />
   ...
   ```

## TS 模块化开发

* TypeScript 的两种支持
  * 模块化：每个文件可以是一个独立的模块，支持ES Module，也支持CommonJS
  * 命名空间：通过 `nampspace` 来声明一个命名空间

### 命名空间

>在 TypeScript 早期时，称之为内部模块，主要是将一个模块内部再惊醒作用域的划分，防止命名冲突

* 命名空间是在 Web 应用程序中构建代码的好方法，所有依赖项都作为 \<script> 标签包含在 HTML 页面中

```ts
export namespace price {
  export function format(price: number) {
    return "99.99"
  }
}
```

### 类型查找

* 另外的一种 `typescript` 文件：`.d.ts` 文件
  * 通常的 `TypeScript` 文件都是以 `.ts` 文件输出
  * 另外一种 `.d.ts` 文件按，是用来做类型的声明 `declare`。（仅仅是用来做类型监测，告知 typescript 有哪些类型）
* 三种类型声明
  * 内置类型声明
  * 外部定义类型声明
  * 自己定义类型声明

#### 内置类型声明

* 内置类型声明是 `typescript` 自带的，帮助我们内置了 `JavaScript` 运行时的一些标准化API的声明文件
  * 包括比如 `Math`、`Date` 等内置类型，也包括 `DOM API`，比如 `Window`，`Document` 等
* 内置类型声明通常在我们安装typescript的环境中会带有的:
  * <https://github.com/microsoft/TypeScript/tree/main/lib>

#### 外部定义类型声明

* 外部类型声明通常是我们使用一些库(比如第三方库)时，需要的一些类型声明
  * 在自己库中进行类型声明（编写 `.d.ts`文件），比如`axios`
  * 通过社区的一个公有库 `DefinitelyTyped` 存放类型声明文件
    * 该库的 GitHub 地址：<https://github.com/DefinitelyTyped/DefinitelyTyped/>
    * 该库查找声明安装方式的地址：<https://www.typescriptlang.org/dt/search?search>=
    * 比如我们安装 react 的类型声明： `npm i @types/react --save-dev`

#### 自定义声明

> 何时使用自定义声明

1. 我们使用的第三方库是一个纯的JavaScript库，没有对应的声明文件:比如lodash
2. 我们给自己的代码中声明一些类型，方便在其他地方直接进行使用

> 变量-函数-类的声明

```ts
declare let whyHeight: number
declare function whyFoo(): void
declare class Person {
  name: string
  age: number
  constructor(name: string, age: number)
}
```

> 声明模块

* 我们也可以声明模块，比如lodash模块默认不能使用的情况
* 声明模块的语法：
  * 在声明模块的内部，我们可以通过 `export` 导出对应库的类、函数等

```ts
declare module 'lodash' {
  export function join(arr: any[]): void
}
```

> 声明文件

* 在开发中我们使用了 jpg 这类图片文件，默认 `typescript` 也是不支持的，也需要对其进行声明

```ts
declare module "*.jpg"{
  const src:string
  export default src
}
```

> 在我们构建 vue 项目时，vue 会自己初始化一个 `shimes-vue.d.ts` 文件

* 其中vue的 `.d.ts` 文件并没有构建其他的全局属性（或者自己添加的），所以如果要使用，最好加上去

```ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.json'
//暴露两个全局属性
declare const $store: any
declare const $filters: any
```
