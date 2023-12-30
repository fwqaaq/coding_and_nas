# 在群晖中碰到的一些问题

1. VSCode Remote SSH 无法连接：将 `sshd_config` 中 `AllowTcpForwarding` 改为 yes
2. SSH 无法使用公钥私钥连接：
   * 修改群晖的用户目录到 755 才行，默认是 777：
  
   ```sh
   chmod 755 ~
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

   * 到 sshd_config 中将 `PubkeyAuthentication` 改为 yes，将 `AuthorizedKeysFile` 注释打开
3. 配置 `oh-my-zsh`，群晖由于没有 `chsh` 命令支持，也不要擅自改动 `/etc/passwd` 中的 shell，而是在 `~/.profile` 中添加：

   ```sh
   if [[ -x /usr/local/bin/zsh ]]; then
       export SHELL=/usr/local/bin/zsh
       exec /usr/local/bin/zsh
   fi
   ```

   * 添加完套件中心的[群晖社区源](http://packages.synocommunity.com/)之后，就可以下载 `zsh` 了，然后使用 <https://github.com/fwqaaq/dot> 中的脚本一键美化了。
4. NVIM 在硬链接之后会出现找不到文件的问题，一定要使用**软链接**，这样就不会出现问题了。参见：<https://vi.stackexchange.com/questions/42676/neovim-0-9-1-cant-open-syntax-vim>
5. 下载 OPKG，参考：<https://www.technorabilia.com/using-entware-on-synology-nas/>，下载完之后可以直接使用 `opkg install xxx` 来安装软件，例如安装 gcc（opkg install gcc）。
6. 下载 Rust 的时候遇到如下问题：

   ```txt
   "Cannot execute /tmp/tmp.jTWJlXTq1c/rustup-init (likely because of mounting /tmp as noexec)"
   ```

   * 可以更换一下临时目录，例如：

   ```sh
   mkdir ~/tmp
   export TMPDIR=~/tmp
   ```

7. 权限问题，比如使用 npm 下载 pnpm 的时候，会出现权限问题，参考：<https://stackoverflow.com/questions/48910876/error-eacces-permission-denied-access-usr-local-lib-node-modules>。
8. `clangd` 找不到 opkg 安装的头文件，首先找到这些头文件的位置，`cc -v main.c`，然后在跟目录下配置 `.clangd` 文件：

   ```txt
   CompileFlags:
       Add: [-I, /opt/lib/gcc/x86_64-openwrt-linux-gnu/8.4.0/include, -I, /opt/include, -I, /opt/lib/gcc/x86_64-openwrt-linux-gnu/8.4.0/include-fixed, -I, /usr/include]
   ```
