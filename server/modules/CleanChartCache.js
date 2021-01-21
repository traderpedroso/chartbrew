const moment = require("moment");
const { CronJob } = require("cron");

const db = require("../models/models");

function clean() {
  return db.ChartCache.findAll()
    .then((cache) => {
      const cleanPromises = [];
      for (const item of cache) {
        const timeDiff = moment().diff(item.createdAt, "hours");

        if (timeDiff > 23) {
          // clean the data field in each cache item
          cleanPromises.push(db.ChartCache.update({ data: null }, { where: { id: item.id } }));
        }
      }

      if (cleanPromises.length > 0) return Promise.all(cleanPromises);

      return [];
    })
    .catch(() => {
      console.log("Error while cleaning the chart caches. You might want to delete them manually"); // eslint-disable-line
    });
}

module.exports = () => {
  clean();

  // now run the cron job every hour
  const cron = new CronJob("0 0 * * * *", () => {
    clean();
  });

  cron.start();

  return cron;
};
