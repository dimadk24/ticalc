import React from 'react'
import {Cell, Group, List, Panel, PanelHeader, View} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import SweetSelect from './SweetSelect'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activePanel: 'main'
        }
    }

    changePanel(id) {
        this.setState({activePanel: id})
    }

    goHome() {
        this.changePanel('main')
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
                                indicator="Выбрать"
                                onClick={() => this.changePanel('chooseModel')}
                            >
                                Модель авто
                            </Cell>
                            <Cell
                                indicator="Выбрать"
                                onClick={() =>
                                    this.changePanel('chooseModification')
                                }
                            >
                                Модификация
                            </Cell>
                            <Cell
                                indicator="Выбрать"
                                onClick={() => this.changePanel('chooseTime')}
                            >
                                Пробег или время
                            </Cell>
                        </List>
                    </Group>
                </Panel>
                <SweetSelect
                    id="chooseModel"
                    backClickHandler={() => this.goHome()}
                    header="Select model"
                    items={[{id: 1, value: 'panamera'}]}
                    onSelect={(item) => console.log(item)}
                />
                <SweetSelect
                    id="chooseModification"
                    backClickHandler={() => this.goHome()}
                    header="Select modification"
                    items={[{id: 1, value: 'cool'}]}
                    onSelect={(item) => console.log(item)}
                />
                <SweetSelect
                    id="chooseTime"
                    backClickHandler={() => this.goHome()}
                    header="Select Time"
                    items={[{id: 1, value: '1k'}]}
                    onSelect={(item) => console.log(item)}
                />
            </View>
        )
    }
}

export default Home
