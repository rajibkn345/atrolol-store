# Task: Display Prices as Integers (No Decimal Points)

## Objective
Change all price displays throughout the project to show whole numbers without decimal points (e.g., 1999 instead of 19.99 or 1999.00).

## Scope
Update price formatting across the entire Shopify theme to handle integer display efficiently.

---

## Task Plan

### 1. Analyze Current Price Implementation
- [ ] Search for all price display patterns in Liquid files
- [ ] Identify JavaScript files handling price formatting
- [ ] Locate CSS files with price-related styling
- [ ] Check locale files for currency formatting
- [ ] Review Shopify price filters currently in use (e.g., `money`, `money_with_currency`)

**Files to check:**
- `snippets/price.liquid` - Main price snippet
- `assets/*.js` - JavaScript files with price calculations
- All template and section files using price displays

---

### 2. Create Centralized Price Format Filter/Function

#### Option A: Liquid Filter Approach
- [ ] Modify or create a custom Liquid snippet for integer price formatting
- [ ] Use Shopify's `money_without_trailing_zeros` filter if this in udpated shopify docs
- [ ] Remove decimal separator from money format strings

#### Option B: JavaScript Approach
- [ ] Create a utility function in `assets/theme.js` or dedicated file
- [ ] Format: `formatPriceAsInteger(price)`
- [ ] Handle currency symbols and positioning
- [ ] Ensure compatibility with VAT toggle functionality

**Recommended approach:**
```liquid
{{ price | money_without_trailing_zeros | remove: '.00' | remove: ',00' }}
```

Or update locale settings to have no decimals in money format.

---

### 3. Update Locale Configuration
- [ ] Open all locale JSON files in `locales/` directory
- [ ] Update `money_format` and `money_with_currency_format` settings
- [ ] Remove decimal placeholders (`.{{amount}}` → `{{amount}}`)
- [ ] Ensure consistency across all languages (EN, DE, ES, FR, IT, SV, VI)

**Example change:**
```json
// Before
"money_format": "{{amount}} kr"  // Shows 19.99 kr

// After
"money_format": "{{amount_no_decimals}} kr"  // Shows 20 kr
```

---

### 4. Update Price Snippet
- [ ] Modify `snippets/price.liquid`
- [ ] Update all price output locations
- [ ] Handle regular price, compare-at price, sale price
- [ ] Ensure VAT calculations still work correctly

**Key locations in snippet:**
- Regular price display
- Sale/discount price display
- Price per item calculations
- Unit price displays

---

### 5. Update JavaScript Price Formatting
- [ ] Search for JavaScript files manipulating prices:
  - `assets/cart.js`
  - `assets/product-info.js`
  - `assets/variant-selects.js`
  - `assets/vat-toggle*.js`
  - `assets/price-per-item.js`

- [ ] Update `Shopify.formatMoney()` calls
- [ ] Modify any custom price formatting functions
- [ ] Test dynamic price updates (variant changes, quantity changes)

**Pattern to find:**
```javascript
Shopify.formatMoney(price, theme.moneyFormat)
```

---

### 6. Update Specific Components

#### Cart System
- [ ] `sections/cart-drawer.liquid`
- [ ] `sections/main-cart.liquid`
- [ ] `assets/cart.js`
- [ ] Cart total, subtotal, line item prices

#### Product Pages
- [ ] `sections/main-product.liquid`
- [ ] `snippets/product-*.liquid` files
- [ ] Quick view modal
- [ ] Product cards (all variants)

#### Collection Pages
- [ ] Product grid price displays
- [ ] Filter price ranges
- [ ] Sort by price functionality

#### Checkout & Order
- [ ] Order confirmation displays
- [ ] Account order history

---

### 7. Handle Edge Cases
- [ ] Prices ending in .00 → Display as integer
- [ ] Prices ending in .50, .99 → Round or display as needed
- [ ] Multi-currency support (if enabled)
- [ ] Gift card values
- [ ] Discount amounts
- [ ] Shipping costs

**Rounding strategy:**
- Define clear rounding rules (round up/down/nearest)
- Document the approach for consistency

---

### 8. VAT Toggle Compatibility
- [ ] Ensure VAT price calculations work with integer display
- [ ] Update `assets/vat-toggle.js` and related files
- [ ] Test price switching between VAT inclusive/exclusive
- [ ] Verify calculations maintain accuracy despite display format

---

### 9. Testing Checklist
- [ ] Product page: Regular price display
- [ ] Product page: Sale/compare-at price display
- [ ] Product page: Variant price changes
- [ ] Product cards in collections
- [ ] Cart page and cart drawer
- [ ] Search results
- [ ] Quick view modals
- [ ] Product bundles pricing
- [ ] Volume/quantity pricing
- [ ] VAT toggle functionality
- [ ] Multi-language price displays
- [ ] Mobile responsive price display
- [ ] Gift cards

---

### 10. Documentation & Deployment
- [ ] Document the changes made
- [ ] Create backup of current theme
- [ ] Test on development/staging theme first
- [ ] Review all price displays manually
- [ ] Deploy to production
- [ ] Monitor for issues post-deployment

---

## Files to Modify (Preliminary List)

### High Priority
1. `locales/*.json` - Currency format settings
2. `snippets/price.liquid` - Main price component
3. `assets/theme.js` - Core theme JavaScript
4. `assets/vat-toggle.js` - VAT calculation logic

### Medium Priority
5. `assets/cart.js`
6. `assets/product-info.js`
7. `assets/variant-selects.js`
8. `sections/main-product.liquid`
9. `sections/cart-drawer.liquid`
10. `snippets/card-product*.liquid`

### Lower Priority (Review & Test)
11. All product card snippets
12. Bundle and comparison components
13. Quick view components
14. Search templates

---

## Implementation Strategy

**Recommended Order:**
1. Start with locale configuration (easiest, most impactful)
2. Update price snippet as central component
3. Modify JavaScript formatting functions
4. Test and fix edge cases
5. Update remaining components systematically

**Efficiency Tips:**
- Use global search/replace for common patterns
- Test incrementally after each major change
- Keep a rollback plan ready
- Use Shopify CLI for rapid testing

---

## Estimated Effort
- Analysis: 2-3 hours
- Locale & snippet updates: 1-2 hours
- JavaScript modifications: 2-3 hours
- Component updates: 3-4 hours
- Testing: 3-4 hours
- **Total: 11-16 hours**

---

## Success Criteria
✓ All prices display as whole numbers (no decimals)
✓ VAT toggle still functions correctly
✓ Cart calculations are accurate
✓ Price updates work dynamically (variants, quantity)
✓ Multi-language support maintained
✓ No console errors
✓ Consistent formatting across all pages
