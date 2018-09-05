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

export {convertResults}
