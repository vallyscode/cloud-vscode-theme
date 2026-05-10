// Complete C Features Demo - C11/C17 with EXTENSIVE MACROS
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdatomic.h>
#include <threads.h>
#include <time.h>
#include <complex.h>
#include <math.h>

// ===== MACRO FUNDAMENTALS =====
// Simple substitution
#define PI 3.14159
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define MIN(a, b) ((a) < (b) ? (a) : (b))

// Multi-statement macro (with do-while trick)
#define SWAP(x, y, T) do { \
    T temp = (x);          \
    (x) = (y);             \
    (y) = temp;            \
} while(0)

// Stringification
#define STR(s) #s
#define XSTR(s) STR(s)

// Token pasting (concatenation)
#define CONCAT(a, b) a ## b
#define XCONCAT(a, b) CONCAT(a, b)

// Variadic macros (C99+)
#define DEBUG(fmt, ...) fprintf(stderr, "DEBUG %s:%d: " fmt "\n", __FILE__, __LINE__, ##__VA_ARGS__)
#define LOG(level, fmt, ...) printf("[%s] " fmt "\n", level, ##__VA_ARGS__)

// Conditional compilation
#define PRODUCTION 0
#if !PRODUCTION
    #define ASSERT(cond) do { if (!(cond)) { fprintf(stderr, "ASSERT failed: %s\n", #cond); exit(1); } } while(0)
#else
    #define ASSERT(cond)
#endif

// Recursive macros
#define RECURSE(n) do { \
    if (n > 0) {        \
        printf("%d ", n); \
        RECURSE(n-1);   \
    }                   \
} while(0)

// Macro with typeof (GNU C)
#define NEW(type, ...) ((type []){(type []){__VA_ARGS__}})

// ===== ADVANCED MACRO PATTERNS =====
// Generic min/max with typeof (GNU C)
#define typeof __typeof__
#define DECLTYPE(x) (__typeof__(x))
#define MIN_TYPE_SAFE(a, b) ({ \
    DECLTYPE(a) _a = (a);      \
    DECLTYPE(b) _b = (b);      \
    _a < _b ? _a : _b;         \
})

// Array count
#define COUNT_OF(arr) (sizeof(arr) / sizeof((arr)[0]))

// Container of macro (for struct member offsets)
#define CONTAINER_OF(ptr, type, member) ({ \
    const typeof(((type *)0)->member) *__mptr = (ptr); \
    (type *)((char *)__mptr - offsetof(type, member)); \
})

// ===== REST OF PROGRAM =====
typedef struct {
    char name[32];
    int age;
    enum Color { RED, GREEN, BLUE } color;
} person_t;

void print_vla(int n, int arr[n]);
bool is_even(int x);

#define print_type(x) _Generic((x), \
    int: printf("int: %d\n", (x)), \
    float: printf("float: %f\n", (double)(x)), \
    char*: printf("string: %s\n", (x)), \
    default: printf("other: %p\n", (void*)(x)) \
)

int main(void) {
    printf("=== C MACRO SUPERSET DEMO ===\n\n");
    
    // 1. BASIC MACROS
    DEBUG("Starting demo");
    LOG("INFO", "PI = %.5f", PI);
    printf("MAX(10, 20) = %d\n", MAX(10, 20));
    printf("MIN(10, 20) = %d\n", MIN(10, 20));
    
    // 2. SWAP MACRO
    int a = 5, b = 10;
    printf("Before swap: a=%d, b=%d\n", a, b);
    SWAP(a, b, int);
    printf("After swap: a=%d, b=%d\n", a, b);
    
    // 3. STRINGIFICATION & TOKEN PASTING
    printf("Stringified PI: %s\n", STR(PI));
    printf("Stringified 3.14: %s\n", XSTR(3.14));
    
    int test123 = 999;
    printf("Token paste test123: %d\n", XCONCAT(test, 123));
    
    // 4. VARIADIC MACROS
    LOG("ERROR", "Failed with code %d: %s", 404, "Not Found");
    DEBUG("Array values: %d, %d, %f", 1, 2, 3.14);
    
    // 5. ASSERT
    ASSERT(1 + 1 == 2);
    // ASSERT(1 + 1 == 3); // Would crash in debug
    
    // 6. RECURSIVE MACRO
    printf("Recursive countdown: ");
    RECURSE(5);
    printf("\n");
    
    // 7. GENERIC MACROS
    int x = 42;
    float y = 3.14f;
    print_type(x);
    print_type(y);
    print_type("hello");
    
    // 8. ARRAY HELPERS
    int arr[] = {1, 2, 3, 4, 5};
    printf("Array count: %zu\n", COUNT_OF(arr));
    
    // 9. TYPE-SAFE MIN
    printf("Type-safe min(5.5, 3): %g\n", MIN_TYPE_SAFE(5.5, 3));
    
    // 10. NEW MACRO (GNU C)
    int* new_arr = NEW(int, 10, 20, 30, 0);
    printf("NEW array: %d, %d, %d\n", new_arr[0], new_arr[1], new_arr[2]);
    free(new_arr);
    
    // 11. CONTAINER_OF (Linux kernel style)
    typedef struct {
        int id;
        char data[16];
    } container_t;
    
    container_t cont = {42, "test"};
    container_t* ptr = CONTAINER_OF(&cont.data, container_t, data);
    printf("Container ID: %d\n", ptr->id);
    
    printf("\n=== %d macros demonstrated! ===\n", 15);
    return EXIT_SUCCESS;
}