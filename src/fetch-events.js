import fetch from "node-fetch"
import { writeFileSync } from "fs"
import ical from "ical-generator"

fetch("https://api.koobit.com/website/api/en/zzz/event-search?venueId=94&maxResultsNextLoad=100")
  .then(res => res.json())
  .then(data => {
    const cal = ical({ name: "Old Trafford Events" })
    for (const ev of data.data["event-cards"]) {
      const isValid = /^\d{4}-\d{2}-\d{2}$/g.test(ev.schema.startDate)
      if (isValid) {
        cal.createEvent({
          start: ev.schema.startDate,
          end: ev.schema.endDate,
          summary: ev.schema.name,
          allDay: true,
        })
      }
    }

    console.log(`Successfully created calendar containing ${cal.events().length} event(s)`)
    writeFileSync("resources/calendar.ics", cal.toString())
  })