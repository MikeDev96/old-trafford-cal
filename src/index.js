import express from 'express';
import cron from 'node-cron';
import { exec } from 'child_process';
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = process.env.PORT ?? 4000

app.get('/', (req, res) => {
  res.sendFile("resources/calendar.ics", { root: "." })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

cron.schedule('0 5 * * *', function() {
  exec('node fetch-events.js', (error, stdout, stderr) => {
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