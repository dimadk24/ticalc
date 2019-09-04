import Raven from 'raven-js'
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper'

const { REACT_APP_IS_PROD } = process.env
const isProduction = Boolean(parseInt(REACT_APP_IS_PROD, 10))

const noscriptMetrikaTag = `
    <noscript>
        <div><img src="https://mc.yandex.ru/watch/50376901" style="position:absolute; left:-9999px;" alt="" /></div>
    </noscript>
`

function launchMetrika() {
  // Yandex.Metrika code
  /* eslint-disable */
  ;(function(d, w, c) {
    ;(w[c] = w[c] || []).push(function() {
      try {
        // noinspection JSUnresolvedFunction
        w.yaCounter50376901 = new Ya.Metrika2({
          id: 50376901,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        })
      } catch (e) {}
    })

    // noinspection ES6ConvertVarToLetConst
    var n = d.getElementsByTagName('script')[0],
      s = d.createElement('script'),
      f = function() {
        n.parentNode.insertBefore(s, n)
      }
    s.type = 'text/javascript'
    s.async = true
    s.src = 'https://mc.yandex.ru/metrika/tag.js'

    // noinspection EqualityComparisonWithCoercionJS
    if (w.opera == '[object Opera]') {
      d.addEventListener('DOMContentLoaded', f, false)
    } else {
      f()
    }
  })(document, window, 'yandex_metrika_callbacks2')
  /* eslint-enable */
}

function getRecaptchaToken() {
  /* global grecaptcha */
  return new Promise((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute('6Le77psUAAAAAHexyG1I-8n1xj2W1pADVQHL7PFo', {
          action: 'homepage',
        })
        .then(resolve)
    })
  })
}

function initProductionUtils(rootElement) {
  mVKMiniAppsScrollHelper(rootElement)
  Raven.config(
    'https://e1f809f399e2427898e1796a4a4d8c64@sentry.io/1280607'
  ).install()
  launchMetrika()
  document.body.innerHTML += noscriptMetrikaTag
}

function reachGoal(name) {
  if (!isProduction) return
  try {
    // noinspection JSUnresolvedFunction
    window.yaCounter50376901.reachGoal(name)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      `Tried to reach goal ${name}, but Yandex.Metrika is blocked or removed`
    )
  }
}

export { isProduction, initProductionUtils, reachGoal, getRecaptchaToken }
