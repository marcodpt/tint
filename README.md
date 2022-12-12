# ![Tint](assets/favicon.ico) Tint
A natural template engine for the HTML DOM. 

 - takes valid `HTML` as input.
 - converts the result to any 
[hyperscript](https://github.com/hyperhype/hyperscript)
function you want to use.
 - layouts completely separate from javascript logic.
 - works with all javascript frameworks that support
[hyperscript](https://github.com/hyperhype/hyperscript).
 - you can use the template as a server-side rendered version of your app.
 - you can use a regular HTML file as a single file component without ANY javascript build tools.
 - [hyperscript](https://github.com/hyperhype/hyperscript) frameworks can be
used by any team of designers or people with no javascript knowledge.
 - the template syntax allow very simple and elegant templates without
repeat yourself.

## Showcase
The classic TODO app, with an initial server-rendered state.

```html
<html>
  <head>
    <script type="module">
      import compile from "https://cdn.jsdelivr.net/gh/marcodpt/tint/template.js"
      const render = compile(document.getElementById("app"))

      const state = {
        todos: [
          "read a book",
          "plant a tree"
        ],
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

Result: 
```html
<main id="app">
  <h1>To do list</h1>
  <input type="text" value="">
  <ul>
    <li>read a book</li>
    <li>plant a tree</li>
  </ul>
  <button>New!</button>
</main>
```

It looks like a normal template engine, but internally compiles the template to:
```js
({ todos, value, NewValue, AddTodo }) =>
  h("main", {}, [
    h("h1", {}, text("To do list")),
    h("input", { type: "text", oninput: NewValue, value }),
    h("ul", {},
      todos.map((todo) => h("li", {}, text(todo)))
    ),
    h("button", { onclick: AddTodo }, text("New!")),
  ])
```
where `h` and `text` can be any hyperscript function you want to use.

You can use it with these frameworks:

- [Hyperapp](https://marcodpt.github.io/tint/lib/hyperapp.html)
- [Superfine](https://marcodpt.github.io/tint/lib/superfine.md)
- [Mithril](https://marcodpt.github.io/tint/lib/mithril.md)
- [Preact](https://marcodpt.github.io/tint/lib/preact.md)

With your help, we can grow this list and improve the work done on already
supported frameworks.

With a little trick, you can even render your application on the server side,
without the complications of the build steps.

```html
<html>
  <head>
    <script type="module">
      import compile from "https://cdn.jsdelivr.net/gh/marcodpt/tint/template.js"
      const app = document.getElementById("app")
      const render = compile(app)

      const state = {
        todos: Array.from(app.querySelectorAll('li')).map(e => e.textContent),
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
        <li :each="todos" :text>read a book</li>
        <li :not>plant a tree</li>
      </ul>
      <button :onclick="AddTodo">New!</button>
    </main>
  </body>
</html>
```

- [Example in action](samples/ssr_dynamic.html)
- [Static HTML rendered by server](samples/ssr_static.html)

What have you achieved:
 - The happiness of designers who can write in plain html.
 - The happiness of customers, which has a very fast and interactive
application, rendered on the server side, search engine friendly and at the
same time as dynamic as necessary.
 - The happiness of developers, who don't need complicated settings for the
 build steps, they can use normal html files to create single file components
and they can use any hyperscript framework they want.

To celebrate the widespread happiness, how about taking a look at the
[documentation](https://marcodpt.github.io/tint/).

## Philosophy
 - Separation: Functions and data transformations belong in javascript, design
and visual presentation to the html and css, and the data belongs to the database.
 - Designers and people with no javascript knowledge should understand it
and quickly become productive.
 - Templates must be valid `XML`/`HTML` that can be inserted into a
`template` tag or anywhere in the DOM.
 - It must not conflict with other template engines and frameworks.
 - Each layout should be written only once, without repetition.
 - Simplicity matters.
 - Elegant syntax is important.

## Contributing
Everything within this documentation is tested 
[here](tests/).
And it will always like this. Any changes to the documentation,
any contributions MUST be present in the tests.

If the tests do not pass in your browser, if you find any bugs, please raise
an issue.

Any changes must be within the philosophy of this project.

It's a very simple project. Any contribution is greatly appreciated.

## [Docs](https://marcodpt.github.io/tint/)
To generate the docs and create a server for tests.

```
mdbook serve
```

## Influences and thanks
This work is hugely influenced by these amazing template engines and frameworks:
 - [mustache](https://mustache.github.io/mustache.5.html)
 - [transparency](https://github.com/leonidas/transparency)
 - [thymeleaf](https://www.thymeleaf.org/)
 - [handlebars](https://handlebarsjs.com/)
 - [jinja](https://jinja.palletsprojects.com/en/3.1.x/)
 - [tera](https://tera.netlify.app/docs)
 - [vue](https://vuejs.org/)
 - [superfine](https://github.com/jorgebucaran/superfine)
 - [hyperapp](https://github.com/jorgebucaran/hyperapp)
 - [rivets](http://rivetsjs.com/docs/reference/)
 - [knockout](https://knockoutjs.com/documentation/introduction.html)

A huge thank you to all the people who contributed to these projects.
