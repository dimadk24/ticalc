import React from 'react'
import PropTypes from 'prop-types'
import { HeaderButton, PanelHeader as VKPanelHeader } from '@vkontakte/vkui'
import BackButton from './BackButton'

export default function PanelHeader({
  panelHeaderProps,
  onBackButtonClick,
  text,
  showBackButton,
}) {
  const vkPanelHeaderProps = panelHeaderProps
  if (showBackButton)
    vkPanelHeaderProps.left = (
      <HeaderButton onClick={onBackButtonClick}>
        <BackButton />
      </HeaderButton>
    )
  else vkPanelHeaderProps.left = undefined
  return <VKPanelHeader {...vkPanelHeaderProps}>{text}</VKPanelHeader>
}

PanelHeader.propTypes = {
  onBackButtonClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  panelHeaderProps: PropTypes.object,
  showBackButton: PropTypes.bool,
}

PanelHeader.defaultProps = {
  panelHeaderProps: {},
  showBackButton: true,
}
