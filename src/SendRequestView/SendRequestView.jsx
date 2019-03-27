import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Panel, ScreenSpinner, View } from '@vkontakte/vkui'
import axios from 'axios'
import HeaderWithBackButton from '../helpers/HeaderWithBackButton'
import './SendRequestView.css'
import { reachGoal } from '../helpers/production_utils'
import NetworkErrorAlert from '../helpers/NetworkErrorAlert'
import SendRequestForm from './SendRequestForm'

function getInput(text) {
  if (text === 'Выбрать') return ''
  return text
}

function getAllInput() {
  // fixme: window????
  const model = getInput(window.input.model.text)
  const modification = getInput(window.input.modification.text)
  const oldness = getInput(window.input.oldness.text)
  return { model, modification, oldness }
}

function getCalculationResults() {
  // fixme: window? save everything in local var
  const works = JSON.stringify(window.calculationResults.works)
  const materials = JSON.stringify(window.calculationResults.materials)
  return { works, materials }
}

function reachSentManualRequestGoal() {
  reachGoal('sent-manual-request')
}

function sendRequest(name, phone) {
  const { model, modification, oldness } = getAllInput()
  const { works, materials } = getCalculationResults()
  return axios.get('request.php', {
    params: {
      model,
      modification,
      oldness,
      works,
      materials,
      name,
      phone,
    },
  })
}

export default class SendRequestView extends Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    onSentRequest: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      popout: null,
    }
  }

  componentDidMount() {
    this.requestedPhone = false
  }

  sendRequest = async (name, phone) => {
    this.showSpinner()
    try {
      await sendRequest(name, phone)
      reachSentManualRequestGoal()
      this.doPostRequestTasks()
    } catch (e) {
      this.showNetworkErrorAlert(() => this.validateAndShowErrorsAndSendForm())
    }
  }

  doPostRequestTasks() {
    const { onSentRequest } = this.props
    this.removeAnyPopout()
    onSentRequest()
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

  removeAnyPopout() {
    this.setState({
      popout: null,
    })
  }

  showSpinner() {
    this.setState({ popout: <ScreenSpinner /> })
  }

  render() {
    const { id: viewId, onBack, username } = this.props
    const { popout } = this.state
    const panelId = `${viewId}main`
    return (
      <View id={viewId} activePanel={panelId} header popout={popout}>
        <Panel id={panelId}>
          <HeaderWithBackButton
            onBackButtonClick={onBack}
            text="Отправить заявку"
          />
          <SendRequestForm
            sendRequest={this.sendRequest}
            initialName={username}
          />
        </Panel>
      </View>
    )
  }
}
