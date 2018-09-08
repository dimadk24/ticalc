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

        this.state = {
            activeView: 'start'
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
                <Home id="home" onCtaClick={() => this.goToSendRequest()} onBack={()=> this.goToStart()}/>
                <SendRequestView
                    id="sendRequest"
                    onBack={() => this.goHome()}
                />
                <StartView id={'start'} onGoHome={() => this.goHome()} />
            </Root>
        )
    }

    goToSendRequest() {
        this.changeView('sendRequest')
    }

    changeView(id) {
        this.setState({activeView: id})
    }

    goToStart() {
        this.changeView('start')
    }
}

export default App
