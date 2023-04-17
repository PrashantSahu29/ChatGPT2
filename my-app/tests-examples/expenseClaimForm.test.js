const { firefox } = require('playwright');

describe('Expense Claim Form', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await firefox.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000/expense-claim-form');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  const fillForm = async (category, amount, receiptDate, description) => {
    await page.fill('#category', category);
    await page.fill('#amount', amount);
    await page.fill('#receiptDate', receiptDate);
    await page.fill('#description', description);
    await page.click('#submit');
  };

  it('should submit the form with valid inputs for Telephone category', async () => {
    await fillForm('Telephone', '100', '2022-08-01', 'Monthly phone bill');
    await page.waitForSelector('.success-message');
  });

  it('should show error message when submitting form without filling required fields for Internet category', async () => {
    await page.selectOption('#category', 'Internet');
    await page.click('#submit');
    await page.waitForSelector('.error-message');
  });

  it('should show error message when submitting form with an invalid category for Medical category', async () => {
    await fillForm('invalidCategory', '250', '2022-08-01', 'Doctor appointment');
    await page.waitForSelector('.error-message');
  });

  it('should show error message when submitting form with claim amount that exceeds the maximum allowed for Travel category', async () => {
    await fillForm('Travel', '100000', '2022-08-01', 'Business trip');
    await page.waitForSelector('.error-message');
  });

  it('should show error message when submitting form with invalid receipt date for Telephone category', async () => {
    await fillForm('Telephone', '100', '2022-09-01', 'Monthly phone bill');
    await page.waitForSelector('.error-message');
  });

  it('should show error message when submitting form with description that exceeds the maximum character limit for Internet category', async () => {
    const longDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod dolor sit amet odio tempus, vel fringilla lacus aliquet. Sed ultrices tellus quis ligula luctus, et porttitor augue bibendum.';
    await fillForm('Internet', '50', '2022-08-01', longDescription);
    await page.waitForSelector('.error-message');
  });
});
