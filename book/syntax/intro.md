# Introduction

Tint is a DOM-based template engine and compiles the output to hyperscript
functions.

While on the surface it may look like a normal (text-based) template engine,
it has some important differences:

- you can use functions and will be bound to DOM element events.
- the syntax must always be valid HTML, in order to use the javascript DOM.
- although it is currently implemented in the browser and
[deno](https://deno.land/), as long as the DOM API is available, can be
implemented in javascript runtimes such as [node](https://nodejs.org/en/).
- there is no dot syntax, javascript expressions, filters, delimiters for text
interpolation or any kind of logic other than the special attributes available,
this is a decision made in order for the template to be as free of logic as
possible.
- all complex data operations must be done in javascript before rendering the
template.
