import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    Cell,
    Div,
    Group,
    Input,
    Panel,
    ScreenSpinner,
    View
} from '@vkontakte/vkui'
import VKLogo from '@vkontakte/icons/dist/24/logo_vk'
import {HeaderWithBackButton} from '../helpers/HeaderWithBackButton'
import './SendRequestView.css'
import {PhoneInput} from '../helpers/PhoneInput'
import {getInfoFromVKConnect, getUserInfo, reachGoal} from '../helpers/helpers'
import axios from 'axios'

let state = {
    name: '',
    phone: '',
    phoneNotValid: false,
    popout: null
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

export class SendRequestView extends Component {
    static propTypes = {
        onBack: PropTypes.func,
        id: PropTypes.string,
        onSentRequest: PropTypes.func.isRequired,
        username: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props)
        const {username} = this.props
        this.state = state
        this.state.name = username
    }

    componentWillUnmount() {
        state = this.state
    }

    orComponent = (
        <Div className={'centered'}>
            <span>или</span>
        </Div>
    )

    vkConnectButton = (
        <Button
            className={'centered'}
            onClick={() => this.sendAutomaticRequest()}
        >
            <span className={'centered'}>
                <VKLogo />
                <span>Отправить заявку с данными профиля</span>
            </span>
        </Button>
    )

    sendButton = (
        <Button
            stretched
            size={'l'}
            onClick={() => this.validateAndShowErrorsAndSendForm()}
        >
            Отправить заявку
        </Button>
    )

    getPhoneComponent() {
        return (
            <div>
                <span>Телефон</span>
                <PhoneInput
                    placeholder={'+79211234567'}
                    value={this.state.phone}
                    onChange={(value) => {
                        this.setState({phoneNotValid: false})
                        return this.setState({phone: value})
                    }}
                />
                {this.state.phoneNotValid && (
                    <p className={'error-hint'}>Введите телефон</p>
                )}
            </div>
        )
    }

    getNameComponent() {
        return (
            <div>
                <span>Имя</span>
                <Input
                    type={'text'}
                    placeholder={'Иван'}
                    value={this.state.name}
                    onChange={(e) => this.setState({name: e.target.value})}
                />
            </div>
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

    automaticButton = (
        <Div className={'centered'} style={{flexDirection: 'column'}}>
            {this.vkConnectButton}
        </Div>
    )

    panelHeader = (
        <HeaderWithBackButton
            onBackButtonClick={this.props.onBack}
            text={'Отправить заявку'}
        />
    )

    getForm() {
        return (
            <Group>
                {this.automaticButton}
                {this.orComponent}
                {this.getManualForm()}
            </Group>
        )
    }

    render() {
        return (
            <View
                id={this.props.id}
                activePanel={this.props.id + 'main'}
                header
                popout={this.state.popout}
            >
                <Panel id={this.props.id + 'main'}>
                    {this.panelHeader}
                    {this.getForm()}
                </Panel>
            </View>
        )
    }

    async validateAndShowErrorsAndSendForm() {
        const {name, phone} = this.state
        if (formIsValid(phone)) {
            this.showSpinner()
            await this.sendRequest(name, phone)
            try {
                this.reachSentManualRequestGoal()
            } catch (e) {}
            this.doPostRequestTasks()
        } else {
            this.setState({phoneNotValid: true})
        }
    }

    doPostRequestTasks() {
        this.hideSpinner()
        this.props.onSentRequest()
    }

    hideSpinner() {
        this.setState({
            popout: null
        })
    }

    showSpinner() {
        this.setState({popout: <ScreenSpinner />})
    }

    reachAutomaticRequestStartGoal() {
        reachGoal('started-automatic-request')
    }

    reachSentAutomaticRequestGoal() {
        reachGoal('sent-automatic-request')
    }

    reachSentManualRequestGoal() {
        reachGoal('sent-manual-request')
    }

    async sendAutomaticRequest() {
        try {
            this.reachAutomaticRequestStartGoal()
        } catch (e) {}
        const [{first_name: name}, {phone_number: phone}] = await Promise.all([
            getUserInfo(),
            getPhoneInfo()
        ])
        this.showSpinner()
        try {
            await this.sendRequest(name, phone)
        } catch (err) {}
        try {
            this.reachSentAutomaticRequestGoal()
        } catch (e) {}
        this.doPostRequestTasks()
    }

    getInput(text) {
        if (text === 'Выбрать') return ''
        else return text
    }

    sendRequest(name, phone) {
        const {model, modification, oldness} = this.getAllInput()
        const {works, materials} = this.getCalculationResults()
        return axios.get('/ticalc4/request.php', {
            params: {
                model: model,
                modification: modification,
                oldness: oldness,
                works: works,
                materials: materials,
                name: name,
                phone: phone
            }
        })
    }

    getCalculationResults() {
        const works = window.JSON.stringify(window.calculationResults.works)
        const materials = window.JSON.stringify(
            window.calculationResults.materials
        )
        return {works, materials}
    }

    getAllInput() {
        const model = this.getInput(window.input.model.text)
        const modification = this.getInput(window.input.modification.text)
        const oldness = this.getInput(window.input.oldness.text)
        return {model, modification, oldness}
    }
}
