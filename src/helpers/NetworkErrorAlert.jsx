import { Alert } from '@vkontakte/vkui'
import Icon36Cancel from '@vkontakte/icons/dist/36/cancel'
import React from 'react'
import PropTypes from 'prop-types'

function NetworkErrorAlert({ onRetry, onCancel }) {
  const actions = [
    {
      title: 'Попробовать еще раз',
      action: onRetry,
    },
    {
      title: 'Отмена',
      action: onCancel,
      style: 'cancel',
    },
  ]
  return (
    <Alert actions={actions} actionsLayout="vertical">
      <Icon36Cancel style={{ color: 'red', margin: '0 auto' }} />
      <p>
        Упс, возникла проблема с сетью. Скорее всего Вы не подключены к
        интернету.
      </p>
      <span>Подключитесь к интернету еще раз</span>
    </Alert>
  )
}

NetworkErrorAlert.propTypes = {
  onRetry: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default NetworkErrorAlert
