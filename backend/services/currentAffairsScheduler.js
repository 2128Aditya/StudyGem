const cron = require("node-cron");

const {
  updateCurrentAffairs,
} = require("./currentAffairsService");

let isUpdating = false;

const runCurrentAffairsUpdate = async () => {
  if (isUpdating) {
    console.log(
      "Current Affairs update is already running. Skipping..."
    );

    return;
  }

  try {
    isUpdating = true;

    console.log(
      "Starting scheduled Current Affairs update..."
    );

    const result =
      await updateCurrentAffairs();

    console.log(
      "Scheduled Current Affairs update finished:",
      result
    );
  } catch (error) {
    console.error(
      "Scheduled Current Affairs update failed:",
      error.message
    );
  } finally {
    isUpdating = false;
  }
};

const startCurrentAffairsScheduler = () => {
  cron.schedule(
    "0 7 * * *",
    async () => {
      console.log(
        "⏰ 7:00 AM IST - Current Affairs scheduler triggered."
      );

      await runCurrentAffairsUpdate();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log(
    "📚 Current Affairs scheduler started."
  );

  console.log(
    "⏰ Daily update scheduled for 7:00 AM IST."
  );
};

module.exports = {
  startCurrentAffairsScheduler,
  runCurrentAffairsUpdate,
};