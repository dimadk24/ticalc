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
import {SendRequestPanel} from './SendRequestPanel'
import {MoneyIndicator, SummaryMoneyIndicator} from './indicators'

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

    ctaText = `Отправь заявку, мы свяжемся с тобой за час и подскажем, как привести твою ласточку в идеальное состояние :)`

    models = [{id: 1, value: 'Almera Classic (2006-2013)'}]

    modifications = [{id: 1, value: 'лучшая'}]

    oldnesses = [{id: 1, value: '15000 или 1 год'}]

    getModelSelectIndicator() {
        return (
            <Cell
                indicator={this.state.model.text}
                onClick={() => this.changePanel('chooseModel')}
            >
                Модель авто
            </Cell>
        )
    }

    getModificationSelectIndicator() {
        return (
            <Cell
                indicator={this.state.modification.text}
                onClick={() => this.changePanel('chooseModification')}
            >
                Модификация
            </Cell>
        )
    }

    getOldnessSelectIndicator() {
        return (
            <Cell
                indicator={this.state.oldness.text}
                onClick={() => this.changePanel('chooseOldness')}
            >
                Пробег или время
            </Cell>
        )
    }

    panelHeader = <PanelHeader>Расчет ТО</PanelHeader>

    getSelectIndicators() {
        return (
            <List>
                {this.getModelSelectIndicator()}
                {this.getModificationSelectIndicator()}
                {this.getOldnessSelectIndicator()}
            </List>
        )
    }

    getCalculationSelectGroup() {
        return (
            <Group title="Рассчитайте стоимость технического обслуживания машины:">
                {this.getSelectIndicators()}
            </Group>
        )
    }

    resultWorkGroup = (
        <Group title={'Работы'}>
            <MoneyIndicator text={'Покраска'} value={2000} />
            <SummaryMoneyIndicator text={'Всего по работам'} value={2000} />
        </Group>
    )
    resultMaterialGroup = (
        <Group title={'Материалы'}>
            <MoneyIndicator text={'Краска'} value={5000} />
            <SummaryMoneyIndicator text={'Всего по материалам'} value={5000} />
        </Group>
    )
    resultSummaryGroup = (
        <Group>
            <SummaryMoneyIndicator text={'Итого'} value={7000} />
        </Group>
    )
    calculationResultGroups = (
        <div>
            {this.resultWorkGroup}
            {this.resultMaterialGroup}
            {this.resultSummaryGroup}
        </div>
    )

    render() {
        return (
            <View
                id={this.props.id}
                header={true}
                activePanel={this.state.activePanel}
            >
                <Panel id="main">
                    {this.panelHeader}
                    {this.getCalculationSelectGroup()}
                    {this.calculationResultGroups}
                    <Div>
                        <p>{this.ctaText}</p>
                        <Button
                            align="center"
                            stretched
                            size="l"
                            onClick={() => this.changePanel('sendRequestPanel')}
                        >
                            Отправить заявку
                        </Button>
                    </Div>
                </Panel>
                <SweetSelect
                    id="chooseModel"
                    backClickHandler={() => this.goHome()}
                    header="Модель"
                    items={this.models}
                    onSelect={(item) => this.setSelectValue('model', item)}
                />
                <SweetSelect
                    id="chooseModification"
                    backClickHandler={() => this.goHome()}
                    header="Модификация"
                    items={this.modifications}
                    onSelect={(item) =>
                        this.setSelectValue('modification', item)
                    }
                />
                <SweetSelect
                    id="chooseOldness"
                    backClickHandler={() => this.goHome()}
                    header="Пробег или время"
                    items={this.oldnesses}
                    onSelect={(item) => this.setSelectValue('oldness', item)}
                />
                <SendRequestPanel
                    id="sendRequestPanel"
                    onBack={() => this.goHome()}
                />
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
