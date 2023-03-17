# ESM

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
