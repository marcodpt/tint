# Usage with [Superfine](https://github.com/jorgebucaran/superfine)

## TODO app sample
 - [Example in action](../samples/superfine.html)

```html
<html>
  <head>
    <script type="module">
      import superfine from "https://cdn.jsdelivr.net/gh/marcodpt/tint/superfine.js"

      const state = {
        todos: [],
        value: "",
        AddTodo: () => {
          state.todos.push(state.value)
          state.value = ""
          setState(state)
        },
        NewValue: ev => {
          state.value = ev.target.value
        }
      }

      const setState = superfine(document.getElementById('app'))
      setState(state)
    </script>
  </head>
  <body>
    <main id="app">
      <h1>To do list</h1>
      <input type="text" value:="value" oninput:="NewValue">
      <ul>
        <li each:="todos" text:></li>
      </ul>
      <button onclick:="AddTodo">New!</button>
    </main>
  </body>
</html>
```
