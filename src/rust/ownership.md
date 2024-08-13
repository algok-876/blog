# Rust所有权
所有权是Rust管理堆内存的一种途径方法，不同于垃圾回收机制（Garbage Collection, GC），其利用作用域机制回收不再使用的内存空间。
所有权规定：
- 每个值都有一个所有者
- 任一值在同一时刻有且只有一个所有者
- 所有者离开作用域时，值将被丢弃  
  
基于这三点规则，Rust可以在编译时确定内存的生命周期，因此在运行时不会带来额外的开销（垃圾回收机制发生在运行时，GC程序本身就会消耗CPU时间和内存）。
## 作用域
作用域指明变量的生命周期，决定变量何时创建，何时销毁。与所有权机制结合可以有效地管理内存空间。
```rust
struct MyStruct {
    data: Vec<i32>,
}

impl Drop for MyStruct {
    fn drop(&mut self) {
        println!("Dropping MyStruct with data: {:?}", self.data);
    }
}

fn main() {
    let s = MyStruct { data: vec![1, 2, 3] };

    {
        let t = MyStruct { data: vec![4, 5, 6] };
        println!("t data: {:?}", t.data);
    } // t 在此处销毁

    println!("s data: {:?}", s.data);
} // s 在此处销毁
```

s与t都是所有者，当他们离开各自的作用域时，对应的值都会被回收，这演示了所有权的第三点规则。
## 所有权转移
所有权转移是因为 任一值在同一时刻有且只有一个所有者 。所有权转移是Rust中保证内存安全的关键机制之一，它确保了数据的一致性和正确性，同时也避免了常见的内存错误。
### 变量间赋值
```rust
fn main() {
    let s1 = String::from("hello"); // 创建一个新的字符串，并赋予 s1
    println!("s1 = {}", s1);

    let s2 = s1; // 所有权转移给 s2
    // println!("s1 = {}", s1); // 错误！s1 不再有效

    println!("s2 = {}", s2);
}
```

s1 的所有权被转移给了 s2，因此 s1 不再有效，s1 不再拥有对字符串的引用。这防止了当s1和s2离开作用域时，两次释放相同的内存。
栈上的数据不会发生所有权转移，因为赋值时会复制一份完整的数据
### 函数参数传递
同样的情况也发生在函数的参数传递
```rust
fn take_ownership(some_string: String) {
    println!("some_string = {}", some_string);
} // some_string 在这被销毁

fn main() {
    let s = String::from("hello");
    take_ownership(s); // s 的所有权转移给 take_ownership()
    // println!("s = {}", s); // 错误！s 不再有效
}
```
take_ownership 函数接收一个 String 类型的参数，并且获取了该 String 的所有权。因此，在函数调用之后，原始的 s 变量不再有效。
函数返回值可以返回所有权
```rust
fn make_string() -> String {
    let s = String::from("world");
    s // 返回 s 的所有权
}

fn main() {
    let s = make_string(); // s 获取了 make_string() 返回的所有权
    println!("s = {}", s);
} // s 在这被销毁
```
## 引用
### 不可变引用
引用允许在不转移所有权的情况下访问值，这常用于函数参数，因为可能希望传递给函数的参数，在函数执行完成后还可以被继续使用。
```rust
// 定义 display_message 函数，接受一个字符串切片作为参数
fn display_message(message: &str) {
    println!("Message: {}", message);
}

fn main() {
    let my_message = String::from("Hello, Rustaceans!");

    // 调用 display_message 函数，传入 my_message 的引用
    display_message(&my_message);

    // my_message 仍然有效，可以继续使用
    println!("Original message: {}", my_message);
}
```
调用 display_message 函数时，传递的是 my_message 的引用，而不是它的所有权。这意味着 my_message 在函数调用后仍然有效，可以继续使用。
### 可变引用
```rust
// 定义 modify_message 函数，接受一个可变引用作为参数
fn modify_message(message: &mut String) {
    message.push_str(", World!");
}

fn main() {
    let mut my_message = String::from("Hello");

    // 调用 modify_message 函数，传入 my_message 的可变引用
    modify_message(&mut my_message);

    // my_message 已经被修改
    println!("Modified message: {}", my_message);
}
```
&mut String 表示一个可变引用，允许我们在函数内部修改 String。
