---
autoSort: 1
---

# Typescript 基础语法

## 1. 类型

### 1.1 基础类型

#### 数值

```ts
let value: number = 10
value = 0o11 // 二进制，8进制等等都可以
```

#### 布尔

```ts
let value: boolean = true
value = false
```

#### 字符串

```ts
let value: string = 'hello'
```

### 1.2 数组和元组类型

#### 数组类型

方式一：

```ts
let arr1: Array<number> // 定义了一个只能存放 number 类型的数组
arr1 = [1, true, 2] // TS 2322 类型错误
```

方式二：

```ts
let arr2: string[] // 定义了一个只能存放 string 类型的数组
```

联合类型：

```ts
let arr3: (number | string)[] // 定义了一个只能存放 number 和 string 类型的数组
```

任意类型：

```ts
let arr4: any // 数组中可以存放任意类型的数据
```

#### 元组类型

TS 中的元组类型是数组类型的扩展，主要是创建 **定长、定数据类型** 的数据

```ts
// 创建了一个数组，该数组只能存放 3 个数据
// 且第一个数据必须是 string 类型，第二个必须是 number 类型，第三个必须是 boolean 类型
let arr: [string, number, boolean]
```

### 1.3 枚举类型

#### 使用枚举

枚举类型是数组类型的补充 关键字`enum`

枚举一般用于几个固定的取值，比如一年只有 4 季，性别只有男女

```ts
enum Gender {
  Male,
  Female,
}
```

使用枚举

```ts
let value: Gender // 定义了一个变量，该变量只能存放 Male/Female
value = Gender.Male
value = Gender.Female
```

#### 注意事项

TS 枚举的本质其实就是数值类型，所以赋值为数值类型不会报错

```ts
Gender.Male // 0
Gender.Female // 1
```

枚举类型的默认值是从上之下，从 0 开始递增，但是我们可以手动指定枚举的值

如果手动指定前一个枚举值，那么后面的就会递增

```ts
enum Gender {
  Male = 5,
  Female,
}

Gender.Female // 6
```

如果指定后一个枚举值，那么前面就会从 0 开始递增

```ts
enum Gender {
  Male,
  Female = 6,
}

Gender.Male // 0
```

枚举的值可以任意改

```ts
enum Gender {
  Male = 100,
  Female = 12,
}
```

我们不仅可以通过枚举键来获取值，还可以通过值来获取键

```ts
enum Gender {
  Male = 6,
}

Gender[6] // Male
```

这是怎么实现的？

```ts
// 编译的 JS
'use strict'
var Gender
;(function (Gender) {
  Gender[(Gender['Male'] = 6)] = 'Male'
})(Gender || (Gender = {}))

// 👇 剖析出来就是这样的 👇
let obj = {}
obj[(obj['male'] = 3)] = 'male'
obj = { 3: 'male', male: 3 }
```

### 1.4 any 和 void 类型

#### any 类型

表示任意类型，当我们不清楚这个值是什么类型的时候，可以给其 any 类型

一般用于定义通用性较强的变量，或者从其他地方保存的不知道什么类型的变量

```ts
let val: any
val = 0
val = 'aa'
val = true
```

#### void 类型

void 类型与 any 类型正好相反，表示没有类型，一般用于函数返回值

TS 只有 null/undefined 可以是 void 类型的

```ts
function test(): void {
  console.log('test void')
}

let val: void // 定义了一个变量，只能保存为 null 或 undefined
```

### 1.5 never 和 object 类型

#### never 类型

表示那些永不存在的类型，一般用于抛出异常或者根本不会有返回值的函数

```ts
function demo(): never {
  throw new Error('test never')
}

function demo2(): never {
  while (true) {}
}
```

#### object 类型

表示一个对象类型，只能存放对象类型的数据

```typescript
let obj: object
obj = {
  a: 1,
}
```

### 1.6 类型断言

#### 什么是类型断言

TS 中的类型断言其实更像是类型转换，可以将一种类型强制转换为另一种类型。

类型断言就像是在告诉编译器：我知道我在干什么，你不用再检查了

#### 使用类型断言

第一种方式：

```typescript
let str: any = 'abc' // 此时这里的 str 是 any 类型的，所以不能使用字符串的函数
// str.length  // 会报错
let len = (<string>str).length // 将 any 类型转换为 string 类型
```

第二种方式：

```ts
let len2 = (str as string).length // 转换为 string 类型
```

#### 注意

在企业开发中，更推荐使用`as`的方式来进行类型断言，因为第一种在`tsx`文件中会出现兼容问题

### 1.7 自动类型推断

#### 1. 什么是自动类型推断

不用告诉编译器具体是什么类型，编译器自动知道是什么类型的

#### 2. 根据初始值自动推断

```ts
// 如果是先定义再初始化，是无法进行自动推断的
let value
value = 123

// 如果是定义的同时初始化，TS 就会自动进行类型推断
let value = 123 //  -> let value: number = 123
value = 'aaa' //  error

// 也可以自动推断出联合类型
let arr = [1, 'a'] // -> let arr: (number | string) = [1, 'a']
arr = ['a', 2, false] // error
```

#### 3. 根据上下文类型自动推断

```ts
window.onmousedown = event => {
  // 自动推导出 event 是 MouseEvent 类型
  event.target
}
```

## 2. 接口

### 2.1 使用接口

和 number、boolean、string、enum 这种基本类型一样，接口也是一种类型

**定义一个接口类型**

```ts
interface FullName {
  firstName: string
  lastName: string
}
```

如果使用接口来约束变量或者形参，那么必须要按照接口走，类型、个数、位置都不能出错。

```ts
function getFullName({fistName, lastName}: FullName) {
    return `${firstName} - ${lastName}`
}

getFullName({'aa', 'bb'})  // right
getFullName({true, 'bb'})  // wrong
getFullName({'aaa'})       // wrong
getFullName({'a', 'b', 'c'})  // wrong
```

那如果我们想要多一个多多个，少一个，少多个怎么办？

### 2.2 可选变量

如果少一个或少多个，那么就需要在定义是加入`?`来判断此可省略

```ts
interface FullName {
  firstName: string
  lastName?: string
  middleName?: string
}
// 上面的接口，`lastName`和`middleName`都是可以不用填的
```

### 2.3 索引签名

如果多一个或者多多个参数，就需要绕开检查了

方式一，使用类型断言：

```ts
getFullName({
  firstName: 'aa',
  lastName: 'bb',
  notName: 'nihao',
} as FullName)
```

类型断言可以让这段代码直接绕开类型检查

方式二，使用变量【不推荐】

```ts
let person = {
  firstName: 'aa',
  lastName: 'bb',
  notName: 'nihao',
}
getFullName(person)
```

方式三，使用索引签名【推荐】

```ts
interface FullName {
  firstName: string
  lastName: string
  [propName: string]: any
}
```

在定义接口的时候，上面的`propName`表示键只能是 string 类型的，而值可以是任意类型的(any)

```ts
getFullName({
  firstName: 'aa',
  lastName: 'bb',
  notName1: 'aaaaa',
  notName2: 'bbb',
})
```

#### 索引签名

索引签名用于描述那些“通过索引得到”的类型，比如`arr[10]`或`obj["key"]`

```ts
// 定义了一个接口，将来所有被该接口约束的变量/形参，其键和值都必须是 string 类型的
interface FullName {
	[propName: string]: string
}

let obj: FullName {
    // 只要键值满足索引签名的条件，无论多少个都可以
	aa: 'aaa',
    bb: 'bbb',
    // cc: false,  // 报错
    false: '666'  // 不会报错，这是因为无论 key 是什么类型，都会转为 string 类型的
}
```

### 2.4 只读属性

让对象的属性只能在对象刚刚创建的时候更改其值

```ts
// 此接口的 lastName 无法被重新赋值
interface FullName {
    firstName: string
    readonly lastName: string
}

let myName: FullName {
    firstName: 'alex',
    lastName: 'white'
}

myName.firstName = 'tom'  // right
myName.lastName = 'zhang' // wrong
```

TS 内部对只读属性进行了扩展，扩展出来了一个只读数组

