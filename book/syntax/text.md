# text
## Replace node text
```js
{
  content: "Hello John!"
}
```
```html
<h1 text:="content">Hello World!</h1>
```
Result:
```html
<h1>Hello John</h1>
```

## Use template to interpolate text
```js
{
  name: "John"
}
```
```html
<h1>
  Hello <template text:="name"></template>, how are you?
</h1>
```
Result:
```html
<h1>
  Hello John, how are you?
</h1>
```

## HTML strings will be escaped
```js
{
  raw: "var x = y > 4 && z / 3 == 2 ? 1 : 2"
}
```
```html
<code text:="raw"></code>
```
Result:
```html
<code>var x = y &gt; 4 &amp;&amp; z / 3 == 2 ? 1 : 2</code>
```
