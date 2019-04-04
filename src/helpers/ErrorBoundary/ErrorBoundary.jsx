import React from 'react'
import Raven from 'raven-js'
import PropTypes from 'prop-types'
import IconMoreHorizontal from '@vkontakte/icons/dist/16/more_horizontal'
import errorSmile from './error_smile.png'
import './ErrorBoundary.css'

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error })
    Raven.captureException(error, { extra: errorInfo })
  }

  render() {
    const { error } = this.state
    const { children } = this.props
    if (error) {
      return (
        <div className="error-wrapper">
          <img src={errorSmile} alt="Ошибка!" />
          <h2>Похоже, приложение сломалось</h2>
          <span>Наша команда уже знает об ошибке</span>
          <span>Попробуйте перезапустить приложение:</span>
          <ul className="error-wrapper__list">
            <li className="error-wrapper__three-dots-text-wrapper">
              Нажмите на <IconMoreHorizontal /> в правом верхнем углу
            </li>
            <li>Нажмите на пункт «Очистить кэш»</li>
            <li>
              Или просто{' '}
              <a
                className="error-wrapper__link"
                href="https://vk.me/ya.service.nissan"
                target="_blank"
                rel="noreferrer noopener"
              >
                расскажите нам об ошибке
              </a>
            </li>
          </ul>
        </div>
      )
    }
    return children
  }
}

export default ErrorBoundary
