const schedule = require("node-schedule");

schedule.scheduleJob("*/10 * * * * *", function () {
  console.log("scheduled every 10 seconds");
});
