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
  results.forEach((row) => {
    const material = convertMaterial(row)
    if (material.name) converted.materials.push(material)
    const work = convertWork(row)
    if (work.name) converted.works.push(work)
  })
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
  return Object.entries(modifications).map(([id, value]) => ({
    id: parseInt(id, 10),
    value,
  }))
}

function doPostRequest(url, params) {
  const requestParams = new URLSearchParams()
  Object.entries(params).forEach(([parameter, value]) => {
    requestParams.append(parameter, value)
  })
  return axios.post(url, requestParams)
}

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })
}

export {
  convertResults,
  getInfoFromVKConnect,
  getUserInfo,
  convertModifications,
  doPostRequest,
  sleep,
}
