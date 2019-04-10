function convertOldnessYearToReleaseYear(year) {
  const currentYear = 2019
  const diff = currentYear - year
  return `${diff} год выпуска`
}

export default [
  { id: 1, value: `15000 км или ${convertOldnessYearToReleaseYear(1)}` },
  { id: 2, value: `30000 км или ${convertOldnessYearToReleaseYear(2)}` },
  { id: 3, value: `45000 км или ${convertOldnessYearToReleaseYear(3)}` },
  { id: 4, value: `60000 км или ${convertOldnessYearToReleaseYear(4)}` },
  { id: 5, value: `75000 км или ${convertOldnessYearToReleaseYear(5)}` },
  { id: 6, value: `90000 км или ${convertOldnessYearToReleaseYear(6)}` },
  { id: 7, value: `105000 км или ${convertOldnessYearToReleaseYear(7)}` },
  { id: 8, value: `120000 км или ${convertOldnessYearToReleaseYear(8)}` },
  { id: 9, value: `135000 км или ${convertOldnessYearToReleaseYear(9)}` },
  { id: 10, value: `150000 км или ${convertOldnessYearToReleaseYear(10)}` },
]
