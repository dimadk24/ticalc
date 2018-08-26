import React from 'react'
import * as VKConnect from '@vkontakte/vkui-connect'
import {Root} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'

import Home from './Home'

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

    render() {
        return (
            <Root activeView={this.state.activeView}>
                <Home id="home" />
            </Root>
        )
    }
}

export default App
