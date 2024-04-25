import playwright from "playwright";
import { printTable } from "console-table-printer";

export default class utils {
  static async takeScreenshot(
    page: playwright.Page,
    fileName: string,
    msg: string
  ) {
    console.log(msg);
    await page.screenshot({
      path: `screenshot/${fileName}.png`,
      fullPage: true,
    });
  }

  static printTableData(data: any) {
    printTable(data);
  }
}
