import React from 'react'
import * as VKConnect from '@vkontakte/vkui-connect'
import {Root} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'

import {Home} from './Home/Home'
import {SendRequestView} from './SendRequestView/SendRequestView'
import {StartView} from './StartView/StartView'
import ErrorBoundary from './helpers/ErrorBoundary'
import {ThankYouView} from './ThankYouView/ThankYouView'
import {getUserInfo} from './helpers/helpers'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeView: 'start',
            username: ''
        }
        this.setStartHistoryState()
        this.setGlobalHistoryStateHandler()
    }

    async componentWillMount() {
        VKConnect.send('VKWebAppInit', {})
        this.setOnPopStateEventHandler()
        const name = await this.getUserName()
        this.setUserName(name)
    }

    setGlobalHistoryStateHandler() {
        window.basePopHistoryStateHandler = () => this.onPopHistoryState()
    }

    setOnPopStateEventHandler() {
        window.onpopstate =
            window.basePopHistoryStateHandler ||
            (() => this.onPopHistoryState())
    }

    onPopHistoryState() {
        const hash = window.location.hash
        const viewId = this.convertHashLocationToId(hash)
        this.changeView(viewId)
    }

    changeView(viewId) {
        this.setState({activeView: viewId})
    }

    setStartHistoryState() {
        window.history.replaceState({}, '', '#start')
    }

    setUserName(username) {
        this.setState({username})
    }

    async getUserName() {
        return (await getUserInfo()).first_name
    }

    goHome() {
        this.changeViewAndPushHistoryItem('home')
    }

    goToThankYouView() {
        this.changeViewAndPushHistoryItem('thank-you')
    }

    render() {
        const {username} = this.state
        return (
            <ErrorBoundary>
                <Root activeView={this.state.activeView}>
                    <Home
                        id="home"
                        onCtaClick={() => this.goToSendRequest()}
                        onBack={() => this.goBack()}
                    />
                    <SendRequestView
                        id="sendRequest"
                        onBack={() => this.goBack()}
                        onSentRequest={() => this.goToThankYouView()}
                        username={username}
                    />
                    <StartView
                        id={'start'}
                        onGoHome={() => this.goHome()}
                        username={username}
                    />
                    <ThankYouView
                        id={'thank-you'}
                        onBack={() => this.goBack()}
                    />
                </Root>
            </ErrorBoundary>
        )
    }

    goBack() {
        window.history.back()
    }

    goToSendRequest() {
        this.changeViewAndPushHistoryItem('sendRequest')
    }

    changeViewAndPushHistoryItem(viewId) {
        this.pushHistoryItem(this.convertIdToHashLocation(viewId))
        this.changeView(viewId)
    }

    convertIdToHashLocation(id) {
        return `#${id}`
    }

    convertHashLocationToId(hash) {
        return hash.slice(1).split('/', 1)[0]
    }

    pushHistoryItem(location) {
        window.history.pushState({}, '', location)
    }
}

export default App
