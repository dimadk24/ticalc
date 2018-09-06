import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Div, Cell} from '@vkontakte/vkui'
import './indicators.css'

class MoneyIndicator extends Component {
    static propTypes = {
        text: PropTypes.string,
        value: PropTypes.number,
        additionalClassesAsStr: PropTypes.string
    }

    render() {
        return (
            <Div className={`info ${this.props.additionalClassesAsStr || ''}`}>
                <div>
                    <span>{this.props.text}</span>
                </div>
                <div>
                    <span className={'indicator'}>
                        {this.props.value + ' руб'}
                    </span>
                </div>
            </Div>
        )
    }
}

class SummaryMoneyIndicator extends Component {
    static propTypes = {
        text: PropTypes.string,
        value: PropTypes.number
    }

    render() {
        return (
            <MoneyIndicator
                text={this.props.text}
                value={this.props.value}
                additionalClassesAsStr={'summary'}
            />
        )
    }
}

class Indicator extends Component {
    static propTypes = {
        text: PropTypes.string,
        value: PropTypes.number,
        onClick: PropTypes.func
    }

    render() {
        return (
            <Cell onClick={() => this.props.onClick()}>
                <div className={'indicator'}>
                    <div className={'text-wrapper'}>
                        <span>{this.props.text}</span>
                    </div>
                    <div className={'value-wrapper'}>
                        <span className={'value'}>{this.props.value}</span>
                    </div>
                </div>
            </Cell>
        )
    }
}

export {MoneyIndicator, SummaryMoneyIndicator, Indicator}
