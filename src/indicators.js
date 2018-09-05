import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Div} from '@vkontakte/vkui'
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
                    <p>{this.props.text}</p>
                </div>
                <div>
                    <p className={'indicator'}>{this.props.value + ' руб'}</p>
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

export {MoneyIndicator, SummaryMoneyIndicator}