import React from 'react'
import {
  Button,
  Div,
  Group,
  Header,
  List,
  Panel,
  ScreenSpinner,
  View,
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import PropTypes from 'prop-types'
import Icon24Delete from '@vkontakte/icons/dist/24/delete'
import SweetSelect from '../SweetSelect/SweetSelect'
import {
  Indicator,
  MoneyIndicator,
  SummaryMoneyIndicator,
} from '../Indicators/indicators'
import {
  convertModifications,
  convertResults,
  doPostRequest,
  sleep,
} from '../helpers/helpers'
import HeaderWithBackButton from '../helpers/HeaderWithBackButton'
import { isProduction, reachGoal } from '../helpers/production_utils'
import mockModifications from '../_mocks_/modifications'
import mockCalculationResults from '../_mocks_/calculation_results'
import productionModels from '../data/models'
import productionOldnesses from '../data/oldnesses'
import NetworkErrorAlert from '../helpers/NetworkErrorAlert'

function getDefaultSelectState(text) {
  return {
    model: { id: 0, text },
    modification: { id: 0, text },
    oldness: { id: 0, text },
  }
}

const defaultState = {
  calculationResults: {
    status: 'notSelected',
    works: [],
    materials: [],
  },
  popout: null,
  modifications: [],
  ...getDefaultSelectState('Выбрать'),
}

let state = defaultState

function goBack() {
  window.history.back()
}

function reachModelSelectedGoal() {
  reachGoal('selected-model')
}

function reachModificationSelectedGoal() {
  reachGoal('selected-modification')
}

function reachOldnessSelectedGoal() {
  reachGoal('selected-oldness')
}

function reachCtaClickGoal() {
  reachGoal('open-send-request')
}

function convertFromSweetSelectToHomeItemsFormat(item) {
  return {
    id: item.id,
    text: item.value,
  }
}

function isHomeView(url) {
  return url.includes('home')
}

function convertIdToHashLocation(id) {
  return `#home/${id}`
}

function convertLocationToPanelId(url) {
  return url.split('/', 2)[1]
}

async function loadModifications(modelId) {
  if (isProduction)
    return (await doPostRequest(`/ajax/model.php`, {
      ID: modelId,
    })).data
  await sleep(0.2)
  return mockModifications
}

function pushHistoryItem(location) {
  window.history.pushState({}, '', location)
}

async function loadResults(model, modification, oldness) {
  if (isProduction)
    return (await doPostRequest(`/ajax/to.php`, {
      SECTION: model,
      TIME: oldness,
      AUTO: modification,
    })).data
  await sleep(0.5)
  return mockCalculationResults
}

class Home extends React.Component {
  static propTypes = {
    onCtaClick: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
  }

  ctaText = `Отправьте заявку, наши сотрудники свяжутся с Вами для записи на техническое обслуживание автомобиля Nissan`

  models = productionModels

  oldnesses = productionOldnesses

  headerText = 'Расчет ТО Ниссан'

  // had to suppress eslint cause we need this function in ctaButton property
  // so it has to be declared before it.
  // we need to remove it when ctaButton will be standalone component,
  // and not just property
  // eslint-disable-next-line react/sort-comp
  onCtaClick = () => {
    const { onCtaClick } = this.props
    reachCtaClickGoal()
    onCtaClick()
  }

  ctaButton = (
    <Button stretched size="xl" onClick={this.onCtaClick}>
      Отправить заявку
    </Button>
  )

  ctaComponent = (
    <Div>
      <p>{this.ctaText}</p>
      {this.ctaButton}
    </Div>
  )

  constructor(props) {
    super(props)
    this.state = state
    const { id: viewId } = this.props
    state.activePanel = `${viewId}main`
    window.onpopstate = () => this.onPopHistoryState()

    window.history.replaceState({}, '', `#${viewId}/${viewId}main`)
  }

  componentDidMount() {
    this.setState({ ...state })
  }

  componentWillUnmount() {
    ;({ state } = this)
    const { calculationResults, model, modification, oldness } = this.state
    window.onpopstate = window.basePopHistoryStateHandler
    window.calculationResults = calculationResults
    window.input = {
      model,
      modification,
      oldness,
    }
  }

  onPopHistoryState() {
    const { hash } = window.location
    if (!isHomeView(hash)) window.basePopHistoryStateHandler()
    else this.viewPopStateHandler()
  }

  getPanelHeader = () => {
    const { onBack } = this.props
    return (
      <HeaderWithBackButton
        text={this.headerText}
        onBackButtonClick={() => onBack()}
      />
    )
  }

  get resultsStatus() {
    const { calculationResults } = this.state
    return calculationResults.status
  }

  getModelSelectIndicator() {
    const { model } = this.state
    return (
      <Indicator
        text="Модель авто"
        value={model.text}
        onClick={() => this.changePanelAndPushHistoryState('chooseModel')}
      />
    )
  }

  getModificationSelectIndicator() {
    const { modification } = this.state
    return (
      <Indicator
        text="Модификация"
        value={modification.text}
        onClick={() =>
          this.changePanelAndPushHistoryState('chooseModification')
        }
      />
    )
  }

  getOldnessSelectIndicator() {
    const { oldness } = this.state
    return (
      <Indicator
        text="Пробег или год выпуска"
        value={oldness.text}
        onClick={() => this.changePanelAndPushHistoryState('chooseOldness')}
      />
    )
  }

  getSelectIndicatorList() {
    return (
      <List>
        {this.getModelSelectIndicator()}
        {Boolean(this.getSelectedModelId()) &&
          this.getModificationSelectIndicator()}
        {this.getOldnessSelectIndicator()}
      </List>
    )
  }

  getCalculationSelectGroup() {
    return (
      <Group>
        <Div>
          <Button
            size="xl"
            level="outline"
            className="reset-button"
            before={<Icon24Delete />}
            onClick={this.resetAll}
          >
            <span>Сбросить все</span>
          </Button>
        </Div>
        <Header>
          Рассчитайте стоимость технического обслуживания вашего Nissan:
        </Header>
        {this.getSelectIndicatorList()}
      </Group>
    )
  }

  getResultWorkGroup() {
    const { calculationResults } = this.state
    return (
      <Group title="Работы">
        {calculationResults.works.map(({ name, price }) => (
          <MoneyIndicator text={name} value={price} key={name} />
        ))}
        {
          <SummaryMoneyIndicator
            text="Всего по работам"
            value={this.getSummaryValue('works')}
          />
        }
      </Group>
    )
  }

  getResultMaterialGroup() {
    const { calculationResults } = this.state
    return (
      <Group title="Материалы">
        {calculationResults.materials.map(({ name, price }) => (
          <MoneyIndicator text={name} value={price} key={name} />
        ))}

        <SummaryMoneyIndicator
          text="Всего по материалам"
          value={this.getSummaryValue('materials')}
        />
      </Group>
    )
  }

  getSummaryValue(thing) {
    const { calculationResults } = this.state
    return calculationResults[thing].reduce(
      (accumulator, currentValue) => accumulator + currentValue.price,
      0
    )
  }

  getResultSummaryGroup() {
    return (
      <Group>
        <SummaryMoneyIndicator
          text="Итого"
          value={
            this.getSummaryValue('works') + this.getSummaryValue('materials')
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

  setSelectValueAndTryToCalculateResults(key, item) {
    this.setState(
      { [key]: convertFromSweetSelectToHomeItemsFormat(item) },
      this.tryToCalculateResults
    )
  }

  getSelectedOldnessId() {
    const { oldness } = this.state
    return oldness.id
  }

  getSelectedModificationId() {
    const { modification } = this.state
    return modification.id
  }

  getSelectedModelId() {
    const { model } = this.state
    return model.id
  }

  getCalculationResults() {
    if (this.resultsStatus === 'notSelected') return null
    if (this.resultsStatus === 'ready') return this.getCalculationResultGroups()
    throw new Error('invalid resultsStatus')
  }

  async setModifications(modelId) {
    let modifications = await loadModifications(modelId)
    modifications = convertModifications(modifications)
    this.setState({ modifications })
  }

  setCalculationResults(results) {
    this.removeAnyPopout()
    this.setState({
      calculationResults: {
        status: 'ready',
        ...results,
      },
    })
  }

  removeAnyPopout() {
    this.setState({ popout: null })
  }

  showSpinner() {
    this.setState({ popout: <ScreenSpinner /> })
  }

  allSelected() {
    return (
      this.getSelectedModelId() &&
      this.getSelectedModificationId() &&
      this.getSelectedOldnessId()
    )
  }

  changePanel(panelId) {
    this.setState({ activePanel: panelId })
  }

  resetAll = () => {
    const { popout } = this.state
    this.setState({
      ...defaultState,
      popout,
    })
  }

  async calculateResults() {
    const { model, modification, oldness } = this.state
    this.showSpinner()
    let results
    try {
      results = await loadResults(model.id, modification.id, oldness.id)
      results = convertResults(results)
      this.setCalculationResults(results)
      this.removeAnyPopout()
    } catch (e) {
      this.showNetworkErrorAlert(() => this.calculateResults())
    }
  }

  async tryToCalculateResults() {
    if (this.allSelected()) {
      await this.calculateResults()
    }
  }

  resetModification() {
    this.setState({ modification: { id: 0, text: 'Выбрать' } })
  }

  changePanelAndPushHistoryState(panelId) {
    pushHistoryItem(convertIdToHashLocation(panelId))
    this.changePanel(panelId)
  }

  viewPopStateHandler() {
    const { hash } = window.location
    const panelId = convertLocationToPanelId(hash)
    this.changePanel(panelId)
  }

  showNetworkErrorAlert(retryCallback) {
    this.setState({
      popout: (
        <NetworkErrorAlert
          onRetry={() => {
            this.removeAnyPopout()
            retryCallback()
          }}
          onCancel={() => this.removeAnyPopout()}
        />
      ),
    })
  }

  onModelSelect = async (model) => {
    this.showSpinner()
    reachModelSelectedGoal()
    this.resetModification()
    try {
      await this.setModifications(model.id)
      await sleep(0.8) // hack: required to make vk ui change panels nicely
      this.removeAnyPopout()
      this.changePanelAndPushHistoryState('chooseModification')
      this.setSelectValueAndTryToCalculateResults('model', model)
    } catch (e) {
      this.showNetworkErrorAlert(() => this.onModelSelect(model))
    }
  }

  onModificationSelect = async (modification) => {
    reachModificationSelectedGoal()
    this.setSelectValueAndTryToCalculateResults('modification', modification)
    if (!this.getSelectedOldnessId()) {
      this.showSpinner()
      await sleep(0.8) // hack: required to make vk ui change panels nicely
      this.removeAnyPopout()
      this.changePanelAndPushHistoryState('chooseOldness')
    }
  }

  render() {
    const { id: viewId } = this.props
    const { activePanel, popout, modifications } = this.state
    const panelId = `${viewId}main`
    return (
      <View id={viewId} activePanel={activePanel} header popout={popout}>
        <Panel id={panelId}>
          {this.getPanelHeader()}
          {this.getCalculationSelectGroup()}
          {this.getCalculationResults()}
          {this.ctaComponent}
        </Panel>
        <SweetSelect
          id="chooseModel"
          backClickHandler={() => goBack()}
          header="Модель"
          items={this.models}
          onSelect={this.onModelSelect}
        />
        <SweetSelect
          id="chooseModification"
          backClickHandler={() => goBack()}
          header="Модификация"
          items={modifications}
          onSelect={this.onModificationSelect}
        />
        <SweetSelect
          id="chooseOldness"
          backClickHandler={() => goBack()}
          header="Пробег или год"
          items={this.oldnesses}
          onSelect={(item) => {
            reachOldnessSelectedGoal()
            this.setSelectValueAndTryToCalculateResults('oldness', item)
          }}
        />
      </View>
    )
  }
}

export default Home
