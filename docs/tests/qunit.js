import compile from "../template.js"
import tests from "./tests.js"

const M = tests(document)

const test = (id, scope, result) => assert => {
  const e = compile(M.div, document.getElementById(id))(scope)
  assert.equal(M.text(e.innerHTML), M.text(result))
}

M.tests.forEach(({name, tests}) => {
  QUnit.module(name, () => {
    tests.forEach(({name, id, scope, result, run}) => {
      if (typeof run == 'function') {
        QUnit.test(name, run)
      } else {
        QUnit.test(name, test(id, scope, result))
      }
    })
  })
})
