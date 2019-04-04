import React, { Component } from 'react'
import * as VKConnect from '@vkontakte/vkui-connect'
import { Root } from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import Home from './Home/Home'
import SendRequestView from './SendRequestView/SendRequestView'
import StartView from './StartView/StartView'
import ErrorBoundary from './helpers/ErrorBoundary/ErrorBoundary'
import ThankYouView from './ThankYouView/ThankYouView'
import { getUserInfo } from './helpers/helpers'

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

function goBack() {
  window.history.back()
}

function convertIdToHashLocation(id) {
  return `#${id}`
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeView: 'start',
      username: '',
    }
    setStartHistoryState()
    this.setGlobalHistoryStateHandler()
  }

  async componentWillMount() {
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
    const { username, activeView } = this.state
    return (
      <ErrorBoundary>
        <Root activeView={activeView}>
          <Home
            id="home"
            onCtaClick={() => this.goToSendRequest()}
            onBack={() => goBack()}
          />
          <SendRequestView
            id="sendRequest"
            onBack={() => goBack()}
            onSentRequest={() => this.goToThankYouView()}
            username={username}
          />
          <StartView
            id="start"
            onGoHome={() => this.goHome()}
            username={username}
          />
          <ThankYouView id="thank-you" onBack={() => goBack()} />
        </Root>
      </ErrorBoundary>
    )
  }
}

export default App
