const { chromium } = require('playwright');

jest.setTimeout(40 * 1000);

describe('Expense claim form', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch({headless: false});

  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000/'); // Replace with your app URL
  });

  afterEach(async () => {
    await page.close();
  });

  test('Submitting the form successfully', async () => {
    await page.selectOption('#category', 'Telephone');
    await page.fill('#description', 'Sample description');
    await page.fill('#receipt-date', '2021-10-01');
    await page.fill('#claim-amount', '500');

    const submitButton = await page.$('button[type="submit"]');
    await submitButton.click();

    // Assume that Sweet Alert success message is displayed after submitting the form successfully
    await page.waitForSelector('.swal2-success');
  });

  test('Submitting the form with empty required fields', async () => {
    const submitButton = await page.$('button[type="submit"]');
    await submitButton.click();

    // Assume that Toastify error message is displayed after submitting the form with empty required fields
    await page.waitForSelector('.Toastify__toast--error');
  });

  test('Submitting the form with invalid category', async () => {
    await page.selectOption('#category', 'Invalid Category');
    await page.fill('#description', 'Sample description');
    await page.fill('#receipt-date', '2021-10-01');
    await page.fill('#claim-amount', '500');

    const submitButton = await page.$('button[type="submit"]');
    await submitButton.click();

    // Assume that Toastify error message is displayed after submitting the form with invalid category
    await page.waitForSelector('.Toastify__toast--error');
  });

  test('Submitting the form with claim amount exceeding maximum allowed', async () => {
    await page.selectOption('#category', 'Travel');
    await page.fill('#description', 'Sample description');
    await page.fill('#receipt-date', '2021-10-01');
    await page.fill('#claim-amount', '30000');

    const submitButton = await page.$('button[type="submit"]');
    await submitButton.click();

    // Assume that Toastify error message is displayed after submitting the form with claim amount exceeding maximum allowed
    await page.waitForSelector('.Toastify__toast--error');
  });

  test('Submitting the form with invalid receipt date', async () => {
    await page.selectOption('#category', 'Telephone');
    await page.fill('#description', 'Sample description');
    await page.fill('#receipt-date', '2022-10-01'); // Future date
    await page.fill('#claim-amount', '500');

    const submitButton = await page.$('button[type="submit"]');
    await submitButton.click();

    // Assume that Toastify error message is displayed after submitting the form with invalid receipt date
    await page.waitForSelector('.Toastify__toast--error');
  });
});
