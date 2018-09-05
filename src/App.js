import React from 'react'
import * as VKConnect from '@vkontakte/vkui-connect'
import {Root} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'

import {Home} from './Home'
import {SendRequestView} from './SendRequestView'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeView: 'home'
        }
    }

    componentWillMount() {
        VKConnect.send('VKWebAppInit', {})
    }

    goHome() {
        this.changeView('home')
    }

    render() {
        return (
            <Root activeView={this.state.activeView}>
                <Home id="home" onCtaClick={() => this.goToSendRequestView()} />
                <SendRequestView
                    id="sendRequest"
                    onBack={() => this.goHome()}
                />
            </Root>
        )
    }

    goToSendRequestView() {
        this.changeView('sendRequest')
    }

    changeView(id) {
        this.setState({activeView: id})
    }
}

export default App
