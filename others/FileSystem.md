# Linux 下的文件系统

> 在这里，我就不班门弄斧了，主要是记录一下 <https://www.kirito.info/linux-system-programming/#1-文件io> 没有记录的内容。

一方面，很多 Linux 文件系统相关的讲解只讲了关于虚拟文件系统，从进程中获取文件描述符，而虚拟文件系统是底层文件系统的抽象，而不知道这些字段到底是怎么来的。

![Linux 文件系统](./img/file.png)

inode 是文件系统的核心，它包括了文件系统的主要信息，但是不包括文件名，文件名是通过**目录文件**（由 mode 字段控制）来关联的，目录文件中包含了文件名和 inode 的对应关系。

* 这里重点说一下**符号链接**（symbolic link，也称为软链接：soft link）和**硬链接**（hard link）。
  * 硬链接会指向同一个 inode，而不会创建新的 inode，每增加一个硬链接，inode 中的链接数就会增加 1，只有当链接数为 0 时，inode 才会被删除。
  * 而符号链接则是创建一个新的 inode，inode 中的链接数为 1，但是它指向的是另一个 inode，这个 inode 的链接数不会增加。

> [!NOTE]
> 符号链接可以指向一个不存在的文件，而硬链接不可以。因为文件系统会根据符号链接中保存的路径最后找到目标文件去解析，而硬链接则是直接指向 inode，如果 inode 不存在，那么就无法解析。

## 文件系统的挂载

> Unix 下的文件系统挂载都是通过类似树的结构来实现的，其他的文件系统可以自由地挂载到某个目录下，形成树结构。被挂载之前的文件不能被访问到，只能访问到挂载到文件系统的内容，卸载之后，原来的文件就可以访问了。

* Macos 下查看可恢复到文件系统类型

```bash
diskutil listFilesystems
```

如果要挂载到 APFS 文件系统的某个目录下，如果在 windows 和 linux 下都可以访问，格式化成 `exFAT`。

```bash
# King 是 u 盘的名字
diskutil eraseDisk APFS King /dev/disk6
# 一定要先卸载
diskutil unmount /dev/disk6s1
```

APFS 文件系统的磁盘格式化可能遇到以下问题：

```bash
diskutil eraseDisk ExFAT King /dev/disk7
# You cannot manually format an existing APFS Container disk
# 先删除容器再格式化
diskutil apfs deleteContainer /dev/disk7
```

* 挂载的时候，如果已经挂载先卸载，并且一定要指定文件系统类型，下面指定的是 apfs 文件系统，macos 上挂载也可以指定其他的文件系统。

```bash
sudo mount -t apfs /dev/disk6s1 /path/to/MyMountPoint
```

* 卸载的时候，一定要先离开挂载点，再卸载。

### Linux 下文件系统的挂载

在 Linux 下文件系统一般默认是 ext4，可以使用 `lsblk -f`, `fdisk -l` 查看系统的文件系统类型。

使用如下命令可以格式化文件系统，但是注意，如果只想格式化某个分区，一定要指定分区，例如 /dev/sdb1，否则会格式化整个磁盘。

```bash
sudo mkfs.ext4 /dev/sdb
```
