import {h, render, Component} from 'https://unpkg.com/preact?module'
import tint from "./index.js"

const getView = tint(h)

export default (state, node) => {
  const rerender = () => render(getView(state.templateId, state), node)
  rerender()
  return rerender
}
