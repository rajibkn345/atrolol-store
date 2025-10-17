# Quote Button Feature - Setup Guide

## Quick Start Guide

This guide will help you deploy and configure the quote button feature.

---

## Step 1: Upload Files to Shopify

### Files to Upload:

1. **Snippets Folder** (`snippets/`)
   - `quote-button.liquid` ✅ (New)
   - `quote-modal.liquid` ✅ (New)
   - `buy-buttons.liquid` ✅ (Modified)

2. **Assets Folder** (`assets/`)
   - `quote-modal.css` ✅ (New)
   - `quote-modal.js` ✅ (New)

3. **Sections Folder** (`sections/`)
   - `main-product.liquid` ✅ (Modified)

### How to Upload:

#### Option A: Using Shopify CLI (Recommended)
```bash
# Navigate to your theme directory
cd /path/to/atrolol-store

# Push changes to Shopify
shopify theme push
```

#### Option B: Using Shopify Admin
1. Go to Shopify Admin
2. Online Store → Themes
3. Click "..." on your theme → Edit code
4. Upload each file to its respective folder:
   - Click on folder name (snippets, assets, sections)
   - Click "Add a new snippet/asset"
   - Copy/paste content or upload file

---

## Step 2: Configure Email Delivery

### Set Email Destination to info@totallager.se

#### Method 1: Change Store Email (Easiest)
1. Shopify Admin → Settings → Store details
2. Scroll to "Store contact email"
3. Change to: `info@totallager.se`
4. Click "Save"

All contact form submissions will now go to info@totallager.se.

#### Method 2: Email Notification Settings
1. Shopify Admin → Settings → Notifications
2. Find "Customer contact form" notification
3. Click to edit
4. Ensure it's enabled
5. Email will be sent to the store owner's email
6. Set up forwarding rules in your email provider to forward to info@totallager.se

#### Method 3: Use Email Filters
If your current store email is different, set up a filter:
- Create rule: If subject contains "Förfrågan om offert"
- Forward to: info@totallager.se

---

## Step 3: Test the Feature

### Pre-Deployment Testing

1. **Open a Product Page**
   - Go to any product in your store
   - You should see two buttons: "Begär offert" and "Add to Cart"

2. **Click "Begär offert"**
   - Modal should open smoothly
   - Product name should be pre-filled

3. **Test Form Validation**
   - Try submitting empty form → Should show errors
   - Enter invalid email → Should show error
   - Don't check GDPR → Should show error

4. **Submit Valid Form**
   - Enter phone: `0701234567`
   - Enter email: `test@example.com`
   - Check GDPR checkbox
   - Click "Jag vill bli kontaktad"
   - Should show loading state
   - Success message should appear
   - Modal should auto-close after 5 seconds

5. **Check Email**
   - Email should arrive at info@totallager.se
   - Subject: "Förfrågan om offert - [Product Name]"
   - Body should contain:
     - Product name
     - Product URL
     - Customer phone
     - Customer email

### Desktop Testing
- Check that buttons are side by side (50% width each)
- Test all modal interactions
- Test responsive resize

### Mobile Testing
- Buttons should stack vertically (100% width each)
- Modal should fit mobile screen
- Form should be easy to fill on mobile
- Touch interactions should work smoothly

---

## Step 4: Customize (Optional)

### Update Privacy Policy Link
If your privacy policy is at a different URL:

**File:** `snippets/quote-modal.liquid`
**Line:** 66
```liquid
<a href="/pages/privacy-policy" target="_blank" class="quote-modal__link">Läs villkor</a>
```
Change `/pages/privacy-policy` to your actual privacy policy URL.

### Change Button Colors
**File:** `assets/quote-modal.css`
**Line:** 216
```css
/* Current: Blue gradient */
background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);

/* Examples: */
/* Green gradient */
background: linear-gradient(135deg, #10b981 0%, #059669 100%);

/* Purple gradient */
background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
```

### Change Auto-Close Time
**File:** `assets/quote-modal.js`
**Line:** 324
```javascript
setTimeout(() => {
  this.closeModal();
}, 5000); // 5000 = 5 seconds, change to desired milliseconds
```

---

## Step 5: Verify Everything Works

### Checklist:
- [ ] Product page loads without errors
- [ ] Quote button appears before buy button
- [ ] Both buttons are same height and aligned
- [ ] Modal opens when clicking quote button
- [ ] Product name is pre-filled
- [ ] Form validation works correctly
- [ ] GDPR checkbox is required
- [ ] Email sends successfully
- [ ] Email arrives at info@totallager.se
- [ ] Email contains all product details
- [ ] Success message displays correctly
- [ ] Modal auto-closes after 5 seconds
- [ ] Form resets after closing
- [ ] Works on mobile devices
- [ ] Works on different browsers
- [ ] No console errors

---

## Common Issues and Solutions

