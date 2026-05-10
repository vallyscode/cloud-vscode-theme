// C++20/23 Complete Features Demo
#include <iostream>
#include <vector>
#include <array>
#include <unordered_map>
#include <string>
#include <memory>
#include <thread>
#include <mutex>
#include <future>
#include <chrono>
#include <optional>
#include <variant>
#include <ranges>
#include <format>
#include <bit>
#include <concepts>
#include <coroutine>

// C-style structs and typedefs (C compatibility)
typedef struct {
    int x, y;
} Point;

union Data {
    int i;
    float f;
    char c;
};

// ===== CONCEPTS (C++20) =====
template<typename T>
concept Integral = std::is_integral_v<T>;

template<typename T>
concept Printable = requires(T t) { 
    std::cout << t; 
};

// ===== MODULES (C++20 - simulated with header) =====

// ===== ENUMS =====
enum Color { RED, GREEN, BLUE };
enum class Status : uint8_t { OK, ERROR, PENDING };

// ===== CLASSES & INHERITANCE =====
class Base {
protected:
    int base_value = 42;
public:
    virtual ~Base() = default;
    virtual void print() const { std::cout << "Base\n"; }
    virtual int value() const = 0;
};

class Derived : public Base {
    int value = 100;
public:
    int value() const override { return value; }
    void print() const override { std::cout << "Derived: " << value << "\n"; }
};

// ===== TEMPLATES & GENERICS =====
template<typename T, size_t N>
class Array {
    std::array<T, N> data;
public:
    void push(T val) { 
        if (data.size() < N) data[data.size()] = val; 
    }
    T get(size_t i) const { return data[i]; }
};

// SFINAE replacement with concepts
template<Integral T>
T add(T a, T b) { return a + b; }

// ===== LAMBDA WITH CAPTURE =====
auto lambda = [i = 0]() mutable -> int {
    return ++i;
};

// ===== SMART POINTERS =====
struct Node {
    std::unique_ptr<Node> next;
    std::shared_ptr<int> data;
    Node(int val) : data(std::make_shared<int>(val)) {}
};

// ===== COROUTINES (C++20) =====
struct Generator {
    struct promise_type {
        Generator get_return_object() { return {}; }
        std::suspend_never initial_suspend() { return {}; }
        std::suspend_never final_suspend() noexcept { return {}; }
        void return_void() {}
        std::suspend_always yield_value(int v) {
            current_value = v;
            return {};
        }
        void unhandled_exception() {}
        int current_value;
    };
    Generator(promise_type& p) : coro(std::coroutine_handle<promise_type>::from_promise(p)) {}
    ~Generator() { if (coro) coro.destroy(); }
    int next() {
        if (coro) {
            coro.resume();
            if (coro.done()) {
                coro.destroy();
                coro = nullptr;
            }
            return coro ? coro.promise().current_value : 0;
        }
        return 0;
    }
    std::coroutine_handle<promise_type> coro;
};

// ===== MAIN FUNCTION =====
int main() {
    std::cout << std::format("=== C++ Complete Features Demo ===\n\n", std::chrono::system_clock::now());

    // ===== 1. C-STYLE FEATURES =====
    printf("C-style: %d\n", 42);
    int c_array[] = {1, 2, 3};
    printf("C array: %d\n", c_array[0]);

    // ===== 2. RAII & CLASSES =====
    Derived d;
    d.print();
    std::cout << "Virtual: " << d.value() << "\n";

    // ===== 3. STL CONTAINERS =====
    std::vector<int> vec = {1, 2, 3, 4, 5};
    std::unordered_map<std::string, int> map = {
        {"one", 1}, {"two", 2}
    };
    
    std::cout << "Vector: ";
    for (int n : vec) std::cout << n << " ";
    std::cout << "\nMap: " << map["one"] << "\n";

    // ===== 4. ITERATORS & RANGES (C++20) =====
    std::cout << "Range sum: " 
              << std::ranges::fold_left(vec, 0, std::plus{}) << "\n";

    // ===== 5. SMART POINTERS =====
    auto node = std::make_unique<Node>(42);
    node->next = std::make_unique<Node>(100);
    std::cout << "*node->data: " << *node->data << "\n";

    // ===== 6. LAMBDAS =====
    std::cout << "Lambda: " << lambda() << ", " << lambda() << "\n";

    // ===== 7. MOVE SEMANTICS =====
    std::vector<int> moved_vec = std::move(vec);
    std::cout << "Moved vec size: " << moved_vec.size() << "\n";

    // ===== 8. TEMPLATE METAPROGRAMMING =====
    std::cout << "Template add<int>: " << add(5, 7) << "\n";

    // ===== 9. MULTITHREADING =====
    std::mutex mtx;
    int shared = 0;
    
    auto worker = [&](int id) {
        for (int i = 0; i < 1000; ++i) {
            std::lock_guard<std::mutex> lock(mtx);
            ++shared;
        }
    };
    
    std::vector<std::thread> threads;
    for (int i = 0; i < 4; ++i) {
        threads.emplace_back(worker, i);
    }
    for (auto& t : threads) t.join();
    std::cout << "Thread counter: " << shared << "\n";

    // ===== 10. ASYNC & FUTURES =====
    auto future = std::async(std::launch::async, []() {
        std::this_thread::sleep_for(100ms);
        return 42;
    });
    std::cout << "Async result: " << future.get() << "\n";

    // ===== 11. OPTIONAL & VARIANT (C++17/20) =====
    std::optional<int> opt = 42;
    std::cout << "Optional: " << (opt ? std::to_string(*opt) : "none") << "\n";
    
    std::variant<int, std::string> v = 123;
    std::cout << "Variant: " << std::get<int>(v) << "\n";

    // ===== 12. CONSTEXPR & CONSTINIT =====
    constexpr int factorial(int n) {
        return n <= 1 ? 1 : n * factorial(n-1);
    }
    constinit int global_counter = 0;
    std::cout << "Constexpr factorial(5): " << factorial(5) << "\n";

    // ===== 13. BIT OPERATIONS (C++20) =====
    std::cout << "popcount(42): " << std::popcount(42) << "\n";

    // ===== 14. COROUTINES =====
    // Simplified coroutine example
    auto gen = []() -> Generator {
        co_yield 1;
        co_yield 2;
        co_yield 3;
    }();
    std::cout << "Coroutine: " << gen.next() << ", "
              << gen.next() << ", " << gen.next() << "\n";

    // ===== 15. SPACES HIP OPERATOR (C++20) =====
    auto cmp = [](int a, int b) { return a < b; };
    std::vector<int> sorted = {3, 1, 4, 1, 5};
    std::ranges::sort(sorted, cmp);
    std::cout << "Spaceship sorted: ";
    for (int n : sorted) std::cout << n << " ";
    std::cout << "\n";

    std::cout << "\n=== All C++ features demo complete! ===\n";
    return 0;
}