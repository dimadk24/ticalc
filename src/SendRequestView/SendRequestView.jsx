import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Panel, ScreenSpinner, View, Alert } from '@vkontakte/vkui'
import axios from 'axios'
import PanelHeader from '../helpers/PanelHeader'
import {
  reachGoal,
  isProduction,
  getRecaptchaToken,
} from '../helpers/production_utils'
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

async function sendRequest(name, phone, recaptchaToken) {
  const { model, modification, oldness } = getAllInput()
  const { works, materials } = getCalculationResults()
  const url = isProduction ? 'request.php' : 'https://dimadk.tk/dev_request.php'
  const { status, data } = await axios.get(url, {
    params: {
      model,
      modification,
      oldness,
      works,
      materials,
      name,
      phone,
      recaptcha_token: recaptchaToken,
    },
  })
  if (!status === 200) throw new Error('Network error')
  return data
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
    const { onSentRequest } = this.props
    this.showSpinner()
    try {
      const recaptchaToken = await getRecaptchaToken()
      const { ok, error } = await sendRequest(name, phone, recaptchaToken)
      this.removeAnyPopout()
      if (!ok) {
        if (error !== 'too-many-requests') this.setState({ error })
        // why not throwing locally? Well, Sentry catches exception anyway.
        // But componentDidCatch in ErrorBoundary catches exceptions only in:
        // constructors, render methods and lifecycle hooks.
        // But not in onClicks and so on.
        // So to catch exception in onClick and show nice error view
        // we need to use such a hack :(
        // Another way our nice error view wouldn't be shown to user
        else
          this.setState({
            popout: (
              <Alert
                onClose={this.setState({ popout: null })}
                actions={[
                  {
                    title: 'Написать',
                    action: () => window.open('//vk.me/ya.service.nissan'),
                  },
                  {
                    title: 'Отмена',
                    action: () => this.setState({ popout: null }),
                    style: 'cancel',
                  },
                ]}
              >
                <p>
                  Ваши предыдущие заявки получены. Если Вы хотите уточнить их,
                  напишите нам
                </p>
              </Alert>
            ),
          })
      } else {
        reachSentManualRequestGoal()
        onSentRequest()
      }
    } catch (e) {
      this.showNetworkErrorAlert(() => this.validateAndShowErrorsAndSendForm())
    }
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
    const { popout, error } = this.state
    if (error) throw new Error(error)
    const panelId = `${viewId}main`
    return (
      <View id={viewId} activePanel={panelId} header popout={popout}>
        <Panel id={panelId}>
          <PanelHeader onBackButtonClick={onBack} text="Отправить заявку" />
          <SendRequestForm
            sendRequest={this.sendRequest}
            initialName={username}
          />
        </Panel>
      </View>
    )
  }
}
