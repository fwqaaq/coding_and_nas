# 深入 Bash

## 输出重定向

```bash
if ! command -v git >/dev/null 2>&1; then
        red "Please install git at first."
        exit 1
fi
```

理解 `2>&1`，这是一种输出重定向

1. Linux 或者 Unix 命令运行时，都会打开三个文件描述符：标准输入（stdin），标准输出（stdout）和标准错误输出（stderr）。它们的文件描述符分别是 0、1 和 2。
2. \> 是重定向运算符，它可以将命令的输出重定向到文件中，如 `command > file` 会将 command 的标准输出重定向到 file 中。
3. `2>&1` 是另一种重定向运算符，它会将标准错误输出重定向到指定的位置（这里是标准输出）。

在上述命令，`>/dev/null` 这部分是将“标准输出”重定向到 `/dev/null`。所以当 `2>&1` 执行时，“标准错误输出”被重定向到了“标准输出”的当前位置，也就是 /dev/null。

`/dev/null` 是一个特殊的文件，写入到它的内容都会被丢弃。这意味着，这个 `command -v git` 命令的所有输出，无论是正常的还是错误的，都会被重定向到 `/dev/null`，即被丢弃。
