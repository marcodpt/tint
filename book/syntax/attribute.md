# :attribute
## Simple eval
```js
{
  target: "#/page/1"
}
```
```html
<a class="primary" :href="target">Go to page 1</a>
```
Result:
```html
<a class="primary" href="#/page/1">Go to page 1</a>
```

## Boolean attributes
```js
{
  isDisabled: true,
  isChecked: false
}
```
```html
<input type="checkbox" :checked="isChecked" :disabled="isDisabled">
```
Result:
```html
<input type="checkbox" disabled="">
```

## Extending attributes
```js
{
  isDisabled: false,
  btn: "primary"
}
```
```html
<button class="btn btn-" :class="btn" disabled :disabled="isDisabled">
  Submit
</button>
```
Result:
```html
<button class="btn btn-primary">
  Submit
</button>
```

## Function calls 
```js
{
  action: (ev) => {
    const btn = ev.target.closest('button')
    btn.disabled = true
    btn.textContent = 'Submited!'
  }
}
```
```html
<button class="btn btn-primary" :onclick="action">
  Submit
</button>
```

Result:
```html
<button class="btn btn-primary">
  Submit
</button>
```

After clicking the button:
```html
<button class="btn btn-primary" disabled="">
  Submited!
</button>
```