```ts
let arr: Array<string> = ['a', 'b', 'c']
arr[0] = '123' // 默认情况下数组是可读可写

// 定义只读数组
let arr2: ReadonlyArray<string> = ['a', 'b', 'c']
arr2[0] = '123' // 报错
```

### 2.5 函数接口

我们除了可以通过接口来限定对象之外，还可以通过接口来**限定函数**

```ts
// 第一个参数必须是 number 类型，第二个参数必须是 number 类型
// 返回必须是 number 类型
interface SumInterface {
  (a: number, b: number): number
}

let sum: SumInterface = (num1: number, num2: number): number => {
  return num1 + num2
}

let res = sum(1, 2)
```

### 2.6 混合类型接口

接口中既有对象属性，也有函数，需要约束那些类型，就要符合其条件

```ts
interface CountInterface {
  (): void
  count: number
}

let getCounter = (function (): CountInterface {
  // 接口要求数据既要是一个没有参数，没有返回值的函数
  // 又要是一个拥有 count 属性的对象
  // fn 作为函数的时候，符合接口中函数接口的限定
  // fn 作为对象的时候，符合接口中对象属性的限定
  let fn = <CountInterface>function () {
    fn.count++
    console.log(fn.count)
  }
  fn.count = 0
  return fn
})()
```

### 2.7 接口的继承

TS 中的接口和 JS 中的类其实都是可以被继承的

```ts
interface LengthInterface {
  length: number
}
interface WidthInterface {
  width: number
}
// 冗余代码，其实可以直接写为继承
interface RectInterface extends LengthInterface, WidthInterface {
  // length: number
  // width: number
  color: string
}
```

### 2.8 接口合并现象

当我们定义了很多同名的接口，多个接口的内容将进行合并。

```ts
interface TestInterface {
  name: string
}
interface TestInterface {
  age: number
}

// 自动合并为

interface TestInterface {
  name: string
  age: string
}
```

## 3. 函数

### 3.1 使用函数

TS 的函数大部分和 JS 的函数相同

```ts
// 命名函数
function fn1(a: string): void {
  console.log(a)
}
// 匿名函数
let fn2 = function (b: string): void {
  console.log(b)
}
// 箭头函数
let fn3 = (c: string): void => {
  console.log(c)
}
```

### 3.2 函数的完整格式

在 TS 中的函数的完整格式应该是由函数的定义和实现两个部分组成的

```ts
// 定义一个函数
let addFn: (a: number, b: number) => number;
// 根据定义实现函数
addFn = (x: number, y: number): number {
    return x + y
}
```

一步到位写法

```ts
let addFn(a: number, b: number) => number = function (x: number, y: number): number {
    return x + y
}
```

进一步优化写法

```ts
// 根据函数的定义，自动推导对应的数据类型
let addFn(a: number, b: number) => number = function (x, y) {
    return x + y
}
```

### 3.3 函数声明

从上面我们可以看到，可以先声明一个函数，后面再去实现。使用`type`来声明函数

```ts
// 先声明一个函数
type addFn(a: number, b: number) => number
// 再根据声明实现一个函数
let add: addFn = (x: number, y: number): number => {
    return x + y
}
```

简写方式

```typescript
// 先声明一个函数
type addFn(a: number, b: number) => number
// 再根据声明实现一个函数, 自动推导类型
let add: addFn = (x, y) => {
    return x + y
}
```

### 3.4 函数重载

函数的重载就是同名的函数可以根据不同的参数实现不同的功能

```typescript
// 定义函数的重载
function getArray(x: number): number[]
function getArray(str: string): string[]

// 实现函数的重载
function getArray(value: any): any[] {
  if (typeof value === 'number') {
    let arr = []
    for (let i = 0; i <= x; i++) {
      arr.push(i)
    }
    return arr
  } else if (typeof value === 'string') {
    return value.split('')
  } else {
    console.log('argument must be a string or number')
    return []
  }
}
```

### 3.5 函数的参数

#### 可选参数

在形参定义时加入`?`代表该参数可以省略

```ts
// 需求：实现 2 个数或者 3 个数相加
function add(x: number, y: number, z?: number): number {
  return x + y + (z ? z : 0)
}

add(2, 3)
add(2, 3, 4)
```

在函数重载的时候也可以使用这个可选参数，这样可以让函数重载变得更加健壮

```ts
function add(x: number, y: number): number
function add(x: number, y: number, z: number): number
function add(x: number, y: number, z?: number): number {
  return x + y + (z ? z : 0)
}
```

注意：

- 可选参数可以是一个或多个
- 前面的参数是可选参数，后面的也一定要是可选参数

#### 默认参数

详见 ES6-函数形参默认值

```ts
function add(x: number, y: number = 10): number {
  return x + y
}
add(10) // 20
```

#### 剩余参数

详见 ES6-函数扩展运算符

```ts
function add2(x: number, ...args: number[]): number {
  let sum: number = 0
  let each: number
  for (each of args) {
    sum += each
  }
  return x + sum
}

console.log(add2(1, 3, 4, 5, 6))
```

## 4. 泛型

### 4.1 什么是泛型

在编写代码的时候我们既要考虑代码的健壮性，又要考虑代码的灵活性和可复用性。

通过 TS 的静态检测能让我们的代码更加健壮安全，但是在健壮的同时却丢失了灵活性和可复用性，为了解决这个问题，TS 推出了泛型的概念。

```ts
// 需求：定义一个创建数组的方法，可以创建出指定长度的数组，并且可以用任意内容填充这个数组
let getArray = (value: any, length: number = 5): any[] => {
  return new Array(length).fill(value)
}
let arr = getArray(6) // [6, 6, 6, 6, 6]
```

但是直接使用`any`代码就不再健壮，并且会出现一些问题：

```ts
// 1. 编写代码没有提示，因为 any 类型并不知道是否有 length 属性
// 2. 哪怕代码写错了，也不会报错
let res = arr.map(item => item.length)
```

使用泛型就可以避免此类问题

### 4.2 使用泛型

```ts
let getArray = <T>(value: T, length: number = 5): T[] => {
  return new Array(length).fill(value)
}
```

以上代码的含义：在调用方法时告诉`T`是什么类型，那么`value`和`返回值`都会严格按照此类型

```ts
let arr = getArray<string>('value')
// 其实类型也可以不指定，默认情况下ts会根据传值自动判断类型
let arr2 = getArray(4) // === getArray<number>(4)
```

### 4.3 泛型约束

#### 1. 什么是泛型约束

默认情况下我们可以指定泛型为任意类型，但是有些情况下我们需要指定的类型满足某些条件后才能指定。那么这个时候就可以使用泛型约束

```ts
// 需求：可以指定任意类型的泛型，但是指定的类型必须有 length 属性
interface LengthInterface {
  length: number
}
let getArray = <T extends LengthInterface>(
  value: T,
  length: number = 5
): T[] => {
  return new Array(length).fill(value)
}
```

#### 2. 在泛型约束中使用类型参数

一个泛型被另一个泛型约束，就叫做泛型类型中使用类型参数

```ts
// 需求：定义一个函数用于根据指定的 key 获取对象的 value
let getProps = (obj: object, key: string): any => {
  return obj[key]
}
let obj = {
  a: 'a',
}
// undefined，但是编译时未报错，说明代码不够健壮
let res = getProps(obj, 'c')
```

```ts
// 修改一下，使用 keyof 作为索引类型
let getProps = <T, K extends keyof T>(obj: T, key: K): any => {
  return obj[key]
}
```

## 5. 类

### 5.1 使用类

TS 中的类和 JS 中的类基本相同

```ts
class Person {
  name: string // 和 ES6 的区别，需要先定义实例属性，才能使用实例属性
  age: number
  // 构造函数
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  // 实例方法
  say(): void {
    console.log(`my name is ${this.name}, my age is ${this.age}`)
  }
  // 静态属性
  static food: string
  // 静态方法
  static eat(): void {
    console.log(`我正在吃${this.food}`)
  }
}
let p = new Person('alex', 18)
p.say()
Person.food = '鸡蛋'
Person.eat()

// 继承
class Student extends Person {
  book: string
  constructor(name: string, age: number, book: string) {
    super(name, age)
    this.book = book
  }
  say(): void {
    console.log(`我是重新后的say`)
  }
}
let stu = new Student('zs', 19, '语文')
stu.say()
Student.food = '牛奶'
Student.eat()
```

