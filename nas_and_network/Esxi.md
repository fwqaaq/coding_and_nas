# ESXI

## 配置硬盘

### ESXI 磁盘置备选项

* **厚置备延迟零**（Thick Provision Lazy Zeroed）：此选项预先分配虚拟磁盘的全部空间，并将新空间填充为零，但只在首次使用时才会这样做。
* **厚置备预留零**（Thick Provision Eager Zeroed）：与延迟零置备类似，但是会立即将所有空间置零。这会创建一份无任何残留数据的磁盘，通常用于高性能需求。
* **薄置备**（Thin Provision）：此选项只在虚拟机需要时分配物理空间。当虚拟机写入更多数据时，磁盘将按需增长。薄置备允许您在物理存储上节省空间，但可能会带来一些管理挑战，特别是如果多个虚拟机的磁盘都充满的情况。

### 控制器

1. SCSI 控制器（SCSI Controller）：
   * SCSI控制器是一种通用的控制器类型，用于许多现代操作系统。可以选择不同的 SCSI 控制器类型，例如 LSI Logic、BusLogic 等，这些选项可能与您的客户操作系统和特定工作负载有关。
2. IDE 控制器（IDE Controller）：
   * IDE 控制器通常用于较旧的操作系统，可能会限制可连接设备的数量。通常，每个 IDE 控制器可以有两个通道（主/从），因此可以连接两个设备。
3. SATA 控制器（SATA Controller）：
   * SATA控制器是现代硬盘的常见连接方式。可以使用 SATA 控制器连接虚拟 SATA 设备。

* 注意⚠️：控制器编号和设备编号
  * 控制器编号确定了哪个特定的控制器实例。设备编号确定了在特定控制器下连接的设备位置。例如，在 SCSI 控制器下，您可能会看到诸如 `(0:0)`、`(0:1)` 等表示法，其中第一个数字表示控制器编号，第二个数字表示设备编号。

## 存储位置

> 虚拟机的文件（虚拟硬盘、配置文件以及快照文件等）存储在数据存储（datastore）中。

* 数据存储的根目录 /vmfs/volumes/datastore_name
  * 虚拟机文件夹：/vmfs/volumes/datastore_name/vmware_name/
  * VMDK 文件：/vmfs/volumes/datastore_name/vmware_name/vmware_name.vmdk
  * VMX 文件：/vmfs/volumes/datastore_name/vmware_name/vmware_name.vmx

* **虚拟硬盘文件**（VMDK）：存储虚拟机的磁盘数据。
* **配置文件**（VMX）：存储虚拟机的配置信息。
* **快照文件**（Snapshot）：存储虚拟机的快照数据。
* **日志文件**（Log）：存储有关虚拟机操作的日志信息。
* **ISO 文件**：存储 CD/DVD 镜像，可以用于虚拟机的操作系统安装等。

## vSwitch0 配置

> 在 VMware 的虚拟环境中，vSwitch（虚拟交换机）用于虚拟机之间以及虚拟机与物理网络之间的网络通信。vSwitch0 通常是默认的虚拟交换机。

端口组：在虚拟交换机内部，虚拟机与上行链路连接到所谓的“端口组”（Port Group）。端口组定义了网络策略和连接设置，上行链路允许端口组的流量流向外部物理网络。所以虚拟机需要 IP 地址时会自动向局域网上的 DHCP 服务器请求一个 IP 地址。

### 端口组

* VM NetWork：是用于虚拟机（VM）流量的默认端口组。当您创建一个新的虚拟机，并希望它能够与外部网络进行通信时，您通常会将其连接到 VM Network。
* Management Network：是 ESXi 主机用于管理和监视操作的专用端口组。

但是当我们没有特别设置 VLAN 的时候，通用一个上行链路的两个端口也不会发生冲突，可能是以下情况：

1. **逻辑分隔**：虚拟交换机（vSwitch）在逻辑层面上分隔了不同类型的流量。虽然它们可能共享同一物理端口，但虚拟交换机将端口组（例如 VM Network 和 Management Network）的流量隔离开来。
2. **端口和端口组**：在虚拟交换机中，每个虚拟机的网络接口和管理网络都连接到自己的虚拟端口。端口组进一步将这些端口按用途分类。虚拟交换机通过端口和端口组管理流量，确保不同类型的流量按预期路由，不会互相冲突。
3. MAC 地址和 ARP：虚拟交换机使用MAC地址（硬件地址）来识别和路由流量。当数据包到达虚拟交换机时，它会查看目的MAC地址，并将数据包路由到正确的虚拟端口。这样，即使不使用VLAN，流量也可以准确地传递到正确的目的地，不会出现冲突。
4. 不同的网络策略：VM Network 和 Management Network 可能具有不同的安全和流量策略。虚拟交换机会根据这些策略处理流量，确保各自的流量在逻辑上相互隔离。

### 上行链路

> 上行链路（Uplink）是指虚拟见还击连接到物理网络端口。这些上行链路端口将虚拟交换机连接到物理网络。

* 连接到物理网络：上行链路提供了虚拟交换机与物理网络之间的连接点。通过上行链路，虚拟机可以访问局域网、广域网和互联网。
* 关联物理适配器：上行链路与主机上的物理网络适配器（例如 Ethernet 卡）关联。物理适配器充当虚拟交换机和物理交换机之间的桥梁。
* 冗余和负载平衡：可以为虚拟交换机配置多个上行链路。通过使用多个物理网络适配器，可以提供冗余和负载平衡，增加可用性和性能。

### 安全策略

* **混杂模式**（Promiscuous Mode）：在混杂模式下，虚拟交换机的端口组将接收通过交换机的所有流量，而不仅仅是与该端口 MAC 地址匹配的流量。在正常模式下，端口只会接收目标 MAC 地址与其自身匹配的帧。混杂模式在某些情况下可能是有用的，例如网络分析和故障排除，但是它也可能带来安全风险。
* **MAC 地址更改**（MAC Address Changes）：这个设置控制虚拟机是否能更改其操作系统内的 MAC 地址。如果允许虚拟机更改 MAC 地址，并且该地址与虚拟机配置文件中的地址不匹配，交换机仍将接受来自该虚拟机的数据包。禁用此设置可以增加安全性，防止潜在的MAC欺骗攻击。
* **伪传输**（Forged Transmits）：伪传输设置控制虚拟交换机是否接受源 MAC 地址与虚拟机配置文件中定义的地址不匹配的帧。如果禁用伪传输，源 MAC 地址不匹配的帧将被丢弃。这也是一项安全措施，可防止虚拟机假冒其他系统。
