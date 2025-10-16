document.addEventListener("DOMContentLoaded", function () {
  class VatToggle {
    constructor() {
      this.vatToggle = document.getElementById("js-vat-btn");
      this.productsGrid = document.querySelector(".main-products-grid");
      this.textTag = document.getElementById("js-vat-text");
      this.tagHTML = document.documentElement; // Get the <html> element

      if (this.vatToggle) {
        this.vatToggle.addEventListener("click", this.toggleVat.bind(this));

        const storageVAT = window.localStorage.getItem("VAT");
        this.changeVAT(storageVAT || "exc"); // Default to 'exc' since base prices are exc VAT
        
        // Force initial update after a brief delay to ensure DOM is ready
        setTimeout(() => {
          const isInc = (storageVAT || "exc") === "inc";
          this.updatePriceLabels(isInc);
        }, 100);
        
        // Also run after a longer delay to catch any dynamically loaded content
        setTimeout(() => {
          const isInc = (storageVAT || "exc") === "inc";
          this.updatePriceLabels(isInc);
        }, 1000);
        
        if (this.productsGrid) {
          setTimeout(() => {
            this.productsGrid.classList.add("transition-ready");
          }, 500);
        }
        this.addAjaxListeners();
      }
    }
    
    addAjaxListeners() {
      // Listen for Shopify's AJAX updates
      document.addEventListener("cart:rendered", (event) => {
        const vatOpt = window.localStorage.getItem("VAT");
        const isInc = vatOpt === "inc";
        this.updatePriceLabels(isInc);
      });

      document.addEventListener("on:cart:add", (event) => {
        const vatOpt = window.localStorage.getItem("VAT");
        const isInc = vatOpt === "inc";
        this.updatePriceLabels(isInc);
      });

      document.addEventListener("on:facet-filters:updated", () => {
        const vatOpt = window.localStorage.getItem("VAT");
        const isInc = vatOpt === "inc";
        this.updatePriceLabels(isInc);
      });

      // Listen for cart drawer opening
      document.addEventListener("cart-drawer:open", () => {
        const vatOpt = window.localStorage.getItem("VAT");
        const isInc = vatOpt === "inc";
        this.updatePriceLabels(isInc);
      });

      // Listen for cart updates
      document.addEventListener("cart:updated", () => {
        const vatOpt = window.localStorage.getItem("VAT");
        const isInc = vatOpt === "inc";
        this.updatePriceLabels(isInc);
      });

      // Listen for page fully loaded event
      window.addEventListener("load", () => {
        const vatOpt = window.localStorage.getItem("VAT");
        const isInc = vatOpt === "inc";
        this.updatePriceLabels(isInc);
      });

      // Listen for variant changes (Shopify theme events)
      document.addEventListener("variant:change", () => {
        setTimeout(() => {
          const vatOpt = window.localStorage.getItem("VAT");
          const isInc = vatOpt === "inc";
          this.updatePriceLabels(isInc);
        }, 100);
      });

      // Listen for product form updates
      document.addEventListener("product:variant:change", () => {
        setTimeout(() => {
          const vatOpt = window.localStorage.getItem("VAT");
          const isInc = vatOpt === "inc";
          this.updatePriceLabels(isInc);
        }, 100);
      });

      // Listen for form changes (variant selects, radio buttons)
      document.addEventListener("change", (event) => {
        if (event.target.matches('select[name="id"], input[name="id"], input[type="radio"][name*="option"]')) {
          setTimeout(() => {
            const vatOpt = window.localStorage.getItem("VAT");
            const isInc = vatOpt === "inc";
            this.updatePriceLabels(isInc);
          }, 200);
        }
      });

      // Listen for price updates from Shopify scripts
      document.addEventListener("price:update", () => {
        setTimeout(() => {
          const vatOpt = window.localStorage.getItem("VAT");
          const isInc = vatOpt === "inc";
          this.updatePriceLabels(isInc);
        }, 100);
      });

      // Listen for any price updates via mutation observer
      this.setupMutationObserver();

      // Add specific listeners for product forms
      this.setupProductFormListeners();
    }

    setupMutationObserver() {
      const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            // Check if any price elements were modified
            const target = mutation.target;
            if (target.matches && (
              target.matches('[data-base-price]') || 
              target.matches('.price') || 
              target.querySelector('[data-base-price]') ||
              target.querySelector('.price')
            )) {
              shouldUpdate = true;
            }
          }
        });
        
        if (shouldUpdate) {
          setTimeout(() => {
            const vatOpt = window.localStorage.getItem("VAT");
            const isInc = vatOpt === "inc";
            this.updatePriceLabels(isInc);
          }, 200);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-base-price', 'class']
      });
    }

    setupProductFormListeners() {
      // Wait for DOM to be ready, then set up form listeners
      setTimeout(() => {
        // Look for product forms
        const productForms = document.querySelectorAll('form[action*="/cart/add"], product-form, [is="product-form"]');
        console.log(`Found ${productForms.length} product forms`);
        
        productForms.forEach((form, index) => {
          console.log(`Setting up listeners for product form ${index}`);
          
          // Listen for variant select changes
          const variantSelects = form.querySelectorAll('select[name="id"], input[name="id"], input[type="radio"]');
          variantSelects.forEach((select) => {
            select.addEventListener('change', () => {
              console.log('Product variant changed, updating VAT prices');
              setTimeout(() => {
                const vatOpt = window.localStorage.getItem("VAT");
                const isInc = vatOpt === "inc";
                this.updatePriceLabels(isInc);
              }, 300); // Longer delay for variant changes
            });
          });
          
          // Listen for option changes
          const optionInputs = form.querySelectorAll('input[name*="options"], select[name*="options"]');
          optionInputs.forEach((input) => {
            input.addEventListener('change', () => {
              console.log('Product option changed, updating VAT prices');
              setTimeout(() => {
                const vatOpt = window.localStorage.getItem("VAT");
                const isInc = vatOpt === "inc";
                this.updatePriceLabels(isInc);
              }, 300);
            });
          });
        });
        
        // Also listen for any custom events that might be fired
        document.addEventListener('variantChange', () => {
          console.log('Custom variantChange event detected');
          setTimeout(() => {
            const vatOpt = window.localStorage.getItem("VAT");
            const isInc = vatOpt === "inc";
            this.updatePriceLabels(isInc);
          }, 200);
        });
        
        document.addEventListener('variant-change', () => {
          console.log('Custom variant-change event detected');
          setTimeout(() => {
            const vatOpt = window.localStorage.getItem("VAT");
            const isInc = vatOpt === "inc";
            this.updatePriceLabels(isInc);
          }, 200);
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
      console.log("VAT Toggle: Updating prices to", showIncVat ? "include VAT" : "exclude VAT");
      
      // Target all f-price containers that have data attributes
      const priceContainers = document.querySelectorAll('[data-base-price]');
      console.log(`Found ${priceContainers.length} price containers with data-base-price`);
      
      // Log details about each container found
      priceContainers.forEach((container, index) => {
        console.log(`Container ${index}:`, {
          element: container.tagName,
          classes: container.className,
          basePrice: container.dataset.basePrice,
          vatFree: container.dataset.vatFree,
          parent: container.parentElement?.className,
          location: container.closest('.cart-item') ? 'cart-item' : 
                   container.closest('.cart-drawer') ? 'cart-drawer' : 
                   container.closest('.main-cart') ? 'main-cart' : 
                   container.closest('.product-card') ? 'product-card' : 'other'
        });
      });
      
      let totalUpdated = 0;
      let cartTotalVAT = 0; // Track total VAT amount for cart total calculation
      
      priceContainers.forEach((container, index) => {
        const basePrice = parseFloat(container.dataset.basePrice);
        const vatFree = container.dataset.vatFree === 'true';
        
        console.log(`Processing container ${index}: basePrice=${basePrice}, vatFree=${vatFree}`);
        
        if (!isNaN(basePrice)) {
          let newPrice;
          if (vatFree) {
            newPrice = basePrice;
          } else {
            newPrice = showIncVat ? basePrice * 1.25 : basePrice;
            // Add VAT amount to cart total if this is a cart item
            if (showIncVat && container.closest('.cart-item')) {
              cartTotalVAT += basePrice * 0.25;
            }
          }
          
          // Update VAT label
          let vatLabel;
          if (vatFree) {
            vatLabel = 'momsbefriet';
          } else {
            vatLabel = showIncVat ? 'inkl. moms' : 'exkl. moms';
          }
          
          // Check if this is a cart total element
          if (container.classList.contains('totals__subtotal-value')) {
            console.log(`Found cart total element, delegating to updateCartTotal`);
            // For cart totals, we need to calculate the total differently
            this.updateCartTotal(showIncVat);
          } else {
            // Find all vat-price-display elements within this container
            const priceDisplays = container.querySelectorAll('.vat-price-display');
            console.log(`  Found ${priceDisplays.length} price displays in container ${index}`);
            
            priceDisplays.forEach((display, displayIndex) => {
              const oldContent = display.innerHTML;
              console.log(`  Updating display ${displayIndex}: ${basePrice} → ${newPrice.toFixed(2)}`);
              console.log(`  Old content: "${oldContent}"`);
              
              // Simple replacement - just update the display with new price and VAT label
              display.innerHTML = `${newPrice.toFixed(2)} SEK <span class="vat-label-pp">${vatLabel}</span>`;
              console.log(`  New content: "${display.innerHTML}"`);
              totalUpdated++;
            });
            
            // Also handle compare prices in this container
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
                  console.log(`  Updated compare price: ${baseComparePrice} → ${newComparePrice.toFixed(2)}`);
                });
              }
            }
          }
        }
      });

      console.log(`VAT Toggle: Updated ${totalUpdated} price elements`);
    }

    updateCartTotal(showIncVat) {
      // Calculate cart total by summing all individual cart item prices
      const cartItems = document.querySelectorAll('.cart-item [data-base-price]');
      let calculatedTotal = 0;
      
      console.log(`Calculating cart total for ${cartItems.length} cart items`);
      
      cartItems.forEach((item, index) => {
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
          const totalItemPrice = itemPrice * quantity;
          calculatedTotal += totalItemPrice;
          
          console.log(`Cart item ${index}: basePrice=${basePrice}, vatFree=${vatFree}, quantity=${quantity}, itemTotal=${totalItemPrice.toFixed(2)}`);
        }
      });
      
      // Update cart total displays - target both main cart and cart drawer
      const cartTotalSelectors = [
        '.totals__subtotal-value .vat-price-display', // Main cart (nested)
        '.totals__subtotal-value.vat-price-display',  // Cart drawer (same element)
        '.totals__subtotal-value'                     // Fallback - any total element
      ];
      
      let totalElementsUpdated = 0;
      const vatLabel = showIncVat ? 'inkl. moms' : 'exkl. moms';
      
      cartTotalSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`Selector "${selector}" found ${elements.length} elements`);
        
        elements.forEach((totalElement, index) => {
          // Check if this element already has the vat-price-display class or if it contains one
          if (totalElement.classList.contains('vat-price-display')) {
            // Direct update
            console.log(`Updating total element directly (${selector}[${index}]): ${calculatedTotal.toFixed(2)} SEK (${vatLabel})`);
            totalElement.innerHTML = `${calculatedTotal.toFixed(2)} SEK <span class="vat-label-pp">${vatLabel}</span>`;
            totalElementsUpdated++;
          } else {
            // Look for vat-price-display child
            const priceDisplay = totalElement.querySelector('.vat-price-display');
            if (priceDisplay) {
              console.log(`Updating total element child (${selector}[${index}]): ${calculatedTotal.toFixed(2)} SEK (${vatLabel})`);
              priceDisplay.innerHTML = `${calculatedTotal.toFixed(2)} SEK <span class="vat-label-pp">${vatLabel}</span>`;
              totalElementsUpdated++;
            }
          }
        });
      });
      
      console.log(`Updated ${totalElementsUpdated} total elements with calculated total: ${calculatedTotal.toFixed(2)} SEK`);
    }

    getCartItemQuantity(priceElement) {
      // Try to find quantity from the cart item
      const cartItem = priceElement.closest('.cart-item');
      if (cartItem) {
        // First try to get from data-quantity attribute (cart drawer)
        const dataQuantity = cartItem.dataset.quantity;
        if (dataQuantity) {
          return parseInt(dataQuantity) || 1;
        }
        
        // Then try to get from quantity input (main cart)
        const quantityInput = cartItem.querySelector('input[name="updates[]"]');
        if (quantityInput) {
          return parseInt(quantityInput.value) || 1;
        }
        
        // Try alternative selector
        const altQuantityInput = cartItem.querySelector('input[data-quantity-variant-id]');
        if (altQuantityInput) {
          return parseInt(altQuantityInput.value) || 1;
        }
      }
      return 1; // Default to 1 if quantity not found
    }

    updateCompareAtPrices(showIncVat) {
      // This is now handled in updatePriceLabels to avoid duplication
      console.log("Compare prices updated within main function");
    }

    handleSpecialPriceElements(showIncVat) {
      // Handle GP Product elements (if using any third-party product apps)  
      const gpPriceElements = document.querySelectorAll(".gp-product-price .gp-price.gp-money");
      const gpCompPriceElements = document.querySelectorAll(".gp-product-price .gp-product-compare-price");

      gpPriceElements.forEach((priceEle) => {
        const gpProductEl = priceEle.closest("gp-product");
        if (!gpProductEl) return;

        const contextAttr = gpProductEl.getAttribute("gp-context");
        if (!contextAttr) return;

        try {
          const context = JSON.parse(contextAttr);
          const taxable = context?.variantSelected?.taxable;
          const basePrice = context?.variantSelected?.price;
          const priceExcVat = (parseInt(basePrice) / 100).toFixed(2);

          if (taxable === true) {
            const priceIncVat = (parseFloat(priceExcVat) * 1.25).toFixed(2);
            if (showIncVat) {
              priceEle.innerHTML = `${priceIncVat} <span class="vat-label-pp">inkl. moms</span>`;
            } else {
              priceEle.innerHTML = `${priceExcVat} <span class="vat-label-pp">exkl. moms</span>`;
            }
          } else {
            priceEle.innerHTML = `${priceExcVat} <span class="vat-label-pp">momsbefriet</span>`;
          }
        } catch (err) {
          console.warn("❌ Failed to parse gp-context JSON", err);
        }
      });

      gpCompPriceElements.forEach((priceEle) => {
        const gpProductEl = priceEle.closest("gp-product");
        if (!gpProductEl) return;

        const contextAttr = gpProductEl.getAttribute("gp-context");
        if (!contextAttr) return;

        try {
          const context = JSON.parse(contextAttr);
          const taxable = context?.variantSelected?.taxable;
          const basePrice = context?.variantSelected?.compare_at_price || context?.variantSelected?.price;
          const priceExcVat = (parseInt(basePrice) / 100).toFixed(2);

          if (taxable === true) {
            const priceIncVat = (parseFloat(priceExcVat) * 1.25).toFixed(2);
            if (showIncVat) {
              priceEle.innerHTML = `${priceIncVat} <span class="vat-label-pp">inkl. moms</span>`;
            } else {
              priceEle.innerHTML = `${priceExcVat} <span class="vat-label-pp">exkl. moms</span>`;
            }
          } else {
            priceEle.innerHTML = `${priceExcVat} <span class="vat-label-pp">momsbefriet</span>`;
          }
        } catch (err) {
          console.warn("❌ Failed to parse gp-context JSON", err);
        }
      });
    }
  }

  // Initialize the VAT toggle
  const vatToggleInstance = new VatToggle();
  
  // Make it globally accessible
  window.VatToggle = vatToggleInstance;
});
