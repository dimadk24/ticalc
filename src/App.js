import React from 'react'
import * as VKConnect from '@vkontakte/vkui-connect'
import {Root} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'

import {Home} from './Home/Home'
import {SendRequestView} from './SendRequestView/SendRequestView'
import {StartView} from './StartView/StartView'
import ErrorBoundary from './helpers/ErrorBoundary'
import {ThankYouView} from './ThankYouView/ThankYouView'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {activeView: 'start'}
        this.setStartHistoryState()
        this.setGlobalHistoryStateHandler()
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

    componentWillMount() {
        VKConnect.send('VKWebAppInit', {})
        this.setOnPopStateEventHandler()
    }

    goHome() {
        this.changeViewAndPushHistoryItem('home')
    }

    goToThankYouView() {
        this.changeViewAndPushHistoryItem('thank-you')
    }

    render() {
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
                    />
                    <StartView id={'start'} onGoHome={() => this.goHome()} />
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
