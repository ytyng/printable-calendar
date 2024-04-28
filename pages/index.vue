<script lang="ts" setup>
const calendar = useCalendar()
const route = useRoute()

if (route.query.year) {
  calendar.year.value = Number(route.query.year)
}


</script>
<template>
  <div>
    index
    {{ calendar.year }}
    <div
      v-for="mc in calendar.getMonthlyCalendars()"
      :key="mc.key"
      class="monthly-calendar"
    >
      {{ mc.year }} -
      {{ mc.month }}

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
          class="day-cell">
            {{ cell.day }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.monthly-calendar {
  .calendar-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    border: 1px solid #ccc;
    margin-top: 10px;

    .day-cell{
      font-size: 5mm;
      padding: 2mm;
    }
  }
}
</style>
