import cannabis from "./index.js"

const render = cannabis()
const text = str => str.trim()
  .replace(/>\s+</g, () => '><')
  .replace(/\s+/g, () => ' ')
const test = (id, scope, result) => assert => {
  const e = render(id, scope)
  assert.equal(text(e.innerHTML), text(result))
}

QUnit.module(':attribute', () => {
  QUnit.test('Simple eval', test('attributes-1', {
    target: "#/page/1"
  }, `<a class="primary" href="#/page/1">Go to page 1</a>`))

  QUnit.test('Boolean attributes', test('attributes-2', {
    isDisabled: true,
    isChecked: false
  }, `<input type="checkbox" disabled="">`))

  QUnit.test('Extending attributes', test('attributes-3', {
    isDisabled: false,
    btn: "primary"
  }, `<button class="btn btn-primary"> Submit </button>`))

  QUnit.test('Function calls', assert => {
    const scope = {
      action: (ev) => {
        const btn = ev.target.closest('button');
        btn.disabled = true;
        btn.textContent = 'Submited!';
      }
    }
    const e = render('attributes-4', scope)
    const b = e.querySelector('button')
    assert.equal(
      text(e.innerHTML),
      text(`<button class="btn btn-primary"> Submit </button>`)
    )
    assert.equal(b.disabled, false)
    assert.equal(b.textContent.trim(), 'Submit')
    b.click()
    assert.equal(
      text(e.innerHTML),
      text(`<button class="btn btn-primary" disabled="">Submited!</button>`)
    )
    assert.equal(b.disabled, true)
    assert.equal(b.textContent.trim(), 'Submited!')
  })
})
QUnit.module('text', () => {
  QUnit.test('Append text to node', test('text-1', {
    name: "John"
  }, `<h1>Hello John</h1>`))
  QUnit.test('Use template to interpolate text', test('text-2', {
    name: "John"
  }, `<h1>
    Hello John, how are you?
  </h1>`))
  QUnit.test('HTML strings will be escaped', test('text-3', {
    raw: "var x = y > 4 && z / 3 == 2 ? 1 : 2"
  }, `<code>var x = y &gt; 4 &amp;&amp; z / 3 == 2 ? 1 : 2</code>`))
})
QUnit.module('if/not', () => {
  QUnit.test('Remove node with a conditional test.', test('if-not-1', {
    john: false,
    mary: true
  }, `
    <div>
      John: <i class="fas fa-times"></i>
    </div><div>
      Mary: <i class="fas fa-check"></i>
    </div>
  `))
  QUnit.test('Some critical js values', test('if-not-2', [
    null,
    0,
    1,
    -1,
    "",
    "0",
    [],
    {},
    undefined
  ], `
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
  `))
})

QUnit.module('switch/case', () => {
  QUnit.test('Choose a imediate children tag based on a criteria.', test('switch-case-1', {
    input: "text",
    name: "bio",
    title: "Bio"
  }, `<form>
    <label>Bio</label>
    <textarea name="bio" rows="6"></textarea>
    <button>Submit</button>
  </form>`))
  QUnit.test('You can use template for case', test('switch-case-2', {
    color: "red"
  }, `<div>
    My favorite color is:
    Red
  </div>`))
  QUnit.test('You can use template for switch', test('switch-case-3', {
    color: "green"
  }, `My favorite color is: <b>Green</b>`))
  QUnit.test('You can use in both', test('switch-case-4', {
    color: "blue"
  }, `My favorite color is: Blue`))
})

QUnit.module('with', () => {
  QUnit.test('Change scope within tag.', test('with-1', {
    name: "Mary",
    friend: {
      name: "John"
    }
  }, `<div>
    <p>My name is: Mary</p>
    <p>My name is: John</p>
    <p>My name is: Mary</p>
  </div>`))
  QUnit.test('Parent keys access.', test('with-2', {
    greeting: "Hello",
    name: "Mary",
    friend: {
      name: "John"
    }
  }, `<div>
    <p><b>Hello</b><span>Mary</span></p>
    <p><b>Hello</b><span>John</span></p>
    <p><b>Hello</b><span>Mary</span></p>
  </div>`))
  QUnit.test('Simple types access.', test('with-3', [
    ["Mary", "John"], "dog", 3.14
  ], `<div>
    <p>Mary</p>
    <p>John</p>
  </div>
  <div>
    <p>dog</p>
  </div>
  <div>
    <p>3.14</p>
  </div>`))
})

QUnit.module('each', () => {
  QUnit.test('Simple array iteration.', test('each-1', [
    "dog", "cat", "horse"
  ], `dog cat horse`))
  QUnit.test('Complex array iteration.', test('each-2', {
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
  }, `<table>
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
  </table>`))
})

QUnit.module('custom tags', () => {
  QUnit.test('Reuse your templates inside another template.', test('custom-1', {
    button: "primary",
    title: "Submit"
  }, `<div>
    <button class="btn btn-primary">Go Submit</button>
  </div>`))
  QUnit.test('Iterate with custom tags.', test('custom-2', [
    {button: "secondary", title: "Cancel"},
    {button: "primary", title: "Submit"}
  ], `<div>
    <button class="btn btn-secondary">Go Cancel</button>
    <button class="btn btn-primary">Go Submit</button>
  </div>`))
  QUnit.test('Recursive tags.', test('my-list', {
    items: [
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
  }, `<ul>
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
  </ul>`))
})
