import compile from "../template.js"

export default doc => {
  const text = str => str.trim()
    .replace(/>\s+</g, () => '><')
    .replace(/\s+/g, () => ' ')
  const div = doc.createElement('div')

  return {
    text,
    div,
    tests: [
      {
        name: ':attribute',
        tests: [
          {
            name: 'Simple eval',
            id: 'attributes-1',
            scope: {
              target: "#/page/1"
            },
            result: `<a class="primary" href="#/page/1">Go to page 1</a>`
          }, {
            name: 'Boolean attributes',
            id: 'attributes-2',
            scope: {
              isDisabled: true,
              isChecked: false
            },
            result: `<input type="checkbox" disabled="">`
          }, {
            name: 'Extending attributes',
            id: 'attributes-3',
            scope: {
              isDisabled: false,
              btn: "primary"
            },
            result: `<button class="btn btn-primary"> Submit </button>`
          }, {
            name: 'Function calls',
            run: assert => {
              const scope = {
                action: (ev) => {
                  const btn = ev.target.closest('button');
                  btn.disabled = true;
                  btn.textContent = 'Submited!';
                }
              }
              const e = compile(
                div, doc.getElementById('attributes-4'), doc
              )(scope)
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
            } 
          }
        ]
      }, {
        name: 'text',
        tests: [
          {
            name: 'Replace node text',
            id: 'text-1',
            scope: {
              content: "Hello John!"
            },
            result: `<h1>Hello John!</h1>`
          }, {
            name: 'Use template to interpolate text',
            id: 'text-2',
            scope: {
              name: "John"
            },
            result: `<h1>
              Hello John, how are you?
            </h1>`
          }, {
            name: 'HTML strings will be escaped',
            id: 'text-3',
            scope: {
              raw: "var x = y > 4 && z / 3 == 2 ? 1 : 2"
            },
            result: `<code>var x = y &gt; 4 &amp;&amp; z / 3 == 2 ? 1 : 2</code>`
          }
        ]
      }, {
        name: 'if/not',
        tests: [
          {
            name: 'Remove node with a conditional test.',
            id: 'if-not-1',
            scope: {
              john: false,
              mary: true
            },
            result: `
              <div>
                John: <i class="fas fa-times"></i>
              </div><div>
                Mary: <i class="fas fa-check"></i>
              </div>
            `
          }, {
            name: 'Some critical js values',
            id: 'if-not-2',
            scope: [
              null,
              0,
              1,
              -1,
              "",
              "0",
              [],
              {},
              undefined
            ],
            result: `<div>
              null: false
              0: false
              1: true
              -1: true
              "": false
              "0": true
              []: true
              {}: true
              undefined: false
            </div>`
          }
        ]
      }, {
        name: 'show/hide',
        tests: [
          {
            name: 'Remove node with a conditional test.',
            id: 'show-hide-1',
            scope: {
              john: false,
              mary: true
            },
            result: `
              <div>
                John:
                <i style="display: none;" class="fas fa-check"></i>
                <i class="fas fa-times"></i>
              </div><div>
                Mary:
                <i class="fas fa-check" style="max-width:200px"></i>
                <i style="display: none;max-width:200px" class="fas fa-times"></i>
              </div>
            `
          }
        ]
      }, {
        name: 'switch/case',
        tests: [
          {
            name: 'Choose a imediate children tag based on a criteria.',
            id: 'switch-case-1',
            scope: {
              input: "text",
              name: "bio",
              title: "Bio"
            },
            result: `<form>
              <label>Bio</label>
              <textarea name="bio" rows="6"></textarea>
              <button>Submit</button>
            </form>`
          }, {
            name: 'You can use template for case',
            id: 'switch-case-2',
            scope: {
              color: "red"
            },
            result: `<div>
              My favorite color is:
              Red
            </div>`
          }, {
            name: 'You can use template for switch',
            id: 'switch-case-3',
            scope: {
              color: "green"
            },
            result: `My favorite color is: <b>Green</b>`
          }, {
            name: 'You can use in both',
            id: 'switch-case-4',
            scope: {
              color: "blue"
            },
            result: `My favorite color is: Blue`
          }
        ]
      }, {
        name: 'with',
        tests: [
          {
            name: 'Change scope within tag.',
            id: 'with-1',
            scope: {
              name: "Mary",
              friend: {
                name: "John"
              }
            },
            result: `<div>
              <p>My name is: Mary</p>
              <p>My name is: John</p>
              <p>My name is: Mary</p>
            </div>`
          }, {
            name: 'Parent keys access.',
            id: 'with-2',
            scope: {
              greeting: "Hello",
              name: "Mary",
              friend: {
                name: "John"
              }
            },
            result: `<div>
              <p><b>Hello</b><span>Mary</span></p>
              <p><b>Hello</b><span>John</span></p>
              <p><b>Hello</b><span>Mary</span></p>
            </div>`
          }, {
            name: 'Simple types access.',
            id: 'with-3',
            scope: [
              ["Mary", "John"], "dog", 3.14
            ],
            result: `
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
            `
          }
        ]
      }, {
        name: 'each',
        tests: [
          {
            name: 'Simple array iteration.',
            id: 'each-1',
            scope: [
              "dog", "cat", "horse"
            ],
            result: `dog cat horse`
          }, {
            name: 'Complex array iteration.',
            id: 'each-2',
            scope: {
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
            },
            result: `<table>
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
            </table>`
          }
        ]
      }, {
        name: 'custom tags',
        tests: [
          {
            name: 'Reuse your templates inside another template.',
            id: 'custom-1',
            scope: {
              button: "primary"
            },
            result: `<div>
              <button class="btn btn-primary">
                Action
              </button>
            </div>`
          }, {
            name: 'Iterate with custom tags.',
            id: 'custom-2',
            scope: [
              {button: "secondary", title: "Cancel"},
              {button: "primary", title: "Submit"}
            ],
            result: `<div>
              <button class="btn btn-secondary">Cancel</button>
              <button class="btn btn-primary">Submit</button>
            </div>`
          }, {
            name: 'Recursive tags.',
            id: 'my-list',
            scope: {
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
            },
            result: `<ul>
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
            </ul>`
          }
        ]
      }, {
        name: 'bind',
        tests: [
          {
            name: 'Spread attributes',
            id: 'bind-1',
            scope: {
              class: "message",
              style: "white-space:pre-wrap;",
              text: "Hello John!"
            },
            result: `<h1 class="message" style="white-space:pre-wrap;">Hello John!</h1>`
          }, {
            name: 'Very useful with custom tags',
            run: assert => {
              const e = compile(div, doc.getElementById('bind-2'), doc)([
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
            } 
          }, {
            name: 'Bug passing data to slot',
            run: assert => {
              const e = compile(div, doc.getElementById('bind-3'), doc)({
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
            }
          }
        ]
      }
    ]
  }
}
