import "dotenv/config";
import retry from "async-retry";
import playwright from "playwright";

import utils from "./utils";
import Demowebshop from "./demowebshop";

async function main() {
  const browser = await playwright.chromium.launch({
    headless: true,
  });
  const page = await browser.newPage();
  console.log("Launched the browser");

  try {
    const demowebshop = new Demowebshop(page);
    await demowebshop.init();
    await demowebshop.login();
    const orderItems = await demowebshop.getAllOrderItems();
    utils.printTableData(orderItems);
  } catch (e) {
    await utils.takeScreenshot(page, "error", "Error");
    throw e;
  } finally {
    await browser.close();
  }
}

await retry(main, {
  retries: 3,
  onRetry: (err) => {
    console.error("retrying...", err);
  },
});
