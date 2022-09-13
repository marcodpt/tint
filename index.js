export default (h, text) => {
  if (typeof h != 'function') {
    h = (tagName, attributes, children) => {
      const element = document.createElement(tagName)
      Object.keys(attributes).forEach(key => {
        const v = attributes[key]
        if (typeof v == 'function') {
          element.addEventListener(
            key.substr(key.substr(0, 2) == 'on' ? 2 : 0), v
          )
        } else if (v != null && v !== false) {
          element.setAttribute(key, v === true ? '' : v)
        }
      })
      children.forEach(child => {
        element.appendChild(child)
      })
      return element
    }
  }

  if (typeof text != 'function') {
    text = str => document.createTextNode(str)
  }

  const isObj = X => X && typeof X == 'object' && !(X instanceof Array)
  const merge = (X, Y) => isObj(X) && isObj(Y) ? {...X, ...Y} : Y

  const templates = {}

  const compile = element => {
    if (element.nodeType != 1) {
      return () => [text(element.textContent)]
    }

    const tag = element.tagName.toLowerCase()
    const attributes = Array.from(element.attributes).map(({
      nodeName,
      nodeValue
    }) => ({
      key: nodeName,
      value: nodeValue
    }))

    const childNodes = Array.from(
      (tag == 'template' ? element.content : element).childNodes
    ).map(child => compile(child))

    return (scope, word, rootChildren) => attributes.reduce(
      (nodes, attrs) => nodes.reduce((nodes, data) => {
        const {scope, attributes} = data
        var {key, value} = attrs

        if (key.substr(0, 1) == ':') {
          key = key.substr(1)
          if (value == '') {
            value = scope
          } else if (scope && typeof scope == 'object' && scope[value] != null) {
            value = scope[value]
          } else {
            value = null
          }
        }

        if (key == 'each') {
          if (value instanceof Array) {
            value.forEach(row => {
              nodes.push({
                attributes: {...attributes},
                scope: merge(scope, row)
              })
            })
          }
        } else if (key == 'with') {
          nodes.push({
            ...data,
            scope: merge(scope, value)
          })
        } else if (key == 'if' || key == 'not') {
          if ((key == 'if' && value) || (key == 'not' && !value)) {
            nodes.push(data)
          }
        } else if (key == 'case') {
          if (word != null && word == value) {
            nodes.push(data)
          }
        } else if (key == 'switch') {
          nodes.push({
            ...data,
            word: value
          })
        } else {
          const attr = {...attributes}
          const old = attributes[key]
          attributes[key] = typeof old == 'string' && typeof value == 'string' ?
            old+value : value
          nodes.push({
            ...data,
            attributes: attributes
          })
        }
        return nodes
      }, [])
    , [{
      scope: scope,
      attributes: {}
    }]).reduce((nodes, {scope, attributes, word}) => {
      const children = (tag == 'slot' ? rootChildren : childNodes)
        .reduce((result, render) => {
          render(scope, word, rootChildren || childNodes).forEach(child => {
            result.push(child)
          })
          return result
        }, [])
      const hasTpl = tag.indexOf('-') >= 0 && templates[tag] != null

      if (attributes.text != null && !hasTpl) {
        children.push(text(attributes.text))
        attributes = {...attributes}
        delete attributes.text
      }

      var it = null
      if (tag == 'template' || tag == 'slot') {
        it = children
      } else if (hasTpl) {
        it = templates[tag](attributes, null, childNodes)
      } else {
        it = [h(tag, attributes, children)]
      }

      it.forEach(child => {
        nodes.push(child)
      })

      return nodes
    }, [])
  }

  document.querySelectorAll('template[id]').forEach(tpl => {
    templates[tpl.getAttribute('id')] = compile(tpl)
  })

  return (template, scope, tag, attributes) =>
    h(tag || 'div', attributes || {}, templates[template](scope))
}
