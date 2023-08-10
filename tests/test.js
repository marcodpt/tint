import tint from "../index.js"
import superfine from "../superfine.js"
import hyperapp from "../hyperapp.js"

const compile = tint()
const text = str => str.trim()
  .replace(/>\s+</g, () => '><')
  .replace(/\s+/g, () => ' ')
const div = document.createElement('div')
const test = (id, scope, result) => assert => {
  const e = compile(div, document.getElementById(id))(scope)
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
    const e = compile(div, document.getElementById('attributes-4'))(scope)
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
  QUnit.test('Replace node text', test('text-1', {
    content: "Hello John!"
  }, `<h1>Hello John!</h1>`))
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
    button: "primary"
  }, `<div>
    <button class="btn btn-primary">
      Action
    </button>
  </div>`))
  QUnit.test('Iterate with custom tags.', test('custom-2', [
    {button: "secondary", title: "Cancel"},
    {button: "primary", title: "Submit"}
  ], `<div>
    <button class="btn btn-secondary">Cancel</button>
    <button class="btn btn-primary">Submit</button>
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

QUnit.module('bind', () => {
  QUnit.test('Spread attributes', test('bind-1', {
    class: "message",
    style: "white-space:pre-wrap;",
    text: "Hello John!"
  }, `<h1 class="message" style="white-space:pre-wrap;">Hello John!</h1>`))

  QUnit.test('Very useful with custom tags', assert => {
    const e = compile(div, document.getElementById('bind-2'))([
      {
        btn: "secondary",
        text: "Cancel",
        click: (ev) => {
          ev.target.textContent = 'canceled!';
        }
      },
      {
        btn: "primary",
        text: "Submit",
        click: (ev) => {
          ev.target.textContent = 'submited!';
        }
      }
    ])
    assert.equal(
      text(e.innerHTML),
      text(`
        <button class="btn btn-secondary">Cancel</button>
        <button class="btn btn-primary">Submit</button>
      `)
    )
    e.querySelector('.btn-secondary').click()
    e.querySelector('.btn-primary').click()
    assert.equal(
      text(e.innerHTML),
      text(`
        <button class="btn btn-secondary">canceled!</button>
        <button class="btn btn-primary">submited!</button>
      `)
    )
  })

  QUnit.test('Bug passing data to slot', assert => {
    const e = compile(div, document.getElementById('bind-3'))({
      css: 'container',
      one: {
        label: 'first'
      },
      two: {
        label: 'second'
      }
    })
    assert.equal(
      text(e.innerHTML),
      text(`
        <div class="container">
          <a>container</a>
          <a>first</a>
          <a>second</a>
          <span>first</span>
          <span>second</span>
        </div>
      `)
    )
  })
})

QUnit.module('static', () => {
  QUnit.test('static views', assert => {
    const render = compile(div, document.getElementById('static-1'))
    const e = render({
      a: 'a1',
      b: 'b1',
      c: 'c1',
      d: 'd1'
    })
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <a id="a">a1</a>
          <a id="static-b">b1</a>
          <a><span>c1</span></a>
          <a id="static-d"><span>d1</span></a>
        </div>
      `)
    )
    document.body.appendChild(e)
    const f = render({
      a: 'a2',
      b: 'b2',
      c: 'c2',
      d: 'd2'
    })
    assert.equal(
      text(f.innerHTML),
      text(`
        <div>
          <a id="a">a2</a>
          <a id="static-b">b1</a>
          <a><span>c2</span></a>
          <a id="static-d"><span>d1</span></a>
        </div>
      `)
    )
    const a = document.getElementById('a')
    const b = document.getElementById('static-b')
    const d = document.getElementById('static-d')
    a.innerHTML = '<p>Hello!</p>'
    b.innerHTML = '<p>Hello!</p>'
    d.innerHTML = '<div><a>D</a> Here</div>'
    const g = render({
      a: 'a3',
      b: 'b3',
      c: 'c3',
      d: 'd3'
    })
    assert.equal(
      text(g.innerHTML),
      text(`
        <div>
          <a id="a">a3</a>
          <a id="static-b"><p>Hello!</p></a>
          <a><span>c3</span></a>
          <a id="static-d"><div><a>D</a> Here</div></a>
        </div>
      `)
    )
    document.body.removeChild(e)
  })

  QUnit.test('button sample', assert => {
    const render = compile(div, document.getElementById('static-2'))
    const e = render({
      title: 'Static elements',
      description: 'Ignores vDom, useful for using external libs'
    })
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <p>Ignores vDom, useful for using external libs</p>
          <external-component id="static-comp"></external-component>
          <div id="static-results"></div>
        </div>
      `)
    )
    document.body.appendChild(e)
    const comp = document.getElementById('static-comp')
    const res = document.getElementById('static-results')
    var i = 0
    comp.innerHTML = '<button onclick="clickButton()">Click</button>'
    window.clickButton = () => {
      res.innerHTML += `<p>click ${++i}</p>`
    }
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <p>Ignores vDom, useful for using external libs</p>
          <external-component id="static-comp">
            <button onclick="clickButton()">Click</button>
          </external-component>
          <div id="static-results"></div>
        </div>
      `)
    )
    const b = e.querySelector('button')
    b.click()
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <p>Ignores vDom, useful for using external libs</p>
          <external-component id="static-comp">
            <button onclick="clickButton()">Click</button>
          </external-component>
          <div id="static-results">
            <p>click 1</p>
          </div>
        </div>
      `)
    )
    const f = render({
      title: 'Static elements',
      description: 'Preserve dom after rerender.'
    })
    assert.equal(
      text(f.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <p>Preserve dom after rerender.</p>
          <external-component id="static-comp">
            <button onclick="clickButton()">Click</button>
          </external-component>
          <div id="static-results">
            <p>click 1</p>
          </div>
        </div>
      `)
    )
    const c = f.querySelector('button')
    c.click()
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <p>Ignores vDom, useful for using external libs</p>
          <external-component id="static-comp">
            <button onclick="clickButton()">Click</button>
          </external-component>
          <div id="static-results">
            <p>click 1</p>
            <p>click 2</p>
          </div>
        </div>
      `)
    )
    assert.equal(
      text(f.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <p>Preserve dom after rerender.</p>
          <external-component id="static-comp">
            <button onclick="clickButton()">Click</button>
          </external-component>
          <div id="static-results">
            <p>click 1</p>
          </div>
        </div>
      `)
    )
    b.click()
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <p>Ignores vDom, useful for using external libs</p>
          <external-component id="static-comp">
            <button onclick="clickButton()">Click</button>
          </external-component>
          <div id="static-results">
            <p>click 1</p>
            <p>click 2</p>
            <p>click 3</p>
          </div>
        </div>
      `)
    )
    assert.equal(
      text(f.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <p>Preserve dom after rerender.</p>
          <external-component id="static-comp">
            <button onclick="clickButton()">Click</button>
          </external-component>
          <div id="static-results">
            <p>click 1</p>
          </div>
        </div>
      `)
    )
    document.body.removeChild(e)
  })

  QUnit.test('superfine', assert => {
    const e = div.cloneNode(true)
    document.body.appendChild(e)
    const render = superfine(e, document.getElementById('static-3'))
    const state = {
      title: 'Static elements',
      count: 1,
      update: () => {
        state.count++
        render(state)
      }
    }
    render(state)
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <button>Update</button>
          <p>Update 1</p>
          <external-component id="static-comp"></external-component>
          <div id="static-results"></div>
        </div>
      `)
    )
    const u = e.querySelector('button')
    u.click()
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <button>Update</button>
          <p>Update 2</p>
          <external-component id="static-comp"></external-component>
          <div id="static-results"></div>
        </div>
      `)
    )
    const comp = document.getElementById('static-comp')
    const res = document.getElementById('static-results')
    const b = document.createElement('button')
    b.textContent = 'Click'
    var i = 0
    b.addEventListener('click', () => {
      res.innerHTML += `<p>click ${++i}</p>`
      delete e.vdom
    })
    comp.appendChild(b)
    delete e.vdom
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <button>Update</button>
          <p>Update 2</p>
          <external-component id="static-comp">
            <button>Click</button>
          </external-component>
          <div id="static-results"></div>
        </div>
      `)
    )
    u.click()
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <button>Update</button>
          <p>Update 3</p>
          <external-component id="static-comp">
            <button>Click</button>
          </external-component>
          <div id="static-results"></div>
        </div>
      `)
    )
    b.click()
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <button>Update</button>
          <p>Update 3</p>
          <external-component id="static-comp">
            <button>Click</button>
          </external-component>
          <div id="static-results">
            <p>click 1</p>
          </div>
        </div>
      `)
    )
    u.click()
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements</h1>
          <button>Update</button>
          <p>Update 4</p>
          <external-component id="static-comp">
            <button>Click</button>
          </external-component>
          <div id="static-results">
            <p>click 1</p>
          </div>
        </div>
      `)
    )
    state.title += ' review'
    render(state)
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements review</h1>
          <button>Update</button>
          <p>Update 4</p>
          <external-component id="static-comp">
            <button>Click</button>
          </external-component>
          <div id="static-results">
            <p>click 1</p>
          </div>
        </div>
      `)
    )
    b.click()
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements review</h1>
          <button>Update</button>
          <p>Update 4</p>
          <external-component id="static-comp">
            <button>Click</button>
          </external-component>
          <div id="static-results">
            <p>click 1</p>
            <p>click 2</p>
          </div>
        </div>
      `)
    )
    u.click()
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <h1>Static elements review</h1>
          <button>Update</button>
          <p>Update 5</p>
          <external-component id="static-comp">
            <button>Click</button>
          </external-component>
          <div id="static-results">
            <p>click 1</p>
            <p>click 2</p>
          </div>
        </div>
      `)
    )
    document.body.removeChild(e)
  })

  QUnit.test('docs', assert => {
    const render = compile(div, document.getElementById('static-4'))
    const e = render({
      msg: 'Static demo'
    })
    assert.equal(
      text(e.innerHTML),
      text(`
        <div>
          <p>Static demo</p>
          <div id="static-data">Loading...</div>
        </div>
      `)
    )
    document.body.appendChild(e)
    document.getElementById('static-data').textContent = 'Some data'
    const f = render({
      msg: 'Demo updated'
    })
    assert.equal(
      text(f.innerHTML),
      text(`
        <div>
          <p>Demo updated</p>
          <div id="static-data">Some data</div>
        </div>
      `)
    )
    document.body.removeChild(e)
  })
})
