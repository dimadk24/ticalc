import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button, Cell, Div, Group, Input, Panel} from '@vkontakte/vkui'
import Icon24VKLogo from '@vkontakte/icons/dist/24/logo_vk'
import {HeaderWithBackButton} from './HeaderWithBackButton'

export class sendRequestPanel extends Component {
    static propTypes = {onBack: PropTypes.func}

    render() {
        return (
            <Panel id={'sendRequest'}>
                <HeaderWithBackButton
                    onBackButtonClick={this.props.onBack}
                    text={'Отправить заявку'}
                />
                <Group>
                    <Div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <Button
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <div>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Icon24VKLogo />
                                    <span>
                                        Отправить заявку с данными профиля
                                    </span>
                                </span>
                            </div>
                        </Button>
                        <Div
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <span>или</span>
                        </Div>
                    </Div>
                    <div>
                        <Cell>
                            <span>Имя</span>
                            <Input type={'text'} placeholder={'Иван'} />
                        </Cell>
                        <Cell>
                            <span>Телефон</span>
                            <Input type={'tel'} placeholder={'+79211234567'} />
                        </Cell>
                        <Cell>
                            <Button stretched size={'l'}>
                                Отправить заявку
                            </Button>
                        </Cell>
                    </div>
                </Group>
            </Panel>
        )
    }
}
