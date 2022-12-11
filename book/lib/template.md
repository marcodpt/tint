# Usage as a template engine

### compile(element, template?) -> render(scope)
Returns the view associated with `element`.

Optionally, you can use a `template` element to replace the `element`'s inner
HTML with your own contents.

 - element: The `element` that will be the root of the result. If you don't
pass a `template`, it will be treated as a complete template. In case you
provide a `template` it will only be used as the root of the result,
ignoring its content.
 - template: The optional `template` element you want to render inside .
 - scope: The data passed to interpolate the `element`,
any JSON object even with javascript functions is valid!

## Hello world example!
 - [Example in action](../samples/hello.html)
```html
<html>
  <head>
    <script type="module">
      import compile from "https://cdn.jsdelivr.net/gh/marcodpt/tint/template.js"
      const render = compile(document.getElementById("app"))
      render({
        message: "Hello World!"
      })
    </script>
  </head>
  <body>
    <div id="app">
      <h1 :text="message">Loading...</h1>
    </div>
  </body>
</html>
```
Result:
```html
<div id="app">
  <h1>Hello world!</h1>
</div>
```

## Hello world with external template example!
 - [Example in action](../samples/hello2.html)
```html
<html>
  <head>
    <script type="module">
      import compile from "../template.js"
      const render = compile(
        document.getElementById("app"),
        document.getElementById("view")
      )
      render({
        message: "Hello World!"
      })
    </script>
  </head>
  <body>
    <div id="app">
      <p>Loading...</p>
    </div>
    <template id="view">
      <h1 :text="message"></h1>
    </template>
  </body>
</html>
```
Result:
```html
<div id="app">
  <h1>Hello world!</h1>
</div>
```

## TODO app without any framework or virtual DOM
This is not the recommended way to do this.
You'll update the DOM more than necessary, lose focus, and maybe other things.
But here's a demo anyway.

 - [Example in action](../samples/template.html)

```html
<html>
  <head>
    <script type="module">
      import compile from "https://cdn.jsdelivr.net/gh/marcodpt/tint/template.js"
      const render = compile(document.getElementById("app"))

      const state = {
        todos: [],
        value: "",
        AddTodo: () => {
          state.todos.push(state.value)
          state.value = ""
          render(state)
        },
        NewValue: ev => {
          state.value = ev.target.value
        }
      }

      render(state)
    </script>
  </head>
  <body>
    <main id="app">
      <h1>To do list</h1>
      <input type="text" :value="value" :oninput="NewValue">
      <ul>
        <li :each="todos" :text></li>
      </ul>
      <button :onclick="AddTodo">New!</button>
    </main>
  </body>
</html>
```
