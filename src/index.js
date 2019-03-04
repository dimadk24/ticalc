import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import * as VKConnect from '@vkontakte/vkui-connect'
import App from './App'
import registerServiceWorker from './sw'
import Raven from 'raven-js'

Raven.config(
  'https://e1f809f399e2427898e1796a4a4d8c64@sentry.io/1280607'
).install()

const root = document.getElementById('root')
// Render
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    root
  )
}

// Init VK App
VKConnect.send('VKWebAppInit', {})

render(App)

// Service Worker For Cache
registerServiceWorker()

// Hot Reload
if (module.hot) {
  module.hot.accept('./App', () => {
    render(App)
  })
}
