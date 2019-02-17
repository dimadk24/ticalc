import React from 'react'
import {Button, Div, Group, Panel, PanelHeader, View} from '@vkontakte/vkui'
import PropTypes from 'prop-types'
import logo from '../logo.png'
import './StartView.css'
import {reachGoal} from '../helpers/helpers'

class StartView extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        onGoHome: PropTypes.func,
        username: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            activePanel: `${this.props.id}main`
        }
    }

    onGoHome = () => {
        try {
            this.reachStatisticGoal()
        } catch (e) {}
        this.props.onGoHome()
    }

    headerText = 'Расчет ТО Ниссан в СПб'

    reachStatisticGoal() {
        reachGoal('open-home')
    }

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
                                onClick={this.onGoHome}
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
        const {username: name} = this.props
        let text
        if (name) text = `${name}, выберите`
        else text = `Выберите`
        text +=
            ' свой автомобиль Nissan и узнайте стоимость обслуживания согласно пробегу или году'
        return <p>{text}</p>
    }

    getGreeting() {
        const {username: name} = this.props
        const greetingPhrase = 'Здравствуйте'
        const greeting = name
            ? `${greetingPhrase}, ${name}!`
            : `${greetingPhrase}!`
        return <p>{greeting} Вы из СПб, и у вас Ниссан?</p>
    }
}

export {StartView}
