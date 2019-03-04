import {convertModifications, convertResults} from './helpers'

describe('results converter', () => {
  test('basic convertion', () => {
    const input = [
      {
        MATERIAL_NAME: 'Моторное масло (DPF) 8л.',
        MATERIAL_PRICE: '5600',
        SERVICE_NAME: 'Замена моторного масла (без снятия защиты ДВС)',
        SERVICE_PRICE: '600',
      },
    ]
    const output = {
      works: [
        {
          name: 'Замена моторного масла (без снятия защиты ДВС)',
          price: 600,
        },
      ],
      materials: [{name: 'Моторное масло (DPF) 8л.', price: 5600}],
    }
    expect(convertResults(input)).toEqual(output)
  })

  test('convertion with zero prices', () => {
    const input = [
      {
        MATERIAL_NAME: 'Моторное масло (DPF) 8л.',
        MATERIAL_PRICE: '---',
        SERVICE_NAME: 'Замена моторного масла (без снятия защиты ДВС)',
        SERVICE_PRICE: '---',
      },
    ]
    const output = {
      works: [
        {
          name: 'Замена моторного масла (без снятия защиты ДВС)',
          price: 0,
        },
      ],
      materials: [{name: 'Моторное масло (DPF) 8л.', price: 0}],
    }
    expect(convertResults(input)).toEqual(output)
  })

  test('convertion with no work', () => {
    const input = [
      {
        MATERIAL_NAME: 'Моторное масло (DPF) 8л.',
        MATERIAL_PRICE: '5600',
        SERVICE_NAME: '---',
        SERVICE_PRICE: '---',
      },
    ]
    const output = {
      works: [],
      materials: [{name: 'Моторное масло (DPF) 8л.', price: 5600}],
    }
    expect(convertResults(input)).toEqual(output)
  })

  test('convertion with no material', () => {
    const input = [
      {
        MATERIAL_NAME: '---',
        MATERIAL_PRICE: '---',
        SERVICE_NAME: 'Замена моторного масла (без снятия защиты ДВС)',
        SERVICE_PRICE: '600',
      },
    ]
    const output = {
      works: [
        {
          name: 'Замена моторного масла (без снятия защиты ДВС)',
          price: 600,
        },
      ],
      materials: [],
    }
    expect(convertResults(input)).toEqual(output)
  })
})

describe('modification converter', () => {
  test('basic convertion', () => {
    const input = {
      67232: '3.5л., бензин, 249 л.с., 4х2 АКПП',
      67277: '3.5л., бензин, 249 л.с., 4х4 АКПП',
    }
    const output = [
      {id: 67232, value: '3.5л., бензин, 249 л.с., 4х2 АКПП'},
      {id: 67277, value: '3.5л., бензин, 249 л.с., 4х4 АКПП'},
    ]
    expect(convertModifications(input)).toEqual(output)
  })

  test('basic convertion', () => {
    const input = {
      67231: '3.5л., бензин, 249 л.с., 4х2 АКПП',
      67278: '3.5л., бензин, 249 л.с., 4х4 АКПП',
    }
    const output = [
      {id: 67231, value: '3.5л., бензин, 249 л.с., 4х2 АКПП'},
      {id: 67278, value: '3.5л., бензин, 249 л.с., 4х4 АКПП'},
    ]
    expect(convertModifications(input)).toEqual(output)
  })
})
