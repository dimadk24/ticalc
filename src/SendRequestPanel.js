import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button, Cell, Div, Group, Input, Panel} from '@vkontakte/vkui'
import VKLogo from '@vkontakte/icons/dist/24/logo_vk'
import {HeaderWithBackButton} from './HeaderWithBackButton'
import './SendRequestPanel.css'

export class SendRequestPanel extends Component {
    static propTypes = {onBack: PropTypes.func, id: PropTypes.string}

    orComponent = (
        <Div className={'centered'}>
            <span>или</span>
        </Div>
    )

    vkConnectButton = <Button className={'centered'}>
        <span className={'centered'}>
            <VKLogo />
            <span>Отправить заявку с данными профиля</span>
        </span>
    </Button>

    sendButton = <Button stretched size={'l'}>
        Отправить заявку
    </Button>

    phoneComponent = <div><span>Телефон</span>
        <Input type={'tel'} placeholder={'+79211234567'}/></div>

    nameComponent = <div><span>Имя</span>
        <Input type={'text'} placeholder={'Иван'}/></div>

    render() {
        return (
            <Panel id={this.props.id}>
                <HeaderWithBackButton
                    onBackButtonClick={this.props.onBack}
                    text={'Отправить заявку'}
                />
                <Group>
                    <Div
                        className={'centered'}
                        style={{flexDirection: 'column'}}
                    >
                        {this.vkConnectButton}
                        {this.orComponent}
                    </Div>
                    <Div>
                        <Cell>
                            {this.nameComponent}
                        </Cell>
                        <Cell>
                            {this.phoneComponent}
                        </Cell>
                        <Cell>
                            {this.sendButton}
                        </Cell>
                    </Div>
                </Group>
            </Panel>
        )
    }
}
