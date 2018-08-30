import React from 'react'
import {
    Button,
    Cell,
    Div,
    Group,
    Header,
    List,
    Panel,
    PanelHeader,
    View
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import SweetSelect from './SweetSelect'
import {MoneyIndicator, SummaryMoneyIndicator} from './indicators'
import PropTypes from 'prop-types'

let state = {
    calculationResults: {ready: false}
}
Object.assign(state, getDefaultSelectState('Выбрать'))

function getDefaultSelectState(text) {
    return {
        model: {id: 0, text},
        modification: {id: 0, text},
        oldness: {id: 0, text}
    }
}

class Home extends React.Component {
    static propTypes = {
        onCtaClick: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = state
        state.activePanel = this.props.id + 'main'
    }

    changePanel(id) {
        this.setState({activePanel: id})
    }

    componentWillUnmount() {
        state = this.state
    }

    goHome() {
        this.changePanel(this.props.id + 'main')
    }

    ctaText = `Отправьте заявку, мы свяжемся с вами за час и подскажем, как привести вашу ласточку в идеальное состояние :)`

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

    getSelectIndicatorList() {
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
            <Group>
                <Header>
                    Рассчитайте стоимость технического обслуживания машины:
                </Header>
                {this.getSelectIndicatorList()}
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

    ctaButton = (
        <Button
            align="center"
            stretched
            size="l"
            onClick={() => this.props.onCtaClick()}
        >
            Отправить заявку
        </Button>
    )

    ctaComponent = (
        <Div>
            <p>{this.ctaText}</p>
            {this.ctaButton}
        </Div>
    )

    render() {
        return (
            <View
                id={this.props.id}
                activePanel={this.state.activePanel}
                header
            >
                <Panel id={this.props.id + 'main'}>
                    {this.panelHeader}
                    {this.getCalculationSelectGroup()}
                    {this.ifCalculationResultsReady() &&
                        this.calculationResultGroups}
                    {this.ctaComponent}
                </Panel>
                <SweetSelect
                    id="chooseModel"
                    backClickHandler={() => this.goHome()}
                    header="Модель"
                    items={this.models}
                    onSelect={(item) =>
                        this.setSelectValueAndTryToCalculateResults(
                            'model',
                            item
                        )
                    }
                />
                <SweetSelect
                    id="chooseModification"
                    backClickHandler={() => this.goHome()}
                    header="Модификация"
                    items={this.modifications}
                    onSelect={(item) =>
                        this.setSelectValueAndTryToCalculateResults(
                            'modification',
                            item
                        )
                    }
                />
                <SweetSelect
                    id="chooseOldness"
                    backClickHandler={() => this.goHome()}
                    header="Пробег или время"
                    items={this.oldnesses}
                    onSelect={(item) =>
                        this.setSelectValueAndTryToCalculateResults(
                            'oldness',
                            item
                        )
                    }
                />
            </View>
        )
    }

    ifCalculationResultsReady() {
        return this.state.calculationResults.ready
    }

    setSelectValueAndTryToCalculateResults(key, item) {
        this.setState(
            {[key]: this.convertFromSweetSelectToHomeItemsFormat(item)},
            this.tryToCalculateResults
        )
    }
    convertFromSweetSelectToHomeItemsFormat(item) {
        return {
            id: item.id,
            text: item.value
        }
    }

    tryToCalculateResults() {
        if (this.allSelected()) {
            this.setState({calculationResults: {ready: true}})
        }
    }

    allSelected() {
        return (
            this.getSelectedModelId() &&
            this.getSelectedModificationId() &&
            this.getSelectedOldnessId()
        )
    }

    getSelectedOldnessId() {
        return this.state.oldness.id
    }

    getSelectedModificationId() {
        return this.state.modification.id
    }

    getSelectedModelId() {
        return this.state.model.id
    }
}

export default Home