### 5.2 类属性修饰符

- `public`：只读
- `protected`：受保护
- `private`：私有
- `readonly`：只读

### 5.3 类方法修饰符

- `public`：如果使用 public 来修饰方法，那么表示这个方法是公开的，可以在类的内部使用，也可以在子类中使用，也可以在外部使用
- `protected`：如果使用 protected 来修饰方法，那么表示这个方法是受保护的，可以在类的内部使用，也可以在子类中使用
- `private`：如果使用 private 修饰方法，那么表示这个方法是私有的，可以在类的内部使用

```ts
// 需求：有一个基类，所有的子类都继承于这个基类，但是我们不允许别人通过基类来创建对象
// 在构造函数前加入修饰符 protected，就不能创建基于此类创建实例
class Person {
  name: string
  protected constructor(name: string) {
    this.name = name
  }
  say(): void {
    console.log(this.name)
  }
}

class Student extends Person {
  age: number
  constructor(name: string, age: number) {
    super(name)
    this.age = age
  }
}

// new Person() 报错
new Student()
```

### 5.4 类可选属性

和接口可选属性一样，可传可不传的属性

```ts
// 在 TS 中定义了实例属性，就必须在构造函数中使用，否则就会报错
class Person {
  name: string
  age?: number
  constructor(name: string, age?: number) {
    this.name = name
    this.age = age
  }
}

let p = new Person('alex') // 可传一个参数也不会报错
```

### 5.5 类参数属性

参数属性是用来简化代码的

```ts
class Person {
  constructor(public name: string, public age: number) {}
}

// 虽然没有在类中写属性，但是 public 修饰符，让类依然有属性
let p = new Person('alex', 13)
console.log(p) // { name: 'alex', age: 13 }
```

### 5.6 类存取器

通过 getter/setter 来截取对象成员的访问

```ts
class Person {
  private _age: number = 0
  set age(val: number) {
    if (val < 0) {
      throw new Error('年龄不可小于 0 ')
    }
    this._age = val
  }
  get age(): number {
    return this._age
  }
}

let p = new Person()
// p.age = -1  // error !
p.age = 10

console.log(p.age) // 10
```

### 5.7 抽象类

#### 1. 什么是抽象类

抽象类一般用于专门定义那些不希望被外界直接创建的类，抽象类一般用于定义基类，抽象类和接口一样用于约束子类。

```ts
// 以后只要有类继承此抽象类，那么类中必须要有 name 属性 和 say 方法
abstract class Person {
  abstract name: string
  abstract say(): void
  eat(): void {
    console.log(`${this.name} is eating`)
  }
}

// let p = new Person() // error !
class Student extends Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
  say(): void {
    console.log(`my name is ${this.name}`)
  }
}
```

#### 2. 抽象类和接口区别

接口中只能定义约束，不能定义具体实现。

抽象类中既可以定义约束，也可以定义具体实现

### 5.8 类和接口

#### 1. 类实现接口

```ts
interface PersonInterface {
  name: string
  say(): void
}

// 只要类实现和接口，那么该类必须实现接口的属性和方法
class Person implements PersonInterface {
  name: string = 'alex'
  say(): void {}
}
```

#### 2. 接口继承类

```ts
class Person {
  protected name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  say(): void {
    console.log(`${this.name}-${this.age}`)
  }
}

// 注意点：如果一个接口继承了某个类，那么该接口就会继承这个类的所有属性和方法的约束
// 注意点：如果继承的类中包含 protected 修饰的属性或方法，那么就只有这个类的子类能实现这个接口
interface PersonInterface extends Person {
  gender: string
}

class Student extends Person implements PersonInterface {
  gender: string = 'male'
  name: string = 'alex'
  age: number = 18
  say(): void {}
}

let s = new Student()
s.say()
```

### 5.9 类和泛型

#### 1. 泛型类

```ts
class Cache<T> {
  arr: T[] = []
  add(value: T): T {
    this.arr.push(value)
    return value
  }
  all(): T[] {
    return this.arr
  }
}

let c = new Cache<number>()
c.add(1)
c.add(2)
// c.add('3') // 报错，只能使用泛型的 number
console.log(c.all())
```

## 6. 枚举

TS 中支持数字枚举和字符串枚举两种类型，默认情况下就是数字枚举

### 6.1 数字枚举

```ts
enum Gender {
  Male,
  Female,
}

console.log(Gender.male) // 0
console.log(Gender.female) // 1
```

#### 注意点

- 数字枚举的取值默认以 0 开始，递增
- 数字枚举的取值可以是字面量，也可以是常量，也可以是计算的结果
- 如果使用常量或计算结果给前面的枚举值赋值，那么后面的枚举值也需要手动的赋值

### 6.2 枚举的反向映射

可以根据枚举值获取到原始值，也可以根据原始值获取到枚举值

```ts
enum Gender {
  Male,
  Female,
}
console.log(Gender.Male) // 通过枚举值获取原始值
console.log(Gender[0]) // 通过原始值获取枚举值
```

### 6.3 字符串枚举

```ts
enum Gender {
  Male = '男',
  Female = '女', // 如果使用字符串给前面的枚举赋值了，那么后面的也需要手动赋值
}
console.log(Gender.Male) // 男
```

#### 注意点

- 如果使用字符串给前面的枚举赋值了，那么后面的也需要手动赋值

- 和数字枚举不一样，字符串枚举不能使用常量或者计算结果给枚举值赋值

- 字符串枚举无法根据原始值来获取枚举值

- 虽然字符串枚举不能使用常量或者计算结果赋值，但是可以使用内部的其他枚举的值来赋值

  ```ts
  enum Gender {
    Male = '男',
    Female = '女',
    Test = Male,
  }
  ```

### 6.4 异构枚举

枚举中既包含数字，又包含字符串，我们就称为异构枚举

```ts
enum Gender {
  Male = 6,
  Female = 'test',
}
```

### 6.5 枚举成员类型

我们可以把枚举成员当作类型来使用

```ts
enum Gender {
  Male,
  Female,
}

interface TestInterface {
  age: Gender.Male
}

class Person implements TestInterface {
  // age: Gender.Male √
  // age: Gender.Female  // 由于类型不匹配，所以会报错
  age: 0 // 注意：由于数字枚举本身就是数值，所以这里写数字也不会报错
}
```

```ts
enum Gender {
    Male: '男',
    Female: '女'
}

interface TestInterface {
	age: Gender.Male
}

class Person implements TestInterface {
    // age: '男'    // error
    // age: string  // error
    // 注意点，如果是字符串枚举，那么只能是枚举成员的值，不能是其他的值
}
```

### 6.6 联合枚举类型

我们可以把枚举类型当作一个联合类型来使用

#### 1. 什么是联合类型

联合类型就是将多种数据通过 | 连接起来

```ts
// (number | string) 联合类型
let value: number | string
value = 0
value = '1'
```

#### 2. 什么是联合枚举类型

```ts
enum Gender {
  Male,
  Female,
}
interface TestInterface {
  age: Gender // age: (Gender.Male | Gender.Female)
}
```

### 6.7 运行时枚举

枚举在编译之后是一个真实存储的对象，所以可以在运行时使用

而像接口这种只是用来做约束做静态检查的代码，编译后将不再存在

### 6.8 常量枚举

```ts
// 普通枚举
enum Gender {
  Male,
  Female,
}
// 常量枚举
const enum Gender2 {
  Male,
  Female,
}
```

##### 区别：

- 普通枚举会生成真实存在的对象
- 常量枚举不会生成真实存在的对象
- 而是利用枚举成员的值直接替换到使用到的地方
- 常量枚举可以减少页面体积

## 7. 兼容

### 7.1 类型兼容性

