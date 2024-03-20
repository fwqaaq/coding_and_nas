# 设计模式示例

1. OOP 设计模式
   * 封装：在 .h 文件中 Point 结构体内部并没有暴露，只能通过 makePoint 函数创建，参见 [C 示例](./example/encapsulation/encapsulation.c)。
   * 继承：在 NamedPoint 结构体中可以当作是 Point 的超集，也就是 Point 的子类，参见 [C 示例](./example/Inheritance/main.c)
   * 多态：UNIX 系统中会要求每个 IO 设备都要支持 open、close、read、write 以及 seek 五个函数，而控制台等 IO 驱动程序会提供这五个函数的实际定义，将 FILE 结构体的函数指针指向这些对应的实现。**多态的优势**就是程序的运行和程序本身无关，例如一段 copy 函数，需要支持新的 IO 设备，也不需要更改 copy 函数的代码，只是其中驱动对 FILE 结构体的实现不同。

      ```c
      struct FILE {
          void (*open)(char* name, int mode);
          void (*close)();
          void (*read)();
          void (*write)(char);
          void (*seek)(long next, int mode);
      }
      ```

   * 依赖反转（Dependency Inversion Principle, DIP）：高层模块不应该依赖低层模块，它们都应该依赖于抽象。抽象不应该依赖于具体实现，具体实现应该依赖于抽象。传统的控制流是自上而下一层套一层，而依赖反转是使用多态来实现。

   ![依赖反转](./img/DIP.png)

2. 设计原则
    * 单一职责原则（Single Responsibility Principle, SRP）：“任何一个软件模块都应该只对某一类行为者负责。”
    * 开闭原则（Open-Closed Principle, OCP）：““设计良好的计算机软件应该易于扩展，同时抗拒修改”
    * 里氏替换原则（Liskov Substitution Principle, LSP）：“子类型必须能够替换掉它们的父类型”
    * 接口隔离原则（Interface Segregation Principle, ISP）：“客户端不应该被迫依赖它们不使用的方法”
    * 依赖反转原则（Dependency Inversion Principle, DIP）：应在代码中多使用抽象接口，尽量避免使用那些多变的具体实现类；不要在具体实现类上创建衍生类；不要覆盖包含具体的函数。
