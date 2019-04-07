import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import * as VKConnect from '@vkontakte/vkui-connect'
import App from './App'
import registerServiceWorker from './sw'
import { isProduction, initProductionUtils } from './helpers/production_utils'

if (isProduction) initProductionUtils()

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
