#!/usr/bin/env python3
"""
Complete Python Features Demo - Python 3.12+
Shows every major language feature in one file
"""

import asyncio
import dataclasses
import enum
import functools
import itertools
import json
import multiprocessing as mp
import os
import re
import sys
import threading
import time
import typing
from collections import defaultdict, deque, namedtuple
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from pathlib import Path
from typing import (
    Any, Callable, Dict, Generic, List, Literal, Optional, Protocol, TypeAlias, TypeVar
)
from weakref import WeakKeyDictionary

# ===== 1. BASIC TYPES & LITERALS =====
PRIMITIVE_INT: int = 42
PRIMITIVE_FLOAT: float = 3.14159
BOOL_TRUE: bool = True
BOOL_FALSE: bool = False
NONE_VAL: None = None
IMAGINARY: complex = 1 + 2j

# Type aliases (Python 3.10+)
Point: TypeAlias = tuple[float, float]
UserId: TypeAlias = int

# ===== 2. COLLECTIONS =====
LIST_VAL: List[int] = [1, 2, 3]
TUPLE_VAL: tuple[int, str, float] = (1, "hello", 3.14)
DICT_VAL: Dict[str, int] = {"a": 1, "b": 2}
SET_VAL: set[str] = {"apple", "banana"}

# NamedTuple
PersonNT = namedtuple("PersonNT", ["name", "age"])
person_nt = PersonNT("Alice", 30)

# defaultdict
counter = defaultdict(int)

# deque
queue = deque([1, 2, 3])

# ===== 3. STRINGS & FORMATTING =====
SIMPLE_STR = "hello"
FSTRING = f"Value: {PRIMITIVE_INT}"
RAW_STR = r"C:\path\to\file"
BYTES_STR = b"bytes"
TRIPLE_QUOTE = """
Multi-line
string
"""

# ===== 4. CLASSES & OBJECTS =====
class BaseClass:
    def __init__(self, value: int):
        self._value = value
    
    @property
    def value(self) -> int:
        return self._value
    
    @classmethod
    def create(cls) -> 'BaseClass':
        return cls(42)

class DerivedClass(BaseClass):
    def method(self) -> str:
        return f"Derived: {self.value}"

# Dataclasses (Python 3.7+)
@dataclasses.dataclass(frozen=True, order=True)
class Person:
    name: str
    age: int
    email: str = dataclasses.field(default="no-email@example.com")

# Protocol (structural typing)
class Drawable(Protocol):
    def draw(self) -> None: ...

class Circle:
    def draw(self) -> None:
        print("Drawing circle")

# Generic classes
T = TypeVar('T')
class Stack(Generic[T]):
    def __init__(self):
        self._items: List[T] = []
    
    def push(self, item: T) -> None:
        self._items.append(item)
    
    def pop(self) -> T:
        return self._items.pop()

# ===== 5. ENUMS =====
class Color(enum.Enum):
    RED = "red"
    GREEN = "green"
    BLUE = "blue"

class Status(enum.Flag):
    NONE = 0
    ACTIVE = 1
    DELETED = 2

# ===== 6. FUNCTIONS & DECORATORS =====
def simple_func(param1: int, param2: str = "default") -> tuple[int, str]:
    return (param1 * 2, param2)

@functools.lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

def generator_func():
    yield 1
    yield 2
    yield 3

async def async_func() -> str:
    await asyncio.sleep(0.1)
    return "async complete"

# Lambda
square = lambda x: x * x

# Higher-order function
def apply_twice(func: Callable[[int], int], x: int) -> int:
    return func(func(x))

# ===== 7. EXCEPTIONS =====
class CustomError(Exception):
    """Custom exception class"""

# ===== 8. CONTEXT MANAGERS =====
class FileManager:
    def __enter__(self):
        self.file = open("temp.txt", "w")
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.file.close()