```ts
interface TestInterface {
  name: string
}

let p1 = { name: 'alex' }
let p2 = { age: 18 }
let p3 = { name: 'alex', age: 18 }

let t: TestInterface

// 对象类型和接口类型是兼容的
t = p1
t = p2 // 报错
t = p3 // 也可以兼容，可多不可少
```

### 7.2 函数兼容性

#### 1. 参数个数

```ts
let fn1 = (x: number, y: number) => {}
let fn2 = (x: number) => {}

fn1 = fn2
fn2 = fn1 // 报错，可少不能多
```

#### 2. 参数类型

```ts
let fn1 = (x: number) => {}
let fn2 = (x: number) => {}
let fn3 = (x: string) => {}

fn1 = fn2
fn2 = fn1

fn3 = fn2 // 报错，参数类型必须相同
```

#### 3. 返回值类型

```ts
let fn1 = (): number => 134
let fn2 = (): number => 456
let fn3 = (): string => 'aaa'

fn1 = fn2
fn2 = fn1
fn3 = fn1 // 报错，返回值类型必须相同
```

#### 4. 函数的双向协变

##### 参数的双向协变

```ts
let fn1 = (x: number | string) => {}
let fn2 = (x: number) => {}

fn1 = fn2
fn2 = fn1
```

##### 返回值的双向协变

```ts
let fn1 = (x: boolean): number | string => (x ? 123 : 'abc')
let fn2 = (x: boolean): number => 456

fn2 = fn1 // 报错，不能将返回值是联合类型的赋值给具体类型的
fn1 = fn2 // 但是可以从具体类型转到联合类型的
```

#### 5. 函数重载

```ts
function add(x: number, y: number): number
function add(x: string, y: string): string
function add(x, y) {
  return x + y
}

function sub(x: number, y: number): number
function sub(x, y) {
  return x - y
}

let fn1 = add

fn1 = sub // 不能将重载少的赋值给重载多的

let fn2 = sub
fn2 = add // 但是可以将重载多的赋值给重载少的
```

### 7.3 枚举兼容性

#### 1. 数字枚举与数值兼容

```ts
enum Gender {
  Male,
  Female,
}
let value: Gender
value = Gender.Male
value = 0
```

#### 2. 数字枚举与数字枚举不兼容

```ts
enum Gender {
  Male,
  Female,
}

enum Animal {
  Dog,
  Cat,
}

let value1: Gender = Gender.Male
value = Animal.Dog // 报错
```

#### 3. 字符串枚举与字符串不兼容

```ts
enum Gender {
  Male = '男',
  Female = '女',
}

let value: Gender = Gender.Male
value = '男' // 报错
```

### 7.4 类兼容性

#### 1. 只比较实例成员，不比较类的构造函数和静态成员

```ts
class Person {
  public name: string
  // 只能多不能少
  // public age: number;
  // 不会比较静态成员
  public static age: number
  // 不会比较构造函数
  constructor(name: string, age: number) {}
}

class Animal {
  public name: string
  constructor(name: string) {}
}
```

#### 2. 类的私有属性和受保护属性会影响兼容性

```ts
class Person {
  // 私有属性和受保护属性会影响兼容性
  private name: string
  protected age: number
}

class Animal {
  private name: string
}
```

### 7.5 泛型兼容性

泛型只影响使用的部分，不会影响声明的部分

```ts
interface TestInterface<T> {}
let t1: TestInterface<number>
let t2: TestInterface<string>

t1 = t2
t2 = t1 // 不影响声明部分

interface TestInterface<T> {
  age: T
}
let t1: TestInterface<number> // age: number
let t2: TestInterface<string> // age: string

t1 = t2 // 报错，
t2 = t1 // 只影响使用部分
```

## 8 高级类型

### 8.1 交叉类型

- 格式：`type1 & type2 & ...`
- 交叉类型是将多个类型合并为**一个类型**

```ts
let mergeFn = <T, U>(arg1: T, arg2: U): T & U => {
  let res = {} as T & U
  res = Object.assign(arg1, arg2)
  return res
}

let res = mergeFn({ name: 'aaa' }, { age: 18 })

console.log(res) // { name: 'aaa', age: 18 }
```

### 8.2 联合类型

- 格式：`type1 | type2 | ...`
- 联合类型是多个类型中的任意类型

```ts
let value: number | string | boolean

value = 123
value = 'abc'
value = true
```

### 8.3 类型保护

对于**联合类型**的变量，在使用时要确切告诉编译器它是哪一种类型，通过类型断言或者类型保护。

```ts
let getRandomValue = (): string | number => {
  let value = Math.random()
  return value >= 0.5 ? 'abc' : 123.123
}
// 如果是字符串，就获取到字符串的长度，如果是数值，就省略小数位
// 通过类型断言，需要每一次都要断言类型，所以比较麻烦
if ((value as string).length) {
  console.log((value as string).length)
} else {
  console.log((value as number).toFixed())
}

// 因此我们也可以使用类型保护

// 定义了一个类型保护函数，这个函数的返回类型是一个 boolean 类型
// 这个函数的返回值类型是传入的参数是否是 string 类型的
function isString(value: string | number): value is string {
  return typeof value === 'string'
}
if (isString(value)) {
  console.log(value.length)
} else {
  console.log(value.toFixed())
}
```

```ts
// 除了可以通过定义类型保护函数的方式来告诉编译器使用联合类型的变量具体是类型之外
// 还可以使用 typeof 来实现类型保护
if (typeof value === 'string') {
  console.log(value.length)
} else {
  console.log(value.toFixed())
}
```

注意点：

- 如果使用`typeof`来实现类型保护，那么只能用`===`或者`!==`
- 如果使用`typeof`来实现类型保护，那么只能保护`number/string/boolean/symbol`类型

```ts
// 除了可以通过 typeof 类实现类型保护之外，还可以通过 instanceof 来实现类型保护
class Person {
  name: string = 'alex'
}
class Animal {
  age: number = 18
}
let getRandomObject = (): Person | Animal => {
  let value = Math.random()
  return value >= 0.5 ? new Person() : new Animal()
}
let res = getRandomObject()
if (res instanceof Person) {
  console.log(res.name)
} else {
  console.log(res.age)
}
```

### 8.4 特殊类型

#### 1. 空值检测

TS 中有两种特殊的类型`null/undefined`，他们分别具有值`null/undefined`

- 默认情况下我们可以将`null/undefined`赋值给任意类型
- 默认情况下这两个类型也可以互相转换

```ts
let value1: null
let value2: undefined
value1 = value2 // ok
value2 = value1 // ok
let value3: number
value3 = value1 // ok
value3 = value2 // ok
```

在企业开发中，如果不想让`null/undefined`赋值给任意类型，或者不想让这两者相互转换，就可以开启`tsconfig.json`中的`strictNullChecks`选项，开启后之前的操作将会报错。

```json
{
  "strictNullChecks": true
}
```

#### 2. 空值检测下转换

如果我们在开启了`strictNullChecks`的前提下还想要将`null/undefined`赋值给任意类型，此时就需要用到来拟合类型

```ts
let value: number | null | undefined
```

#### 3. 空值检查下的可选参数和可选属性

对于可选属性和可选参数来说，如果开启了`strictNullChecks`，那么默认情况下数据类型就是联合类型。

是当前的类型 + `undefined`

```ts
class Person {
  name?: string // 默认 name 的类型是 (string | undefined)
}

function say(name?: number) {
  // name 也是 (number | undefined)
}
```

#### 4. 去除 null 和 undefined 检测

可以使用`!`来去除 null 或 undefined 检测，意思就是该值一定不是 null 或 undefined

```ts
function getLength(value: string | null | undefined) {
  value = 'abc'
  return () => {
    // return value.length  // 报错，因为 null 和 undefined 没有 length 属性
    // return (value || '').length; // 原生 JS 的写法
    // return (value as string).length  // 使用类型断言
    return value!.length // 我们已知 value 一定是 string 类型的，所以可以使用类型断言的简写方式，加入 !
  }
}
```

### 8.5 类型别名

#### 1. 什么是类型别名

类型别名就是给类型起一个新名字，但是他们都代表同一种类型。

