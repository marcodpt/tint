# bind 
## Spread attributes
```js
{
  class: "message",
  style: "white-space:pre-wrap;",
  text: "Hello John!"
}
```
```html
<h1 :bind>Hello World!</h1>
```
Result:
```html
<h1 class="message" style="white-space:pre-wrap;">Hello John!</h1>
```

## Very useful with custom tags
With the following tag in your `HTML` `template`: 
```html
<template id="my-button">
  <button class="btn btn-" :class="btn" :text="text" :click="click">
    <slot></slot>
  </button>
</template>
```
Render this:
```js
[
  {
    btn: "secondary",
    text: "Cancel",
    click: (ev) => {
      ev.target.textContent = 'canceled!';
    }
  },
  {
    btn: "primary",
    text: "Submit",
    click: (ev) => {
      ev.target.textContent = 'submited!';
    }
  }
]
```
```html
<my-button :each :bind></my-button>
```
Result:
```html
<button class="btn btn-secondary">Cancel</button>
<button class="btn btn-primary">Submit</button>
```
After clicking on the two buttons:
```html
<button class="btn btn-secondary">canceled!</button>
<button class="btn btn-primary">submited!</button>
```
