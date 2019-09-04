import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import * as VKConnect from '@vkontakte/vkui-connect'
import App from './App'
import { unregister } from './sw'
import { isProduction, initProductionUtils } from './helpers/production_utils'

let root = document.getElementById('root')
if (isProduction) initProductionUtils(root)

// need to query it again here cause initProductionUtils modifies DOM
// another way React throws error
root = document.getElementById('root')
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

// unregister service worker
unregister()

// Hot Reload
if (module.hot) {
  module.hot.accept('./App', () => {
    render(App)
  })
}
