// Complete TypeScript Features Demo
// Demonstrates every major TS feature in one file

// ===== 1. BASIC TYPES =====
const num: number = 42;
const str: string = "hello";
const bool: boolean = true;
const nul: null = null;
const und: undefined = undefined;
const sym: symbol = Symbol("id");
const big: bigint = 100n;
const anyVal: any = "any";
const unk: unknown = 42;

// Literal types
type Literal = "hello" | 42 | true;
const lit: Literal = "hello";

// ===== 2. ARRAYS & TUPLES =====
const arr: number[] = [1, 2, 3];
const tuple: [string, number, boolean] = ["Alice", 30, true];
const readonlyTuple: readonly [string, number] = ["Bob", 25];

// ===== 3. OBJECTS & INTERFACES =====
interface Person {
    name: string;
    age: number;
    readonly id: number;
    [key: string]: unknown; // Index signature
}

interface Employee extends Person {
    salary: number;
}

const employee: Employee = {
    name: "Alice",
    age: 30,
    id: 1,
    salary: 50000
};

// Type aliases
type UserId = string | number;
type Point = { x: number; y: number };
type Optional<T> = T | undefined;

// ===== 4. UNION & INTERSECTION =====
type Status = "active" | "inactive" | "pending";
type Admin = Person & { role: "admin" };

const admin: Admin = {
    name: "Bob",
    age: 35,
    id: 2,
    role: "admin",
    salary: 75000
};

// ===== 5. GENERICS =====
function identity<T>(arg: T): T {
    return arg;
}

class Box<T> {
    private value: T;
    constructor(value: T) { this.value = value; }
    getValue(): T { return this.value; }
}

const numBox = new Box<number>(42);

// Generic constraints
function getLength<T extends { length: number }>(item: T): number {
    return item.length;
}

// ===== 6. ENUMS =====
enum Color {
    Red = "RED",
    Green = "GREEN",
    Blue = "BLUE"
}

enum StatusCode {
    OK = 200,
    NOT_FOUND = 404
}

// ===== 7. FUNCTIONS =====
type Handler = (req: string, res: any) => void;
const handler: Handler = (req, res) => {
    res.send(`Hello ${req}`);
};

// Overloads
function parse(value: string): number;
function parse(value: number): number;
function parse(value: string | number): number {
    return typeof value === "number" ? value : parseInt(value);
}

// Optional & rest parameters
function greet(name: string, greeting?: string, ...extras: string[]): string {
    return `${greeting ?? "Hi"}, ${name}! ${extras.join(", ")}`;
}

// ===== 8. CLASSES =====
class Animal {
    protected name: string;
    constructor(name: string) {
        this.name = name;
    }
    
    move(distance: number = 0): string {
        return `${this.name} moved ${distance}m.`;
    }
}

class Dog extends Animal {
    private breed: string;
    
    constructor(name: string, breed: string) {
        super(name);
        this.breed = breed;
    }
    
    bark(): string {
        return "Woof! Woof!";
    }
    
    // Abstract-like (sealed concept)
    getDetails(): string {
        return `${this.name} (${this.breed})`;
    }
}

// ===== 9. UTILITY TYPES =====
type PartialPerson = Partial<Person>;
type RequiredPerson = Required<Person>;
type PickPerson = Pick<Person, "name" | "age">;
type OmitPerson = Omit<Person, "id">;
type UserWithRole = Person & { role?: string };

// Mapped types
type ReadOnly<T> = {
    readonly [K in keyof T]: T[K];
};

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
type ExtractNumbers<T> = T extends number ? T : never;

// ===== 10. ADVANCED TYPES =====
// Discriminated unions
interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    side: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle": return Math.PI * shape.radius ** 2;
        case "square": return shape.side ** 2;
    }
}

// Type guards
function isCircle(shape: Shape): shape is Circle {
    return shape.kind === "circle";
}

// Never type
function exhaustiveCheck(shape: never): never {
    throw new Error(`Unhandled shape: ${shape}`);
}

// ===== 11. MODULES & NAMESPACES =====
namespace Utils {
    export function log(msg: string): void {
        console.log(`[LOG] ${msg}`);
    }
    
    export const VERSION = "1.0.0";
}

// ===== 12. DECORATORS (requires experimentalDecorators) =====
function logged(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyKey}`);
        return original.apply(this, args);
    };
}

class Calculator {
    @logged
    add(a: number, b: number): number {
        return a + b;
    }
}

// ===== 13. ADVANCED FEATURES =====
// Template literal types
type EventName = `on${"Click" | "Hover" | "Focus"}`;
type MouseEvent = "click" | "dblclick" | "mousedown";

// Keyof & Indexed access
type PersonKeys = keyof Person; // "name" | "age" | "id" | string
type Age = Person["age"]; // number

// Conditional types with infer
type Flatten<T> = T extends Array<infer U> ? U : T;

// ===== 14. MODERN FEATURES =====
// Const assertions
const personList = ["Alice", "Bob"] as const;
type PersonName = typeof personList[number]; // "Alice" | "Bob"

// Satisfies operator (TS 4.9+)
const config = {
    apiUrl: "https://api.example.com",
    timeout: 5000
} satisfies Record<string, unknown>;

// In operator (TS 4.9+)
type Fish = "fin" extends FishKeys ? true : false;
type Bird = "wings" extends FishKeys ? true : false;

// ===== 15. MAIN EXECUTION =====
function main(): void {
    console.log("=== TypeScript Complete Features Demo ===\n");
    
    // Basic types
    console.log("Primitives:", { num, str, bool, big });
    
    // Generics
    console.log("Identity<number>(42):", identity<number>(42));
    
    // Classes
    const dog = new Dog("Rex", "Labrador");
    console.log("Dog:", dog.getDetails(), dog.bark());
    
    // Discriminated union
    const circle: Shape = { kind: "circle", radius: 5 };
    console.log("Circle area:", getArea(circle));
    
    // Utility types
    const partial: PartialPerson = { name: "Charlie" };
    console.log("Partial:", partial);
    
    // Template literals
    const event: EventName = "onClick";
    console.log("Event:", event);
    
    // Type guards
    if (isCircle(circle)) {
        console.log("Radius:", circle.radius);
    }
    
    Utils.log("Demo complete!");
    console.log("Utils.VERSION:", Utils.VERSION);
}

// Type-only imports/exports
import type { Point } from "./types"; // Hypothetical

main();