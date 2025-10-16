document.addEventListener("DOMContentLoaded", function () {
  class VatToggle {
    constructor() {
      this.vatToggle = document.getElementById("js-vat-btn");
      this.productsGrid = document.querySelector(".main-products-grid");
      this.textTag = document.getElementById("js-vat-text");
      this.tagHTML = document.documentElement;
      this.isUpdating = false; // Throttle flag to prevent excessive updates
      this.DEBUG = false; // Set to true only for debugging

      if (this.vatToggle) {
        this.vatToggle.addEventListener("click", this.toggleVat.bind(this));

        const storageVAT = window.localStorage.getItem("VAT");
        this.changeVAT(storageVAT || "exc");
        
        // Single initial update
        setTimeout(() => {
          const isInc = (storageVAT || "exc") === "inc";
          this.updatePriceLabels(isInc);
        }, 200);
        
        this.setupEventListeners();
      }
    }

    // Only log if DEBUG is enabled
    log(message, ...args) {
      if (this.DEBUG) {
        console.log(`VAT Toggle: ${message}`, ...args);
      }
    }

    setupEventListeners() {
      // Essential event listeners with throttling
      document.addEventListener("on:facet-filters:updated", () => {
        this.throttledUpdate();
      });

      document.addEventListener("cart-drawer:open", () => {
        this.throttledUpdate();
      });

      document.addEventListener("cart:updated", () => {
        this.throttledUpdate();
      });

      // Form changes for variants (most important for variant updates)
      document.addEventListener("change", (event) => {
        if (event.target.matches('select[name="id"], input[name="id"], input[type="radio"][name*="option"]')) {
          this.throttledUpdate(300); // Longer delay for variant changes
        }
      });

      // Setup product form listeners without excessive logging
      this.setupProductFormListeners();
    }

    // Throttled update to prevent excessive calls
    throttledUpdate(delay = 100) {
      if (this.isUpdating) return;
      
      this.isUpdating = true;
      setTimeout(() => {
        const vatOpt = window.localStorage.getItem("VAT");
        const isInc = vatOpt === "inc";
        this.updatePriceLabels(isInc);
        this.isUpdating = false;
      }, delay);
    }

    setupProductFormListeners() {
      setTimeout(() => {
        const productForms = document.querySelectorAll('form[action*="/cart/add"], product-form, [is="product-form"]');
        this.log(`Found ${productForms.length} product forms`);
        
        productForms.forEach((form) => {
          const variantSelects = form.querySelectorAll('select[name="id"], input[name="id"], input[type="radio"]');
          variantSelects.forEach((select) => {
            select.addEventListener('change', () => {
              this.throttledUpdate(300);
            });
          });
        });
      }, 1000);
    }

    changeVAT(vat) {
      if (vat === "inc") {
        window.localStorage.setItem("VAT", "inc");
        this.tagHTML.classList.add("global-vat-inc");
        this.tagHTML.classList.remove("global-vat-exc");
        this.textTag.innerHTML = "inkl. moms";
        this.updatePriceLabels(true);
      } else {
        window.localStorage.setItem("VAT", "exc");
        this.tagHTML.classList.add("global-vat-exc");
        this.tagHTML.classList.remove("global-vat-inc");
        this.textTag.innerHTML = "exkl. moms";
        this.updatePriceLabels(false);
      }
    }

    toggleVat() {
      const vat = window.localStorage.getItem("VAT");
      if (vat === "inc") {
        this.changeVAT("exc");
      } else {
        this.changeVAT("inc");
      }
    }

    updatePriceLabels(showIncVat) {
      this.log("Updating prices to", showIncVat ? "include VAT" : "exclude VAT");
      
      const priceContainers = document.querySelectorAll('[data-base-price]');
      this.log(`Found ${priceContainers.length} price containers`);
      
      let totalUpdated = 0;
      
      priceContainers.forEach((container, index) => {
        const basePrice = parseFloat(container.dataset.basePrice);
        const vatFree = container.dataset.vatFree === 'true';
        
        if (!isNaN(basePrice)) {
          let newPrice;
          if (vatFree) {
            newPrice = basePrice;
          } else {
            newPrice = showIncVat ? basePrice * 1.25 : basePrice;
          }
          
          let vatLabel;
          if (vatFree) {
            vatLabel = 'momsbefriet';
          } else {
            vatLabel = showIncVat ? 'inkl. moms' : 'exkl. moms';
          }
          
          // Handle cart totals separately
          if (container.classList.contains('totals__subtotal-value')) {
            this.updateCartTotal(showIncVat);
          } else {
            const priceDisplays = container.querySelectorAll('.vat-price-display');
            
            priceDisplays.forEach((display) => {
              display.innerHTML = `${newPrice.toFixed(2)} SEK <span class="vat-label-pp">${vatLabel}</span>`;
              totalUpdated++;
            });
            
            // Handle compare prices
            const compareElements = container.querySelectorAll('s');
            if (compareElements.length > 0) {
              const baseComparePrice = parseFloat(container.dataset.baseComparePrice);
              if (!isNaN(baseComparePrice) && baseComparePrice > 0) {
                let newComparePrice;
                if (vatFree) {
                  newComparePrice = baseComparePrice;
                } else {
                  newComparePrice = showIncVat ? baseComparePrice * 1.25 : baseComparePrice;
                }
                
                compareElements.forEach((compareEl) => {
                  compareEl.innerHTML = `${newComparePrice.toFixed(2)} SEK`;
                });
              }
            }
          }
        }
      });

      this.log(`Updated ${totalUpdated} price elements`);
    }

    updateCartTotal(showIncVat) {
      const cartItems = document.querySelectorAll('.cart-item [data-base-price]');
      let calculatedTotal = 0;
      
      this.log(`Calculating cart total for ${cartItems.length} cart items`);
      
      cartItems.forEach((item) => {
        const basePrice = parseFloat(item.dataset.basePrice);
        const vatFree = item.dataset.vatFree === 'true';
        const quantity = this.getCartItemQuantity(item);
        
        if (!isNaN(basePrice)) {
          let itemPrice;
          if (vatFree) {
            itemPrice = basePrice;
          } else {
            itemPrice = showIncVat ? basePrice * 1.25 : basePrice;
          }
          calculatedTotal += itemPrice * quantity;
        }
      });
      
      // Update cart total displays
      const cartTotalSelectors = [
        '.totals__subtotal-value .vat-price-display',
        '.totals__subtotal-value.vat-price-display',
        '.totals__subtotal-value'
      ];
      
      let totalElementsUpdated = 0;
      const vatLabel = showIncVat ? 'inkl. moms' : 'exkl. moms';
      
      cartTotalSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach((totalElement) => {
          if (totalElement.classList.contains('vat-price-display')) {
            totalElement.innerHTML = `${calculatedTotal.toFixed(2)} SEK <span class="vat-label-pp">${vatLabel}</span>`;
            totalElementsUpdated++;
          } else {
            const priceDisplay = totalElement.querySelector('.vat-price-display');
            if (priceDisplay) {
              priceDisplay.innerHTML = `${calculatedTotal.toFixed(2)} SEK <span class="vat-label-pp">${vatLabel}</span>`;
              totalElementsUpdated++;
            }
          }
        });
      });
      
      this.log(`Updated ${totalElementsUpdated} total elements`);
    }

    getCartItemQuantity(priceElement) {
      const cartItem = priceElement.closest('.cart-item');
      if (cartItem) {
        // Try data-quantity first (cart drawer)
        const dataQuantity = cartItem.dataset.quantity;
        if (dataQuantity) {
          return parseInt(dataQuantity) || 1;
        }
        
        // Try quantity input (main cart)
        const quantityInput = cartItem.querySelector('input[name="updates[]"], input[data-quantity-variant-id]');
        if (quantityInput) {
          return parseInt(quantityInput.value) || 1;
        }
      }
      return 1;
    }
  }

  // Initialize the VAT toggle
  new VatToggle();
});
