const searchInput = document.getElementById('topic-search');
const categoryFilter = document.getElementById('category-filter');
const posts = Array.from(document.querySelectorAll('.post'));
const resultCount = document.getElementById('result-count');
const emptyState = document.getElementById('empty-state');
const readerView = document.getElementById('reader-view');
const readerArticle = document.getElementById('reader-article');
const postsSection = document.getElementById('posts');
const intro = document.querySelector('.intro');
const footer = document.querySelector('footer');
const originalTitle = document.title;

// Extra notes sit inside the full reading view, so the feed stays quick to scan.
const lessonExpansions = [
  [
    'It helps to picture a name as a label rather than a little box that permanently contains one thing. When Python runs `score = 10`, the name score refers to the integer 10. If you later write `score = score + 1`, Python calculates 11 and binds the name to that new value. This is why the equals sign is assignment, not a claim that both sides will always match.',
    'Assignment can also make two names refer to the same object. That matters most with changeable values such as lists: if `first` and `second` both refer to one list, changing it through either name is visible through both. Integers and strings do not behave that way when you appear to change them; a new value is created and the name is rebound.',
    'A practical habit is to choose names for meaning, not for brevity. `number_of_visitors` is easier to understand later than `n`, especially when a program grows beyond a few lines. Avoid names that hide what they represent, and avoid Python’s reserved words such as `class`, `for`, or `if`. They already have jobs in the language.',
    'You can check a value while learning with `type(value)`, and you can convert between compatible types with constructors such as `int()` or `str()`. Conversion is not magic: `int("12")` works, while `int("twelve")` raises a `ValueError`. Treat a conversion as a real operation that can fail, not just a cosmetic change.'
  ],
  [
    'Strings are sequences of characters, so many useful operations feel familiar: you can ask for their length, take a slice, or check whether one piece of text appears inside another. Strings are immutable, though. A method like `replace()` returns a new string rather than editing the original one in place, which can be surprising the first time you inspect the old variable.',
    'Whitespace is still part of a string. A newline, a tab, or an extra space can affect comparisons and printed output, so methods such as `strip()` are useful when cleaning text. Use them deliberately: stripping can remove meaningful spaces too. When combining many values, an f-string is usually easier to read than joining lots of separate pieces with plus signs.',
    'Python integers can grow beyond the fixed size you may have seen in some other languages, while floats represent many decimal values approximately. That is why a calculation like 0.1 + 0.2 may not display as exactly 0.3. For ordinary measurements this is usually fine; for exact money calculations, use the `decimal` module or store an amount in whole cents.',
    'The remainder operator is useful beyond school arithmetic. For example, `number % 2 == 0` checks whether an integer is even, and `minutes % 60` can help split a total into hours and leftover minutes. When a result looks unexpected, print the intermediate values or inspect them in a tiny example. Small experiments are often faster than guessing.'
  ],
  [
    'Lists are ordered and mutable, which makes them a comfortable default for a collection you expect to update. You can add an item with `append()`, add several with `extend()`, or remove one with `pop()`. These methods change the existing list. In particular, `append()` returns `None`; write `items.append(value)` on its own line rather than assigning its result back to `items`.',
    'Indexing is strict: asking for an item past the end of a list raises `IndexError`. Slices are more forgiving and make a new list, which is handy for taking a section without changing the original. The end index is excluded on purpose. That convention means the length of `items[start:stop]` is usually easy to work out by subtracting start from stop.',
    'A tuple is a useful choice when the positions have a stable meaning, such as an (x, y) coordinate or a pair of minimum and maximum values. The tuple itself cannot have its slots reassigned, although it can contain a mutable object that changes. Parentheses are often optional, but the comma is what makes a one-item tuple: `(value,)`.',
    'Unpacking works with any iterable that yields the expected number of values. It can make a loop clearer with `for name, score in results`, and a starred target can collect the remainder, as in `first, *middle, last = values`. If unpacking fails because the number of values is different than expected, that is a useful signal to check the shape of your data.'
  ],
  [
    'A dictionary is best thought of as a lookup table, not as two parallel lists. Each key maps to one value, and keys need to be hashable—strings, numbers, and tuples of immutable values are common choices. Dictionaries preserve insertion order in modern Python, but use a list when position itself is the main thing you care about.',
    'The `in` operator on a dictionary checks keys, not values. Use `"name" in user` to see whether the key exists, or `user.get("name")` to request a value safely. Be aware that `get()` returns `None` by default, which can be ambiguous if `None` is also a meaningful stored value; you can provide a distinct fallback when that matters.',
    'Sets are useful when uniqueness is the point. Adding a value that is already present changes nothing, and membership checks are generally a good fit for a set when you do them repeatedly. Sets do not promise a meaningful display order, so do not rely on whichever order happens to appear when printing one.',
    'A comprehension is just a compact loop that builds a collection. Read it from left to right: choose an output expression, name each input value, and optionally add a condition. If it needs several nested loops or a long conditional expression, a normal loop is easier to debug. Clear code is more valuable than fitting everything onto one line.',
    'When updating a dictionary from another mapping, `update()` can be convenient; when counting items, `collections.Counter` may save you from writing the same bookkeeping repeatedly. The standard library has focused tools for common data shapes. Start with the plain built-ins, then reach for a helper when it genuinely makes the intent clearer.'
  ],
  [
    'Conditions do not have to be written as comparisons to `True` or `False`. Python values have truthiness: empty strings, empty collections, zero, and `None` count as false, while most other values count as true. That lets you write `if names:` to check whether a list has any items. Use this only when the meaning is obvious to someone reading the code.',
    'Comparison operators include `==`, `!=`, `<`, `<=`, `>`, and `>=`. A common beginner mix-up is using `=` inside a condition; assignment gives a name a value, while `==` asks whether two values compare equal. For strings, equality checks the actual text, including capitalization and whitespace, so normalize carefully if your use case should ignore those details.',
    'The operators `and` and `or` short-circuit: Python may stop evaluating once the final answer is already known. This is useful for safe checks such as `items and items[0]`, because the index is only read when the list is non-empty. Avoid clever chains if a couple of named conditions would make the decision easier to explain.',
    'A good branch order makes the code tell a story. Handle unusual or narrow cases first, then broader cases, and finish with a default only when there is a sensible default. If a decision grows into many branches, consider whether a dictionary lookup or a small helper function would make the different outcomes easier to maintain.'
  ],
  [
    'A `for` loop asks an iterable for one value at a time. That is why the same pattern works on a list of names, the characters in a string, or the keys in a dictionary. If you need both a dictionary key and its value, use `.items()`. This keeps the loop focused on the data instead of on manual index tracking.',
    '`range(start, stop, step)` creates a sequence of integers on demand; it does not build a list of every number first. The stop remains excluded, and the step can be negative when counting backwards. If you find yourself writing `range(len(items))` just to get each item, loop over `items` directly. Use `enumerate()` when the position is also useful.',
    'A `while` loop fits situations where you do not know in advance how many repetitions you need, such as retrying until a condition changes. Make the progress easy to spot: update the counter, consume an item, or otherwise move toward stopping. If that update is accidentally omitted, the loop can run forever, so test loops with small inputs first.',
    '`break` and `continue` can make a loop direct, but too many exits can make its path hard to follow. A `for` loop can also have an `else` block, which runs when the loop finishes normally and is skipped if `break` was used. That less familiar feature is handy for searches where you want to report that no match was found.'
  ],
  [
    'A function is a small boundary around a task. Good functions tend to have one clear purpose, a useful name, and inputs that describe what they need. You do not have to turn every two-line operation into a function, but repeating the same meaningful logic in several places is a sign that a shared function may help.',
    'Parameters are the names in the definition; arguments are the actual values supplied at a call. Python evaluates a `return` expression and immediately leaves the function. If you need to return several related results, you can return a tuple and unpack it at the call site. Printing inside a helper is less flexible because the caller cannot easily use that printed text as a value.',
    'Default values are worked out when the function is defined, not fresh each time it is called. That is why a default such as `items=[]` can accidentally carry changes from one call into the next. Use `None` as the default and create a new list inside the function when you need a fresh collection for each call.',
    'Names inside a function are local unless you deliberately use another scope. Returning a result is usually easier to reason about than changing a global variable behind the caller’s back. Type hints such as `def double(number: int) -> int:` can document intent and help editors, but Python does not automatically reject a value that does not match the hint.',
    'Try calling a new function with a normal case, an edge case, and an awkward input. For a function that divides, that might mean a positive denominator, a negative value, and zero. Thinking about those cases while writing the function helps you decide what its contract should be, rather than leaving callers to discover its assumptions by surprise.'
  ],
  [
    'Creating an instance calls `__init__`, but `__init__` is not the operation that creates the object itself; it initializes an instance that Python has already made. The `self` parameter is supplied automatically when you call a method through an instance, which is why you write `pet.speak()` rather than `Dog.speak(pet)` in everyday code.',
    'Each instance normally gets its own attributes, while class attributes are shared through the class. A list stored as a class attribute can therefore surprise you if you meant every object to have an independent list. Put per-instance data on `self` during initialization. Use shared class attributes for values that genuinely belong to the class as a whole.',
    'A leading underscore in a name, like `_internal_value`, is a convention that tells other programmers the detail is for internal use. Python does not enforce private access in the same way some languages do. Properties can provide a simple interface when you need to validate or calculate a value, but plain attributes are perfectly fine until that extra behavior is useful.',
    'Inheritance lets a specialized class reuse and override behavior from a parent, but a deep family tree can make it difficult to see where a method came from. Composition offers another route: one object holds another object and delegates part of the work to it. Prefer the smallest design that makes the relationship clear; classes should help organize a problem, not add ceremony.'
  ],
  [
    'An exception is not always a disaster. It is a structured way for an operation to say it could not complete as expected. The traceback includes the chain of calls that led to the problem, and the final line names the exception. Read that message first, then inspect the closest line in your own code before changing anything.',
    'Catch the narrowest exception you know how to handle. If converting a value to an integer can fail, catch `ValueError` around that conversion rather than surrounding an entire program with `except Exception`. A broad handler can make an application appear to keep working while silently skipping a real programming mistake.',
    'You can use `raise` to signal that a function received a value it cannot sensibly process. Add context to the error where it helps the caller understand what was wrong, and avoid catching an error only to raise the exact same error without adding useful information. Clear failures are easier to fix than a quiet wrong answer.',
    'The `finally` block is for work that must happen regardless of success or failure. In ordinary file handling, `with open(...)` is usually the simpler option because it closes the file automatically. As you learn to debug, try to reproduce an error with the smallest possible input; that tiny example often reveals the mistaken assumption.'
  ],
  [
    'A module is a Python file that can be imported, and a package groups modules together. Imports make it possible to keep a program in readable pieces instead of one enormous file. Put imports near the top, use clear module names, and avoid naming your own file after a standard-library module such as `json` or `pathlib`, since that can confuse Python’s import lookup.',
    '`pathlib.Path` represents a filesystem path and lets you join folders with `/` in a way that works across operating systems. Reading and writing text with an explicit encoding such as UTF-8 avoids relying on a machine-specific default. For larger files, iterate over lines rather than loading the whole contents into memory at once.',
    'JSON supports a small set of data shapes: objects, arrays, strings, numbers, booleans, and null. These map naturally to Python dictionaries, lists, strings, numbers, booleans, and `None`. JSON does not preserve every Python type, so a date or custom class needs a deliberate conversion before it can be serialized.',
    '`json.loads()` parses a string, while `json.load()` reads JSON from an open file. Likewise, `dumps()` returns JSON text and `dump()` writes it to a file. Be thoughtful when opening files in write mode: it replaces existing contents. When a file contains invalid JSON, catch `json.JSONDecodeError` only if your program has a useful recovery plan.'
  ],
  [
    'An assertion is a compact way to state an assumption during development: if it is false, Python stops at that point and tells you. Assertions are excellent for checking your own logic and documenting invariants, but they are not a substitute for validating information that comes from a user, a file, or an external service.',
    'A focused test makes one behavior easy to recognize. Give it an input, call the code, and compare the result to an expected value. When a test fails, do not immediately rewrite the test to make it pass; first decide whether the expectation or the implementation is wrong. A small, specific test often pinpoints the cause better than a long scenario.',
    'The built-in `unittest` framework is enough to organize a suite without installing anything. Tests can cover ordinary values, boundaries, and failure cases. Keep test data understandable and avoid tests that depend on the current time, network, or machine-specific files unless you have made those dependencies controllable.',
    'A virtual environment gives a project its own place for third-party packages, so one project’s dependencies do not have to dictate another’s. The standard library is already available, so do not add a dependency for a job Python can handle cleanly on its own. For a real project, record the dependencies and keep secrets out of the repository.'
  ],
  [
    'A generator function looks like an ordinary function but uses `yield` to hand a value back while keeping its place. The function continues from that point the next time a value is requested. This lets you process a stream item by item, which can save memory when the full collection would be large or is not available all at once.',
    'Generators are lazy: calling the function returns a generator object, and its body starts running when you iterate over that object. Once it is exhausted, it does not start over automatically. If you need to repeat the values, call the generator function again or store the results in a list when the data is small enough to keep in memory.',
    'A decorator receives a function and returns something that can stand in its place. The `@decorator` form is convenient syntax for applying that transformation. In real decorators, `functools.wraps` helps the wrapped function keep its original name and documentation, which makes debugging and introspection less confusing.',
    'A context manager sets up a temporary situation and guarantees cleanup when the block ends. Files are the familiar case, but the same pattern can manage a lock or temporarily change a setting. Type hints add another kind of help: they explain expected shapes to people and tools, but they are not runtime checks unless you add a separate validation step.'
  ],
  [
    'Built-ins are worth learning because they express common work directly. `sorted()` creates a new list, while a list’s `.sort()` method rearranges that list in place. `zip()` pairs values until the shortest input ends; if mismatched lengths should be treated as a bug, modern Python also provides a strict option. `any()` and `all()` can make simple checks read almost like plain English.',
    'Async code is designed for concurrency around waiting, not as a shortcut for making every program faster. A coroutine pauses at `await` so the event loop can let other tasks make progress. If a task spends its time doing heavy calculations, async syntax alone does not split that work across processors.',
    'Use asynchronous tools when the libraries involved support them and there is useful waiting to overlap. Mixing blocking work into an event loop can stall every other task, so it may need to be moved elsewhere. Start with ordinary synchronous Python until you have a real waiting problem; async adds a model of execution that is worth understanding rather than copying by habit.',
    'Python is broad enough that nobody keeps every corner of it in their head. A practical path is to build a small project, read the documentation for the next tool you need, and write tests for the parts that matter. Keep notes about the problems you solved. Coming back to code after a week and still understanding it is a better measure than memorizing syntax.'
  ]
];

