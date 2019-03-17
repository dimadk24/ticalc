import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Cell,
  Div,
  Group,
  Input,
  Panel,
  ScreenSpinner,
  View,
} from '@vkontakte/vkui'
import axios from 'axios'
import HeaderWithBackButton from '../helpers/HeaderWithBackButton'
import './SendRequestView.css'
import PhoneInput from '../helpers/PhoneInput'
import { getInfoFromVKConnect } from '../helpers/helpers'
import { reachGoal } from '../helpers/production_utils'

let state = {
  name: '',
  phone: '',
  phoneNotValid: false,
  popout: null,
}

function removePlus(phone) {
  return phone.replace(/[^0-9]/g, '')
}

function formIsValid(phone) {
  return Boolean(removePlus(phone))
}

function getPhoneInfo() {
  return getInfoFromVKConnect('VKWebAppGetPhoneNumber')
}

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

  sendButton = (
    <Button
      stretched
      size="l"
      onClick={() => this.validateAndShowErrorsAndSendForm()}
    >
      Отправить заявку
    </Button>
  )

  constructor(props) {
    super(props)
    const { username } = this.props
    this.state = state
    this.state.name = username
    this.requestedPhone = false
  }

  componentWillUnmount() {
    ;({ state } = this)
  }

  async onPhoneInputClick() {
    if (!this.requestedPhone) {
      this.requestedPhone = true
      const { phone_number: phone } = await getPhoneInfo()
      this.setState({ phone })
    }
  }

  getForm() {
    return <Group>{this.getManualForm()}</Group>
  }

  getPanelHeader = () => {
    const { onBack } = this.props
    return (
      <HeaderWithBackButton
        onBackButtonClick={onBack}
        text="Отправить заявку"
      />
    )
  }

  getManualForm() {
    return (
      <Div>
        <Cell>{this.getNameComponent()}</Cell>
        <Cell>{this.getPhoneComponent()}</Cell>
        <Cell>{this.sendButton}</Cell>
      </Div>
    )
  }

  getNameComponent() {
    const { name } = this.state
    return (
      <div>
        <span>Имя</span>
        <Input
          type="text"
          placeholder="Иван"
          value={name}
          onChange={(e) => this.setState({ name: e.target.value })}
        />
      </div>
    )
  }

  getPhoneComponent() {
    const { phone, phoneNotValid } = this.state
    return (
      <div>
        <span>Телефон</span>
        <PhoneInput
          placeholder="+79211234567"
          value={phone}
          onChange={(value) => {
            this.setState({ phoneNotValid: false })
            return this.setState({ phone: value })
          }}
          onClick={() => this.onPhoneInputClick()}
        />
        {phoneNotValid && <p className="error-hint">Введите телефон</p>}
      </div>
    )
  }

  showSpinner() {
    this.setState({ popout: <ScreenSpinner /> })
  }

  hideSpinner() {
    this.setState({
      popout: null,
    })
  }

  doPostRequestTasks() {
    const { onSentRequest } = this.props
    this.hideSpinner()
    onSentRequest()
  }

  async validateAndShowErrorsAndSendForm() {
    const { name, phone } = this.state
    if (formIsValid(phone)) {
      this.showSpinner()
      await sendRequest(name, phone)
      reachSentManualRequestGoal()
      this.doPostRequestTasks()
    } else {
      this.setState({ phoneNotValid: true })
    }
  }

  render() {
    const { id: viewId } = this.props
    const { popout } = this.state
    const panelId = `${viewId}main`
    return (
      <View id={viewId} activePanel={panelId} header popout={popout}>
        <Panel id={panelId}>
          {this.getPanelHeader()}
          {this.getForm()}
        </Panel>
      </View>
    )
  }
}
