import React from 'react'
import Raven from 'raven-js'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {error: null}
  }

  componentDidCatch(error, errorInfo) {
    this.setState({error})
    Raven.captureException(error, {extra: errorInfo})
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{textAlign: 'center'}}>
          <p>Что-то пошло не так :(</p>
          <p>Наша команда уже решает ошибку</p>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}

export default ErrorBoundary
