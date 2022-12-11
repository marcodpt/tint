import {h, text, app} from "https://unpkg.com/hyperapp"
import tint from './index.js'

const compile = tint(h, text)

export default ({actions, ...options}) => {
  const render = compile(options.node)

  return app({
    ...options,
    view: state => render({
      ...state,
      ...actions
    })
  })
}
