import React from 'react'
import { Button, Div, Group, Panel, PanelHeader, View } from '@vkontakte/vkui'
import PropTypes from 'prop-types'
import logo from '../logo.png'
import './StartView.css'
import { reachGoal } from '../helpers/helpers'

function reachStatisticGoal() {
  reachGoal('open-home')
}

class StartView extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onGoHome: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
  }

  headerText = 'Расчет ТО Ниссан в СПб'

  constructor(props) {
    super(props)
    const { id: viewId } = this.props
    this.state = {
      activePanel: `${viewId}main`,
    }
  }

  onGoHome = () => {
    reachStatisticGoal()
    const { onGoHome } = this.props
    onGoHome()
  }

  getText() {
    const { username: name } = this.props
    let text
    if (name) text = `${name}, выберите`
    else text = `Выберите`
    text +=
      ' свой автомобиль Nissan и узнайте стоимость обслуживания согласно пробегу или году'
    return <p>{text}</p>
  }

  getGreeting() {
    const { username: name } = this.props
    const greetingPhrase = 'Здравствуйте'
    const greeting = name ? `${greetingPhrase}, ${name}!` : `${greetingPhrase}!`
    return <p>{greeting} Вы из СПб, и у вас Ниссан?</p>
  }

  render() {
    const { id: viewId } = this.props
    const { activePanel } = this.state
    const panelId = `${viewId}main`
    return (
      <View id={viewId} activePanel={activePanel}>
        <Panel id={panelId}>
          <PanelHeader>{this.headerText}</PanelHeader>
          <Group>
            <Div>
              <div className="centerring-wrapper">
                <img src={logo} alt="Логотип Я Сервис" />
              </div>
              <div>
                {this.getGreeting()}
                {this.getText()}
              </div>
              <Button stretched size="xl" onClick={this.onGoHome}>
                Рассчитать стоимость ТО
              </Button>
            </Div>
          </Group>
        </Panel>
      </View>
    )
  }
}

export default StartView