```ts
// 给 string 起了一个类型别名叫做 myString
// 无论是 myString 还是 string 都表示为 string
type myString = string
let value: myString

value = '134'
value = 134 // 报错
```

#### 2. 类型别名用于泛型

```ts
type MyType<T> = { x: T; y: T }
let value: MyType<number>
// 将来给 value 赋值必须是 {x，y}，并且必须都是 number 类型
value = {
  x: 1,
  y: 1,
}

value = {
  x: 2,
  y: '1',
} // 报错
```

#### 3. 在类型别名的属性中使用自己

```ts
// 这种用法一般用于定义一些嵌套、树状的结构
type MyType = {
  name: string
  children?: MyType // 这里需要变成可选的，不然将会循环嵌套，不会停止
}

let value: MyType = {
  name: 'aa',
  children: {
    name: 'bb',
    children: {
      name: 'cc',
      // ......
    },
  },
}
```

#### 4. 接口和类型别名是相互兼容的

```ts
type MyType = {
  name: string
}

interface MyInterface {
  name: string
}

let value1: MyType = { name: 'alex' }
let value2: MyInterface = { name: 'tom' }

value1 = value2
value2 = value1 // 如果这两个约束的类型一样，那么这两个就可以相互转换，即使一个是接口，一个是类型别名
```

#### 5. 类型别名和接口的异同

##### 1. 都可以描述属性或方法

```ts
type MyType = {
  name: string
  say(): void
}
interface MyInterface {
  name: string
  say(): void
}
```

##### 2. 都允许扩展

扩展接口

```ts
interface MyInterface {
  name: string
  say: void
}
interface MyInterface2 extends MyInterface {
  age: number
}

let value: MyInterface2 = {
  name: 'aaa',
  age: 18,
  say(): void {
    console.log('aaa')
  },
}
```

扩展类型别名

```ts
type MyType = {
  name: string
  say(): void
}

type MyType2 = MyType & {
  age: number
}

let value: MyType2 = {
  name: 'aaa',
  age: 18,
  say(): void {
    console.log('aaa')
  },
}
```

##### 3. type 可以声明基本类名别名、联合类型、元组等类型，但接口不能

```ts
type MyType1 = boolean
type MyType2 = string | number
type MyType3 = [string, boolean, number]
```

##### 4. type 不会自动合并，接口会自动合并

```ts
interface MyInterface {
  age: number
}
interface MyInterface {
  name: string
}
// 两个同名的接口会合并
```

### 8.6 字面量类型

#### 1. 什么是字面量

字面量就是源代码中的一个固定的值。

例如数值字面量：1、2、3

字符串字面量：'a'、'abc'

#### 2. TS 中的字面量类型

在 TS 中我们可以使用字面量作为具体的类型使用，当使用字面量作为具体类型时，该类型的取值就必须是字面量的值。

```ts
type MyNum = 1
let value: MyNum = 1
value = 2 // 报错
```

### 8.7 可辨识联合

#### 1. 什么是可辨识联合

具有共同的可辨识特征。一个类型别名，包含了具有共同的可辨识特征的类型和联合

```ts
interface Square {
  kind: 'square'
  size: number
}

interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}

interface Circle {
  kind: 'circle'
  radius: number
}
```

以上三个接口都有一个共同点，那就是他们都有一个属性`kind`，kind 就是`共同的可辨识特征`

```ts
// shape 就是一个可辨识的联合，因为它的取值就是一个联合，因为联合的每一个值都有一个共同的可辨识特征
type Shape = (Square | Rectangle | Circle);

function area(s: Shape) {
    swicth(s.kind){
        case "square": return s.size * s.size;
        case "rectangle": return s.width * s.height;
        case "circle": return Math.Pi * s.radius ** 2; // ** 是 ES 7 的幂运算符
    }
}
```

#### 2. 可辨识联合完整性检查

```ts
function area(s: Shape) {
    swicth(s.kind){
        case "square": return s.size * s.size;
        // case "rectangle": return s.width * s.height;
        case "circle": return Math.Pi * s.radius ** 2; // ** 是 ES 7 的幂运算符
    }
}
```

> 在企业开发中，如果我们想要对可辨识联合进行完整性检查，有两种方式：
>
> 方式一：
>
> - 对函数加入返回值
> - 打开`strictNullChecks`
>
> 方式二：
>
> - 添加 default
> - 添加 never

##### 方式一：

```ts
// 加入返回值 number
function area(s: Shape): number {
    swicth(s.kind){
        case "square": return s.size * s.size;
        case "rectangle": return s.width * s.height;
        case "circle": return Math.Pi * s.radius ** 2; // ** 是 ES 7 的幂运算符
    }
}
```

将`tsconfig.json`中的`strictNullChecks`选项打开

##### 方式二：

```ts
function MyNever(x: never):never {
    throw new Error('可辨识联合处理不完整' + x)
}

function area(s: Shape) {
    swicth(s.kind){
        case "square": return s.size * s.size;
        case "rectangle": return s.width * s.height;
        case "circle": return Math.Pi * s.radius ** 2; // ** 是 ES 7 的幂运算符
        default: return MyNever(s)
    }
}
```

####

## 9. TS 高级

### 9.1 索引访问符

通过`[]`索引访问符，我们就能得到某个索引的类型。

```ts
class Person {
  name: string
  age: number
}
// 此时 MyType 就是 string 类型的
type MyType = Person['name']
```

#### 1. 应用场景

需求：获取指定对象，部分属性的值，放到数组中返回

```ts
let obj = {
   name: 'alex',
   age: 18,
   gender: true
}

function getValues<T, K extends keyof T>(obj: T; keys: K[]): T[K][] {
    let arr = [] as T[K][]
    keys.forEach(key => {
        arr.push(obj[key]);
    })
    return arr
}

let res = getValues(obj, keys['name, age'])

console.log(res)  // [alex, 18]
```

#### 2. 注意点

不能返回 null/undefined/never 类型

### 9.2 映射类型

#### 1. 什么是映射类型

根据旧的类型创建出新的类型，我们称之为映射类型

```ts
interface TestInterface {
  name: string
  age: number
}

type ReadOnlyTestInterface<T> = {
  readonly // 作用是遍历出指定类型所有的key，添加到当前对象上
  [P in keyof T]: T[P]
}

type MyType = ReadOnlyTestInterface<TestInterface>
```

当然，不仅可以添加某个约束，还可以删除某个约束

```ts
interface TestInterface {
  readonly name: string
  readonly age: number
}

type ReadOnlyTestInterface<T> = {
  -readonly // - 减号表示删除此约束， + 加号表示增加
  [P in keyof T]: T[P]
}

type MyType = ReadOnlyTestInterface<TestInterface>
```

由于生成可读属性和可选属性的操作比较常见，因此 TS 内部封装了

`ReadOnly/Partial`

```ts
interface TestInterface {
  name: string
  age: number
}

// 全部变成可读了
type MyType = ReadOnly<TestInterface>
// 全部变成可选了
type MyType2 = Partial<TestInterface>
// 变成可选可读了
type MyType3 = Partial<ReadOnly<TestInterface>>
```

#### 2. Pick 映射类型

将原有的类型的部分内容映射到新类型中

```ts
interface TestInterface {
  name: string
  age: number
}

// 传入 name 只映射 name
type MyType = Pick<TestInterface, 'name'>
```

#### 3. Record 映射类型

将一个类型的所有属性映射到另一个类型上，并创建一个新的类型

```ts
type Animal = 'person' | 'dog' | 'cat'

interface TestInterface {
  name: string
  age: number
}

// 会映射出一个新的类型，大概长👇这样

/*
  {
  	person: {
  		name: string,
  		age: number,
  	}
  	dog: {
  		name: string,
  		age: number
  	}
  	cat: {
  		name: string,
  		age: number
  	}
  }
*/
type MyType = Record<Animal, TestInterface>

let res: MyType = {
  person: {
    name: 'xx',
    age: 18,
  },
  dog: {
    name: 'aa',
    age: 3,
  },
  cat: {
    name: 'bb',
    age: 1,
  },
}
```

#### 4. 由映射类型进行推断

