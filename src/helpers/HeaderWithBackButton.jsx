import React from 'react'
import PropTypes from 'prop-types'
import { HeaderButton, PanelHeader } from '@vkontakte/vkui'
import BackButton from './BackButton'

export default function HeaderWithBackButton({
  panelHeaderProps,
  onBackButtonClick,
  text,
}) {
  return (
    <PanelHeader
      {...panelHeaderProps}
      left={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <HeaderButton onClick={onBackButtonClick}>
          <BackButton />
        </HeaderButton>
      }
    >
      {text}
    </PanelHeader>
  )
}

HeaderWithBackButton.propTypes = {
  onBackButtonClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  panelHeaderProps: PropTypes.object,
}

HeaderWithBackButton.defaultProps = {
  panelHeaderProps: {},
}
