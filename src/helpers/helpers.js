import connect from '@vkontakte/vkui-connect'

function getPrice(string) {
    return Number.parseInt(string, 10) || 0
}

function getName(string) {
    return string === '---' ? '' : string
}

function convertMaterial(row) {
    return {
        name: getName(row['MATERIAL_NAME']),
        price: getPrice(row['MATERIAL_PRICE'])
    }
}

function convertWork(row) {
    return {
        name: getName(row['SERVICE_NAME']),
        price: getPrice(row['SERVICE_PRICE'])
    }
}

function convertResults(results) {
    let converted = {works: [], materials: []}
    for (const row of results) {
        let material = convertMaterial(row)
        if (material.name) converted.materials.push(material)
        let work = convertWork(row)
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
            if (messageTypeIs(response, `${eventName}Result`))
                resolve(response.data)
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
    const new_array = []
    for (const id in modifications) {
        const obj = {id: Number.parseInt(id, 10), value: modifications[id]}
        new_array.push(obj)
    }
    return new_array
}
export {convertResults, getInfoFromVKConnect, getUserInfo, convertModifications}
