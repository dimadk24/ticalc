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

    render() {
        return (
            <View id={this.props.id} activePanel={this.state.activePanel}>
                <Panel id={`${this.props.id}main`}>
                    <PanelHeader>Калькулятор ТО Ниссан</PanelHeader>
                    <Group>
                        <Div>
                            <div className={'centerring-wrapper'}>
                                <img src={logo} alt="Логотип Я Сервис" />
                            </div>
                            <div>
                                <p>{this.getPersonalizedGreeting()}</p>
                                <p>
                                    Здесь вы можете рассчитать стоимость и
                                    записаться на техническое обслуживание (ТО)
                                    автомобилей Ниссан (Nissan) в
                                    Санкт-Петербурге.
                                </p>
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

    getPersonalizedGreeting() {
        const name = this.state.name
        const greeting = name
            ? `Добро пожаловать, ${name}!`
            : 'Добро пожаловать!'
        return `${greeting} Вы из СПб, и у вас Ниссан?`
    }
}

export {StartView}