# ===== 9. MAIN EXECUTION =====
def main():
    print("=== PYTHON COMPLETE FEATURES DEMO ===\n")
    
    # 1. Basic types
    print(f"Primitives: {PRIMITIVE_INT}, {PRIMITIVE_FLOAT}, {BOOL_TRUE}, {NONE_VAL}")
    print(f"Imaginary: {IMAGINARY}")
    
    # 2. Collections
    print(f"List: {LIST_VAL}, Tuple: {TUPLE_VAL}")
    print(f"Dict: {DICT_VAL}, Set: {SET_VAL}")
    print(f"NamedTuple: {person_nt}")
    
    # 3. Strings
    print(f"F-string: {FSTRING}")
    print(f"Textwrap: {TRIPLE_QUOTE}")
    
    # 4. Classes & dataclasses
    person = Person("Bob", 25)
    print(f"Dataclass: {person}, Age: {person.age}")
    
    base = BaseClass(100)
    derived = DerivedClass(200)
    print(f"Class inheritance: {derived.method()}")
    
    # 5. Enums
    print(f"Enum: {Color.RED.value}")
    
    # 6. Functions
    print(f"Simple func: {simple_func(5)}")
    print(f"Fibonacci(10): {fibonacci(10)}")
    
    gen = generator_func()
    print(f"Generator: {list(gen)}")
    
    # 7. Type hints & generics
    int_stack = Stack[int]()
    int_stack.push(42)
    print(f"Generic stack: {int_stack.pop()}")
    
    # 8. List comprehensions & generators
    squares = [x**2 for x in range(5)]
    gen_expr = sum(x**2 for x in range(5))
    print(f"List comp: {squares}, Gen expr: {gen_expr}")
    
    # 9. Pattern matching (Python 3.10+)
    def match_value(value):
        match value:
            case int(x) if x > 0:
                return "positive int"
            case str() as s if len(s) > 3:
                return "long string"
            case _:
                return "other"
    
    print(f"Pattern match 42: {match_value(42)}")
    print(f"Pattern match 'hello': {match_value('hello')}")
    
    # 10. Decorators
    @functools.singledispatch
    def process(value):
        return f"Unknown: {value}"
    
    @process.register
    def _(value: int):
        return f"Int: {value}"
    
    print(f"Single dispatch: {process(123)}")
    
    # 11. Concurrency
    print("Threading:")
    def thread_worker(n):
        time.sleep(0.1)
        return n * 2
    
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = [executor.submit(thread_worker, i) for i in range(3)]
        results = [f.result() for f in futures]
    print(f"Thread results: {results}")
    
    # 12. Multiprocessing
    print("Multiprocessing:")
    def mp_worker(x):
        return x * x
    
    with mp.Pool(2) as pool:
        mp_results = pool.map(mp_worker, [1, 2, 3])
    print(f"MP results: {mp_results}")
    
    # 13. Async/Await
    print("Async (non-blocking):")
    async def fetch_data():
        await asyncio.sleep(0.1)
        return "data"
    
    async def main_async():
        tasks = [fetch_data() for _ in range(3)]
        results = await asyncio.gather(*tasks)
        print(f"Async results: {results[:1]}...")
    
    asyncio.run(main_async())
    
    # 14. pathlib & modern file handling
    path = Path("example.txt")
    path.write_text("Hello, Python!")
    content = path.read_text()
    print(f"Pathlib: {content[:10]}...")
    
    # 15. Walrus operator (Python 3.8+)
    data = [1, 2, 3, 4, 5]
    if (n := len(data)) > 3:
        print(f"Walrus: list has {n} items")
    
    # 16. Union types & Literal (Python 3.10+)
    def greet(mode: Literal["formal", "casual"]) -> str:
        return {"formal": "Good day", "casual": "Hey"}[mode]
    
    print(f"Literal type: {greet('formal')}")
    
    print("\n=== All Python features demo complete! ===")

if __name__ == "__main__":
    # Global setup
    counter["demo"] += 1
    main()