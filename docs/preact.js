import {h, render, Component} from 'https://unpkg.com/preact?module'
import tint from "./index.js"

const compile = tint(h)

export default (state, node) => {
  console.log(node.children[0])
  const getView = compile(node.children[0])

  const rerender = () => render(getView(state), node)
  node.innerHTML = ''
  rerender()
  return rerender
}
