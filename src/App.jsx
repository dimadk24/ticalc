import React, { Component } from 'react'
import * as VKConnect from '@vkontakte/vkui-connect'
import { Root } from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import Home from './Home/Home'
import SendRequestView from './SendRequestView/SendRequestView'
import StartView from './StartView/StartView'
import ErrorBoundary from './helpers/ErrorBoundary/ErrorBoundary'
import ThankYouView from './ThankYouView/ThankYouView'
import { getUserInfo, isSafari } from './helpers/helpers'

async function getUserName() {
  return (await getUserInfo()).first_name
}

function setStartHistoryState() {
  window.history.replaceState({}, '', '#start')
}

function convertHashLocationToId(hash) {
  return hash.slice(1).split('/', 1)[0]
}

function pushHistoryItem(location) {
  window.history.pushState({}, '', location)
}

function convertIdToHashLocation(id) {
  return `#${id}`
}

class App extends Component {
  static isOpenedAppFirstTime() {
    const KEY = 'oldUser'
    const isOldUser = Boolean(localStorage.getItem(KEY))
    if (isOldUser) return false
    localStorage.setItem(KEY, String(true))
    return true
  }

  constructor(props) {
    super(props)
    const showStartView = App.isOpenedAppFirstTime()
    const startView = showStartView ? 'start' : 'home'
    this.state = {
      activeView: startView,
      username: '',
      showStartView,
    }
    setStartHistoryState()
    this.setGlobalHistoryStateHandler()
  }

  async componentDidMount() {
    VKConnect.send('VKWebAppInit', {})
    this.setOnPopStateEventHandler()
    const name = await getUserName()
    this.setUserName(name)
  }

  onPopHistoryState() {
    const { hash } = window.location
    const viewId = convertHashLocationToId(hash)
    this.changeView(viewId)
  }

  setOnPopStateEventHandler() {
    window.onpopstate =
      window.basePopHistoryStateHandler || (() => this.onPopHistoryState())
  }

  setGlobalHistoryStateHandler() {
    window.basePopHistoryStateHandler = () => this.onPopHistoryState()
  }

  setUserName(username) {
    this.setState({ username })
  }

  goBackTo = (viewId) => {
    if (isSafari()) this.changeView(viewId)
    else window.history.back()
  }

  changeView(viewId) {
    this.setState({ activeView: viewId })
  }

  goHome() {
    this.changeViewAndPushHistoryItem('home')
  }

  goToThankYouView() {
    this.changeViewAndPushHistoryItem('thank-you')
  }

  goToSendRequest() {
    this.changeViewAndPushHistoryItem('sendRequest')
  }

  changeViewAndPushHistoryItem(viewId) {
    pushHistoryItem(convertIdToHashLocation(viewId))
    this.changeView(viewId)
  }

  render() {
    const { username, activeView, showStartView } = this.state
    return (
      <ErrorBoundary>
        <Root activeView={activeView}>
          <StartView
            id="start"
            onGoHome={() => this.goHome()}
            username={username}
          />
          <Home
            id="home"
            onCtaClick={() => this.goToSendRequest()}
            onBack={() => this.goBackTo('start')}
            showBackButton={showStartView}
          />
          <SendRequestView
            id="sendRequest"
            onBack={() => this.goBackTo('home')}
            onSentRequest={() => this.goToThankYouView()}
            username={username}
          />
          <ThankYouView
            id="thank-you"
            onBack={() => this.goBackTo('sendRequest')}
          />
        </Root>
      </ErrorBoundary>
    )
  }
}

export default App
