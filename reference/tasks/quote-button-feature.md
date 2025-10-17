# Quote Button Feature - Task Plan

## Overview
Add a quote request button alongside the buy button on product pages. When clicked, it opens a modal form that collects customer information and product details, then sends an email to info@totallager.se.

## Requirements Summary
1. Quote button positioned before buy button
2. Both buttons should be 50% width each on the same line
3. Modal form with product details pre-filled
4. Form fields: Product name (auto-loaded), Phone, Email, GDPR checkbox
5. Email sent to: info@totallager.se
6. Success message displayed for 5 seconds after submission
7. Professional Swedish language interface (matching screenshot)

---

## Task Breakdown

### Phase 1: Frontend Structure & Styling

#### Task 1.1: Create Quote Button Snippet
**File:** `snippets/quote-button.liquid`
- Create new Liquid snippet for the quote button
- Add button with proper classes for 50% width
- Match styling to existing buy button
- Add data attributes for JavaScript functionality
- Include icon if needed (matching existing button style)

#### Task 1.2: Modify Buy Buttons Layout
**File:** `snippets/buy-buttons.liquid` (line 293-364)
- Modify the `.product-form__buttons` container
- Create flex layout for quote + buy buttons to be inline
- Set each button to 50% width (with gap consideration)
- Ensure responsive behavior on mobile devices
- Maintain existing functionality for dynamic checkout

#### Task 1.3: Create Quote Modal Component
**File:** `snippets/quote-modal.liquid`
- Create modal overlay structure
- Design modal card with proper styling
- Match Swedish text from screenshot:
  - Title: "Jag är intresserad av den här maskinen"
  - Subtitle: "Fyll i dina uppgifter så hör vi snabbt av oss med ett erbjudande!"
- Include close button (X icon)
- Add proper accessibility attributes (aria-labels, role, etc.)

#### Task 1.4: Create Quote Form Structure
**File:** Inside `snippets/quote-modal.liquid`
- Product name field (pre-filled, read-only)
- Phone number field (placeholder: "Telefon")
- Email field (placeholder: "E-post")
- GDPR checkbox with text: "Jag godkänner att mina personuppgifter behandlas i syfte att kontakta mig."
- Link: "Läs villkor" (Read terms)
- Submit button: "Jag vill bli kontaktad" (I want to be contacted)
- Success message container (initially hidden)

#### Task 1.5: Style Quote Modal
**File:** `assets/quote-modal.css` (new file)
- Modal overlay styling (backdrop blur/dark)
- Card styling (white background, rounded corners, shadow)
- Form field styling (rounded inputs matching screenshot)
- Button styling (gradient blue, with arrow icon)
- Success message styling (green border, professional layout)
- Responsive design for mobile devices
- Animation for modal open/close

---

### Phase 2: JavaScript Functionality

#### Task 2.1: Create Quote Modal Handler
**File:** `assets/quote-modal.js` (new file)
- Initialize modal functionality
- Open modal on quote button click
- Close modal on backdrop click or X button
- Close modal on ESC key press
- Prevent body scroll when modal is open
- Pre-fill product name from data attribute

#### Task 2.2: Implement Form Validation
**File:** Inside `assets/quote-modal.js`
- Validate phone number field (not empty)
- Validate email field (proper email format)
- Validate GDPR checkbox is checked
- Show inline error messages
- Disable submit button during submission
- Clear validation errors on input change

#### Task 2.3: Implement Form Submission
**File:** Inside `assets/quote-modal.js`
- Prevent default form submission
- Gather form data (product, phone, email)
- Prepare data for email sending
- Handle form submission via AJAX
- Show loading state during submission

---

### Phase 3: Backend Email Integration

#### Task 3.1: Create Email Sending Endpoint
**Option A:** Using Shopify App/Script
- Research Shopify email sending options
- Set up email service integration (Shopify Email, external service)
- Create endpoint to receive form data
**Option B:** Using External Service for shoipify contact form  (Recommended)
- Set up service like Formspree, Web3Forms, or EmailJS
- Configure service with destination email: info@totallager.se
- Get API endpoint/key for integration

#### Task 3.2: Implement Email Template
**File:** Email template configuration
- Subject: "Förfrågan om offert - [Product Name]"
- Body format:
  ```
  En ny offertförfrågan har kommit in:

  Produkt: [Product Name]
  Telefon: [Phone]
  E-post: [Email]

  Datum: [Timestamp]
  ```
- Professional Swedish formatting
- Include link to product page

#### Task 3.3: Handle Email Response
**File:** Inside `assets/quote-modal.js`
- Handle successful email send
- Handle error cases (network, server errors)
- Show appropriate messages to user
- Log errors for debugging