对于`Readonly`、`Partial`、`Pick`的映射类型，我们可以对映射之后的类型进行拆包。还原映射之前的类型，这种操作我们称之为拆包

```ts
interface TestInterface {
  name: string
  age: number
}

type TestType<T> = {
  +readonly [P in keyof T]: T[P]
}
// 此时 test 就是一个只读的映射类型
type test = TestType<TestInterface>

// 那么我们该如何还原回去呢？
type UnType<T> = {
  -readonly [P in keyof T]: T[P]
}
// 此时 test2 就是拆包后的
type test2 = UnType<test>
```

### 9.3 条件类型

判断前面的一个类型是否是后面一个类型或者继承于后面一个类型

如果是就返回第一个结果，如果不是就返回第二个结果

```ts
T extends U ? X : Y
```

```ts
type MyType<T> = T extends string ? string : any
// 此时 res 是 string 类型
type res = MyType<string>
// 此时 res2 是 boolean 类型
type res2 = MyType<boolean>
```

#### 1. infer 关键字

条件类型提供了一个`infer`关键字，可以让我们在条件类型中定义新的类型。

需求：定义一个类型，如果传入的是数组，就返回数组的元素类型，如果传入的是普通类型，则直接返回此类型。

```ts
type MyType<T> = T extends any[] ? T[number] : T
type res = MyType<string[]> //  -> string
type re2 = MyType<number> //  -> number
```

使用`infer`

```ts
// infer U 此时的 U 其实就是每一个数组元素的类型
type MyType<T> = T extends Array<infer U> ? U : T
```

### 9.4 分布式条件类型

被检测类型是一个联合类型的时候，该条件类型就被称之为分布式条件类型

```ts
type MyType<T> = T extends any ? T : never
// 被检测类型是一个联合类型，就是一个分布式联合类型
// 返回一个所有符合条件的集合
// string number boolean 都符合 any 那么就返回这三个的联合类型
type res = MyType<string | number | boolean>
```

#### 应用场景

##### 从 T 中剔除可以赋值给 U 的类型

```ts
type MyType<T, U> = T extends U ? never : T
// 这样就剔除了 number
type res = MyType<string | number | boolean, number>
```

由于这种操作很常见，所以 TS 内部封装了 `Exclude`

```ts
type res = Exclude<string | number | boolean, number>
```

##### 提取 T 中可以赋值给 U 的类型

TS 内部封装了 `Extract`

```ts
// 只拿到 number 和 string
type res = Extract<string | number | boolean, number | string>
```

##### 剔除 T 中的 null 和 undefined

TS 内部封装了 `NonNullable`

```ts
// 只接收一个参数，自动把 null 和 undefined 剔除
type res = NonNullable<string | null | undefined | boolean>
```

##### 获取函数的返回值类型

TS 内部封装了 `ReturnType`

```ts
// 获取到返回值类型时 string
type res = ReturnType<() => string>
```

##### 获取一个类构造函数参数组成的元组类型

TS 内部封装了 `ConstructorParameters`

```ts
class Person {
  constructor(name: string, age: number) {}
}
// 返回一个构造函数参数组成的元素 type res = [string, number]
type res = ConstructorParameters<typeof Person>
```

##### 获取函数的参数类型组成的元组类型

TS 内部封装了 `Parameters`

```ts
function say(name: string, age: number, gender: boolean) {}
// type res = [string, number, boolean]
type res = Parameters<typeof say>
```

### 9.5 unknown 类型

#### 1. 什么是 unknown 类型

`unknown`类型是 TS 3.0 新增的一个顶级类型，被称为安全的 any

#### 2. 任何类型都可以赋值为 unknown 类型

```ts
let value: unknown
value = 123
value = 'abc'
value = false
```

#### 3. 如果没有进行类型断言或基于控制流的类型细化，不能将 unknown 赋值给其他类型

```ts
let value1: unknown = 123
let value2: number

// value2 = value1  // 报错
value2 = value1 as number // 要么进行类型断言
// 要么进行流程控制的类型细化
if (typeof value1 === 'number') {
  value2 = value1
}
```

#### 4. 如果没有进行类型断言或基于控制流的类型细化，不能在 unknown 上进行任何操作

```TS
let value1: unknown = 123;
value1++ // 报错
(value1 as number)++
if(typeof value1 === 'number'){
	value1++
}
```

#### 5. 只能对 unknown 类型进行相等或不等操作，不能进行其他操作（因为其他操作没有意义）

```ts
let value1: unknown = 123
let value2: unknown = 123

console.log(value1 === value2)
console.log(value1 !== value2)
// 但是 tsconfig.json 开启 strict 严格模式下会报错
// console.log(value1 >= value2) // 虽然不会报错，但是不推荐
```

#### 6. unknown 与其他类型组成的交叉类型最后都是其他类型

```ts
type MyType = number & unknown // number 类型
type MyType2 = unknown & string // string 类型
```

#### 7. unknown 除了与 any 之外，与其他类型的联合类型都是 unknown 类型

```ts
type MyType = unknown | string | boolean // unknown
```

#### 8. never 是 unknown 的子类型

```ts
type MyType = never exntends unknown ? string : number  // string
```

#### 9. keyof unknown 等于 never

```ts
type MyType = keyof unknown // never
```

#### 10. unknown 类型的值不能直接访问属性、方法、创建实例

```ts
class Person {
  name: string
  say(): void {
    console.log(`name=${this.name}`)
  }
}
// 报错
let p: unknown = new Person('aa')
```

#### 11. 使用映射类型时，如果遍历的是 unknown 类型，那么就不会映射任何类型

```ts
type MyType<T> = {
  [P in keyof T]: any
}
type res = MyType<number> // number
type res2 = MyType<unknown> // 空的
```

### 9.6 Symbol 类型

和 ES6 中的 Symbol 一样

#### 1. 什么是 Symbol

Symbol 是 ES6 中新增的一种数据类型，被划分到了基本数据类型中。

基本数据类型：string、number、boolean、undefined、null、Symbol

引用数据类型：Object

#### 2. Symbol 的作用

用来表示一个独一无二的值

#### 3. 如何生成一个独一无二的值

```ts
let xxx = Symbol()
```

#### 4. 为什么需要 Symbol

在企业开发中，对一些第三方的框架或者插件自定义的时候，可能会因为添加了同名的属性或者方法，将框架中原有的属性或者方法覆盖掉。为了避免这种情况的发生，框架的作者或者我们就可以使用 Symbol 作为属性或者方法的名称

```js
// 假设这是一个插件
let obj = {
    name: 'alex'
}
// 我们在使用的时候由于和插件的变量名一样，导致覆盖原有的值
obj.name = 'tom'
console.log(obj.name)  // tom

// 这种情况下，我们就要用到 Symbol
let name = Symbol()
let obj = {
    // 如果想要变量作为对象的键，那么就必须要加入 [] 中括号
    [name]: 'alex'
}
obj.name = '123456'

// 此时并没有覆盖
obj = {
    name: '123456',
    Symbol(name): 'alex'
}
```

#### 5. 如何区分 Symbol

在通过 Symbol 生成值得时候可以设置一个标记，这个标记仅仅用于区分，没有其他含义。

```ts
// name 作为标记仅仅是用于区分
let name = Symbol('name')
```

#### 6. 使用 Symbol 的注意点

- 生成 Symbol 的时候不能加`new`，因为这是一个基本数据类型，不是引用数据类型
- Symbol 的标记仅仅是便于阅读代码，没有任何作用
- 做类型转换的时候不能转换为数值
- 不能做任何运算
- Symbol 生成的值一定要保存下来，否则后续将无法使用
- for 循环无法遍历出 Symbol 的属性和方法，通过`Object.getOwnPropertySymbols(obj)`方法可以获取到 obj 中的所有 Symbol 属性或方法

### 9.7 迭代器与生成器

和 ES6 的迭代器与生成器相同

#### 1. 迭代器 iterator

在 ES6 中迭代器的接口是`for...of`

默认情况下：`Array/Map/Set/String/TypedArray/函数的 arguments 对象/NodeList`都实现了 iterator

**对象默认情况下没有实现 iterator 接口，所以默认情况下不能使用 for...of**

