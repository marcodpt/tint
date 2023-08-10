# Static id
Is it possible to ignore vdom on elements with id starting with static-
```js
{
  msg: "Static demo"
}
```
```html
<div>
  <p :text="msg"></p>
  <div id="static-data">Loading...</div>
</div>
```
Result:
```html
<div>
  <p>Static demo</p>
  <div id="static-data">Loading...</div>
</div>
```

External library takes over element
```js
document.getElementById('static-data').textContent = 'Some data'
```

Rerender
```js
{
  msg: "Demo updated"
}
```

The result does not change the content in static-data even though the template
contains Loading...
```html
<div>
  <p>Demo updated</p>
  <div id="static-data">Some data</div>
</div>
```
