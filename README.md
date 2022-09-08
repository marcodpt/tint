# ![Cannabis](favicon.ico) Cannabis
> The natural template engine for the browser

A logicless xml template engine that uses valid `HTML` as input.

It is simple, intuitive, clean and beautiful. And always will be this way!

## Usage
> cannabis(target, template, scope)

 - target: `id` or `DOM element` that cannabis will `append` the result.
 - template: `id` or `DOM element` of the `template`.
 - scope: any valid json is a valid `scope` to be rendered.

```html
<html>
  <head>
    <meta charset="utf-8">
    <title>Sample cannabis</title>
    <script src="https://cdn.jsdelivr.net/gh/marcodpt/cannabis/index.js"></script>
  </head>
  <body>
    <div id="app"></div>

    <template id="my-header">
      <h1 :text="message"></h1>
    </template>

    <script>
      cannabis('app', 'my-header', {
        message: "Hello world!"
      })
    </script>
  </body>
</html>
```
Result:
```html
<div id="app">
  <h1>Hello world!</h1>
</div>
```

You can check the result [here](https://marcodpt.github.io/cannabis/sample.html).

## Magic Attributes
### :attribute
> Simple eval
```html
<a class="primary" :href="target">Go to page 1</a>
```
```js
{
  target: "#/page/1"
}
```
```html
<a class="primary" href="#/page/1">Go to page 1</a>
```

> Boolean attributes
```html
<input type="checkbox" :checked="isChecked" :disabled="isDisabled">
```
```js
{
  isDisabled: true,
  isChecked: false
}
```
```html
<input type="checkbox" disabled="">
```

> Extending attributes
```html
<button class="btn btn-" :class="btn" disabled :disabled="isDisabled">
  Submit
</button>
```
```js
{
  isDisabled: false,
  btn: "primary"
}
```
```html
<button class="btn btn-primary">
  Submit
</button>
```

### text
> Prepend text to node
```html
<h1 :text="hi">John</h1>
```
```js
{
  hi: "Hello "
}
```
```html
<h1>Hello John</h1>
```

> Use template to interpolate text
```html
<h1>
  Hello <template :text="name"></template>, how are you?
</h1>
```
```js
{
  name: "John"
}
```
```html
<h1>
  Hello John, how are you?
</h1>
```

> HTML strings will be escaped
```html
<code :text="raw"></code>
```
```js
{
  raw: "var x = y > 4 && z / 3 == 2 ? 1 : 2"
}
```
```html
<code>var x = y &gt; 4 &amp;&amp; z / 3 == 2 ? 1 : 2</code>
```

### html
> Prepend HTML to node
```html
<a href="#" :html="icon">Remove</a>
```
```js
{
  icon: '<i class="fas fa-trash"></i> '
}
```
```html
<a href="#"><i class="fas fa-trash"></i> Remove</a>
```

> Use template to interpolate html
```html
<h1>
  Hello <template :html="name"></template>, how are you?
</h1>
```
```js
{
  name: "<b>John</b>"
}
```
```html
<h1>
  Hello <b>John</b>, how are you?
</h1>
```

> Templates as void elements
```html
<a href="#"><template><i class="fas fa-trash"></i> </template>Remove</a>
```
```js
{}
```
```html
<a href="#"><i class="fas fa-trash"></i> Remove</a>
```

### if/not
> Remove node with a conditional test
```html
<div>
  John: <i :if="john" class="fas fa-check"></i><i :not="john" class="fas fa-times"></i>
</div><div>
  Mary: <i :if="mary" class="fas fa-check"></i><i :not="mary" class="fas fa-times"></i>
</div>
```
```js
{
  john: false,
  mary: true
}
```
```html
<div>
  John: <i class="fas fa-times"></i>
</div><div>
  Mary: <i class="fas fa-check"></i>
</div>
```

> Some critical js values
```html
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
```
```js
[
  null,
  0,
  1,
  -1,
  "",
  "0",
  [],
  {},
  undefined
]
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
> Choose a imediate children tag based on a criteria.
```html
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
```
```js
{
  input: "text",
  name: "bio",
  title: "Bio"
}
```
```html
<form>
  <label>Bio</label>
  <textarea name="bio" rows="6"></textarea>
  <button>Submit</button>
</form>
```

> You can use template for case
```html
<div :switch="color">
  My favorite color is:
  <template
    case="red"
  >Red</template><template
    case="green"
  >Green</template><template
    case="blue"
  >Blue</template>
</div>
```
```js
{
  color: "red"
}
```
```html
<div>
  My favorite color is:
  Red
</div>
```

> You can use template for switch
```html
<template :switch="color">My favorite color is: <b
  case="red"
>Red</b><b
  case="green"
>Green</b><b
  case="blue"
>Blue</b></template>
```
```js
{
  color: "green"
}
```
```html
My favorite color is: <b>Green</b>
```

> You can use in both
```html
<template :switch="color">My favorite color is: <template
  case="red"
>Red</template><template
  case="green"
>Green</template><template
  case="blue"
>Blue</template></template>
```
```js
{
  color: "blue"
}
```
```html
My favorite color is: Blue
```

### with
> Change scope within tag.
```html
<div>
  <p>My name is: <template :text="name"></template></p>
  <p :with="friend">My name is: <template :text="name"></template></p>
  <p>My name is: <template :text="name"></template></p>
</div>
```
```js
{
  name: "Mary",
  friend: {
    name: "John"
  }
}
```
```html
<div>
  <p>My name is: Mary</p>
  <p>My name is: John</p>
  <p>My name is: Mary</p>
</div>
```

> Parent keys access.
```html
<div>
  <p><b :text="greeting"></b><span :text="name"></span></p>
  <p :with="friend"><b :text="greeting"></b><span :text="name"></span></p>
  <p><b :text="greeting"></b><span :text="name"></span></p>
</div>
```
```js
{
  greeting: "Hello",
  name: "Mary",
  friend: {
    name: "John"
  }
}
```
```html
<div>
  <p><b>Hello</b><span>Mary</span></p>
  <p><b>Hello</b><span>John</span></p>
  <p><b>Hello</b><span>Mary</span></p>
</div>
```

> Arrays can also be expanded.
```html
<div :with="to">
  <p><b :text="greeting"></b><span :text="0"></span></p>
  <p><b :text="greeting"></b><span :text="1"></span></p>
</div>
```
```js
{
  greeting: "Hello",
  to: ["Mary", "John"]
}
```
```html
<div>
  <p><b>Hello</b><span>Mary</span></p>
  <p><b>Hello</b><span>John</span></p>
</div>
```

> Simple types access.
```html
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
```
```js
[["Mary", "John"], "dog", 3.14]
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

```html
<div :with="">
  <p :text=""></p>
</div>
```
```js
"dog"
```
```html
<div>
  <p>dog</p>
</div>
```

### each
> Simple array iteration.
```html
<template :each=""><template :text=""></template>
</template>
```
```js
["dog", "cat", "horse"]
```
```html
dog
cat
horse

```

> Complex array iteration.

```html
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
```
```js
{
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
}
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

### custom tags (TODO)
> Reuse your templates inside another template.

With the following tag in your `HTML` `body` 
```html
<template id="my-button">
  <button class="btn btn-" :class="btn">
    <slot></slot>
  </button>
</template>
```
```html
<div>
  <my-button :each="" :btn="button" :text="title"></my-button>
</div>
```
```js
[
  {button: "secondary", title: "Cancel"},
  {button: "primary", title: "Submit"}
]
```
```html
<div>
  <button class="btn btn-secondary">
    Cancel 
  </button>
  <button class="btn btn-" :class="btn">
    Submit
  </button>
</div>
```

> Recursively flatten an array.

With the following tag in your `HTML` `body` 
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

```html
<my-list :items=""></my-list>
```
```js
[
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
]
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
  <li>
    <span>home</span>
  </li>
</ul>
```

## Philosophy
 - Separation: Functions and data transformations belong to javascript, design
and visual presentation to html and css, and the data belongs to database.
 - Designers and people with no programming knowledge should understand it
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

Any syntax changes must be within the philosophy of this project. If you
disagree, feel free to fork it.

It's a very simple project. Any contribution is highly appreciated.
