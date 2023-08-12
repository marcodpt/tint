# Usage with [preact](https://github.com/preactjs/preact)
Our `preact` wrapper is not the best. But it serves to show an example
with a global state and no components. If you think you can improve this
wrapper, please submit a pull request.

## TODO app sample
- [Example in action](../samples/preact.html)

```html
<html>
  <head>
    <script type="module">
      import preact from "https://cdn.jsdelivr.net/gh/marcodpt/tint/preact.js"

      const state = {
        todos: [],
        value: "",
        AddTodo: () => {
          state.todos.push(state.value)
          state.value = ""
          render()
        },
        NewValue: ev => {
          state.value = ev.target.value
        }
      }

      const render = preact(state, document.getElementById("app"))
    </script>
  </head>
  <body>
    <main id="app">
      <div>
        <h1>To do list</h1>
        <input type="text" value:="value" oninput:="NewValue">
        <ul>
          <li each:="todos" text:></li>
        </ul>
        <button onclick:="AddTodo">New!</button>
      </div>
    </main>
  </body>
</html>
```
