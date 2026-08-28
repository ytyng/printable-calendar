import { describe, expect, it } from 'vitest'
import { CalendarCell, MonthlyCalendar } from '../composables/calendar'

/**
 * 印刷用カレンダーの組み立て。
 * ここが崩れると A4 に印刷したときの見た目がそのまま壊れるので、
 * 「1 行 = 7 日」「先頭が日曜」「当月の日が過不足なく 1 回ずつ出る」を固定する。
 */

function flatten(rows: CalendarCell[][]) {
  return rows.flat()
}

describe('MonthlyCalendar', () => {
  it('すべての行がちょうど 7 日ある', () => {
    for (let month = 1; month <= 12; month++) {
      const rows = new MonthlyCalendar(2026, month).getRows()
      for (const row of rows) {
        expect(row.length, `2026-${month}`).toBe(7)
      }
    }
  })

  it('各行は日曜で始まり土曜で終わる', () => {
    for (let month = 1; month <= 12; month++) {
      const rows = new MonthlyCalendar(2026, month).getRows()
      for (const row of rows) {
        expect(row[0].dayOfWeek, `2026-${month}`).toBe(0)
        expect(row[6].dayOfWeek, `2026-${month}`).toBe(6)
      }
    }
  })

  it('当月の日がすべて 1 回ずつ、昇順で並ぶ', () => {
    for (let month = 1; month <= 12; month++) {
      const cells = flatten(new MonthlyCalendar(2026, month).getRows())
      const currentMonthDates = cells
        .filter((cell) => cell.isCurrentMonth)
        .map((cell) => cell.dateNumber)
      const lastDateNumber = new Date(2026, month, 0).getDate()
      const expected = Array.from({ length: lastDateNumber }, (_, i) => i + 1)
      expect(currentMonthDates, `2026-${month}`).toEqual(expected)
    }
  })

  it('前後の埋めが 1 つも要らない月は当月の日だけになる', () => {
    // 2026-02 は 1 日が日曜、28 日が土曜
    const cells = flatten(new MonthlyCalendar(2026, 2).getRows())
    expect(cells.length).toBe(28)
    expect(cells.every((cell) => cell.isCurrentMonth)).toBe(true)
  })

  it('当月に属さない日は isCurrentMonth が false になる', () => {
    // 2026-03 は 1 日が日曜ではなく 31 日が土曜でもないので、前後とも埋めが出る
    const rows = new MonthlyCalendar(2026, 3).getRows()
    const cells = flatten(rows)
    const notCurrent = cells.filter((cell) => !cell.isCurrentMonth)
    expect(notCurrent.length).toBeGreaterThan(0)
    // 当月に属さないと判定されたセルは、実際に 3 月以外の日付である
    for (const cell of notCurrent) {
      expect(cell.date.getMonth()).not.toBe(2)
    }
    // 逆に当月と判定されたセルは、すべて 3 月の日付である
    for (const cell of cells.filter((cell) => cell.isCurrentMonth)) {
      expect(cell.date.getMonth()).toBe(2)
      expect(cell.date.getFullYear()).toBe(2026)
    }
  })

  it('翌月だけの行を余分に作らない', () => {
    // 以前は末尾の埋めが (6 - lastDay + 7) だったため、
    // どの月にも「翌月の日だけの週」が 1 行増えていた。
    for (let month = 1; month <= 12; month++) {
      const rows = new MonthlyCalendar(2026, month).getRows()
      const lastRow = rows[rows.length - 1]
      expect(
        lastRow.some((cell) => cell.isCurrentMonth),
        `2026-${month} の最終行が翌月だけになっている`,
      ).toBe(true)
    }
  })

  it('必要最小限の行数になる', () => {
    // 2026-02: 日曜始まりの 28 日 → 4 行
    expect(new MonthlyCalendar(2026, 2).getRows().length).toBe(4)
    // 2026-08: 土曜始まりの 31 日 → 6 行
    expect(new MonthlyCalendar(2026, 8).getRows().length).toBe(6)
    // 2026-01: 木曜始まりの 31 日 → 5 行
    expect(new MonthlyCalendar(2026, 1).getRows().length).toBe(5)
  })

  it('前月・翌月の埋めは実際の日付になっている', () => {
    // 2026-01-01 は木曜。前の埋めは 2025-12-28 (日) 〜 12-31 (水)
    const rows = new MonthlyCalendar(2026, 1).getRows()
    const leading = rows[0].filter((cell) => !cell.isCurrentMonth)
    expect(leading.map((cell) => cell.dateNumber)).toEqual([28, 29, 30, 31])
    expect(leading[0].date.getFullYear()).toBe(2025)
    expect(leading[0].date.getMonth()).toBe(11)

    // 2026-01-31 は土曜なので、翌月の埋めは 1 つも出ない
    const lastRow = rows[rows.length - 1]
    expect(lastRow.every((cell) => cell.isCurrentMonth)).toBe(true)
    expect(lastRow[6].dateNumber).toBe(31)
  })

  it('うるう年の 2 月を 29 日まで出す', () => {
    const cells = flatten(new MonthlyCalendar(2024, 2).getRows())
    const currentMonthDates = cells
      .filter((cell) => cell.isCurrentMonth)
      .map((cell) => cell.dateNumber)
    expect(currentMonthDates[currentMonthDates.length - 1]).toBe(29)
  })

  it('12 月の翌月の埋めが翌年になる', () => {
    // 2026-12-31 は木曜なので、翌月の埋めは 2027-01-01 と 01-02
    const rows = new MonthlyCalendar(2026, 12).getRows()
    const trailing = rows[rows.length - 1].filter((cell) => !cell.isCurrentMonth)
    expect(trailing.map((cell) => cell.dateNumber)).toEqual([1, 2])
    expect(trailing[0].date.getFullYear()).toBe(2027)
    expect(trailing[0].date.getMonth()).toBe(0)
  })

  it('key は年月で一意になる', () => {
    expect(new MonthlyCalendar(2026, 1).key).toBe('2026-1')
    expect(new MonthlyCalendar(2026, 12).key).toBe('2026-12')
  })

  it('セルの key は日付ごとに異なる', () => {
    const cells = flatten(new MonthlyCalendar(2026, 3).getRows())
    const keys = new Set(cells.map((cell) => cell.key))
    expect(keys.size).toBe(cells.length)
  })
})

describe('CalendarCell', () => {
  it('dateNumber と dayOfWeek が日付から決まる', () => {
    // 2026-08-28 は金曜
    const cell = new CalendarCell(new Date(2026, 7, 28), true)
    expect(cell.dateNumber).toBe(28)
    expect(cell.dayOfWeek).toBe(5)
  })
})
