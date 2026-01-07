import cron from "node-cron";

export function initCronJobs() {
  // Runs at 00:00 every Sunday
  cron.schedule("0 0 * * 0", () => {
    console.log("Running Sunday quote submission open job");
    // TODO: open submissions, notify users
  });

  // Runs at 17:00 every Monday (example result publish)
  cron.schedule("0 17 * * 1", () => {
    console.log("Running weekly quote publish job");
    // TODO: tally votes, run AI moderation, publish winner
  });
}
