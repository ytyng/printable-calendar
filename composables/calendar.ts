class CalendarCell {
  constructor(
    public date: Date,
    public isCurrentMonth: boolean,
  ) {
    this.date = date
    this.isCurrentMonth = isCurrentMonth
  }

  get key() {
    return this.date.toISOString()
  }

  get day() {
    return this.date.getDate()
  }
}


class MonthlyCalendar{
  constructor(
    public year: number,
    public month: number,
  ) {
    this.year = year
    this.month = month
  }

  get key() {
    return `${this.year}-${this.month}`
  }

  getRows() {
    const firstDate = new Date(this.year, this.month - 1, 1)
    const lastDate = new Date(this.year, this.month, 0)
    const firstDay = firstDate.getDay()
    const lastDay = lastDate.getDay()
    const lastDateNumber = lastDate.getDate()

    const rows = []
    let row = []
    for (let i = 0; i < firstDay; i++) {
      row.push(new CalendarCell(new Date(this.year, this.month - 1, -firstDay + i + 1), false))
    }
    for (let i = 1; i <= lastDateNumber; i++) {
      row.push(new CalendarCell(new Date(this.year, this.month - 1, i), true))
      if (row.length % 7 === 0) {
        rows.push(row)
        row = []
      }
    }
    for (let i = 0; i < (6 - lastDay); i++) {
      row.push(new CalendarCell(new Date(this.year, this.month, i + 1), false))
    }
    rows.push(row)
    return rows

  }
}


export const useCalendar = () => {
  const year = useState<number>('year', () => new Date().getFullYear())

  function* getMonthlyCalendars() {
    for (let i = 1; i <= 12; i++) {
      yield new MonthlyCalendar(year.value, i)
    }
  }
  return {
    year,
    getMonthlyCalendars,
  }

}
