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
  reachGoal,
} from '../helpers/helpers'
import HeaderWithBackButton from '../helpers/HeaderWithBackButton'

let state = {
  calculationResults: {
    status: 'notSelected',
    works: [],
    materials: [],
  },
  popout: null,
}

function getDefaultSelectState(text) {
  return {
    model: { id: 0, text },
    modification: { id: 0, text },
    oldness: { id: 0, text },
  }
}

state = {
  ...state,
  ...getDefaultSelectState('Выбрать'),
}

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
  return (await doPostRequest(`/ajax/model.php`, {
    ID: modelId,
  })).data
}

function pushHistoryItem(location) {
  window.history.pushState({}, '', location)
}

function getSpinner() {
  return <ScreenSpinner />
}

async function loadResults(model, modification, oldness) {
  return (await doPostRequest(`/ajax/to.php`, {
    SECTION: model,
    TIME: oldness,
    AUTO: modification,
  })).data
}

class Home extends React.Component {
  static propTypes = {
    onCtaClick: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
  }

  ctaText = `Отправьте заявку, наши сотрудники свяжутся с вами для записи на техническое обслуживание автомобиля Nissan`

  models = [
    { id: 43, value: 'Almera Classic (2006-2013)' },
    { id: 44, value: 'Almera New (с 2012)' },
    { id: 45, value: 'Juke (с 2011)' },
    { id: 46, value: 'Micra (с 2002)' },
    { id: 47, value: 'Murano (2008-2015)' },
    { id: 48, value: 'Murano (с 2015)' },
    { id: 49, value: 'Navara (с 2010)' },
    { id: 50, value: 'Note (2006-2014)' },
    { id: 51, value: 'Pathfinder (2010-2013)' },
    { id: 52, value: 'Pathfinder (с 2013)' },
    { id: 53, value: 'Qashqai (2006-2013)' },
    { id: 54, value: 'Qashqai (с 2013)' },
    { id: 55, value: 'Teana (2008-2013)' },
    { id: 56, value: 'Teana (с 2013)' },
    { id: 57, value: 'Terrano (с 2013)' },
    { id: 58, value: 'Tiida (2004-2015)' },
    { id: 60, value: 'X-Trail (2010-2014)' },
    { id: 61, value: 'X-Trail (с 2014)' },
    { id: 62, value: 'Sentra (с 2014)' },
  ]

  modifications = []

  oldnesses = [
    { id: 1, value: '15000 или 1 год' },
    { id: 2, value: '30000 или 2 года' },
    { id: 3, value: '45000 или 3 года' },
    { id: 4, value: '60000 или 4 года' },
    { id: 5, value: '75000 или 5 лет' },
    { id: 6, value: '90000 или 6 лет' },
    { id: 7, value: '105000 или 7 лет' },
    { id: 8, value: '120000 или 8 лет' },
    { id: 9, value: '13500 или 9 лет' },
    { id: 10, value: '150000 или 10 лет' },
  ]

  headerText = 'Расчет ТО Ниссан'

  panelHeader = (
    <HeaderWithBackButton
      text={this.headerText}
      onBackButtonClick={() => this.props.onBack()}
    />
  )

  // had to suppress eslint cause we need this function in ctaButton property
  // so it has to be declared before it.
  // we need to remove it when ctaButton will be standalone component,
  // and not just property
  // eslint-disable-next-line react/sort-comp
  onCtaClick = () => {
    const { onCtaClick } = this.props
    try {
      reachCtaClickGoal()
    } catch (e) {} // eslint-disable-line no-empty
    onCtaClick()
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

  constructor(props) {
    super(props)
    this.state = state
    const { id: viewId } = this.props
    state.activePanel = `${viewId}main`
    window.onpopstate = () => this.onPopHistoryState()

    window.history.replaceState({}, '', `#${viewId}/${viewId}main`)
  }

  componentWillUnmount() {
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
        text="Пробег или время"
        value={oldness.text}
        onClick={() => this.changePanelAndPushHistoryState('chooseOldness')}
      />
    )
  }

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
        {calculationResults.works.map((item, index) => (
          <MoneyIndicator text={item.name} value={item.price} key={index} />
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
        {calculationResults.materials.map((item, index) => (
          <MoneyIndicator text={item.name} value={item.price} key={index} />
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

  setLoadingStatus() {
    this.setState((state) => {
      Object.assign(state.calculationResults, { status: 'loading' })
      return state
    })
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
    const switcher = {
      notSelected: null,
      loading: getSpinner(),
      ready: this.getCalculationResultGroups(),
    }
    return switcher[this.resultsStatus]
  }

  async setModifications(modelId) {
    let modifications
    try {
      modifications = await loadModifications(modelId)
    } catch (err) {} // eslint-disable-line no-empty
    this.modifications = convertModifications(modifications)
    this.setState({
      modification: convertFromSweetSelectToHomeItemsFormat(
        this.modifications[0]
      ),
    })
  }

  setCalculationResults(results) {
    this.setState({
      calculationResults: {
        status: 'ready',
        ...results,
      },
    })
  }

  removeSpinner() {
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

  async calculateResults() {
    const { model, modification, oldness } = this.state
    this.setLoadingStatus()
    let results
    try {
      results = await loadResults(model.id, modification.id, oldness.id)
    } catch (err) {} // eslint-disable-line no-empty
    results = convertResults(results)
    this.setCalculationResults(results)
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

  render() {
    const { id: viewId } = this.props
    const { activePanel, popout } = this.state
    const panelId = `${viewId}main`
    return (
      <View id={viewId} activePanel={activePanel} header popout={popout}>
        <Panel id={panelId}>
          {this.panelHeader}
          {this.getCalculationSelectGroup()}
          {this.getCalculationResults()}
          {this.ctaComponent}
        </Panel>
        <SweetSelect
          id="chooseModel"
          backClickHandler={() => goBack()}
          header="Модель"
          items={this.models}
          onSelect={async (item) => {
            this.showSpinner()
            try {
              reachModelSelectedGoal()
            } catch (e) {} // eslint-disable-line no-empty
            this.resetModification()
            await this.setModifications(item.id)
            this.setSelectValueAndTryToCalculateResults('model', item)
            this.removeSpinner()
          }}
        />
        <SweetSelect
          id="chooseModification"
          backClickHandler={() => goBack()}
          header="Модификация"
          items={this.modifications}
          onSelect={(item) => {
            try {
              reachModificationSelectedGoal()
            } catch (e) {} // eslint-disable-line no-empty
            this.setSelectValueAndTryToCalculateResults('modification', item)
          }}
        />
        <SweetSelect
          id="chooseOldness"
          backClickHandler={() => goBack()}
          header="Пробег или время"
          items={this.oldnesses}
          onSelect={(item) => {
            try {
              reachOldnessSelectedGoal()
            } catch (e) {} // eslint-disable-line no-empty
            this.setSelectValueAndTryToCalculateResults('oldness', item)
          }}
        />
      </View>
    )
  }
}

export default Home
