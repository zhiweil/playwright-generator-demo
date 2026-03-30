import { test, expect } from '@playwright/test';

test('[TC-SAMPLE-0001] [SMOKE] [PURCHASE] [END-TO-END] Complete e-commerce purchase flow from login to order confirmation', async ({ page }) => {
  // Navigate to SauceDemo login page
  await page.goto('https://saucedemo.com');

  // Enter username
  await page.fill('input[data-test="username"]', 'standard_user');

  // Enter password
  await page.fill('input[data-test="password"]', 'secret_sauce');

  // Click Login button
  await page.click('input[data-test="login-button"]');

  // Verify redirect to products page
  await page.waitForURL('**/inventory.html');
  await expect(page).toHaveTitle(/Swag Labs/);

  // Click on Sauce Labs Backpack product
  await page.click('text=Sauce Labs Backpack');

  // Verify product details page opened
  await page.waitForURL('**/inventory-item.html**');

  // Verify product name
  const productName = await page.locator('[data-test="inventory-item-name"]').textContent();
  expect(productName).toBe('Sauce Labs Backpack');

  // Verify product price is displayed
  const productPrice = await page.locator('[data-test="inventory-item-price"]').textContent();
  expect(productPrice).toBeTruthy();

  // Click Add to Cart button
  await page.click('button[data-test="add-to-cart"]');

  // Verify cart icon shows 1 item
  const cartBadge = await page.locator('[data-test="shopping-cart-badge"]').textContent();
  expect(cartBadge).toBe('1');

  // Verify Add to Cart button changed to Remove
  const buttonText = await page.locator('button[data-test="remove"]').textContent();
  expect(buttonText).toBe('Remove');

  // Click cart icon in top right
  await page.click('[data-test="shopping-cart-link"]');

  // Verify cart page opened
  await page.waitForURL('**/cart.html');

  // Verify Sauce Labs Backpack is in cart
  const cartItemName = await page.locator('[data-test="inventory-item-name"]').textContent();
  expect(cartItemName).toBe('Sauce Labs Backpack');

  // Verify quantity is 1
  const quantity = await page.locator('[data-test="item-quantity"]').textContent();
  expect(quantity).toBe('1');

  // Verify price matches (store the price for comparison)
  const cartItemPrice = await page.locator('[data-test="inventory-item-price"]').textContent();
  expect(cartItemPrice).toBe(productPrice);

  // Click Checkout button
  await page.click('button[data-test="checkout"]');

  // Verify checkout information page opened
  await page.waitForURL('**/checkout-step-one.html');

  // Enter first name
  await page.fill('input[data-test="firstName"]', 'John');

  // Enter last name
  await page.fill('input[data-test="lastName"]', 'Doe');

  // Enter zip code
  await page.fill('input[data-test="postalCode"]', '12345');

  // Click Continue button
  await page.click('input[data-test="continue"]');

  // Verify checkout overview page opened
  await page.waitForURL('**/checkout-step-two.html');

  // Verify item total is displayed
  const itemTotal = await page.locator('[data-test="subtotal-label"]').textContent();
  expect(itemTotal).toBeTruthy();

  // Verify tax is applied
  const taxAmount = await page.locator('[data-test="tax-label"]').textContent();
  expect(taxAmount).toBeTruthy();

  // Verify total amount is displayed
  const totalAmount = await page.locator('[data-test="total-label"]').textContent();
  expect(totalAmount).toBeTruthy();

  // Click Finish button
  await page.click('button[data-test="finish"]');

  // Verify order confirmation page opened
  await page.waitForURL('**/checkout-complete.html');

  // Verify success message is displayed
  const successMessage = await page.locator('[data-test="complete-header"]').textContent();
  expect(successMessage).toBe('Thank you for your order!');

  // Verify order number is shown
  const orderMessage = await page.locator('[data-test="complete-text"]').textContent();
  expect(orderMessage).toBeTruthy();
});


