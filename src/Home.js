import React from 'react'
import {
    Button,
    Cell,
    Div,
    Group,
    List,
    Panel,
    PanelHeader,
    View
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import SweetSelect from './SweetSelect'
import './Home.css'
import {sendRequestPanel} from './sendRequestPanel'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    changePanel(id) {
        this.setState({activePanel: id})
    }

    goHome() {
        this.changePanel('main')
    }

    get ctaText() {
        return `Отправь заявку, мы свяжемся с тобой за час и подскажем, как привести твою ласточку в идеальное состояние :)`
    }

    render() {
        return (
            <View
                id={this.props.id}
                header={true}
                activePanel={this.state.activePanel}
            >
                <Panel id="main">
                    <PanelHeader>Расчет ТО</PanelHeader>
                    <Group title="Рассчитайте стоимость технического обслуживания машины:">
                        <List>
                            <Cell
                                indicator={this.state.model.text}
                                onClick={() => this.changePanel('chooseModel')}
                            >
                                Модель авто
                            </Cell>
                            <Cell
                                indicator={this.state.modification.text}
                                onClick={() =>
                                    this.changePanel('chooseModification')
                                }
                            >
                                Модификация
                            </Cell>
                            <Cell
                                indicator={this.state.oldness.text}
                                onClick={() =>
                                    this.changePanel('chooseOldness')
                                }
                            >
                                Пробег или время
                            </Cell>
                        </List>
                    </Group>
                    <Group title={'Работы'}>
                        <Cell indicator={'2000 руб'} className={'info'}>
                            Покраска
                        </Cell>
                        <Cell indicator={'2000 руб'} className={'info summary'}>
                            Всего по работам
                        </Cell>
                    </Group>
                    <Group title={'материалы'}>
                        <Cell indicator={'5000 руб'} className={'info'}>
                            Краска
                        </Cell>
                        <Cell indicator={'5000 руб'} className={'info summary'}>
                            Всего по материалам
                        </Cell>
                    </Group>
                    <Group>
                        <Cell indicator={'7000 руб'} className={'info summary'}>
                            Итого
                        </Cell>
                    </Group>
                    <Div>
                        <p>{this.ctaText}</p>
                        <Button
                            align="center"
                            stretched
                            size="l"
                            onClick={() => this.changePanel('sendRequest')}
                        >
                            Отправить заявку
                        </Button>
                    </Div>
                </Panel>
                <SweetSelect
                    id="chooseModel"
                    backClickHandler={() => this.goHome()}
                    header="Модель"
                    items={[{id: 1, value: 'Almera Classic (2006-2013)'}]}
                    onSelect={(item) => this.setSelectValue('model', item)}
                />
                <SweetSelect
                    id="chooseModification"
                    backClickHandler={() => this.goHome()}
                    header="Модификация"
                    items={[{id: 1, value: 'лучшая'}]}
                    onSelect={(item) =>
                        this.setSelectValue('modification', item)
                    }
                />
                <SweetSelect
                    id="chooseOldness"
                    backClickHandler={() => this.goHome()}
                    header="Пробег или время"
                    items={[{id: 1, value: '15000 или 1 год'}]}
                    onSelect={(item) => this.setSelectValue('oldness', item)}
                />
                <sendRequestPanel onBack={() => this.goHome()} />
            </View>
        )
    }

    setSelectValue(key, item) {
        this.setState({
            [key]: this.convertFromSweetSelectToHomeItemsFormat(item)
        })
    }

    getInitialState() {
        const state = {}
        state.activePanel = 'main'
        Object.assign(state, this.getDefaultSelectState('Выбрать'))
        return state
    }

    convertFromSweetSelectToHomeItemsFormat(item) {
        return {
            id: item.id,
            text: item.value
        }
    }

    getDefaultSelectState(text) {
        return {
            model: {id: 0, text},
            modification: {id: 0, text},
            oldness: {id: 0, text}
        }
    }
}

export default Home
