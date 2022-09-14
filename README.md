# ![Cannabis](favicon.ico) Cannabis
#### The natural view engine for the browser

A logicless xml template engine that takes valid `HTML` as input.

Compile all HTML5 `template` tags from the current page to any
[hyperscript](https://github.com/hyperhype/hyperscript) function you want to
use.

Completely separate layouts from javascript logic.

It works with all javascript frameworks that support
[hyperscript](https://github.com/hyperhype/hyperscript).

## Usage
### cannabis(h, text) -> render

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

## Samples

### Hello World!
```html
<html>
  <head>
    <meta charset="utf-8">
    <title>Hello Cannabis</title>
    <script type="module">
      import cannabis from 'https://cdn.jsdelivr.net/gh/marcodpt/cannabis/index.js'
      const render = cannabis()

      const root = document.getElementById("app")
      root.replaceWith(render('my-view', {
        message: "Hello World!"
      }))
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
 - [live](https://marcodpt.github.io/cannabis/hello.html)
 - [source](https://raw.githubusercontent.com/marcodpt/cannabis/main/hello.html)

### Examples
 - Todo without virtual DOM:
   - [live](https://marcodpt.github.io/cannabis/todo.html)
   - [source](https://raw.githubusercontent.com/marcodpt/cannabis/main/todo.html)
 - [Superfine](https://github.com/jorgebucaran/superfine):
   - [live](https://marcodpt.github.io/cannabis/superfine.html)
   - [source](https://raw.githubusercontent.com/marcodpt/cannabis/main/superfine.html)
 - [Hyperapp](https://github.com/jorgebucaran/hyperapp): 
   - [live](https://marcodpt.github.io/cannabis/hyperapp.html)
   - [source](https://raw.githubusercontent.com/marcodpt/cannabis/main/hyperapp.html)
 - [Mithril.js](https://github.com/MithrilJS/mithril.js): 
   - [live](https://marcodpt.github.io/cannabis/mithril.html)
   - [source](https://raw.githubusercontent.com/marcodpt/cannabis/main/mithril.html)
 - [preact](https://github.com/preactjs/preact): 
   - [live](https://marcodpt.github.io/cannabis/preact.html)
   - [source](https://raw.githubusercontent.com/marcodpt/cannabis/main/preact.html)

## Docs
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
[here](https://marcodpt.github.io/cannabis/).
And it will always be so. Any changes to the documentation, any contributions
MUST be present in the tests.

If the tests do not pass in your browser, if you find any bugs, please raise
an issue.

Any syntax changes must be within the philosophy of this project.

It's a very simple project. Any contribution is highly appreciated.