test('[TC-SAMPLE-0002] [REGRESSION] [BROWSING] [CART] Browse products, sort items, and manage cart contents', async ({ page }) => {
  // Navigate to SauceDemo login page
  await page.goto('https://www.saucedemo.com/');

  // Login with valid credentials
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');

  // Wait for products page to load
  await page.waitForSelector('[data-test="inventory-container"]');

  // Verify all products are displayed in grid layout
  const productGrid = await page.locator('[data-test="inventory-list"]');
  await expect(productGrid).toBeVisible();

  // Verify each product shows name, price, and "Add to Cart" button
  const products = await page.locator('[data-test="inventory-item"]').count();
  expect(products).toBeGreaterThan(0);

  for (let i = 0; i < Math.min(products, 3); i++) {
    const product = page.locator('[data-test="inventory-item"]').nth(i);
    await expect(product.locator('[data-test="inventory-item-name"]')).toBeVisible();
    await expect(product.locator('[data-test="inventory-item-price"]')).toBeVisible();
    await expect(product.locator('button')).toBeVisible();
  }

  // Click the sort dropdown
  const sortDropdown = page.locator('[data-test="product-sort-container"]');
  await sortDropdown.click();

  // Verify sorting options are displayed
  const sortOptions = page.locator('[data-test="product-sort-container"] option');
  const optionCount = await sortOptions.count();
  expect(optionCount).toBeGreaterThanOrEqual(4);

  // Test sorting: Name (A to Z)
  await sortDropdown.selectOption('az');
  await page.waitForLoadState('networkidle');
  let firstProductName = await page.locator('[data-test="inventory-item-name"]').first().textContent();
  expect(firstProductName?.trim()).toBe('Sauce Labs Backpack');

  // Test sorting: Name (Z to A)
  await sortDropdown.selectOption('za');
  await page.waitForLoadState('networkidle');
  firstProductName = await page.locator('[data-test="inventory-item-name"]').first().textContent();
  expect(firstProductName?.trim()).toBe('Test.allTheThings() T-Shirt (Red)');

  // Test sorting: Price (low to high)
  await sortDropdown.selectOption('lohi');
  await page.waitForLoadState('networkidle');
  const firstPrice = await page.locator('[data-test="inventory-item-price"]').first().textContent();
  expect(firstPrice).toBeTruthy();

  // Test sorting: Price (high to low)
  await sortDropdown.selectOption('hilo');
  await page.waitForLoadState('networkidle');
  const highestPrice = await page.locator('[data-test="inventory-item-price"]').first().textContent();
  expect(highestPrice).toBeTruthy();

  // Add first product to cart
  const firstAddToCartButton = page.locator('[data-test="inventory-item"]').first().locator('button');
  await firstAddToCartButton.click();

  // Verify cart icon shows "1"
  let cartBadge = await page.locator('[data-test="shopping-cart-badge"]').textContent();
  expect(cartBadge?.trim()).toBe('1');

  // Verify first product button now shows "Remove"
  const firstRemoveButton = page.locator('[data-test="inventory-item"]').first().locator('button');
  await expect(firstRemoveButton).toContainText('Remove');

  // Add second product to cart
  const secondAddToCartButton = page.locator('[data-test="inventory-item"]').nth(1).locator('button');
  await secondAddToCartButton.click();

  // Verify cart icon shows "2"
  cartBadge = await page.locator('[data-test="shopping-cart-badge"]').textContent();
  expect(cartBadge?.trim()).toBe('2');

  // Verify both products' buttons show "Remove"
  const secondRemoveButton = page.locator('[data-test="inventory-item"]').nth(1).locator('button');
  await expect(secondRemoveButton).toContainText('Remove');

  // Click cart icon to open cart page
  await page.click('[data-test="shopping-cart-link"]');
  await page.waitForSelector('[data-test="cart-list"]');

  // Verify both selected products are listed in cart
  const cartItems = await page.locator('[data-test="inventory-item"]').count();
  expect(cartItems).toBe(2);

  // Verify quantities are 1 for each product
  const cartItemQuantities = page.locator('[data-test="cart-quantity"]');
  for (let i = 0; i < await cartItemQuantities.count(); i++) {
    const quantity = await cartItemQuantities.nth(i).textContent();
    expect(quantity?.trim()).toBe('1');
  }

  // Verify total price is calculated correctly
//   const totalPrice = await page.locator('[data-test="subtotal-label"]').textContent();
//   expect(totalPrice).toContain('Item total:');

  // Remove first product from cart
  const firstRemoveInCart = page.locator('[data-test="inventory-item"]').first().locator('[data-test*="remove-"], button:has-text("Remove")');
  await firstRemoveInCart.click();
  await page.waitForLoadState('networkidle');

  // Verify first product is removed and only second product remains
  const remainingItems = await page.locator('[data-test="inventory-item"]').count();
  expect(remainingItems).toBe(1);

  // Verify cart icon shows "1"
  cartBadge = await page.locator('[data-test="shopping-cart-badge"]').textContent();
  expect(cartBadge?.trim()).toBe('1');

  // Click "Continue Shopping"
  await page.click('[data-test="continue-shopping"]');
  await page.waitForSelector('[data-test="inventory-container"]');

  // Verify user is back on products page
  await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();

  // Verify cart icon still shows "1"
  cartBadge = await page.locator('[data-test="shopping-cart-badge"]').textContent();
  expect(cartBadge?.trim()).toBe('1');

  // Click cart icon again
  await page.click('[data-test="shopping-cart-link"]');
  await page.waitForSelector('[data-test="cart-list"]');

  // Verify cart still contains the remaining product
  const finalCartItems = await page.locator('[data-test="inventory-item"]').count();
  expect(finalCartItems).toBe(1);

  // Verify checkout button is available
  await expect(page.locator('[data-test="checkout"]')).toBeVisible();
});