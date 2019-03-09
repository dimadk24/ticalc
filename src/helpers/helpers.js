import connect from '@vkontakte/vkui-connect'
import axios from 'axios'

function getPrice(string) {
  return Number.parseInt(string, 10) || 0
}

function getName(string) {
  return string === '---' ? '' : string
}

function convertMaterial(row) {
  return {
    name: getName(row.MATERIAL_NAME),
    price: getPrice(row.MATERIAL_PRICE),
  }
}

function convertWork(row) {
  return {
    name: getName(row.SERVICE_NAME),
    price: getPrice(row.SERVICE_PRICE),
  }
}

function convertResults(results) {
  const converted = { works: [], materials: [] }
  for (const row of results) {
    const material = convertMaterial(row)
    if (material.name) converted.materials.push(material)
    const work = convertWork(row)
    if (work.name) converted.works.push(work)
  }
  return converted
}

function messageTypeIs(e, type) {
  return e.type === type
}

function getInfoFromVKConnect(eventName) {
  return new Promise((resolve, reject) => {
    const subscriber = (e) => {
      const response = e.detail
      if (messageTypeIs(response, `${eventName}Result`)) resolve(response.data)
      else if (messageTypeIs(response, `${eventName}Failed`))
        reject(response.data)
    }
    connect.subscribe(subscriber)
    connect.send(eventName, {})
  })
}

function getUserInfo() {
  return getInfoFromVKConnect('VKWebAppGetUserInfo')
}

function convertModifications(modifications) {
  const newArray = []
  for (const id in modifications) {
    if (modifications.hasOwnProperty(id)) {
      const obj = { id: Number.parseInt(id, 10), value: modifications[id] }
      newArray.push(obj)
    }
  }
  return newArray
}

function reachGoal(name) {
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

function doPostRequest(url, params) {
  const requestParams = new URLSearchParams()
  for (const param in params) {
    if (params.hasOwnProperty(param)) requestParams.append(param, params[param])
  }
  return axios.post(url, requestParams)
}

export {
  convertResults,
  getInfoFromVKConnect,
  getUserInfo,
  convertModifications,
  reachGoal,
  doPostRequest,
}
