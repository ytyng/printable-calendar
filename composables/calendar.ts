export class CalendarCell {
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

  get dateNumber() {
    return this.date.getDate()
  }

  get dayOfWeek() {
    return this.date.getDay()
  }
}


export class MonthlyCalendar {
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

    // 日付をcells にどんどん溜めていき、最後に7でチャンクする
    const cells: CalendarCell[] = []

    for (let i = 0; i < firstDay; i++) {
      cells.push(new CalendarCell(new Date(this.year, this.month - 1, -firstDay + i + 1), false))
    }
    for (let i = 1; i <= lastDateNumber; i++) {
      cells.push(new CalendarCell(new Date(this.year, this.month - 1, i), true))
    }
    // 末尾は「土曜まで」を埋める。lastDay は 0 (日) 〜 6 (土) なので 6 - lastDay で足りる。
    // ここに + 7 が入っていたため、どの月にも翌月だけの週が 1 行余分に出ていた。
    for (let i = 0; i < 6 - lastDay; i++) {
      cells.push(new CalendarCell(new Date(this.year, this.month, i + 1), false))
    }
    // 7 でチャンクする
    const rows: CalendarCell[][] = []
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7))
    }
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
