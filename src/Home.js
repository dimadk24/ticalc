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
    ScreenSpinner,
    View
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import SweetSelect from './SweetSelect'
import {MoneyIndicator, SummaryMoneyIndicator} from './indicators'
import PropTypes from 'prop-types'

let state = {
    calculationResults: {
        status: 'notSelected',
        works: [],
        materials: []
    }
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

    get resultsStatus() {
        return this.state.calculationResults.status
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

    getResultWorkGroup() {
        return (
            <Group title={'Работы'}>
                {this.state.calculationResults.works.map((item, index) => (
                    <MoneyIndicator
                        text={item.name}
                        value={item.price}
                        key={index}
                    />
                ))}
                {
                    <SummaryMoneyIndicator
                        text={'Всего по работам'}
                        value={this.getSummaryValue('works')}
                    />
                }
            </Group>
        )
    }

    getResultMaterialGroup() {
        return (
            <Group title={'Материалы'}>
                {this.state.calculationResults.materials.map((item, index) => (
                    <MoneyIndicator
                        text={item.name}
                        value={item.price}
                        key={index}
                    />
                ))}

                <SummaryMoneyIndicator
                    text={'Всего по материалам'}
                    value={this.getSummaryValue('materials')}
                />
            </Group>
        )
    }

    getSummaryValue(thing) {
        return this.state.calculationResults[thing].reduce(
            (accumulator, currentValue) => accumulator + currentValue.price,
            0
        )
    }

    getResultSummaryGroup() {
        return (
            <Group>
                <SummaryMoneyIndicator
                    text={'Итого'}
                    value={
                        this.getSummaryValue('works') +
                        this.getSummaryValue('materials')
                    }
                />
            </Group>
        )
    }

    getCalculationResultGroups() {
        return (
            <div>
                {this.resultsStatus === 'ready' && (
                    <div>
                        {this.getResultWorkGroup()}
                        {this.getResultMaterialGroup()}
                        {this.getResultSummaryGroup()}
                    </div>
                )}
            </div>
        )
    }

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
                    {this.getCalculationResults()}
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
            this.calculateResults()
        }
    }

    calculateResults() {
        this.setState((state) => {
            Object.assign(state.calculationResults, {status: 'loading'})
            return state
        })
        setTimeout(
            () =>
                this.setState({
                    calculationResults: {
                        status: 'ready',
                        works: [{name: 'Покраска', price: 2000}],
                        materials: [{name: 'Краска', price: 5000}]
                    }
                }),
            1000
        )
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

    getCalculationResults() {
        const switcher = {
            notSelected: null,
            loading: this.getSpinner(),
            ready: this.getCalculationResultGroups()
        }
        return switcher[this.resultsStatus]
    }

    getSpinner() {
        return <ScreenSpinner />
    }
}

export default Home
