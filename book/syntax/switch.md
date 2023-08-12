# switch/case
## Choose a imediate children tag based on a criteria.
```js
{
  input: "text",
  name: "bio",
  title: "Bio"
}
```
```html
<form switch:="input">
  <label text:="title"></label>
  <select
    case="boolean"
    name:="name"
  >
    <option value="0">No</option>
    <option value="1">Yes</option>
  </select>
  <textarea
    case="text"
    name:="name"
    rows="6"
  ></textarea>
  <input
    case="default"
    type="text"
    name:="name"
  >
  <button>Submit</button>
</form>
```
Result:
```html
<form>
  <label>Bio</label>
  <textarea name="bio" rows="6"></textarea>
  <button>Submit</button>
</form>
```

## You can use template for case
```js
{
  color: "red"
}
```
```html
<div switch:="color">
  My favorite color is:
  <template case="red">Red</template>
  <template case="green">Green</template>
  <template case="blue">Blue</template>
</div>
```
Result:
```html
<div>
  My favorite color is: Red
</div>
```

## You can use template for switch
```js
{
  color: "green"
}
```
```html
<template switch:="color">
  My favorite color is:
  <b case="red">Red</b>
  <b case="green">Green</b>
  <b case="blue">Blue</b>
</template>
```
Result:
```html
My favorite color is: <b>Green</b>
```

## You can use in both
```js
{
  color: "blue"
}
```
```html
<template switch:="color">
  My favorite color is:
  <template case="red">Red</template>
  <template case="green">Green</template>
  <template case="blue">Blue</template>
</template>
```
Result:
```html
My favorite color is: Blue
```