function addLessonParagraph(parent, text) {
  const parts = text.split(/`([^`]+)`/g);
  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      const code = document.createElement('code');
      code.textContent = part;
      parent.appendChild(code);
    } else {
      parent.appendChild(document.createTextNode(part));
    }
  });
}

function filterPosts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  let visibleCount = 0;

  posts.forEach((post) => {
    const matchesQuery = post.textContent.toLowerCase().includes(query);
    const matchesCategory = category === 'all' || post.dataset.category === category;
    const isVisible = matchesQuery && matchesCategory;
    post.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  resultCount.textContent = query || category !== 'all'
    ? `${visibleCount} ${visibleCount === 1 ? 'post' : 'posts'}`
    : `${visibleCount} posts`;
  emptyState.hidden = visibleCount !== 0;
}

function showPost(post, index) {
  const summary = post.querySelector('summary');
  const title = summary.querySelector('strong').textContent;
  const category = summary.querySelector('.post-meta').textContent;
  const body = post.querySelector('.post-body').cloneNode(true);
  const table = body.querySelector('table');
  const additions = lessonExpansions[index] || [];

  additions.forEach((text) => {
    const paragraph = document.createElement('p');
    addLessonParagraph(paragraph, text);
    if (table) body.insertBefore(paragraph, table);
    else body.appendChild(paragraph);
  });

  readerArticle.innerHTML = '';
  const heading = document.createElement('header');
  heading.className = 'reader-heading';
  heading.innerHTML = `<p class="eyebrow">${category}</p><h1></h1><p class="reader-byline">A Python note by <strong>fomo</strong></p>`;
  heading.querySelector('h1').textContent = title;
  readerArticle.append(heading, body);
  readerView.hidden = false;
  postsSection.hidden = true;
  intro.hidden = true;
  footer.hidden = true;
  document.body.classList.add('reading-post');
  document.title = `${title} — fomo`;
  window.scrollTo(0, 0);
}

function showFeed() {
  readerView.hidden = true;
  postsSection.hidden = false;
  intro.hidden = false;
  footer.hidden = false;
  document.body.classList.remove('reading-post');
  document.title = originalTitle;
}

function syncViewFromHash() {
  const match = window.location.hash.match(/^#post-(\d{2})$/);
  if (!match) {
    showFeed();
    if (window.location.hash === '#posts') {
      postsSection.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  const index = Number(match[1]) - 1;
  if (posts[index]) showPost(posts[index], index);
  else showFeed();
}

posts.forEach((post, index) => {
  post.querySelector('summary').addEventListener('click', (event) => {
    event.preventDefault();
    const slug = `#post-${String(index + 1).padStart(2, '0')}`;
    if (window.location.hash === slug) showPost(post, index);
    else window.location.hash = slug;
  });
});

searchInput.addEventListener('input', filterPosts);
categoryFilter.addEventListener('change', filterPosts);
window.addEventListener('hashchange', syncViewFromHash);
filterPosts();
syncViewFromHash();
