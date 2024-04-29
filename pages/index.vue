<script lang="ts" setup>
const calendar = useCalendar()
const route = useRoute()

if (route.query.year) {
  calendar.year.value = Number(route.query.year)
}

</script>
<template>
  <div>
    <div class="browser-header">
      {{ calendar.year }}
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
          <thead>
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

    .day-cell {
      font-size: 10mm;
      padding: 10mm 0;
      text-align: center;
      border: 0.1mm solid #ccc;

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
