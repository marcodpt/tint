import {h, render, Component} from 'https://unpkg.com/preact?module'
import tint from "./index.js"

const compile = tint(h)

export default (state, node) => {
  const getView = compile(node)

  const rerender = () => render(getView(state), node)
  node.innerHTML = ''
  rerender()
  return rerender
}
