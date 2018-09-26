import * as template from 'es6-template-strings'
import * as express from 'express'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'

import { readFile as fsReadFile } from 'fs'
import { promisify } from 'util'

import { LandingPage } from '../client/LandingPage'
import { indexRouter } from './routes'

const app = express()
const router = express.Router()
const port = 3000
const isProd = process.env.NODE_ENV === 'production'
const htmlPath = 'build/index.html'
const readFile = promisify(fsReadFile)

app.get('/*', (req, res) => {
  const renderApp = ReactDOMServer.renderToStaticMarkup(<LandingPage />)
  const responseRender = data => res.send(template(data, { renderApp }))
  const errorReadfile = e => res.status(400).send(e)
  return readFile(htmlPath, 'utf-8').then(responseRender).catch(errorReadfile)
})

/* app.use(indexRouter) */

app.listen(port, () => console.log(`Example app listening on port ${port}!`))