// Variant Price Update for VAT Toggle
document.addEventListener('DOMContentLoaded', function() {
  
  // Function to update variant prices with VAT toggle
  function updateVariantPriceWithVAT(variantPrice, compareAtPrice = null) {
    const showIncVat = window.localStorage.getItem("VAT") === "inc";
    const priceElements = document.querySelectorAll('.product-info .price, .product__price .price');
    
    priceElements.forEach(priceElement => {
      if (variantPrice) {
        const basePrice = (variantPrice / 100).toFixed(2);
        const baseComparePrice = compareAtPrice ? (compareAtPrice / 100).toFixed(2) : null;
        
        // Update data attributes
        priceElement.setAttribute('data-base-price', basePrice);
        if (baseComparePrice) {
          priceElement.setAttribute('data-base-compare-price', baseComparePrice);
        }
        
        // Trigger price update
        if (window.VatToggle && window.VatToggle.updatePriceLabels) {
          window.VatToggle.updatePriceLabels(showIncVat);
        }
      }
    });
  }
  
  // Listen for variant changes
  document.addEventListener('variant:change', function(event) {
    const variant = event.detail?.variant;
    if (variant) {
      updateVariantPriceWithVAT(variant.price, variant.compare_at_price);
    }
  });
  
  // Also listen for Shopify's built-in variant change events
  const productForms = document.querySelectorAll('product-form, [is="product-form"]');
  productForms.forEach(form => {
    form.addEventListener('change', function(event) {
      if (event.target.matches('input[name="id"], select[name="id"]')) {
        setTimeout(() => {
          const selectedVariant = this.currentVariant;
          if (selectedVariant) {
            updateVariantPriceWithVAT(selectedVariant.price, selectedVariant.compare_at_price);
          }
        }, 100);
      }
    });
  });
  
  // Make VatToggle globally accessible for variant updates
  if (window.VatToggle) {
    window.VatToggle.updateVariantPrice = updateVariantPriceWithVAT;
  }
  
});
