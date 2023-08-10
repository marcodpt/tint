import {h, text, app} from "https://unpkg.com/hyperapp"
import tint from './index.js'

const compile = tint(h, text)

export default ({actions, template, ...options}) => {
  const render = compile(options.node, template)

  return app({
    ...options,
    view: state => render({
      ...state,
      ...actions
    })
  })
}
