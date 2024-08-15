import fetch from "node-fetch"
import { writeFileSync } from "fs"
import ical from "ical-generator"

fetch("https://api.koobit.com/website/api/en/zzz/event-search?venueId=94&maxResultsNextLoad=100")
  .then(res => res.json())
  .then(async data => {
    const cal = ical({ name: "Old Trafford Events" })
    for (const ev of data.data["event-cards"]) {
      const isValid = /^\d{4}-\d{2}-\d{2}/g.test(ev.schema.startDate)
      if (isValid) {
        let schedule

        try {
          const secondaryRes = await fetch(`https://api.koobit.com/website/api/en/zzz/event/cd-${ev.id}/home-secondary?embedded`)
          const secondaryData = await secondaryRes.json()
          // const secondaryData = JSON.parse(readFileSync(`dump/${ev.id}.json`))
          // writeFileSync(`dump/${ev.id}.json`, JSON.stringify(secondaryData, null, 2))
  
          schedule = secondaryData.data.scheduleData.performances.find(p => p.activity === "Football")
        }
        catch { }

        if (schedule) {
          cal.createEvent({
            start: schedule.isoDate,
            end: schedule.isoDate.replace(schedule.startTime, schedule.endTime),
            summary: ev.schema.name,
          })
        }
        else {
          cal.createEvent({
            start: ev.schema.startDate,
            end: ev.schema.endDate,
            summary: ev.schema.name,
            allDay: true,
          })
        }
      }

      // We're not in a rush for the results, let's take our time so we don't get IP banned
      await new Promise(res => setTimeout(res, 1000))
    }

    console.log(`Successfully created calendar containing ${cal.events().length} event(s)`)
    writeFileSync("resources/calendar.ics", cal.toString())
  })