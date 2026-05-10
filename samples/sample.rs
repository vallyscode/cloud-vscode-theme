//! A comprehensive tour of Rust features.
//! This is a module-level doc comment.

use std::fmt;

// --- 1. Enums and Pattern Matching ---
enum Status {
    Active,
    Inactive(String), // Enum with data
    Error { code: i32 }, // Struct-like variant
}

// --- 2. Traits (Interfaces) ---
trait Summary {
    fn summarize(&self) -> String;
    
    // Default implementation
    fn author(&self) -> String {
        String::from("Anonymous")
    }
}

// --- 3. Structs and Generics ---
struct Point<T> {
    x: T,
    y: T,
}

impl<T: fmt::Display> Summary for Point<T> {
    fn summarize(&self) -> String {
        format!("Point(x: {}, y: {})", self.x, self.y)
    }
}

// --- 4. Macros ---
macro_rules! say_hello {
    () => {
        println!("Hello from a declarative macro!");
    };
}

// --- 5. The Main Function and Error Handling ---
fn main() -> Result<(), Box<dyn std::error::Error>> {
    say_hello!();

    // --- 6. Ownership and Borrowing ---
    let s1 = String::from("Rust"); 
    let s2 = &s1; // Immutable borrow
    let mut s3 = s1; // Ownership moves here; s1 is now invalid
    s3.push_str(" is powerful"); // Mutable access

    // --- 7. Pattern Matching ---
    let status = Status::Inactive(String::from("Maintenance"));
    match status {
        Status::Active => println!("System is up"),
        Status::Inactive(reason) => println!("Down for: {}", reason),
        Status::Error { code } if code > 500 => println!("Server Error: {}", code),
        _ => println!("Other state"),
    }

    // --- 8. Closures and Iterators ---
    let numbers = vec![1, 2, 3, 4, 5];
    let doubled: Vec<i32> = numbers.iter()
        .map(|x| x * 2)
        .filter(|&x| x > 5)
        .collect();

    // --- 9. Smart Pointers (Box, Rc, Arc) ---
    let heap_data = Box::new(Point { x: 10.5, y: 20.0 });
    println!("{}", heap_data.summarize());

    // --- 10. Unsafe Rust ---
    let x = 5;
    let r1 = &x as *const i32; // Raw pointer
    unsafe {
        // Dereferencing raw pointers requires unsafe blocks
        println!("Raw pointer value: {}", *r1);
    }

    // --- 11. Concurrency (Threads) ---
    let handle = std::thread::spawn(|| {
        println!("Message from a thread!");
    });
    handle.join().unwrap();

    Ok(()) // Return success
}