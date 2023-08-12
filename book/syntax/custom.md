# Custom Tags

Observe that you can only use as custom tags templates that id contains `-`.
As described [here](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

With the following tag in your `HTML` `template` 
```html
<template id="my-button">
  <button class="btn btn-" class:="btn" text:="text" click:="click">
    <slot></slot>
  </button>
</template>
```

## Reuse your templates inside another template.
```js
{
  button: "primary"
}
```
```html
<div>
  <my-button btn:="button">
    Action
  </my-button>
</div>
```
Result:
```html
<div>
  <button class="btn btn-primary">
    Action
  </button>
</div>
```

## Iterate with custom tags.
```js
[
  {button: "secondary", title: "Cancel"},
  {button: "primary", title: "Submit"}
]
```
```html
<div>
  <my-button each: btn:="button" text:="title"></my-button>
</div>
```
Result:
```html
<div>
  <button class="btn btn-secondary">Cancel</button>
  <button class="btn btn-primary">Submit</button>
</div>
```

## Recursive tags.
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
<template id="my-list">
  <ul if:="items">
    <li each:="items">
      <span text:="title"></span>
      <my-list items:="children"></my-list>
    </li>
  </ul>
</template>
```
Result:
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
