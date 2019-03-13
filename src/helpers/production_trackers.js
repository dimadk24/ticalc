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
        w.yaCounter50376901 = new Ya.Metrika2({
          id: 50376901,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        })
      } catch (e) {}
    })

    var n = d.getElementsByTagName('script')[0],
      s = d.createElement('script'),
      f = function() {
        n.parentNode.insertBefore(s, n)
      }
    s.type = 'text/javascript'
    s.async = true
    s.src = 'https://mc.yandex.ru/metrika/tag.js'

    if (w.opera == '[object Opera]') {
      d.addEventListener('DOMContentLoaded', f, false)
    } else {
      f()
    }
  })(document, window, 'yandex_metrika_callbacks2')
  /* eslint-enable */
}

const { NODE_ENV } = process.env

const isProduction = NODE_ENV === 'production'

function insertMetrika() {
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

export { isProduction, insertMetrika, reachGoal }
