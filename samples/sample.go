// Package declaration and imports
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"os"
	"reflect"
	"sort"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

// ===== 1. BASIC TYPES =====
var (
	// Basic types
	intVar        int     = 42
	floatVar      float64 = 3.14159
	boolVar       bool    = true
	stringVar     string  = "hello"
	byteVar       byte    = 'A'
	runeVar       rune    = 'π'
	
	// Complex numbers (Go 1.18+)
	complexVar    complex128 = 1 + 2i
)

// ===== 2. ARRAYS & SLICES =====
var (
	fixedArray [3]int = [3]int{1, 2, 3}
	sliceVar   []int  = []int{4, 5, 6}
)

// ===== 3. MAPS =====
var config = map[string]int{
	"timeout": 30,
	"retries": 3,
}

// ===== 4. STRUCTS & METHODS =====
type Person struct {
	Name string
	Age  int
}

type Rectangle struct {
	Width, Height float64
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

func (r *Rectangle) Scale(factor float64) {
	r.Width *= factor
	r.Height *= factor
}

// Embedded struct
type Employee struct {
	Person
	Salary int
}

// ===== 5. INTERFACES =====
type Shape interface {
	Area() float64
}

type Circle struct {
	Radius float64
}

func (c Circle) Area() float64 {
	return math.Pi * c.Radius * c.Radius
}

// ===== 6. GENERICS (Go 1.18+) =====
type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(item T) {
	s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
	if len(s.items) == 0 {
		var zero T
		return zero, false
	}
	item := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return item, true
}

// ===== 7. FUNCTIONS =====
func add(x, y int) int {
	return x + y
}

func swap(a, b string) (string, string) {
	return b, a
}

func variadic(nums ...int) []int {
	return nums
}

// Closure
func counter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

// ===== 8. ERROR HANDLING =====
type ValidationError struct {
	Field string
}

func (e ValidationError) Error() string {
	return fmt.Sprintf("validation failed for %s", e.Field)
}

// ===== 9. GOROUTINES & CHANNELS =====
func worker(id int, jobs <-chan int, results chan<- int) {
	for job := range jobs {
		results <- job * 2
	}
}

// ===== 10. MAIN FUNCTION =====
func main() {
	// Variables & constants
	const Pi = 3.14159
	var msg = "Hello, Go!"
	
	fmt.Println("=== BASIC TYPES ===")
	fmt.Printf("int: %d, float: %.2f, bool: %t, string: %s\n", 
		intVar, floatVar, boolVar, stringVar)
	
	fmt.Println("\n=== ARRAYS & SLICES ===")
	fmt.Println("Array:", fixedArray)
	fmt.Println("Slice:", sliceVar)
	sliceVar = append(sliceVar, 7)
	fmt.Println("Appended slice:", sliceVar)
	
	fmt.Println("\n=== MAPS ===")
	fmt.Println("Config:", config)
	config["debug"] = 1
	fmt.Println("Updated config:", config)
	
	fmt.Println("\n=== STRUCTS & METHODS ===")
	p := Person{Name: "Alice", Age: 30}
	fmt.Printf("Person: %+v\n", p)
	
	rect := Rectangle{Width: 10, Height: 5}
	fmt.Printf("Rectangle area: %.2f\n", rect.Area())
	rect.Scale(2)
	fmt.Printf("Scaled rectangle: %+v\n", rect)
	
	emp := Employee{Person: Person{Name: "Bob", Age: 25}, Salary: 50000}
	fmt.Printf("Employee: %+v\n", emp)
	
	fmt.Println("\n=== INTERFACES ===")
	var s Shape = Circle{Radius: 5}
	fmt.Printf("Shape area: %.2f\n", s.Area())
	
	fmt.Println("\n=== GENERICS ===")
	intStack := Stack[int]{}
	intStack.Push(1)
	intStack.Push(2)
	if val, ok := intStack.Pop(); ok {
		fmt.Println("Popped:", val)
	}
	
	fmt.Println("\n=== FUNCTIONS ===")
	fmt.Println("Add:", add(3, 4))
	a, b := swap("hello", "world")
	fmt.Printf("Swapped: %s, %s\n", a, b)
	
	fmt.Println("\n=== CLOSURES ===")
	c1, c2 := counter(), counter()
	fmt.Println("Counter1:", c1(), c1())
	fmt.Println("Counter2:", c2())
	
	fmt.Println("\n=== ERROR HANDLING ===")
	if err := validate("name"); err != nil {
		fmt.Println(err)
	}
	
	fmt.Println("\n=== GOROUTINES & CHANNELS ===")
	jobs := make(chan int, 100)
	results := make(chan int, 100)
	
	// Start workers
	for w := 1; w <= 3; w++ {
		go worker(w, jobs, results)
	}
	
	// Send jobs
	for j := 1; j <= 5; j++ {
		jobs <- j
	}
	close(jobs)
	
	// Collect results
	for r := 1; r <= 5; r++ {
		fmt.Println("Result:", <-results)
	}
	
	fmt.Println("\n=== CONTROL STRUCTURES ===")
	// If/else
	if num := 9; num < 10 {
		fmt.Println("Number less than 10")
	} else {
		fmt.Println("Number 10 or greater")
	}
	
	// Switch
	switch os := runtime.GOOS; {
	case os == "darwin":
		fmt.Println("macOS")
	case os == "linux":
		fmt.Println("Linux")
	default:
		fmt.Printf("Other: %s\n", os)
	}
	
	// For/range
	numbers := []int{1, 2, 3, 4, 5}
	sum := 0
	for i, n := range numbers {
		fmt.Printf("Index %d: %d\n", i, n)
		sum += n
	}
	fmt.Println("Sum:", sum)
	
	fmt.Println("\n=== DEFER & PANIC/RECOVER ===")
	defer fmt.Println("Deferred call")
	doPanic()
	
	fmt.Println("\n=== HTTP SERVER ===")
	// Start simple HTTP server in goroutine
	go func() {
		http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			fmt.Fprintf(w, "Hello from Go server!")
		})
		log.Println("Server starting on :8080")
		log.Fatal(http.ListenAndServe(":8080", nil))
	}()
	
	time.Sleep(100 * time.Millisecond) // Give server time to start
}

// Custom functions
func validate(field string) error {
	if strings.TrimSpace(field) == "" {
		return ValidationError{Field: field}
	}
	return nil
}

func doPanic() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()
	panic("Something went wrong!")
}

func init() {
	fmt.Println("init() called")
}