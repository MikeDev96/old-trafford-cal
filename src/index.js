import express from 'express';
import cron from 'node-cron';
import { exec } from 'child_process';
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = process.env.PORT ?? 4000

app.get('/calendar', (req, res) => res.sendFile("resources/calendar.ics", { root: "." }))
app.get('/money-transfer', (req, res) => res.sendFile("resources/money-transfer.ics", { root: "." }))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

cron.schedule('0 5 * * *', function() {
  exec('node src/fetch-events.js', (error, stdout, stderr) => {
      if (error) {
          console.log(`Error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`Stderr: ${stderr}`);
          return;
      }
      console.log(`Stdout: ${stdout}`);
  });
});

cron.schedule('0 6 * * *', function() {
  exec('node src/create-money-transfer-cal.js', (error, stdout, stderr) => {
      if (error) {
          console.log(`Error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`Stderr: ${stderr}`);
          return;
      }
      console.log(`Stdout: ${stdout}`);
  });
});