---

### Phase 4: Success Message & UX

#### Task 4.1: Create Success Message View
**File:** Inside `snippets/quote-modal.liquid`
- Success message text: "Tack, ditt meddelande har skickats. Vi återkommer så snart som möjligt!"
- Match styling from screenshot (green border box)
- Hide form fields when showing success
- Professional checkmark or success icon

#### Task 4.2: Implement Success Message Logic
**File:** Inside `assets/quote-modal.js`
- Hide form fields on success
- Show success message
- Auto-close modal after 5 seconds
- Reset form when modal closes
- Show form again for next submission

#### Task 4.3: Add Loading States
**File:** Inside `assets/quote-modal.js` and CSS
- Show loading spinner during submission
- Disable all form inputs during submission
- Change button text to "Skickar..." (Sending...)
- Prevent multiple submissions

---

### Phase 5: Integration & Testing

#### Task 5.1: Integrate Components in Product Template
**File:** `sections/main-product.liquid`
- Include quote modal snippet at appropriate location
- Pass product data to modal (name, ID, URL)
- Ensure proper loading order of JS/CSS

#### Task 5.2: Register Assets in Theme
**File:** `layout/theme.liquid` or `sections/main-product.liquid`
- Add CSS stylesheet link for quote-modal.css
- Add JavaScript file for quote-modal.js
- Ensure proper asset loading and optimization

#### Task 5.3: Test All Scenarios
- Test quote button click opens modal
- Test form validation (all fields)
- Test GDPR checkbox requirement
- Test email sending functionality
- Test success message display and timing
- Test modal close functionality (X, backdrop, ESC)
- Test responsive behavior on mobile
- Test with different products
- Test error handling scenarios

#### Task 5.4: Cross-browser Testing
- Test on Chrome, Firefox, Safari, Edge
- Test on iOS Safari and Chrome
- Test on Android Chrome
- Fix any browser-specific issues
- Ensure smooth animations across browsers

#### Task 5.5: Accessibility Testing
- Test with keyboard navigation only
- Test with screen reader
- Ensure proper focus management
- Check color contrast ratios
- Add missing ARIA labels if needed

---

### Phase 6: Polish & Optimization

#### Task 6.1: Performance Optimization
- Minimize CSS/JS files
- Lazy load modal content if possible
- Optimize animation performance
- Ensure fast modal open time

#### Task 6.2: Final Design Refinement
- Match exact colors from screenshot
- Perfect spacing and alignment
- Ensure consistent typography
- Polish hover/focus states
- Test on different screen sizes


---

## Technical Decisions

### Email Service Recommendation
**Recommended:** Use a third-party service like:
1. **FormSubmit** (https://formsubmit.co) - Free, no registration
2. **Web3Forms** - Free tier available
3. **EmailJS** - Good for Shopify integration

**Why not Shopify Forms?**
- More control over email format
- Easier to implement custom success handling
- No additional Shopify app costs

### File Structure
```
snippets/
  ├── buy-buttons.liquid (modified)
  ├── quote-button.liquid (new)
  └── quote-modal.liquid (new)

assets/
  ├── quote-modal.css (new)
  └── quote-modal.js (new)

sections/
  └── main-product.liquid (modified)
```

---

## Dependencies & Prerequisites
- Shopify theme customization access
- Email service setup (FormSubmit/Web3Forms/EmailJS)
- No additional apps required
- Uses existing theme CSS framework (Tailwind-like utilities visible in codebase)

---

## Estimated Timeline
- Phase 1: 2-3 hours (Frontend structure)
- Phase 2: 2-3 hours (JavaScript functionality)
- Phase 3: 1-2 hours (Email integration)
- Phase 4: 1-2 hours (Success message & UX)
- Phase 5: 2-3 hours (Integration & testing)
- Phase 6: 1-2 hours (Polish & optimization)

**Total: 9-15 hours**

---

## Success Criteria
- [ ] Quote button appears before buy button, both at 50% width
- [ ] Modal opens smoothly when quote button clicked
- [ ] Form validates all fields correctly
- [ ] Email sends successfully to info@totallager.se
- [ ] Email contains all product and customer details
- [ ] Success message displays for exactly 5 seconds
- [ ] Modal closes automatically after success message
- [ ] Works perfectly on desktop and mobile
- [ ] Matches Swedish language and styling from screenshot
- [ ] No console errors or warnings
- [ ] Accessible via keyboard and screen readers

---

## Notes
- All text should be in Swedish to match the screenshot
- Color scheme: Blue gradient for button, green for success message
- Form should match the elegant, modern design shown in screenshots
- Consider adding the form to the theme's translation files for easy language changes
