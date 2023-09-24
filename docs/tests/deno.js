import {DOMParser} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"
import compile from "../template.js"
import {assertEquals} from "https://deno.land/std@0.202.0/assert/mod.ts"
import tests from "./tests.js"

const parser = new DOMParser()
const doc = parser.parseFromString(
  Deno.readTextFileSync('tests/index.html'),
  "text/html"
)
const T = tests(doc)

T.tests.forEach((M) => {
  M.tests.forEach(({name, id, scope, result, run}) => {
    if (typeof run == 'function') {
      Deno.test(`${M.name} => ${name}`, () => run({equal: assertEquals}))
    } else {
      Deno.test(`${M.name} => ${name}`, () => {
        const e = compile(T.div, doc.getElementById(id), doc)(scope)
        assertEquals(T.text(e.innerHTML), T.text(result))
      })
    }
  })
})
