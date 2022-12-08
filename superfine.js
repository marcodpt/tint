import {h, text, patch} from "https://unpkg.com/superfine"
import tint from "./index.js"

const compile = tint(h, text)

export default (element, template) => {
  const render = compile(element, template)
  return state => patch(element, render(state))
}
