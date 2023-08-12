# with
## Change scope within tag.
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
  <p>My name is: <template text:="name"></template></p>
  <p with:="friend">My name is: <template text:="name"></template></p>
  <p>My name is: <template text:="name"></template></p>
</div>
```
Result:
```html
<div>
  <p>My name is: Mary</p>
  <p>My name is: John</p>
  <p>My name is: Mary</p>
</div>
```

## Parent keys access.
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
  <p><b text:="greeting"></b><span text:="name"></span></p>
  <p with:="friend"><b text:="greeting"></b><span text:="name"></span></p>
  <p><b text:="greeting"></b><span text:="name"></span></p>
</div>
```
Result:
```html
<div>
  <p><b>Hello</b><span>Mary</span></p>
  <p><b>Hello</b><span>John</span></p>
  <p><b>Hello</b><span>Mary</span></p>
</div>
```

## Simple types access.
```js
[["Mary", "John"], "dog", 3.14]
```
```html
<div with:="0">
  <p text:="0"></p>
  <template with:="1">
    <p text:></p>
  </template>
</div>
<div with:="1">
  <p text:></p>
</div>
<div with:="2">
  <template with:>
    <p text:></p>
  </template>
</div>
<div with:="3">
  <p>This will not render</p>
</div>
```
Result:
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
