import {Button, Cell, Group, Panel, View} from '@vkontakte/vkui'
import React from 'react'
import PropTypes from 'prop-types'
import {HeaderWithBackButton} from '../helpers/HeaderWithBackButton'
import {reachGoal} from '../helpers/helpers'
import './ThankYouView.css'

class ThankYouView extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired
  }

  onGoToPublic = () => {
    reachGoal('open-vk-public')
    return true
  }

  render() {
    return (
      <View id={this.props.id} activePanel={`${this.props.id}main`}>
        <Panel id={`${this.props.id}main`}>
          <HeaderWithBackButton
            onBackButtonClick={() => this.props.onBack()}
            text="Спасибо"
          />
          <Group>
            <Cell multiline>
              <div>Спасибо!</div>
              <div>Наш менеджер свяжется с Вами в ближайшее время.</div>
            </Cell>
            <Cell multiline>
              <span className="thank-you-view__visit-group-text">
                А пока зайдите в наше сообщество ВКонтакте
              </span>
              <a
                href="//vk.com/ya.service.nissan"
                className="not-link"
                onClick={this.onGoToPublic}
              >
                <Button stretched size="xl" style={{marginTop: '15px'}}>
                  Перейти
                </Button>
              </a>
            </Cell>
          </Group>
        </Panel>
      </View>
    )
  }
}

export default ThankYouView
