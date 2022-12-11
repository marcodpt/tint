# if/not
## Remove node with a conditional test
```js
{
  john: false,
  mary: true
}
```
```html
<div>
  John:
  <i :if="john" class="fas fa-check"></i>
  <i :not="john" class="fas fa-times"></i>
</div><div>
  Mary:
  <i :if="mary" class="fas fa-check"></i>
  <i :not="mary" class="fas fa-times"></i>
</div>
```
Result:
```html
<div>
  John: <i class="fas fa-times"></i>
</div><div>
  Mary: <i class="fas fa-check"></i>
</div>
```

## Some critical js values
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
Result:
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