```ts
let arr = [1, 3, 5]
for (let value of arr) {
  console.log(value)
}
// 1
// 3
// 5
```

只要一个数据已经实现了 iterator 接口，那么这个数据就有一个叫做`Symbol.iterator`属性，该属性返回一个方法

```ts
let arr = [1, 3, 4]
let it = arr[Symbol.iterator]()
console.log(it) // Array iterator
// it 中有一个方法 next
console.log(it.next()) // { value: 1, done: false }
console.log(it.next()) // { value: 3, done: false }
console.log(it.next()) // { value: 4, done: false }
console.log(it.next()) // { value: undefined, done: true }
```

- 只要一个数据实现了 iterator 接口，那么就一定会有`Symbol.iterator`属性
- 该属性返回一个函数
- 返回的函数会返回一个对象
- 返回的对象会有一个名称叫做`next`的函数
- `next`每次执行会返回一个对象`{value: 1, done: false}`

##### 手动实现 iterator

```ts
class MyArray {
  constructor() {
    for (let i = 0; i < arguments.length; i++) {
      this[i] = arguments[i]
    }
    this.length = arguments.length
  }
  [Symbol.iterator]() {
    let index = 0
    let _this = this
    return {
      next() {
        if (index < _this.length) {
          return {
            value: _this[index++],
            done: false,
          }
        } else {
          return {
            value: _this[index],
            done: true,
          }
        }
      },
    }
  }
}
let arr = new MyArray(1, 3, 4)
for (const value of arr) {
  console.log(value)
}
```

##### iterator 的应用场景

**解构赋值：**

```tsx
let arr = [1, 3]
let [x, y, z] = arr
console.log(x, y, z) // 1, 3, undefined
```

内部其实是用`next()`方法来进行解构的

**扩展运算符**

```ts
let arr1 = [1, 2]
let arr2 = [3, 4]
let arr3 = [5, 6]
let arr4 = [...arr1, ...arr2, ...arr3] // 1, 2, 3, 4, 5, 6
```

#### 2. 生成器 generator

##### 1 generator 概念

###### 什么是 generator

Generator 函数是 ES6 提供的一种异步编程解决方案，Generator 函数内部可以封装多个状态，因此又可以理解为是一个状态机。

###### 如何定义 generator

只需要在普通函数的 function 后面加上`*`

```ts
function* generator() {}
```

###### generator 与普通函数的区别

- 调用 generator 函数后，无论函数有没有返回值，都会返回一个迭代器对象
- 调用 generator 函数后，函数中封装的代码不会立即执行

###### yield 关键字

真正让 generator 有价值的是`yield`关键字

- 在 generator 函数内部使用`yield`关键字定义状态
- 并且 yield 可以让 generator 内部的逻辑能够切割多个状态
- 通过调用迭代器的`next`方法执行一个部分代码

```ts
function* gen() {
  // 使用 yield 定义一个状态，就会将代码切割一部分
  console.log('123')
  yield 'aaa'
  console.log('456')
  yield 1 + 1
  console.log('789')
  yield true
}
```

每次执行`next`都会执行下一段代码

```ts
const g = gen()
console.log(g.next()) // 123 { value: 'aaa', done: false }
console.log(g.next()) // 456 { value:  2, done: false }
console.log(g.next()) // 789 { value: true, done: false }
console.log(g.next()) //     { value: undefined, done: true }
```

调用 next 的时候可以传递一个参数，该参数会被传递到**上一个** yield

```ts
function* gen() {
  console.log('第一段代码')
  let res = yield '123'
  console.log('第二段代码：', res)
  yield 1 + 1
  console.log('第三段代码')
  yield true
}

const g = gen()
g.next() // 第一段代码
g.next('获取到参数') // 第二段代码：获取到参数
g.next() // 第三段代码
```

##### 2 generator 的应用场景

###### **让函数返回多个值**

```ts
// 像要求两个数的和和差，之前可以这么做
function calculate(a, b) {
  return [a + b, a - b]
}
// 使用 generator 这么做
function* calculate(a, b) {
  yield a + b
  yield a - b
}
```

###### 利用 generator 快速定义一个对象上的 iterator

```ts
let obj = {
  name: 'alex',
  age: 19,
  gender: 'male',
}

obj[Symbol.iterator] = function* () {
  let keys = Object.keys(this)
  for (let i = 0; i < keys.length; i++) {
    yield obj[keys[i]]
  }
}

let it = obj[Symbol.iterator]()
for (const value of obj) {
  console.log(value)
}

// alex  19  male
```

### 9.8 模块系统

#### 1. ES6 模块

##### 分开导入导出

```ts
import xxx;
import { xxx } from 'xxx'
```

##### 一次性导入导出

```ts
import { xxx, yyy, zzz } from 'aaa'
export { xxx, yyy, zzz }
```

##### 默认导入导出

```ts
import xxx from 'aaa'
export default xxx
```

#### 2. Node 模块

##### 导出

```ts
exports.xxx = xxx
module.exports.xxx = xxx
```

##### 导入

```ts
const xxx = require('yyy')
const { xxx, yyy } = require('zzz')
```

#### 3. TS 兼容

ES6 的模块和 Node 的模块是不兼容的，所以 TS 为了兼容就推出了

```ts
export = xxx
import xxx = require('yyy')
```

### 9.9 命名空间

#### 1. 什么是命名空间

命名空间可以看作是一个微型模块，当我们先把相关的业务代码写在一起，又不想污染全局空间的时候，我们就可以使用命名空间。本质就是定义一个大对象，把变量/方法/类/接口...放在里面。

#### 2. 命名空间和模块区别

- 在程序内部使用的代码，可以使用命名空间封装和防止全局污染
- 在程序外部使用的代码，可以使用模块封装和防止全局污染
- 总结：由于模块也能实现相同功能，所以大部分时候使用模块即可

```ts
namespace Validation {
  const letterRegexp = /^[A-Za-z]+$/
  // 需要导出，才能在外界使用
  export const LetterValidator = value => {
    return letterRegexp.test(value)
  }
}
// 使用命名空间中的函数
Validation.LetterValidator('aaa') // true
```

#### 3. 将命名空间封装到模块中

```ts
// ./test/test.ts
namespace Validation {
  const letterRegexp = /^[A-Za-z]+$/
  // 需要导出，才能在外界使用
  export const LetterValidator = value => {
    return letterRegexp.test(value)
  }
}
```

```ts
// 要想使用，必须加入下面的 三个斜杠
/// <reference path="/test/test.ts" />
// 使用命名空间中的函数
Validation.LetterValidator('aaa')
```

TS 遇到`/// <reference path="/test/test.ts" />`就会把其中的代码加载到当前的代码中，但是默认情况下，webpack 并不会自动合并

将 `tsconfig.json` 中`outFile`表示打包后输出的文件，`outDir`表示输出到哪个目录

```json
{
  "module": "system",
  "outFile": "./js/bundle.js",
  "outDir": "./dist"
}
```

### 9.10 声明合并

在 TS 中接口和命名空间是可以重复的，ts 会将多个同名的合并为一个。

#### 1. 接口

- 同名接口如果属性名相同，那么属性类型必须一致
- 同名接口如果出现同名函数，那么就会成为一个函数的重载

#### 2. 命名空间

- 同名的命名空间不能出现同名的属性或方法
- 同名的命名空间中其他命名空间没有通过`export`导出的内容是获取不到的

#### 3. 命名空间与同名的类/函数/枚举合并

注意：类必须定义在命名空间的前面

会将命名空间导出的方法作为一个静态方法合并到类中

```ts
class Person {
  say(): void {
    console.log('hello world')
  }
}

namespace Person {
  export const hi = () => {
    console.log('hi')
  }
}
```

#### 4. 命名空间和函数合并

注意：函数必须声明在命名空间的前面

```ts
function getCounter() {
  getCounter.count++
  console.log(getCounter.count)
}
namespace getCounter {
  export let count: number = 0
}
getCounter() // 1
getCounter() // 2
```

#### 5. 命名空间和枚举合并

注意点：没有先后顺序的要求

