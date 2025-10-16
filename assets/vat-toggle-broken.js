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
        console.log("cart:add event", event);
        const vatOpt = window.localStorage.getItem("VAT");
        const isInc = vatOpt === "inc";
        this.updatePriceLabels(isInc);
      });

      document.addEventListener("on:facet-filters:updated", () => {
        const vatOpt = window.localStorage.getItem("VAT");
        const isInc = vatOpt === "inc";
        this.updatePriceLabels(isInc);
      });
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
      console.log("updatePriceLabels===", showIncVat);
      
      // Target all price elements that need VAT toggle
      const priceElements = document.querySelectorAll(
        ".card--product .price,.product-info .price,.items-end .price,.card--sticky-atc #sticky-product-price.price,.f-price"
      );
      
      const atcElements = document.querySelectorAll(
        ".card--sticky-atc #sticky-product-price.price"
      );
      
      const gpPriceElements = document.querySelectorAll(
        ".gp-product-price .gp-price.gp-money"
      );
      
      const gpCompPriceElements = document.querySelectorAll(
        ".gp-product-price .gp-product-compare-price"
      );

      const recCartElements = document.querySelectorAll(
        ".cart-recommend-price .price"
      );
      
      const compareElements = document.querySelectorAll(
        ".card--product .custom-compare,.product-info .custom-compare,.cart-recommend-price .custom-compare"
      );
      
      const cartComElements = document.querySelectorAll(
        " .cart-item__total  .custom-compare, .cart-item__info  .custom-compare"
      );
      
      const cartElements = document.querySelectorAll(
        " .cart-item__total  .cart-price, .cart-item__info  .cart-price"
      );

      // Handle GP Product elements (if using any third-party product apps)
      gpPriceElements.forEach((priceEle) => {
        const gpProductEl = priceEle.closest("gp-product");
        if (!gpProductEl) return;

        const contextAttr = gpProductEl.getAttribute("gp-context");
        if (!contextAttr) return;

        try {
          const context = JSON.parse(contextAttr);
          const taxable = context?.variantSelected?.taxable;
          const basePrice = context?.variantSelected?.price;
          const priceExcVat = (parseInt(basePrice) / 100).toFixed(2); // Base price is exc VAT

          if (taxable === true) {
            const priceIncVat = (parseFloat(priceExcVat) * 1.25).toFixed(2); // Add 25% VAT
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
          const priceExcVat = (parseInt(basePrice) / 100).toFixed(2); // Base price is exc VAT

          if (taxable === true) {
            const priceIncVat = (parseFloat(priceExcVat) * 1.25).toFixed(2); // Add 25% VAT
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

      // Handle standard price elements with data attributes
      priceElements.forEach((priceElement) => {
        const basePrice = priceElement.getAttribute("data-base-price");
        const baseComparePrice = priceElement.getAttribute("data-base-compare-price");
        const isVatFree = priceElement.getAttribute("data-vat-free") === "true";
        
        if (basePrice) {
          const priceExcVat = parseFloat(basePrice).toFixed(2);
          
          // Handle f-price structure
          if (priceElement.classList.contains('f-price')) {
            const regularPriceSpans = priceElement.querySelectorAll('.f-price-item--regular');
            const salePriceSpans = priceElement.querySelectorAll('.f-price-item--sale');
            const vatLabels = priceElement.querySelectorAll('.vat-label-pp');
            
            if (isVatFree) {
              regularPriceSpans.forEach(span => {
                if (!span.querySelector('.vat-label-pp')) {
                  span.innerHTML += ' <span class="vat-label-pp">momsbefriet</span>';
                } else {
                  span.querySelector('.vat-label-pp').textContent = 'momsbefriet';
                }
              });
              salePriceSpans.forEach(span => {
                if (!span.querySelector('.vat-label-pp')) {
                  span.innerHTML += ' <span class="vat-label-pp">momsbefriet</span>';
                } else {
                  span.querySelector('.vat-label-pp').textContent = 'momsbefriet';
                }
              });
            } else {
              const priceIncVat = (parseFloat(priceExcVat) * 1.25).toFixed(2);
              const currency = priceElement.querySelector('.f-price-item')?.textContent.match(/[£$€¥kr]/)?.[0] || '';
              
              if (showIncVat) {
                regularPriceSpans.forEach(span => {
                  const originalPrice = span.textContent.replace(/\s*inkl\.\s*moms|\s*exkl\.\s*moms|\s*momsbefriet/i, '').trim();
                  if (originalPrice.includes(currency) || currency === '') {
                    span.innerHTML = originalPrice.replace(/[\d,.]+/, priceIncVat) + ' <span class="vat-label-pp">inkl. moms</span>';
                  }
                });
                salePriceSpans.forEach(span => {
                  const originalPrice = span.textContent.replace(/\s*inkl\.\s*moms|\s*exkl\.\s*moms|\s*momsbefriet/i, '').trim();
                  if (originalPrice.includes(currency) || currency === '') {
                    span.innerHTML = originalPrice.replace(/[\d,.]+/, priceIncVat) + ' <span class="vat-label-pp">inkl. moms</span>';
                  }
                });
              } else {
                regularPriceSpans.forEach(span => {
                  const originalPrice = span.textContent.replace(/\s*inkl\.\s*moms|\s*exkl\.\s*moms|\s*momsbefriet/i, '').trim();
                  if (originalPrice.includes(currency) || currency === '') {
                    span.innerHTML = originalPrice.replace(/[\d,.]+/, priceExcVat) + ' <span class="vat-label-pp">exkl. moms</span>';
                  }
                });
                salePriceSpans.forEach(span => {
                  const originalPrice = span.textContent.replace(/\s*inkl\.\s*moms|\s*exkl\.\s*moms|\s*momsbefriet/i, '').trim();
                  if (originalPrice.includes(currency) || currency === '') {
                    span.innerHTML = originalPrice.replace(/[\d,.]+/, priceExcVat) + ' <span class="vat-label-pp">exkl. moms</span>';
                  }
                });
              }
              }
            }
          } else {
            // Handle other price elements
            if (isVatFree) {
              priceElement.innerHTML = `${priceExcVat} <span class="vat-label-pp">momsbefriet</span>`;
            } else {
              if (showIncVat) {
                const priceIncVat = (parseFloat(priceExcVat) * 1.25).toFixed(2);
                priceElement.innerHTML = `${priceIncVat} <span class="vat-label-pp">inkl. moms</span>`;
              } else {
                priceElement.innerHTML = `${priceExcVat} <span class="vat-label-pp">exkl. moms</span>`;
              }
            }
          }
        }
      });

      // Handle compare prices
      compareElements.forEach((priceElement) => {
        const baseComparePrice = priceElement.getAttribute("data-base-compare-price");
        
        if (baseComparePrice) {
          const priceExcVat = parseFloat(baseComparePrice).toFixed(2);
          
          if (showIncVat) {
            const priceIncVat = (parseFloat(priceExcVat) * 1.25).toFixed(2);
            priceElement.innerHTML = `<s class="price__was">${priceIncVat}</s> <span class="vat-label-pp">inkl. moms</span>`;
          } else {
            priceElement.innerHTML = `<s class="price__was">${priceExcVat}</s><span class="vat-label-pp">exkl. moms</span>`;
          }
        }
      });

      // Handle cart compare elements
      cartComElements.forEach((priceElement) => {
        const baseComparePrice = priceElement.getAttribute("data-base-compare-price");
        
        if (baseComparePrice) {
          const priceExcVat = parseFloat(baseComparePrice).toFixed(2);
          
          if (showIncVat) {
            const priceIncVat = (parseFloat(priceExcVat) * 1.25).toFixed(2);
            priceElement.innerHTML = `<s class="price__was">${priceIncVat}</s> <span class="vat-label-pp">inkl. moms</span>`;
          } else {
            priceElement.innerHTML = `<s class="price__was">${priceExcVat}</s><span class="vat-label-pp">exkl. moms</span>`;
          }
        }
      });

      // Handle cart price elements
      cartElements.forEach((priceElement) => {
        const basePrice = priceElement.getAttribute("data-base-price");
        const isVatFree = priceElement.getAttribute("data-vat-free") === "true";
        
        if (basePrice) {
          const priceExcVat = parseFloat(basePrice).toFixed(2);
          
          if (isVatFree) {
            priceElement.innerHTML = `${priceExcVat} <span class="vat-label-pp">momsbefriet</span>`;
          } else {
            if (showIncVat) {
              const priceIncVat = (parseFloat(priceExcVat) * 1.25).toFixed(2);
              priceElement.innerHTML = `${priceIncVat} <span class="vat-label-pp">inkl. moms</span>`;
            } else {
              priceElement.innerHTML = `${priceExcVat} <span class="vat-label-pp">exkl. moms</span>`;
            }
          }
        }
      });

      // Handle recommendation cart elements
      recCartElements.forEach((priceElement) => {
        const basePrice = priceElement.getAttribute("data-base-price");
        
        if (basePrice) {
          const priceExcVat = parseFloat(basePrice).toFixed(2);
          
          if (showIncVat) {
            const priceIncVat = (parseFloat(priceExcVat) * 1.25).toFixed(2);
            priceElement.innerHTML = `${priceIncVat} <span class="vat-label-pp">inkl. moms</span>`;
          } else {
            priceElement.innerHTML = `${priceExcVat} <span class="vat-label-pp">exkl. moms</span>`;
          }
        }
      });

      // Handle ATC elements
      atcElements.forEach((priceElement) => {
        const basePrice = priceElement.getAttribute("data-base-price");
        
        if (basePrice) {
          const priceExcVat = parseFloat(basePrice).toFixed(2);
          
          if (showIncVat) {
            const priceIncVat = (parseFloat(priceExcVat) * 1.25).toFixed(2);
            priceElement.innerHTML = `${priceIncVat} <span class="vat-label-pp">inkl. moms</span>`;
          } else {
            priceElement.innerHTML = `${priceExcVat} <span class="vat-label-pp">exkl. moms</span>`;
          }
        }
      });
    }
  }

  // Initialize the VAT toggle
  const vatToggleInstance = new VatToggle();
  
  // Make it globally accessible
  window.VatToggle = vatToggleInstance;
});
