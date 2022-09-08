const render = (html, json) => {
  const div = document.createElement('div')
  const tpl = document.createElement('template')
  tpl.innerHTML = html
  cannabis(div, tpl, json)
  return div.innerHTML
}

QUnit.module(':attribute', hooks => {
  QUnit.test('Simple eval', assert => {
    assert.equal(render(`
      <a class="primary" :href="target">Go to page 1</a>
    `, {
      target: "#/page/1"
    }), `
      <a class="primary" href="#/page/1">Go to page 1</a>
    `);
  });
  QUnit.test('Boolean attributes', assert => {
    assert.equal(render(`
      <input type="checkbox" :checked="isChecked" :disabled="isDisabled">
    `, {
      isDisabled: true,
      isChecked: false
    }), `
      <input type="checkbox" disabled="">
    `);
  });
  QUnit.test('Extending attributes', assert => {
    assert.equal(render(`
      <button class="btn btn-" :class="btn" disabled :disabled="isDisabled">
        Submit
      </button>
    `, {
      isDisabled: false,
      btn: "primary"
    }), `
      <button class="btn btn-primary">
        Submit
      </button>
    `);
  });
});
QUnit.module('text', hooks => {
  QUnit.test('Prepend text to node', assert => {
    assert.equal(render(`
      <h1 :text="hi">John</h1>
    `, {
      hi: "Hello "
    }), `
      <h1>Hello John</h1>
    `);
  });
  QUnit.test('Use template to interpolate text', assert => {
    assert.equal(render(`
      <h1>
        Hello <template :text="name"></template>, how are you?
      </h1>
    `, {
      name: "John"
    }), `
      <h1>
        Hello John, how are you?
      </h1>
    `);
  });
  QUnit.test('HTML strings will be escaped', assert => {
    assert.equal(render(`
      <code :text="raw"></code>
    `, {
      raw: "var x = y > 4 && z / 3 == 2 ? 1 : 2"
    }), `
      <code>var x = y &gt; 4 &amp;&amp; z / 3 == 2 ? 1 : 2</code>
    `);
  });
});
QUnit.module('html', hooks => {
  QUnit.test('Prepend HTML to node', assert => {
    assert.equal(render(`
      <a href="#" :html="icon">Remove</a>
    `, {
      icon: '<i class="fas fa-trash"></i> '
    }), `
      <a href="#"><i class="fas fa-trash"></i> Remove</a>
    `);
  });
  QUnit.test('Use template to interpolate html', assert => {
    assert.equal(render(`
      <h1>
        Hello <template :html="name"></template>, how are you?
      </h1>
    `, {
      name: "<b>John</b>"
    }), `
      <h1>
        Hello <b>John</b>, how are you?
      </h1>
    `);
  });
  QUnit.test('Templates as void elements', assert => {
    assert.equal(render(`
      <a href="#"><template><i class="fas fa-trash"></i> </template>Remove</a>
    `, {}), `
      <a href="#"><i class="fas fa-trash"></i> Remove</a>
    `);
  });
});
QUnit.module('if/not', hooks => {
  QUnit.test('Remove node with a conditional test.', assert => {
    assert.equal(render(`
      <div>
        John: <i :if="john" class="fas fa-check"></i><i :not="john" class="fas fa-times"></i>
      </div><div>
        Mary: <i :if="mary" class="fas fa-check"></i><i :not="mary" class="fas fa-times"></i>
      </div>
    `, {
      john: false,
      mary: true
    }), `
      <div>
        John: <i class="fas fa-times"></i>
      </div><div>
        Mary: <i class="fas fa-check"></i>
      </div>
    `);
  });
  QUnit.test('Some critical js values', assert => {
    assert.equal(render(`
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
    `, [
      null,
      0,
      1,
      -1,
      "",
      "0",
      [],
      {},
      undefined
    ]), `
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
    `);
  });
});
QUnit.module('switch/case', hooks => {
  QUnit.test('Choose a imediate children tag based on a criteria.', assert => {
    assert.equal(render(`
      <form :switch="input">
        <label :text="title"></label>
        <select
          case="boolean"
          :name="name"
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select><textarea
          case="text"
          :name="name"
          rows="6"
        ></textarea><input
          case="default"
          type="text"
          :name="name"
        >
        <button>Submit</button>
      </form>
    `, {
      input: "text",
      name: "bio",
      title: "Bio"
    }), `
      <form>
        <label>Bio</label>
        <textarea name="bio" rows="6"></textarea>
        <button>Submit</button>
      </form>
    `);
  });
  QUnit.test('You can use template for case', assert => {
    assert.equal(render(`
      <div :switch="color">
        My favorite color is:
        <template
          case="red"
        >Red</template><template
          case="green"
        >Green</template><template
          case="blue"
        >Blue</template>
      </div>
    `, {
      color: "red"
    }), `
      <div>
        My favorite color is:
        Red
      </div>
    `);
  });
  QUnit.test('You can use template for switch', assert => {
    assert.equal(render(`<template :switch="color">My favorite color is: <b
        case="red"
      >Red</b><b
        case="green"
      >Green</b><b
        case="blue"
      >Blue</b></template>`, {
      color: "green"
    }), `My favorite color is: <b>Green</b>`);
  });
  QUnit.test('You can use in both', assert => {
    assert.equal(render(`<template :switch="color">My favorite color is: <template
        case="red"
      >Red</template><template
        case="green"
      >Green</template><template
        case="blue"
      >Blue</template></template>`, {
      color: "blue"
    }), `My favorite color is: Blue`);
  });
});
QUnit.module('with', hooks => {
  QUnit.test('Change scope within tag.', assert => {
    assert.equal(render(`
      <div>
        <p>My name is: <template :text="name"></template></p>
        <p :with="friend">My name is: <template :text="name"></template></p>
        <p>My name is: <template :text="name"></template></p>
      </div>
    `, {
      name: "Mary",
      friend: {
        name: "John"
      }
    }), `
      <div>
        <p>My name is: Mary</p>
        <p>My name is: John</p>
        <p>My name is: Mary</p>
      </div>
    `);
  });
  QUnit.test('Parent keys access.', assert => {
    assert.equal(render(`
      <div>
        <p><b :text="greeting"></b><span :text="name"></span></p>
        <p :with="friend"><b :text="greeting"></b><span :text="name"></span></p>
        <p><b :text="greeting"></b><span :text="name"></span></p>
      </div>
    `, {
      greeting: "Hello",
      name: "Mary",
      friend: {
        name: "John"
      }
    }), `
      <div>
        <p><b>Hello</b><span>Mary</span></p>
        <p><b>Hello</b><span>John</span></p>
        <p><b>Hello</b><span>Mary</span></p>
      </div>
    `);
  });
  QUnit.test('Arrays can also be expanded.', assert => {
    assert.equal(render(`
      <div :with="to">
        <p><b :text="greeting"></b><span :text="0"></span></p>
        <p><b :text="greeting"></b><span :text="1"></span></p>
      </div>
    `, {
      greeting: "Hello",
      to: ["Mary", "John"]
    }), `
      <div>
        <p><b>Hello</b><span>Mary</span></p>
        <p><b>Hello</b><span>John</span></p>
      </div>
    `);
  });
  QUnit.test('Simple types access.', assert => {
    assert.equal(render(`
      <div :with="0">
        <p :text="0"></p>
        <p :text="1"></p>
      </div>
      <div :with="1">
        <p :text=""></p>
      </div>
      <div :with="2">
        <p :text=""></p>
      </div>
    `, [["Mary", "John"], "dog", 3.14]), `
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
    `);
    assert.equal(render(`
      <div :with="">
        <p :text=""></p>
      </div>
    `, "dog"), `
      <div>
        <p>dog</p>
      </div>
    `);
  });
});
QUnit.module('each', hooks => {
  QUnit.test('Simple array iteration.', assert => {
    assert.equal(render(`
      <template :each=""><template :text=""></template>
      </template>
    `, ["dog", "cat", "horse"]), `
      dog
      cat
      horse
      
    `);
  });
  QUnit.test('Complex array iteration.', assert => {
    assert.equal(render(`
      <table>
        <thead>
          <tr>
            <th :each="links" :text=""></th>
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
    `, {
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
    }), `
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
    `);
  });
});
/*QUnit.module('custom tags', hooks => {
  QUnit.test('Reuse your templates inside another template.');
  QUnit.test('Recursively flatten an array.');
});*/
