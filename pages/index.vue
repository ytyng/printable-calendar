<script lang="ts" setup>
const calendar = useCalendar()
const route = useRoute()
const router = useRouter()

if (route.query.year) {
  calendar.year.value = Number(route.query.year)
}

const calendarHeaders = [
  '日', '月', '火', '水', '木', '金', '土'
]

function yearChanged(event: Event) {
  const target = event.target as HTMLInputElement
  const year = Number(target.value)
  calendar.year.value = year
  router.push({query: {year: year.toString()}})
}

function print() {
  window.print()
}

</script>
<template>
  <div>
    <div class="browser-header">
      <input :value="calendar.year.value"
             @input="yearChanged"
             class="year-input"
      >
      <button @click="print()" class="print-button">Print</button>
    </div>
    <div
      v-for="mc in calendar.getMonthlyCalendars()"
      :key="mc.key"
      class="sheet monthly-calendar"
    >
      <div class="calendar-header">
        <div class="month">{{ mc.month }}</div>
        <div class="year">{{ mc.year }}</div>
      </div>
      <div class="calendar-table-wrapper">
        <table class="calendar-table">
          <thead v-if="calendarHeaders && calendarHeaders.length">
          <tr>
            <th v-for="(header, rowIndex) in calendarHeaders"
                :key="`header-${rowIndex}`" :class="[`dow-${rowIndex}`]">{{ header }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(row, rowIndex) in mc.getRows()"
            :key="`${mc.key}-${rowIndex}`"
            class="calendar-row"
          >
            <td v-for="cell in row" :key="cell.key"
                class="day-cell"
                :class="[`dow-${cell.dayOfWeek}`, cell.isCurrentMonth ? 'current-month' : 'no-current-month']">
              {{ cell.dateNumber }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.year-input {
  background-color: #ccc;
  border: none;
  outline: none;
  padding: 0.3em;
  font-size: 16px;
  border-radius: 0.3em;
}

.print-button {
  background: none;
  border: none;
  outline: none;
  padding: 0.3em;
  font-size: 16px;
  margin-left: 1em;
  color: #ddd;
  cursor: pointer;
}

.monthly-calendar {
  display: flex;
  flex-direction: column;

  .calendar-header {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .month {
      font-size: 40mm;
      line-height: 1;
      color: #666;
    }

    .year {
      font-size: 10mm;
      letter-spacing: 2mm;
      margin-left: 2mm;
      color: #999;
    }
  }

  .calendar-table-wrapper {
    margin: 0 5mm 5mm 5mm;
  }

  .calendar-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    th {
      padding: 2mm 0;
      text-align: center;
      border: solid #ccc;
      border-width: 0.7mm 0.3mm;

      color: #555;

      &.dow-0 {
        color: #cc5555;
      }

      &.dow-6 {
        color: #5555cc;
      }
    }

    .day-cell {
      font-size: 10mm;
      padding: 10mm 0;
      text-align: center;
      border: solid #ccc;
      border-width: 0.7mm 0.3mm;

      &.dow-0 {
        color: #aa0000;
      }

      &.dow-6 {
        color: #0000aa;
      }

      &.no-current-month {
        color: #aaa;

        &.dow-0 {
          color: #eeaaaa;
        }

        &.dow-6 {
          color: #aaaaee;
        }
      }
    }
  }
}
</style>