```ts
enum Gender {
  Male,
  Female,
}
namespace Gender {
  export const A: number = 666
}
console.log(Gender)
```

### 9.11 装饰器

#### 1. 什么是装饰器

`Decorator`是 ES7 的一个新语法，目前属于提案中。

装饰器是一种特殊类型的声明，它能够被附加到类、方法、访问器、属性或者参数上。被添加到不同地方的装饰器有不同的名称或者特点。

#### 2. 装饰器的基本格式

- 普通装饰器
- 装饰器工厂
- 装饰器组合

#### 3. 如何在 TS 中使用装饰器

在`tsconfig.json`中，加入配置`experimentalDecorators`

```json
{
  "experimentalDecorators": true
}
```

```ts
// test 就是一个普通装饰器
function test(target) {
  console.log('hello')
}

// 给 Person 绑定了一个装饰器
// 这个装饰器的代码在定义类之前执行
@test
class Person {}
```

##### 装饰器工厂

```ts
// 返回一个函数的装饰器是装饰器工厂
function factory() {
  console.log('factory out')
  return target => {
    console.log('factory in')
  }
}

// 普通装饰器和装饰器工厂可以混合使用
// 执行顺序：先执行装饰器工厂，再执行普通装饰器
@test
@factory()
class Person {} // 先 out 再 in
```

- 先从上至下的执行所有的装饰器工厂，再从下至上的执行所有的普通装饰器

```ts
function f1() {
  console.log('f1 out')
  return target => {
    console.log('f1 in')
  }
}
function f2() {
  console.log('f2 out')
  return target => {
    console.log('f2 in')
  }
}
function n1() {
  console.log('n1 in')
}
function n2() {
  console.log('n2 in')
}

@n1
@f1()
@f2()
@n2
class Person {}
// 输出顺序：
// f1 out / f2 out / n2 in / f2 in / f1 in / n1 in
```

#### 4. 类装饰器

- 类装饰器与类声明绑定（紧靠着类声明）
- 类装饰器用于监听、修改或者替换类定义
- 在执行类装饰器函数的时候，回把绑定的类作为其唯一的参数传递给装饰器
- 如果类装饰器返回一个新的类，他会用新的类代替原有的类的定义

##### 类装饰器和装饰器工厂的区别

类装饰器可以传递参数

```ts
function test<T extends { new (...args: any[]): {} }>(target: T) {
  return class extends target {
    name: string = 'alex'
    age: number = 19
  }
}

@test
class Person {}

let p = new Person()
console.log(p) // { name: alex, age: 19 }
```

#### 5. 方法装饰器

方法装饰器写在一个方法的声明之前，方法装饰器用来定监视、修改或者替换方法定义。

方法装饰器表达式在运行时当作函数被调用，传入下面 3 个参数：

- 处于静态方法而言就是当前的类，对于实例方法而言就是当前的实例
- 被绑定方法的名字
- 被绑定方法的属性描述符

```ts
// 一个案例：动态替换方法

function test(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  descriptor.value = (): void => {
    console.log('decorator name')
  }
}

class Person {
  @test
  sayName(): void {
    console.log('inner name')
  }
}

const p = new Person()
p.sayName() // decorator name
```

#### 6. 访问器装饰器

访问器装饰器生命在一个访问器的声明之前（紧靠着访问器声明）

访问器装饰器应用于访问器的属性描述符并且可以用来监视、修改或替换一个访问器的定义。

访问器装饰器表达式在运行时当作函数被调用，传入下列 3 个参数：

- 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象
- 成员的名字
- 成员的属性描述符

**注意：**

TypeScript 不允许同时装饰一个成员的 get 和 set 访问器，取而代之的是，一个成员的所有装饰器都必须应用在文档顺序的第一个访问器上

```ts
function test(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  // 既能拿到 get ，还能拿到 set，所以只能设置一个访问器装饰器
  descriptor.set = (value: string) => {
    target.myName = value
  }
  descriptor.get = (): string => {
    return target.myName
  }
}

class Person {
  private _name: string
  constructor(name: string) {
    this._name = name
  }
  // set 或 get 装饰器哪个在前面，就设置哪一个，两个不能设置为装饰器
  @test
  get name(): string {
    return this._name
  }
  set name(value: string) {
    this._name = value
  }
}

const p = new Person('zzz')
p.name = 'yyy'
console.log(p.name)
```

#### 7. 属性装饰器

属性装饰器生命在一个属性的声明之前（紧靠着属性声明）

属性装饰器表达式在运行时当作函数被调用，传入下列 3 个参数：

- 对于静态属性来说就是当前的类，对于实例属性来说就是当前实例
- 成员的名字

```ts
function test(target: any, propertyKey: string) {
  target[propertyKey] = '123'
}

class Person {
  static age: number
  @test
  name?: string
}
```

#### 8. 参数装饰器

参数装饰器生命在一个参数的声明之前（紧靠着参数声明）

参数装饰器表达式在运行时当作函数被调用，传入下列 3 个参数：

- 对于静态成员来说就是当前的类，对于实例成员来说就是当前实例
- 参数所在的方法名称
- 参数在参数列表中的索引

```ts
function test(target: any, propertyKey: string, index: number) {}

class Person {
  say(age: number, @test name: string): void {}
}
```

#### 9. 注意

属性装饰器和参数装饰器最常见的应用场景就是配合元数据（reflect-metadata）,在不改变原有数据的同时增加一些额外的信息。

但是元数据目前也在提案中，没有纳入正式的规范

### 9.12 混入

#### 1. 对象混入

```ts
let obj1 = { name: 'alex' }
let obj2 = { age: 13 }

Object.assign(obj1, obj2)

console.log(obj1) // { name: 'alex', age: 13 }
console.log(obj2) // { age" 13 }
```

#### 2. 类混入

需要自定义一个方法，来`mixin`混入

```ts
function myMixin(target: any, from: any[]) {
  from.forEach(fromItem => {
    Object.getOwnPropertyNames(fromItem.prototype).forEach(name => {
      target.prototype[name] = fromItem.prototype[name]
    })
  })
}

class Cat {
  name: string
  say(): void {
    console.log('meow')
  }
}

class Dog {
  age: number
  run(): void {
    console.log('run')
  }
}

class Animal implements Cat, Dog {
  name: string
  say: () => void
  age: number
  run: () => void
}

myMixin(Animal, [Dog, Cat])
let a = new Animal()
console.log(a)
a.run()
a.say()
```

### 9.13 声明

#### 1. 什么是声明

在企业开发中我们不可避免的需要引入第三方 JS 的库，但是默认情况下 TS 是不认识我们引入的这些 JS 的库的。所以我们在使用这些 JS 的库时，我们要告诉 TS 它是什么，它怎么用。

```ts
// 比如我们使用了 jquery 的库，但是 $ TS 不知道这是什么，也不会有任何提示
// 声明一下 $,说明它接受一个 selector 参数 ，是一个函数
declare const $: (
  selector: string
) => {
  // 这里写此声明中存在的属性/方法
  width(): number
  height(): number
  ajax(url: string, config: {}): void
}
console.log($)
// 这样就有提示了
$('.app').width()
```

#### 2. 声明文件

TS 推荐将定义单独写在一个文件中，声明文件一般叫做`xx.d.ts`

注意：声明中不能出现实现

```ts
// test.d.ts
declare let name: string
declare function say(name: string): void
declare class Person {
  name: string
  age: number
  constructor(name: string, age: number)
  say(): void
}
```

```ts
// test.ts
let name: string = 'aa'
function say(name: string) {
  console.log(name)
}
```

#### 3. 声明安装

对于常见的第三方库，不少已经有现成的声明文件，所以在企业开发中，我们可以直接使用第三方的类型声明文件来使用

TS 声明文件的规范`@types/xx`

例如我想要使用 jquery 的声明文件，直接

```bash
npm install @types/jquery
```

```ts
// 使用
import jQuery = require('jquery')
// 有提示了
jQuery().width()
```

如果使用的第三方库没有提示，那就只能按照 [模板文件 ](https://www.tslang.cn/docs/handbook/declaration-files/templates.html)去自己编写了
