# each

## Simple array iteration.
```js
["dog", "cat", "horse"]
```
```html
<template :each>
  <template :text></template>
</template>
```
Result:
```html
dog
cat
horse
```

## Complex array iteration.
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
      <th :each="links" :text></th>
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
Result:
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
