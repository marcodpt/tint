# show/hide
## Hide node with a conditional test
```js
{
  john: false,
  mary: true
}
```
```html
<div>
  John:
  <i show:="john" class="fas fa-check"></i>
  <i hide:="john" class="fas fa-times"></i>
</div><div>
  Mary:
  <i show:="mary" class="fas fa-check" style="max-width:200px"></i>
  <i hide:="mary" class="fas fa-times" style="max-width:200px"></i>
</div>
```
Result:
```html
<div>
  John:
  <i style="display: none;" class="fas fa-check"></i>
  <i class="fas fa-times"></i>
</div><div>
  Mary:
  <i class="fas fa-check" style="max-width:200px"></i>
  <i style="display: none;max-width:200px" class="fas fa-times"></i>
</div>
```
