import React from 'react'
import {Button, Div, Group, Header, List, Panel, ScreenSpinner, View} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import SweetSelect from '../SweetSelect/SweetSelect'
import {Indicator, MoneyIndicator, SummaryMoneyIndicator} from '../Indicators/indicators'
import PropTypes from 'prop-types'
import {convertModifications, convertResults, doPostRequest, reachGoal} from '../helpers/helpers'
import {HeaderWithBackButton} from '../helpers/HeaderWithBackButton'

let state = {
    calculationResults: {
        status: 'notSelected',
        works: [],
        materials: []
    },
    popout: null
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
        onCtaClick: PropTypes.func,
        onBack: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = state
        const viewId = this.props.id
        state.activePanel = `${viewId}main`
        window.onpopstate = () => this.onPopHistoryState()

        window.history.replaceState({}, '', `#${viewId}/${viewId}main`)
    }

    onPopHistoryState() {
        const hash = window.location.hash
        if (!this.isHomeView(hash)) window.basePopHistoryStateHandler()
        else this.viewPopStateHandler()
    }

    get resultsStatus() {
        return this.state.calculationResults.status
    }

    changePanelAndPushHistoryState(panelId) {
        this.pushHistoryItem(this.convertIdToHashLocation(panelId))
        this.changePanel(panelId)
    }

    changePanel(panelId) {
        this.setState({activePanel: panelId})
    }

    pushHistoryItem(location) {
        window.history.pushState({}, '', location)
    }

    componentWillUnmount() {
        state = this.state
        window.onpopstate = window.basePopHistoryStateHandler
        window.calculationResults = state.calculationResults
        window.input = {
            model: this.state.model,
            modification: this.state.modification,
            oldness: this.state.oldness
        }
    }
    goBack() {
        window.history.back()
    }

    ctaText = `Отправьте заявку, наши сотрудники свяжутся с вами для записи на техническое обслуживание автомобиля Nissan`

    models = [
        {id: 43, value: 'Almera Classic (2006-2013)'},
        {id: 44, value: 'Almera New (с 2012)'},
        {id: 45, value: 'Juke (с 2011)'},
        {id: 46, value: 'Micra (с 2002)'},
        {id: 47, value: 'Murano (2008-2015)'},
        {id: 48, value: 'Murano (с 2015)'},
        {id: 49, value: 'Navara (с 2010)'},
        {id: 50, value: 'Note (2006-2014)'},
        {id: 51, value: 'Pathfinder (2010-2013)'},
        {id: 52, value: 'Pathfinder (с 2013)'},
        {id: 53, value: 'Qashqai (2006-2013)'},
        {id: 54, value: 'Qashqai (с 2013)'},
        {id: 55, value: 'Teana (2008-2013)'},
        {id: 56, value: 'Teana (с 2013)'},
        {id: 57, value: 'Terrano (с 2013)'},
        {id: 58, value: 'Tiida (2004-2015)'},
        {id: 60, value: 'X-Trail (2010-2014)'},
        {id: 61, value: 'X-Trail (с 2014)'},
        {id: 62, value: 'Sentra (с 2014)'}
    ]

    modifications = []

    oldnesses = [
        {id: 1, value: '15000 или 1 год'},
        {id: 2, value: '30000 или 2 года'},
        {id: 3, value: '45000 или 3 года'},
        {id: 4, value: '60000 или 4 года'},
        {id: 5, value: '75000 или 5 лет'},
        {id: 6, value: '90000 или 6 лет'},
        {id: 7, value: '105000 или 7 лет'},
        {id: 8, value: '120000 или 8 лет'},
        {id: 9, value: '13500 или 9 лет'},
        {id: 10, value: '150000 или 10 лет'}
    ]

    getModelSelectIndicator() {
        return (
            <Indicator
                text={'Модель авто'}
                value={this.state.model.text}
                onClick={() =>
                    this.changePanelAndPushHistoryState('chooseModel')
                }
            />
        )
    }

    getModificationSelectIndicator() {
        return (
            <Indicator
                text={'Модификация'}
                value={this.state.modification.text}
                onClick={() =>
                    this.changePanelAndPushHistoryState('chooseModification')
                }
            />
        )
    }

    getOldnessSelectIndicator() {
        return (
            <Indicator
                text={'Пробег или время'}
                value={this.state.oldness.text}
                onClick={() =>
                    this.changePanelAndPushHistoryState('chooseOldness')
                }
            />
        )
    }

    headerText = 'Расчет ТО Ниссан'
    panelHeader = (
        <HeaderWithBackButton
            text={this.headerText}
            onBackButtonClick={() => this.props.onBack()}
        />
    )

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
                    Рассчитайте стоимость технического обслуживания вашего
                    Nissan:
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

    reachCtaClickGoal() {
        reachGoal('open-send-request')
    }

    onCtaClick = () => {
        try {
            this.reachCtaClickGoal()
        } catch (e) {}
        this.props.onCtaClick()
    }

    ctaButton = (
        <Button align="center" stretched size="l" onClick={this.onCtaClick}>
            Отправить заявку
        </Button>
    )

    ctaComponent = (
        <Div>
            <p>{this.ctaText}</p>
            {this.ctaButton}
        </Div>
    )

    reachModelSelectedGoal() {
        reachGoal('selected-model')
    }

    reachModificationSelectedGoal() {
        reachGoal('selected-modification')
    }

    reachOldnessSelectedGoal() {
        reachGoal('selected-oldness')
    }

    render() {
        return (
            <View
                id={this.props.id}
                activePanel={this.state.activePanel}
                header
                popout={this.state.popout}
            >
                <Panel id={this.props.id + 'main'}>
                    {this.panelHeader}
                    {this.getCalculationSelectGroup()}
                    {this.getCalculationResults()}
                    {this.ctaComponent}
                </Panel>
                <SweetSelect
                    id="chooseModel"
                    backClickHandler={() => this.goBack()}
                    header="Модель"
                    items={this.models}
                    onSelect={async (item) => {
                        this.showSpinner()
                        try {
                            this.reachModelSelectedGoal()
                        } catch (e) {}
                        this.resetModification()
                        await this.setModifications(item.id)
                        this.setSelectValueAndTryToCalculateResults(
                            'model',
                            item
                        )
                        this.removeSpinner()
                    }}
                />
                <SweetSelect
                    id="chooseModification"
                    backClickHandler={() => this.goBack()}
                    header="Модификация"
                    items={this.modifications}
                    onSelect={(item) => {
                        try {
                            this.reachModificationSelectedGoal()
                        } catch (e) {}
                        this.setSelectValueAndTryToCalculateResults(
                            'modification',
                            item
                        )
                    }}
                />
                <SweetSelect
                    id="chooseOldness"
                    backClickHandler={() => this.goBack()}
                    header="Пробег или время"
                    items={this.oldnesses}
                    onSelect={(item) => {
                        try {
                            this.reachOldnessSelectedGoal()
                        } catch (e) {}
                        this.setSelectValueAndTryToCalculateResults(
                            'oldness',
                            item
                        )
                    }}
                />
            </View>
        )
    }

    resetModification() {
        this.setState({modification: {id: 0, text: 'Выбрать'}})
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

    async tryToCalculateResults() {
        if (this.allSelected()) {
            await this.calculateResults()
        }
    }

    async calculateResults() {
        this.setLoadingStatus()
        let results
        try {
            results = await this.loadResults(
                this.state.model.id,
                this.state.modification.id,
                this.state.oldness.id
            )
        } catch (err) {}
        results = convertResults(results)
        this.setCalculationResults(results)
    }

    async loadResults(model, modification, oldness) {
        return (await doPostRequest(`/ajax/to.php`, {
            SECTION: model,
            TIME: oldness,
            AUTO: modification
        })).data
    }

    setLoadingStatus() {
        this.setState((state) => {
            Object.assign(state.calculationResults, {status: 'loading'})
            return state
        })
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

    async setModifications(modelId) {
        let modifications
        try {
            modifications = await this.loadModifications(modelId)
        } catch (err) {}
        this.modifications = convertModifications(modifications)
        this.setState({
            modification: this.convertFromSweetSelectToHomeItemsFormat(
                this.modifications[0]
            )
        })
    }

    async loadModifications(modelId) {
        return (await doPostRequest(`/ajax/model.php`, {
            ID: modelId
        })).data
    }

    showSpinner() {
        this.setState({popout: <ScreenSpinner />})
    }

    removeSpinner() {
        this.setState({popout: null})
    }

    setCalculationResults(results) {
        this.setState({
            calculationResults: {
                status: 'ready',
                ...results
            }
        })
    }

    isHomeView(url) {
        return url.includes('home')
    }

    viewPopStateHandler() {
        const hash = window.location.hash
        const panelId = this.convertLocationToPanelId(hash)
        this.changePanel(panelId)
    }

    convertIdToHashLocation(id) {
        return `#home/${id}`
    }

    convertLocationToPanelId(url) {
        return url.split('/', 2)[1]
    }
}
export {Home}
