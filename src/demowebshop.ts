import playwright from "playwright";
import utils from "./utils";

export default class demowebshop {
  page: playwright.Page;

  constructor(page: playwright.Page) {
    this.page = page;
  }

  async init() {
    await this.page.goto("https://demowebshop.tricentis.com/");
    await this.page.waitForLoadState("networkidle");
    await this.takeScreenshot("home");
  }

  async login() {
    if (!process.env.APP_USERNAME || !process.env.APP_PASSWORD)
      throw "Please provide APP_USERNAME and APP_USERNAME in .env file";

    await this.page.getByText("Log in").click();
    await this.page.waitForLoadState("networkidle");
    await this.page.fill("#Email", process.env.APP_USERNAME);
    await this.page.fill("#Password", process.env.APP_PASSWORD);
    await this.takeScreenshot("login");

    await this.page.click(".login-button");
    await this.page.waitForLoadState("networkidle");
    await this.takeScreenshot("after-login");
  }

  async takeScreenshot(msg: string) {
    await utils.takeScreenshot(
      this.page,
      "demowebshop-" + msg,
      "Screenshotting demowebshop " + msg + " page"
    );
  }

  async goToOrders() {
    await this.page.getByText("Orders").click();
    await this.page.waitForLoadState("networkidle");
    await this.takeScreenshot("orders");
  }

  async getAllOrderItems() {
    await this.goToOrders();
    const orders = await this.page.locator(".order-item").all();
    let isFirstItem = true;
    const allOrders: any = [];

    for (const order of orders) {
      if (isFirstItem) {
        isFirstItem = false;
      } else {
        await this.goToOrders();
      }

      const orderNo = (await order.locator(".title").innerText()).split(
        "Order Number: "
      )[1];
      const orderDate = (
        await order.locator(".info li:nth-child(2)").innerHTML()
      ).split("Order Date: ")[1];
      console.log(
        "Going to the orderNo: ",
        orderNo,
        ", orderDate: ",
        orderDate
      );
      await order.locator(".order-details-button").click();
      await this.page.waitForLoadState("networkidle");
      await this.takeScreenshot("orders-" + orderNo);

      const orderItems = await this.page.locator(".data-table tbody tr").all();
      for (const item of (await orderItems).slice(0, orderItems.length - 1)) {
        const name = (await item.locator(".name").innerText()).split("\n")[0];
        const price = await item.locator(".price").innerText();
        const quantity = await item.locator(".quantity").innerText();
        const total = await item.locator(".total").innerText();
        allOrders.push({
          "Order Number": orderNo,
          "Order Date": orderDate,
          "Item Name": name,
          Price: price,
          Quantity: quantity,
          Total: total,
        });
      }
    }

    return allOrders;
  }
}
