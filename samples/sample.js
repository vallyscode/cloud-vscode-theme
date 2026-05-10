#!/usr/bin/env node
/**
 * Complete JavaScript Features Demo - ES1 to ES2025
 * Every major JS feature in one self-contained file
 */

// ===== 1. BASIC TYPES & LITERALS =====
const num = 42;
const str = "hello";
const bool = true;
const nul = null;
const und = undefined;
const sym = Symbol("id");
const big = 1234567890123456789012345n;
const obj = {};
const arr = [1, 2, 3];
const regex = /abc/gi;

// ES2025 regex `v` flag
const namedCapture = /(?<year>\d{4})/v;

// ===== 2. VARIABLES (var/let/const) =====
var globalVar = "var";
let blockVar = "let";
const constVar = "const";

// Block scoping
{
    let shadow = "shadow";
    const shadow2 = "shadow2";
}

// Temporal Dead Zone demo
// console.log(tdz); // ReferenceError
let tdz = "ok";

// ===== 3. FUNCTIONS =====
// Arrow functions
const add = (a, b) => a + b;

// Default parameters
const greet = (name = "World") => `Hello ${name}`;

// Rest parameters
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);

// Generators
function* generator() {
    yield 1;
    yield 2;
    yield 3;
}

// Async generators
async function* asyncGen() {
    yield await Promise.resolve(1);
}

// Async/await
async function fetchData() {
    try {
        const data = await Promise.resolve("data");
        return data;
    } catch (error) {
        throw new Error("Failed");
    }
}

// ===== 4. CLASSES =====
class Animal {
    #privateField = 0; // Private fields
    
    static staticProp = "static";
    
    constructor(name) {
        this.name = name;
    }
    
    move(distance = 0) {
        return `${this.name} moved ${distance}m`;
    }
    
    // Private methods
    #privateMethod() {
        return "private";
    }
    
    getPrivate() {
        return this.#privateMethod();
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
    
    bark() {
        return "Woof!";
    }
}

// Static fields/methods
class MathUtils {
    static PI = 3.14159;
    static circleArea(r) {
        return this.PI * r * r;
    }
}

// ===== 5. MODULES (ES6+) =====
// Hypothetical import/export for demo
const Utils = {
    log: (msg) => console.log(`[LOG] ${msg}`)
};

// ===== 6. DESTRUCTURING =====
const { name: personName, age } = { name: "Alice", age: 30 };
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// ===== 7. SPREAD & REST =====
const newArr = [...arr, 4, 5];
const newObj = { ...obj, x: 1 };

// ===== 8. TEMPLATE LITERALS =====
const template = `Multi-line
${num}
string`;

// Tagged templates
function tag(strings, ...values) {
    return strings[0] + values[0];
}
const tagged = tag`Hello ${num}`;

// ===== 9. OBJECT LITERALS =====
const propShorthand = { name, age: 30 };
const methodShorthand = {
    greet() { return `Hi ${this.name}`; },
    ['computed']: 'key'
};

// Optional chaining & nullish coalescing
const safeAccess = obj?.prop?.nested ?? "default";

// ===== 10. ARRAY METHODS =====
const doubled = arr.map(x => x * 2);
const evens = arr.filter(x => x % 2 === 0);
const total = arr.reduce((sum, x) => sum + x, 0);

// Modern array methods
const first = arr.at(0);
const sliced = arr.slice(-2);
const includesCheck = arr.includes(2);

// ===== 11. PROMISES & ASYNC =====
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function parallel() {
    const [result1, result2] = await Promise.all([
        delay(100).then(() => "first"),
        delay(50).then(() => "second")
    ]);
    return result2 + result1;
}

// ===== 12. ITERATORS & GENERATORS =====
const iter = arr[Symbol.iterator]();
console.log(iter.next().value); // 1

// For-await
(async () => {
    for await (const value of asyncGen()) {
        console.log(value);
    }
})();

// ===== 13. PROXIES & REFLECT =====
const target = { name: "target" };
const handler = {
    get(target, prop) {
        return Reflect.get(target, prop) ?? "default";
    }
};
const proxy = new Proxy(target, handler);

// ===== 14. WEAKMAP/WEAKSET =====
const wm = new WeakMap();
const ws = new WeakSet();
const obj1 = {};
wm.set(obj1, "secret");
ws.add(obj1);

// ===== 15. SYMBOLS =====
const mySymbol = Symbol.iterator;
const iterable = {
    [mySymbol]() {
        return arr[Symbol.iterator]();
    }
};

// ===== 16. MODERN FEATURES (ES2021+) =====
// Logical assignment
let x = 0;
x ||= 10; // 10
x &&= 5;  // 5
x ??= 20; // 5

// Numeric separators
const bigNum = 1_000_000_000;

// Top-level await (modules only)
const topLevelData = await fetchData();

// ===== 17. PATTERN MATCHING (hypothetical ES2025) =====
function match(value) {
    if (value === 42) return "answer";
    if (Array.isArray(value) && value.length === 2) return "pair";
    return "unknown";
}

// ===== 18. MAIN DEMO =====
async function main() {
    console.log("=== JavaScript Complete Features Demo ===\n");
    
    // Primitives
    console.log("Primitives:", { num, str, bool, big, sym.toString() });
    
    // Classes
    const dog = new Dog("Rex", "Labrador");
    console.log("Dog:", dog.move(10), dog.bark());
    
    // Destructuring
    console.log("Destructuring:", { personName, age });
    
    // Array methods
    console.log("Array ops:", doubled, evens, total);
    
    // Generators
    const gen = generator();
    console.log("Generator:", Array.from(gen));
    
    // Async
    const asyncResult = await fetchData();
    console.log("Async:", asyncResult);
    
    // Proxies
    console.log("Proxy:", proxy.missing);
    
    // Modern syntax
    console.log("Logical:", x, "Template:", template);
    
    // Private fields
    console.log("Private:", dog.getPrivate());
    
    Utils.log("Complete!");
}

// Polyfill for Node.js top-level await
(async () => {
    try {
        await main();
    } catch (error) {
        console.error("Error:", error);
    }
})();