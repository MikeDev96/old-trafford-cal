import { writeFileSync } from "fs"
import ical from "ical-generator"
import Holidays from "date-holidays"
import { DateTime } from "luxon"

const hd = new Holidays("GB", "ENG")
const cal = ical({ name: "Mike Money Transfer" })

let dt = DateTime.now().startOf("month").plus({ days: 14, hours: 10 })

while ([6, 7].includes(dt.weekday) || Array.from(hd.isHoliday(dt.toISODate()))?.some(h => h.type === "public")) {
  dt = dt.minus({ days: 1 })
}

cal.createEvent({
  start: dt.toISO(),
  end: dt.plus({ hours: 1 }).toISO(),
  summary: `Mike ${dt.monthShort} Money Transfer`,
})

writeFileSync("resources/money-transfer.ics", cal.toString())
