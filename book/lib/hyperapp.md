# Usage with [Hyperapp](https://github.com/jorgebucaran/hyperapp)
We delete the `view` property because `tint` will automatically generate it
based on the `node` that is passed to the `app`.

We've also introduced an `actions` object for your static methods and an
optional `template` property when the node is rendered from a template.

Everything else is exactly equals on hyperapp.

[Here](https://github.com/jorgebucaran/hyperapp/issues/1098) is the thread
that gave rise to this wrapper.

## TODO app sample
 - [Example in action](../samples/hyperapp.html)

```html
<html>
  <head>
    <script type="module">
      import app from "https://cdn.jsdelivr.net/gh/marcodpt/tint/hyperapp.js"

      app({
        actions: {
          AddTodo: state => ({
            ...state,
            value: "",
            todos: state.todos.concat(state.value),
          }),
          NewValue: (state, event) => ({
            ...state,
            value: event.target.value,
          })
        },
        init: {
          todos: [],
          value: ""
        },
        node: document.getElementById("app")
      })
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
