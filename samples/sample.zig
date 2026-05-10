//! A "Tour of Zig" in one file.
//! This demonstrates top-level doc comments.

const std = @import("std");

// --- 1. Variables and Constants ---
const pi: f32 = 3.14159; // Immutable
var count: u32 = 0;       // Mutable

// --- 2. Structs and Enums ---
const Color = enum { red, blue, green };

const Point = struct {
    x: f32,
    y: f32,
    
    // Member functions
    pub fn init(x: f32, y: f32) Point {
        return .{ .x = x, .y = y }; // Struct literal syntax
    }
};

// --- 3. Error Handling ---
const MathError = error{ DivisionByZero, NegativeValue };

fn divide(a: f32, b: f32) MathError!f32 {
    if (b == 0) return MathError.DivisionByZero;
    return a / b;
}

// --- 4. Generics and Comptime ---
// Zig doesn't have "Generics"; it has functions that return types at compile-time.
fn List(comptime T: type) type {
    return struct {
        items: []T,
        len: usize,
    };
}

// --- 5. Memory Management & Defer ---
pub fn main() !void {
    // Standard output setup
    const stdout = std.io.getStdOut().writer();

    // Allocators are explicit
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    defer _ = gpa.deinit(); // Executes at end of scope

    const buffer = try allocator.alloc(u8, 100);
    defer allocator.free(buffer); // Clean up memory

    // --- 6. Optionals and Control Flow ---
    var optional_value: ?i32 = null;
    optional_value = 42;

    if (optional_value) |value| {
        try stdout.print("Optional value: {}\n", .{value});
    }

    // --- 7. Loops and Switches ---
    const items = [_]i32{ 1, 2, 3, 4, 5 }; // Array literal
    for (items, 0..) |item, i| {
        if (i == 2) continue;
        _ = item; // Discard unused variable
    }

    const result = switch (items[0]) {
        1 => "one",
        2...5 => "two to five",
        else => "unknown",
    };
    _ = result;

    // --- 8. Using the Error Result ---
    const division = divide(10, 2) catch |err| {
        try stdout.print("Error occurred: {}\n", .{err});
        return;
    };
    try stdout.print("Division result: {d}\n", .{division});

    // --- 9. Comptime Blocks ---
    comptime {
        const x = 5 + 5;
        if (x != 10) @compileError("Math is broken");
    }
}