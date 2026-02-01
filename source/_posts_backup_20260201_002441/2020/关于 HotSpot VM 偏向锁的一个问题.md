---

title: 关于 HotSpot VM 偏向锁的一个问题

date: 2020-08-08

---

文/年容

这几天对 HotSpot VM 内置锁升、降级挺感兴趣便研究了一番，中间一个细节问题卡了我两天，甚至还请教了一位[<span>博客好友<span>](https://www.dynamic-zheng.com)，好在现在弄清楚了一下，简单记录，顺便感谢。

问题：为什么一致性哈希码（Identity Hash Code）会对偏向锁产生影响？

64位 HotSpot VM 四种锁状态下对象头的 Mark Word 布局如下：

```
|--------------------------------------------------------|
|             Mark Word             |       State        |             
|--------------------------------------------------------|
| identity hash code | age | 0 | 01 |       Normal       |
|--------------------------------------------------------|
| pointer to thread  | age | 1 | 01 |       Biased       |
|--------------------------------------------------------|
| pointer to lock record       | 00 | Lightweight Locked |
|--------------------------------------------------------|
| pointer to monitor           | 10 | Heavyweight Locked |
|--------------------------------------------------------|
```

为使得对象通过 Object::hashCode() 或者 System::identityHashCode(Object) 计算出的一致性哈希码保持不变， 计算结果会被存储在对象头的 Mark Word 中，再次调用就可以直接获取以此保证不变。但对象处于锁定状态下，Mark Word 中大部分空间都被一个指针覆盖了，那原来的 Mark Word 怎么办呢？稍作解释如下：

- 重量级锁状态下，JVM 源码 src/share/vm/runtime/objectMonitor.hpp 中有如下变量用于备份 Mark Word。

  ```java
  volatile markOop _header;       
  ```

- 轻量级锁状态下，JVM 源码 src/share/vm/runtime/basicLock.hpp 中有如下变量用于备份 Mark Word。

  ```java
  volatile markOop _displaced_header;
  ```

- 偏向锁状态下，很遗憾，没有地方用于备份 Mark Word，所以 HotSpot VM 采取的措施是，以用户通常会重写hashCode()方法或者对象很少需要计算一致性哈希码为前提而可以使用偏向锁进行优化。所以，通常：

  a. 对象已经计算过一致性哈希码，偏向锁则不可进入从而只能使用轻量级锁和重量级锁。

  b. 对象正处于偏向锁状态，此时有计算一致性哈希码的请求，偏向锁便会直接膨胀为重量级锁。

## 参考资料

- [<span>Evaluating and improving biased locking in the HotSpot virtual machine<span>](https://pdfs.semanticscholar.org/b8e4/cb0c212fd799522817b914ffcd24470f707e.pdf)
- 《深入理解 Java 虚拟机》第3版 周志明 著







