import React from 'react'
import {PanelHeader, Group, Button, Div, Panel, View} from '@vkontakte/vkui'
import PropTypes from 'prop-types'
import logo from '../logo.png'
import './StartView.css'
import {getUserInfo} from '../helpers/helpers'

class StartView extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        onGoHome: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {
            activePanel: `${this.props.id}main`,
            name: ''
        }
    }

    async componentWillMount() {
        const name = await this.getUserName()
        this.setUserName(name)
    }

    setUserName(name) {
        this.setState({name: name})
    }

    async getUserName() {
        return (await getUserInfo()).first_name
    }

    headerText = 'Расчет ТО Ниссан в СПб'

    render() {
        return (
            <View id={this.props.id} activePanel={this.state.activePanel}>
                <Panel id={`${this.props.id}main`}>
                    <PanelHeader>{this.headerText}</PanelHeader>
                    <Group>
                        <Div>
                            <div className={'centerring-wrapper'}>
                                <img src={logo} alt="Логотип Я Сервис" />
                            </div>
                            <div>
                                {this.getGreeting()}
                                {this.getText()}
                            </div>
                            <Button
                                stretched
                                size={'xl'}
                                onClick={() => this.props.onGoHome()}
                            >
                                Рассчитать стоимость ТО
                            </Button>
                        </Div>
                    </Group>
                </Panel>
            </View>
        )
    }

    getText() {
        const name = this.state.name
        let text
        if (name) text = `${name}, выберите`
        else text = `Выберите`
        text +=
            ' свой автомобиль Nissan и узнайте стоимость обслуживания согласно пробегу или году'
        return <p>{text}</p>
    }

    getGreeting() {
        const name = this.state.name
        const greetingPhrase = 'Здравствуйте'
        const greeting = name
            ? `${greetingPhrase}, ${name}!`
            : `${greetingPhrase}!`
        return <p>{greeting} Вы из СПб, и у вас Ниссан?</p>
    }
}

export {StartView}
