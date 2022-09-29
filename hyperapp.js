import {h, text, app} from "https://unpkg.com/hyperapp"
import tint from './index.js'

const render = tint(h, text)

export default options => {
  return app({
    ...options,
    view: state => render(options.templateId, {
      ...state,
      ...options.actions
    }, options.node.tagName, Array.from(options.node.attributes).reduce((X, {
      nodeName,
      nodeValue
    }) => ({
      ...X,
      [nodeName]: nodeValue
    }), {}))
  })
}
