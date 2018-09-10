import React from 'react'
import * as VKConnect from '@vkontakte/vkui-connect'
import {Root} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'

import {Home} from './Home/Home'
import {SendRequestView} from './SendRequestView/SendRequestView'
import {StartView} from './StartView/StartView'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {activeView: 'start'}
        this.setStartHistoryState()
        this.setOnPopStateEventHandler()
    }

    setOnPopStateEventHandler() {
        window.onpopstate = () => this.onPopHistoryState()
    }

    onPopHistoryState() {
        const hash = window.location.hash
        const viewId = this.convertHashLocationToId(hash)
        this.changeView(viewId)
        console.log(viewId)
    }

    changeView(viewId) {
        this.setState({activeView: viewId})
    }

    setStartHistoryState() {
        window.history.replaceState({}, '', '#start')
    }

    componentWillMount() {
        VKConnect.send('VKWebAppInit', {})
    }

    goHome() {
        this.changeViewAndPushHistoryItem('home')
    }

    render() {
        return (
            <Root activeView={this.state.activeView}>
                <Home
                    id="home"
                    onCtaClick={() => this.goToSendRequest()}
                    onBack={() => this.goBack()}
                />
                <SendRequestView
                    id="sendRequest"
                    onBack={() => this.goBack()}
                />
                <StartView id={'start'} onGoHome={() => this.goHome()} />
            </Root>
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
        return hash.slice(1)
    }

    pushHistoryItem(location) {
        window.history.pushState({}, '', location)
    }
}

export default App
