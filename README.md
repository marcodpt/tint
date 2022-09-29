# ![Tint](favicon.ico) Tint
#### The natural view engine for the browser

A logicless xml template engine that takes valid `HTML` as input.

Compile all HTML5 `template` tags from the current page to any
[hyperscript](https://github.com/hyperhype/hyperscript) function you want to
use.

Completely separate layouts from javascript logic.

It works with all javascript frameworks that support
[hyperscript](https://github.com/hyperhype/hyperscript).

## Usage as a template engine
### render(templateId, scope, target)
Renders the template using the scope. If a target node is passed, the result
will be inserted into the node, otherwise it will return the DOM element.

 - templateId: the id of the view template tag in the current page.
 - scope: template scope to be used.
 - target: optional DOM element where the result will be displayed. If none
target is passed it will return a DOM element with the result.

```html
<html>
  <head>
    <script type="module">
      import render from "https://cdn.jsdelivr.net/gh/marcodpt/tint/template.js"

      render('my-view', {
        message: "Hello World!"
      }, document.getElementById("app"))
    </script>
  </head>
  <body>
    <div id="app"></div>

    <template id="my-view">
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

You can check the result:
 - [live](https://marcodpt.github.io/tint/hello.html)
 - [source](https://raw.githubusercontent.com/marcodpt/tint/main/hello.html)

## Building a todo app
Now we gonna show examples wrappers you can use with some hyperscript
frameworks that you can use to construct real world applications.

In all examples we use the same `body`. This is a full demonstration of the
power of layout separation.

```html
<body>
  <main id="app"></main>
  <template id="todo">
    <h1>To do list</h1>
    <input type="text" :value="value" :oninput="NewValue">
    <ul>
      <li :each="todos" :text></li>
    </ul>
    <button :onclick="AddTodo">New!</button>
  </template>
</body>
```

### Todo without any framework or virtual DOM
This is not the recommended way to do it.
You will update the DOM more than necessary, you will lose focus and maybe
other things.
But here's a demo anyway.

```js
import render from "https://cdn.jsdelivr.net/gh/marcodpt/tint/template.js"

const state = {
  todos: [],
  value: "",
  AddTodo: () => {
    state.todos.push(state.value)
    state.value = ""
    rerender()
  },
  NewValue: ev => {
    state.value = ev.target.value
  }
}

const node = document.getElementById("app")
const rerender = () => render('todo', state, node)

rerender()
```

 - [live](https://marcodpt.github.io/tint/template.html)
 - [source](https://raw.githubusercontent.com/marcodpt/tint/main/template.html)

### Todo with [Superfine](https://github.com/jorgebucaran/superfine)
Here we changed a little bit the usage of superfine, you must pass an object as
state, and you need to add inside the object:
 - nodeId: The id of the DOM element where you will mount the app.
 - templateId: The id of the template tag with your view.

```js
import superfine from "https://cdn.jsdelivr.net/gh/marcodpt/tint/superfine.js"

const state = {
  nodeId: 'app',
  templateId: 'todo',
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

const setState = superfine(state)
```

 - [live](https://marcodpt.github.io/tint/superfine.html)
 - [source](https://raw.githubusercontent.com/marcodpt/tint/main/superfine.html)

### Todo with [Hyperapp](https://github.com/jorgebucaran/hyperapp)
We eliminated `view` property because `tint` will generate it automatically
based on `templateId` that you pass to `app`.

We've also introduced an `actions` object for your static methods, but you can
also enter any variable that is a constant here.

Everything else is exactly equals on hyperapp.

[Here](https://github.com/jorgebucaran/hyperapp/issues/1098) is a nice
discussion where this wrapper came to existence.

```js
import app from "https://cdn.jsdelivr.net/gh/marcodpt/tint/hyperapp.js"

app({
  templateId: 'todo',
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
```

 - [live](https://marcodpt.github.io/tint/hyperapp.html)
 - [source](https://raw.githubusercontent.com/marcodpt/tint/main/hyperapp.html)

### Todo with [Mithril.js](https://github.com/MithrilJS/mithril.js)
In this example you also must import mithril in the page by yourself before the
wrapper.

You can pass any of the components methods like: `oninit`, `oncreate`, etc.
And it will work fine.

```js
import component from 'https://cdn.jsdelivr.net/gh/marcodpt/tint/mithril.js'

const state = {
  templateId: 'todo',
  todos: [],
  value: "",
  AddTodo: () => {
    state.todos.push(state.value)
    state.value = ""
  },
  NewValue: ev => {
    state.value = ev.target.value
  }
}

m.mount(document.getElementById("app"), component(state))
```

 - [live](https://marcodpt.github.io/tint/mithril.html)
 - [source](https://raw.githubusercontent.com/marcodpt/tint/main/mithril.html)

### Todo with [preact](https://github.com/preactjs/preact)
Our preact wrapper is not the best. But it serves to show an example
with a global state and no components. If you think you can improve this
wrapper please send a pull request.

```js
import preact from "https://cdn.jsdelivr.net/gh/marcodpt/tint/preact.js"

const state = {
  templateId: 'todo',
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
```

 - [live](https://marcodpt.github.io/tint/preact.html)
 - [source](https://raw.githubusercontent.com/marcodpt/tint/main/preact.html)

## Usage as a low level library
To build all the wrappers for the TODO application, we use this package as a
low-level library.

```js
import tint from 'https://cdn.jsdelivr.net/gh/marcodpt/tint/index.js'
```

Here is the source code for each of the wrappers:

 - [template](https://raw.githubusercontent.com/marcodpt/tint/main/template.js)
 - [superfine](https://raw.githubusercontent.com/marcodpt/tint/main/superfine.js)
 - [hyperapp](https://raw.githubusercontent.com/marcodpt/tint/main/hyperapp.js)
 - [mithril](https://raw.githubusercontent.com/marcodpt/tint/main/mithril.js)
 - [preact](https://raw.githubusercontent.com/marcodpt/tint/main/preact.js)

If you want to create a wrapper for a framework that is not on this list or
if you want to improve any of the wrappers we've created here, you'll need
use `tint` as described in this section.

If you created something interesting, or a wrapper for another framework or
improved any example. Submit a pull request or open an issue with your
code.

### tint(h, text) -> render

Transforms all template tags (with id attribute) within the current page into a
[hyperscript](https://github.com/hyperhype/hyperscript) function.

 - h(tagName, attributes, children): a
[hyperscript](https://github.com/hyperhype/hyperscript) function that create a
DOM or virtual DOM element, if no function is passed, it will use
[document.createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement).
 - text(str): a 
[hyperscript](https://github.com/hyperhype/hyperscript) function that create
DOM or vDOM text nodes.

### render(templateId, scope, rootTag, rootAttributes) -> element

Return the DOM or vDOM element (based on the `h` function) that is generated
by renderering the `scope` with the template.

 - templateId: The name of the template. Observe that you can only use as
custom tags templates that id contains `-`. As described
[here](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).
 - scope: The data passed to interpolate the template, any JSON object even
with javascript functions is valid!
 - rootTag: The optional root where the resulted should be mounted. If no root
is passed it will be mounted inside a `div` tag.
 - rootAttributes: The optional attributes object (with the exactly hypescript
syntax of the `h` function). No attributes is the default.

## Docs for the template engine
### :attribute
#### Simple eval
```html
<template id="attributes-1">
  <a class="primary" :href="target">Go to page 1</a>
</template>
```
```js
render('attributes-1', {
  target: "#/page/1"
}).innerHTML
```
```html
<a class="primary" href="#/page/1">Go to page 1</a>
```

#### Boolean attributes
```html
<template id="attributes-2">
  <input type="checkbox" :checked="isChecked" :disabled="isDisabled">
</template>
```
```js
render('attributes-2', {
  isDisabled: true,
  isChecked: false
}).innerHTML
```
```html
<input type="checkbox" disabled="">
```

#### Extending attributes
```html
<template id="attributes-3">
  <button class="btn btn-" :class="btn" disabled :disabled="isDisabled">
    Submit
  </button>
</template>
```
```js
render('attributes-3', {
  isDisabled: false,
  btn: "primary"
}).innerHTML
```
```html
<button class="btn btn-primary">
  Submit
</button>
```

#### Function calls 
```html
<template id="attributes-4">
  <button class="btn btn-primary" :onclick="action">
    Submit
  </button>
</template>
```
```js
const el = render('attributes-4', {
  action: (ev) => {
    const btn = ev.target.closest('button')
    btn.disabled = true
    btn.textContent = 'Submited!'
  }
})
el.innerHTML
```
```html
<button class="btn btn-primary">
  Submit
</button>
```
```js
const btn = el.querySelector('button')
btn.click()
el.innerHTML
```
```html
<button class="btn btn-primary" disabled="">
  Submited!
</button>
```

### text
#### Append text to node
```html
<template id="text-1">
  <h1 :text="name">Hello </h1>
</template>
```
```js
render('text-1', {
  name: "John"
}).innerHTML
```
```html
<h1>Hello John</h1>
```

#### Use template to interpolate text
```html
<template id="text-2">
  <h1>
    Hello <template :text="name"></template>, how are you?
  </h1>
</template>
```
```js
render('text-2', {
  name: "John"
}).innerHTML
```
```html
<h1>
  Hello John, how are you?
</h1>
```

#### HTML strings will be escaped
```html
<template id="text-3">
  <code :text="raw"></code>
</template>
```
```js
render('text-3', {
  raw: "var x = y > 4 && z / 3 == 2 ? 1 : 2"
}).innerHTML
```
```html
<code>var x = y &gt; 4 &amp;&amp; z / 3 == 2 ? 1 : 2</code>
```

### if/not
#### Remove node with a conditional test
```html
<template id="if-not-1">
  <div>
    John:
    <i :if="john" class="fas fa-check"></i>
    <i :not="john" class="fas fa-times"></i>
  </div><div>
    Mary:
    <i :if="mary" class="fas fa-check"></i>
    <i :not="mary" class="fas fa-times"></i>
  </div>
</template>
```
```js
render('if-not-1', {
  john: false,
  mary: true
}).innerHTML
```
```html
<div>
  John: <i class="fas fa-times"></i>
</div><div>
  Mary: <i class="fas fa-check"></i>
</div>
```

#### Some critical js values
```html
<template id="if-not-2">
  <div>
    null: <template :if="0">true</template><template :not="0">false</template>
    0: <template :if="1">true</template><template :not="1">false</template>
    1: <template :if="2">true</template><template :not="2">false</template>
    -1: <template :if="3">true</template><template :not="3">false</template>
    "": <template :if="4">true</template><template :not="4">false</template>
    "0": <template :if="5">true</template><template :not="5">false</template>
    []: <template :if="6">true</template><template :not="6">false</template>
    {}: <template :if="7">true</template><template :not="7">false</template>
    undefined: <template :if="8">true</template><template :not="8">false</template>
  </div>
</template>
```
```js
render('if-not-2', [
  null,
  0,
  1,
  -1,
  "",
  "0",
  [],
  {},
  undefined
]).innerHTML
```
```html
<div>
  null: false
  0: false
  1: true
  -1: true
  "": false
  "0": true
  []: true
  {}: true
  undefined: false
</div>
```

### switch/case
#### Choose a imediate children tag based on a criteria.
```html
<template id="switch-case-1">
  <form :switch="input">
    <label :text="title"></label>
    <select
      case="boolean"
      :name="name"
    >
      <option value="0">No</option>
      <option value="1">Yes</option>
    </select><textarea
      case="text"
      :name="name"
      rows="6"
    ></textarea><input
      case="default"
      type="text"
      :name="name"
    >
    <button>Submit</button>
  </form>
</template>
```
```js
render('switch-case-1', {
  input: "text",
  name: "bio",
  title: "Bio"
}).innerHTML
```
```html
<form>
  <label>Bio</label>
  <textarea name="bio" rows="6"></textarea>
  <button>Submit</button>
</form>
```

#### You can use template for case
```html
<template id="switch-case-2">
  <div :switch="color">
    My favorite color is:
    <template case="red">Red</template>
    <template case="green">Green</template>
    <template case="blue">Blue</template>
  </div>
</template>
```
```js
render('switch-case-2', {
  color: "red"
}).innerHTML
```
```html
<div>
  My favorite color is:
  Red
</div>
```

#### You can use template for switch
```html
<template id="switch-case-3">
  <template :switch="color">
    My favorite color is:
    <b case="red">Red</b>
    <b case="green">Green</b>
    <b case="blue">Blue</b>
  </template>
</template>
```
```js
render('switch-case-3', {
  color: "green"
}).innerHTML
```
```html
My favorite color is: <b>Green</b>
```

#### You can use in both
```html
<template id="switch-case-4">
  <template :switch="color">
    My favorite color is:
    <template case="red">Red</template>
    <template case="green">Green</template>
    <template case="blue">Blue</template>
  </template>
</template>
```
```js
render('switch-case-4', {
  color: "blue"
}).innerHTML
```
```html
My favorite color is: Blue
```

### with
#### Change scope within tag.
```html
<template id="with-1">
  <div>
    <p>My name is: <template :text="name"></template></p>
    <p :with="friend">My name is: <template :text="name"></template></p>
    <p>My name is: <template :text="name"></template></p>
  </div>
</template>
```
```js
render('with-1', {
  name: "Mary",
  friend: {
    name: "John"
  }
}).innerHTML
```
```html
<div>
  <p>My name is: Mary</p>
  <p>My name is: John</p>
  <p>My name is: Mary</p>
</div>
```

#### Parent keys access.
```html
<template id="with-2">
  <div>
    <p><b :text="greeting"></b><span :text="name"></span></p>
    <p :with="friend"><b :text="greeting"></b><span :text="name"></span></p>
    <p><b :text="greeting"></b><span :text="name"></span></p>
  </div>
</template>
```
```js
render('with-2', {
  greeting: "Hello",
  name: "Mary",
  friend: {
    name: "John"
  }
}).innerHTML
```
```html
<div>
  <p><b>Hello</b><span>Mary</span></p>
  <p><b>Hello</b><span>John</span></p>
  <p><b>Hello</b><span>Mary</span></p>
</div>
```

#### Simple types access.
```html
<template id="with-3">
  <div :with="0">
    <p :text="0"></p>
    <p :text="1"></p>
  </div>
  <div :with="1">
    <p :text=""></p>
  </div>
  <div :with="2">
    <p :text=""></p>
  </div>
</template>
```
```js
render('with-3', [["Mary", "John"], "dog", 3.14]).innerHTML
```
```html
<div>
  <p>Mary</p>
  <p>John</p>
</div>
<div>
  <p>dog</p>
</div>
<div>
  <p>3.14</p>
</div>
```

### each
#### Simple array iteration.
```html
<template id="each-1">
  <template :each="">
    <template :text=""></template>
  </template>
</template>
```
```js
render('each-1', ["dog", "cat", "horse"]).innerHTML
```
```html
dog
cat
horse
```

#### Complex array iteration.

```html
<template id="each-2">
  <table>
    <thead>
      <tr>
        <th :each="links" :text=""></th>
        <th>Id</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      <tr :each="rows" :class="css">
        <td :each="links">
          <a :href="href" :href="id" :text="title"></a>
        </td>
        <td :text="id"></td>
        <td :text="name"></td>
      </tr>
    </tbody>
  </table>
</template>
```
```js
render('each-2', {
  links: ["Delete", "Edit"],
  rows: [
    {
      id: 1,
      name: "Mary",
      css: "dark",
      links: [
        {
          title: "Delete",
          href: "#/delete/1"
        }, {
          title: "Edit",
          href: "#/edit/1"
        }
      ]
    }, {
      id: 2,
      name: "John",
      css: "light",
      links: [
        {
          title: "Delete",
          href: "#/delete/2"
        }, {
          title: "Edit",
          href: "#/edit/2"
        }
      ]
    }
  ]
}).innerHTML
```
```html
<table>
  <thead>
    <tr>
      <th>Delete</th><th>Edit</th>
      <th>Id</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr class="dark">
      <td>
        <a href="#/delete/1">Delete</a>
      </td><td>
        <a href="#/edit/1">Edit</a>
      </td>
      <td>1</td>
      <td>Mary</td>
    </tr><tr class="light">
      <td>
        <a href="#/delete/2">Delete</a>
      </td><td>
        <a href="#/edit/2">Edit</a>
      </td>
      <td>2</td>
      <td>John</td>
    </tr>
  </tbody>
</table>
```

### Custom Tags
Observe that you can only use as custom tags templates that id contains `-`.
As described [here](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

With the following tag in your `HTML` `body` 
```html
<template id="my-button">
  <button class="btn btn-" :class="btn" :text="text"><slot></slot></button>
</template>
```
#### Reuse your templates inside another template.
```html
<template id="custom-1">
  <div>
    <my-button :btn="button" :text="title">Go </my-button>
  </div>
</template>
```
```js
render('custom-1', {
  button: "primary",
  title: "Submit"
}).innerHTML
```
```html
<div>
  <button class="btn btn-primary">Go Submit</button>
</div>
```

#### Iterate with custom tags.
```html
<template id="custom-2">
  <div>
    <my-button :each="" :btn="button" :text="title">Go </my-button>
  </div>
</template>
```
```js
render('custom2', [
  {button: "secondary", title: "Cancel"},
  {button: "primary", title: "Submit"}
]).innerHTML
```
```html
<div>
  <button class="btn btn-secondary">Go Cancel</button>
  <button class="btn btn-primary">Go Submit</button>
</div>
```

#### Recursive tags.

```html
<template id="my-list">
  <ul :if="items">
    <li :each="items">
      <span :text="title"></span>
      <my-list :items="children"></my-list>
    </li>
  </ul>
</template>
```
```js
render('my-list', [
  {
    title: "animals",
    children: [
      {
        title: "dog"
      }, {
        title: "cat"
      }
    ]
  }, {
    title: "countries",
    children: [
      {
        title: "US",
        children: [
          {
            title: "NY",
            children: [
              {title: "New York"}
            ]
          }, {
            title: "CA",
            children: [
              {title: "San Francisco"},
              {title: "Los Angeles"}
            ]
          }
        ]
      }
    ]
  }, {
    title: "home"
  }
]).innerHTML
```
```html
<ul>
  <li>
    <span>animals</span>
    <ul>
      <li>
        <span>dog</span>
      </li>
      <li>
        <span>cat</span>
      </li>
    </ul>
  </li>
  <li>
    <span>countries</span>
    <ul>
      <li>
        <span>US</span>
        <ul>
          <li>
            <span>NY</span>
            <ul>
              <li>
                <span>New York</span>
              </li>
            </ul>
          </li>
          <li>
            <span>CA</span>
            <ul>
              <li>
                <span>San Francisco</span>
              </li>
              <li>
                <span>Los Angeles</span>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    <span>home</span>
  </li>
</ul>
```

## Philosophy
 - Separation: Functions and data transformations belong to javascript, design
and visual presentation to html and css, and the data belongs to database.
 - Designers and people with no javascript knowledge should understand it
and quickly become productive.
 - Templates must be valid `XML`/`HTML` that can be inserted into a
`template` tag.
 - Should not conflict with other templates engines and frameworks.
 - Every layout should be written only once, without repetition.
 - Simplicity matters.
 - Beautiful syntax matters.

## Influences and thanks
This work is hugely influenced by this amazing template engines and frameworks:
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

## Contributing
First, thanks for reading this far.

Everything within this documentation is tested 
[here](https://marcodpt.github.io/tint/).
And it will always be so. Any changes to the documentation, any contributions
MUST be present in the tests.

If the tests do not pass in your browser, if you find any bugs, please raise
an issue.

Any syntax changes must be within the philosophy of this project.

It's a very simple project. Any contribution is highly appreciated.
