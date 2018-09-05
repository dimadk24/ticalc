import {convertResults} from './helpers'

test('basic convertion', () => {
    const input = [
        {
            MATERIAL_NAME: 'Моторное масло (DPF) 8л.',
            MATERIAL_PRICE: '5600',
            SERVICE_NAME: 'Замена моторного масла (без снятия защиты ДВС)',
            SERVICE_PRICE: '600'
        }
    ]
    const output = {
        works: [
            {name: 'Замена моторного масла (без снятия защиты ДВС)', price: 600}
        ],
        materials: [{name: 'Моторное масло (DPF) 8л.', price: 5600}]
    }
    expect(convertResults(input)).toEqual(output)
})

test('convertion with zero prices', () => {
    const input = [
        {
            MATERIAL_NAME: 'Моторное масло (DPF) 8л.',
            MATERIAL_PRICE: '---',
            SERVICE_NAME: 'Замена моторного масла (без снятия защиты ДВС)',
            SERVICE_PRICE: '---'
        }
    ]
    const output = {
        works: [
            {name: 'Замена моторного масла (без снятия защиты ДВС)', price: 0}
        ],
        materials: [{name: 'Моторное масло (DPF) 8л.', price: 0}]
    }
    expect(convertResults(input)).toEqual(output)
})

test('convertion with no work', () => {
    const input = [
        {
            MATERIAL_NAME: 'Моторное масло (DPF) 8л.',
            MATERIAL_PRICE: '5600',
            SERVICE_NAME: '---',
            SERVICE_PRICE: '---'
        }
    ]
    const output = {
        works: [],
        materials: [{name: 'Моторное масло (DPF) 8л.', price: 5600}]
    }
    expect(convertResults(input)).toEqual(output)
})

test('convertion with no material', () => {
    const input = [
        {
            MATERIAL_NAME: '---',
            MATERIAL_PRICE: '---',
            SERVICE_NAME: 'Замена моторного масла (без снятия защиты ДВС)',
            SERVICE_PRICE: '600'
        }
    ]
    const output = {
        works: [
            {name: 'Замена моторного масла (без снятия защиты ДВС)', price: 600}
        ],
        materials: []
    }
    expect(convertResults(input)).toEqual(output)
})