### Issue: Modal not opening
**Solution:**
1. Check browser console for errors
2. Make sure `quote-modal.js` is loaded
3. Clear browser cache
4. Check if `data-quote-button` attribute exists on button

### Issue: Buttons not 50% width
**Solution:**
1. Make sure `quote-modal.css` is loaded
2. Clear browser cache
3. Check if `.product-form__action-buttons` class exists
4. Inspect element to check if CSS is applied

### Issue: Email not received
**Solution:**
1. Check spam folder
2. Verify store email settings (Step 2)
3. Check Shopify Admin → Settings → Notifications
4. Ensure "Customer contact form" notification is enabled
5. Test with different email addresses

### Issue: Form validation not working
**Solution:**
1. Check browser console for JavaScript errors
2. Ensure `quote-modal.js` is loaded completely
3. Check that form field `data-*` attributes are correct
4. Clear browser cache and reload

### Issue: Success message not showing
**Solution:**
1. Check if form submission was successful
2. Check browser console for errors
3. Verify `[data-quote-success-container]` element exists
4. Check JavaScript console for fetch errors

---

## Email Template Customization

### Default Email Format:
```
Subject: Förfrågan om offert - [Product Name]

Body:
Produktinformation:
Produkt: [Product Name]
Produktlänk: [Product URL]

Kontaktinformation:
Telefon: [Customer Phone]
E-post: [Customer Email]
```

### To Customize Email Template:
1. Shopify Admin → Settings → Notifications
2. Find "Customer contact form" notification
3. Click "Edit email template"
4. Customize the HTML/text as needed
5. Available variables:
   - `{{ form.name }}` - Customer name
   - `{{ form.email }}` - Customer email
   - `{{ form.body }}` - Form body (contains our data)
   - `{{ shop.name }}` - Store name

---

## Performance Tips

1. **Preload CSS (if needed)**
   Add to `snippets/quote-modal.liquid`:
   ```liquid
   {{ 'quote-modal.css' | asset_url | stylesheet_tag: preload: true }}
   ```

2. **Minify Files**
   - Minify CSS and JS before uploading
   - Reduces file size and improves load time

3. **Test Page Speed**
   - Use Google PageSpeed Insights
   - Check that modal doesn't impact page load time
   - Files are loaded deferred, so no blocking

---

## Security Considerations

### Already Implemented:
- ✅ Uses Shopify's native contact form (secure)
- ✅ CSRF protection (built into Shopify)
- ✅ Form validation
- ✅ GDPR consent required

### Additional Security (Optional):
1. **Add Google reCAPTCHA**
   - Prevents spam submissions
   - Add reCAPTCHA to Shopify contact form

2. **Rate Limiting**
   - Shopify handles this automatically
   - Prevents abuse of contact form

3. **Input Sanitization**
   - Shopify handles this automatically
   - All inputs are sanitized before email

---

## Support Resources

### Documentation:
- [Shopify Contact Forms](https://shopify.dev/docs/themes/architecture/forms#contact-form)
- [Shopify Notifications](https://help.shopify.com/en/manual/sell-online/notifications)
- [Liquid Template Language](https://shopify.dev/docs/api/liquid)

### Need Help?
1. Check browser console for errors
2. Review [implementation-summary.md](implementation-summary.md)
3. Review [quote-button-feature.md](quote-button-feature.md)
4. Check individual file comments

---

## Deployment Checklist

Before going live:

### Pre-Launch:
- [ ] All files uploaded to Shopify
- [ ] Email configured to go to info@totallager.se
- [ ] Privacy policy link updated (if needed)
- [ ] Test form submission works
- [ ] Test email delivery
- [ ] Test on desktop browser
- [ ] Test on mobile browser
- [ ] Check all form validations work
- [ ] Verify success message displays
- [ ] Verify auto-close after 5 seconds

### Post-Launch:
- [ ] Monitor email inbox for quote requests
- [ ] Check for any JavaScript errors in production
- [ ] Get user feedback
- [ ] Track conversion rate (quotes vs purchases)

---

## Success! 🎉

Your quote button feature is now live! Customers can now easily request quotes for products, and you'll receive detailed emails at info@totallager.se.

---

## Quick Reference

### Important Files:
- Modal: `snippets/quote-modal.liquid`
- Button: `snippets/quote-button.liquid`
- Styles: `assets/quote-modal.css`
- JavaScript: `assets/quote-modal.js`
- Buy buttons: `snippets/buy-buttons.liquid`
- Product page: `sections/main-product.liquid`

### Key Settings:
- Email destination: Shopify Admin → Settings → Store details
- Notifications: Shopify Admin → Settings → Notifications
- Privacy policy: `/pages/privacy-policy`
- Auto-close time: 5 seconds (5000ms)

### Need to Change?
- Button text: `snippets/quote-button.liquid` line 18
- Modal title: `snippets/quote-modal.liquid` line 23
- Button colors: `assets/quote-modal.css` line 216
- Auto-close time: `assets/quote-modal.js` line 324
