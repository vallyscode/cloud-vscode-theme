import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// Record (Java 14+)
record Person(String name, int age, String email) {}

// Sealed interface (Java 17+)
sealed interface Shape permits Circle, Rectangle {
    double area();
}

// Pattern matching (Java 21+)
record Circle(double radius) implements Shape {
    @Override public double area() { return Math.PI * radius * radius; }
}

record Rectangle(double width, double height) implements Shape {
    @Override public double area() { return width * height; }
}

public class CompleteJavaFeatures {
    // Enums
    enum Color { RED, GREEN, BLUE }
    
    // Nested class
    static class Counter {
        private int count = 0;
        public synchronized void increment() { count++; }
        public int getCount() { return count; }
    }
    
    // Main method with var (Java 10+)
    public static void main(String[] args) {
        System.out.println("=== Java Complete Features Demo ===\n");
        
        // 1. PRIMITIVES & WRAPPERS
        int primitiveInt = 42;
        Integer wrapperInt = 42; // Autoboxing
        System.out.println("Primitives: " + primitiveInt + ", Wrapper: " + wrapperInt);
        
        // 2. ARRAYS
        int[] array = {1, 2, 3};
        System.out.println("Array: " + Arrays.toString(array));
        
        // 3. COLLECTIONS
        List<String> list = new ArrayList<>(List.of("apple", "banana", "cherry"));
        Set<Integer> set = new HashSet<>(Set.of(1, 2, 2, 3)); // Factory methods (Java 9+)
        Map<String, Integer> map = new HashMap<>(Map.of("a", 1, "b", 2));
        System.out.println("List: " + list + ", Set: " + set + ", Map: " + map);
        
        // 4. STRINGS & TEXT BLOCKS (Java 15+)
        String textBlock = """
            This is a multi-line
            text block with %s!
            """.formatted("Java");
        System.out.println("Text block:\n" + textBlock);
        
        // 5. RECORDS
        var person = new Person("Alice", 30, "alice@example.com");
        System.out.println("Record: " + person);
        
        // 6. LAMBDA & FUNCTIONAL INTERFACES (Java 8+)
        List<Integer> numbers = List.of(1, 2, 3, 4, 5);
        List<Integer> doubled = numbers.stream()
            .map(n -> n * 2)
            .collect(Collectors.toList());
        System.out.println("Stream doubled: " + doubled);
        
        // Method references
        list.sort(String::compareTo);
        System.out.println("Sorted: " + list);
        
        // 7. OPTIONAL
        Optional<String> optional = Optional.ofNullable(getNameOrNull());
        String name = optional.orElse("Unknown");
        System.out.println("Optional: " + name);
        
        // 8. SWITCH EXPRESSIONS (Java 14+)
        Color color = Color.RED;
        String colorName = switch (color) {
            case RED -> "Red";
            case GREEN -> "Green";
            case BLUE -> "Blue";
        };
        System.out.println("Switch expr: " + colorName);
        
        // 9. PATTERN MATCHING (Java 21+)
        Object obj = new Circle(5);
        if (obj instanceof Circle c) {
            System.out.println("Circle area: " + c.area());
        }
        
        // 10. GENERICS
        class Box<T> {
            private T value;
            Box(T value) { this.value = value; }
            T get() { return value; }
        }
        Box<String> stringBox = new Box<>("Hello");
        System.out.println("Generic: " + stringBox.get());
        
        // 11. EXCEPTIONS
        try {
            riskyOperation();
        } catch (Exception e) {
            System.out.println("Caught: " + e.getMessage());
        }
        
        // 12. THREADS & VIRTUAL THREADS (Java 21+)
        try {
            ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
            executor.submit(() -> System.out.println("Virtual thread: " + 
                Thread.currentThread()));
            executor.shutdown();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // 13. CONCURRENCY
        Counter counter = new Counter();
        Runnable task = () -> {
            for (int i = 0; i < 1000; i++) counter.increment();
        };
        Thread[] threads = new Thread[10];
        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(task);
            threads[i].start();
        }
        for (Thread t : threads) t.join();
        System.out.println("Counter: " + counter.getCount());
        
        // 14. STREAM OPERATIONS
        long count = numbers.stream()
            .filter(n -> n % 2 == 0)
            .mapToLong(n -> n)
            .sum();
        System.out.println("Even sum: " + count);
        
        // 15. LOCAL TYPE INFERENCE (var)
        var list2 = new ArrayList<Integer>();
        var map2 = Map.of("key", "value");
        var stream = Stream.of(1, 2, 3);
        
        // 16. ENUM WITH METHODS
        System.out.println("Enum ordinal: " + Color.RED.ordinal());
        
        // 17. DATETIME API (Java 8+)
        LocalDateTime now = LocalDateTime.now();
        System.out.println("Now: " + now.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
    }
    
    static String getNameOrNull() { return null; }
    
    static void riskyOperation() throws Exception {
        throw new Exception("Test exception");
    }
    
    // Inner class
    class Inner {
        void sayHello() {
            System.out.println("Hello from inner: " + CompleteJavaFeatures.this);
        }
    }
    
    // Static nested class access
    static void demoInner() {
        CompleteJavaFeatures outer = new CompleteJavaFeatures();
        Inner inner = outer.new Inner();
        inner.sayHello();
    }
    
    // Functional interface example
    @FunctionalInterface
    interface Calculator {
        int calculate(int a, int b);
    }
    
    static void demoFunctional() {
        Calculator add = (a, b) -> a + b;
        System.out.println("Functional: " + add.calculate(2, 3));
    }
}