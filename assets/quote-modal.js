/**
 * Quote Modal Handler
 * Handles the quote request modal functionality including:
 * - Opening/closing modal
 * - Form validation
 * - Form submission via Shopify contact form
 * - Success message display with auto-close
 */

class QuoteModal {
constructor() {
    this.modal = document.getElementById('quote-modal');
    if (!this.modal) return;

    this.form = this.modal.querySelector('#quote-contact-form');
    this.formContainer = this.modal.querySelector('[data-quote-form-container]');
    this.submitButton = this.modal.querySelector('[data-quote-submit]');
    this.submitText = this.modal.querySelector('[data-submit-text]');
    this.spinner = this.modal.querySelector('[data-quote-spinner]');

    // Message elements
    this.successMessage = this.modal.querySelector('[data-quote-success-message]');
    this.errorMessage = this.modal.querySelector('[data-quote-error-message]');
    this.errorText = this.modal.querySelector('[data-error-text]');

    // Form fields
    this.productInput = this.modal.querySelector('[data-quote-product-input]');
    this.phoneInput = this.modal.querySelector('[data-quote-phone]');
    this.emailInput = this.modal.querySelector('[data-quote-email]');
    this.gdprCheckbox = this.modal.querySelector('[data-quote-gdpr]');
    this.bodyField = this.modal.querySelector('[data-quote-body]');
    this.subjectField = this.modal.querySelector('[data-quote-subject]');

    // Field error elements
    this.phoneError = this.modal.querySelector('[data-error-phone]');
    this.emailError = this.modal.querySelector('[data-error-email]');
    this.gdprError = this.modal.querySelector('[data-error-gdpr]');

    this.autoCloseTimer = null;
    this.isSubmitting = false;

    this.init();
  }

  init() {
    // Bind event listeners
    this.bindQuoteButtons();
    this.bindCloseButtons();
    this.bindFormEvents();
    this.bindEscapeKey();
  }

  bindQuoteButtons() {
    const quoteButtons = document.querySelectorAll('[data-quote-button]');
    quoteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productTitle = button.getAttribute('data-product-title');
        const productUrl = button.getAttribute('data-product-url');
        this.openModal(productTitle, productUrl);
      });
    });
  }

  bindCloseButtons() {
    const closeButtons = this.modal.querySelectorAll('[data-quote-modal-close]');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => this.closeModal());
    });
  }

  bindFormEvents() {
    if (!this.form) return;

    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation
    if (this.phoneInput) {
      this.phoneInput.addEventListener('input', () => this.clearError('phone'));
      this.phoneInput.addEventListener('blur', () => this.validatePhone());
    }

    if (this.emailInput) {
      this.emailInput.addEventListener('input', () => this.clearError('email'));
      this.emailInput.addEventListener('blur', () => this.validateEmail());
    }

    if (this.gdprCheckbox) {
      this.gdprCheckbox.addEventListener('change', () => this.clearError('gdpr'));
    }
  }

  bindEscapeKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.hidden) {
        this.closeModal();
      }
    });
  }

openModal(productTitle, productUrl) {
    // Hide all messages
    this.hideMessages();

    // Pre-fill product information
    if (this.productInput) {
      this.productInput.value = productTitle;
    }

    // Update subject with product name
    if (this.subjectField) {
      this.subjectField.value = `Förfrågan om offert - ${productTitle}`;
    }

    // Prepare body field with product details
    if (this.bodyField) {
      const bodyText = `Produktinformation:\nProdukt: ${productTitle}\nProduktlänk: ${window.location.origin}${productUrl}\n\n`;
      this.bodyField.value = bodyText;
    }

    // Show modal
    this.modal.hidden = false;
    document.body.classList.add('quote-modal-open');

    // Focus first input
    setTimeout(() => {
      if (this.phoneInput) {
        this.phoneInput.focus();
      }
    }, 100);
  }

  closeModal() {
    // Clear any auto-close timer
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }

    // Hide modal
    this.modal.hidden = true;
    document.body.classList.remove('quote-modal-open');

    // Reset form after animation
    setTimeout(() => {
      this.resetForm();
    }, 300);
  }

resetForm() {
    if (this.form) {
      this.form.reset();
    }

    // Reset UI states
    this.clearAllErrors();
    this.hideMessages();

    // Reset submit button
    this.setSubmitState(false);
  }

  validatePhone() {
    const phone = this.phoneInput?.value.trim();
    if (!phone) {
      this.showError('phone', 'Vänligen ange ett telefonnummer');
      return false;
    }
    this.clearError('phone');
    return true;
  }

  validateEmail() {
    const email = this.emailInput?.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      this.showError('email', 'Vänligen ange en e-postadress');
      return false;
    }

    if (!emailRegex.test(email)) {
      this.showError('email', 'Vänligen ange en giltig e-postadress');
      return false;
    }

    this.clearError('email');
    return true;
  }

  validateGdpr() {
    if (!this.gdprCheckbox?.checked) {
      this.showError('gdpr', 'Du måste godkänna villkoren');
      return false;
    }
    this.clearError('gdpr');
    return true;
  }

  validateForm() {
    const isPhoneValid = this.validatePhone();
    const isEmailValid = this.validateEmail();
    const isGdprValid = this.validateGdpr();

    return isPhoneValid && isEmailValid && isGdprValid;
  }

  showError(field, message) {
    const errorElement = this[`${field}Error`];
    const inputElement = this[`${field}Input`] || this[`${field}Checkbox`];

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.hidden = false;
    }

    if (inputElement) {
      inputElement.classList.add('error');
    }
  }

  clearError(field) {
    const errorElement = this[`${field}Error`];
    const inputElement = this[`${field}Input`] || this[`${field}Checkbox`];

    if (errorElement) {
      errorElement.hidden = true;
    }

    if (inputElement) {
      inputElement.classList.remove('error');
    }
  }

  clearAllErrors() {
    this.clearError('phone');
    this.clearError('email');
    this.clearError('gdpr');
  }

  setSubmitState(isSubmitting) {
    this.isSubmitting = isSubmitting;

    if (this.submitButton) {
      this.submitButton.disabled = isSubmitting;
    }

    if (this.submitText) {
      this.submitText.textContent = isSubmitting ? 'Skickar...' : 'Jag vill bli kontaktad';
    }

    if (this.spinner) {
      this.spinner.hidden = !isSubmitting;
    }

    // Hide/show icon
    const icon = this.submitButton?.querySelector('.quote-modal__submit-icon');
    if (icon) {
      icon.style.display = isSubmitting ? 'none' : 'block';
    }
  }

async handleSubmit(e) {
    e.preventDefault();

    // Prevent double submission
    if (this.isSubmitting) return;

    // Hide any previous messages
    this.hideMessages();

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    // Update body field with all information before submission
    if (this.bodyField && this.phoneInput && this.emailInput) {
      const currentBody = this.bodyField.value;
      const contactInfo = `\nKontaktinformation:\nTelefon: ${this.phoneInput.value}\nE-post: ${this.emailInput.value}`;
      this.bodyField.value = currentBody + contactInfo;
    }

    // Set submitting state
    this.setSubmitState(true);

    try {
      // Submit form via AJAX
      const formData = new FormData(this.form);

      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Show success message
        this.showSuccessMessage();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Quote form submission error:', error);
      this.showErrorMessage('Ett fel uppstod vid skickning. Vänligen försök igen.');
    } finally {
      this.setSubmitState(false);
    }
  }

  showSuccessMessage() {
    // Show success message
    if (this.successMessage) {
      this.successMessage.hidden = false;
    }

    // Scroll to message
    this.scrollToMessage();

    // Auto-close modal after 5 seconds with fade out animation
    this.autoCloseTimer = setTimeout(() => {
      this.closeModalWithAnimation();
    }, 5000);
  }

  showErrorMessage(message = 'Ett fel uppstod. Vänligen försök igen.') {
    // Update error text if provided
    if (this.errorText && message) {
      this.errorText.textContent = message;
    }

    // Show error message
    if (this.errorMessage) {
      this.errorMessage.hidden = false;
    }

    // Scroll to message
    this.scrollToMessage();

    // Auto-hide error message after 5 seconds
    this.autoCloseTimer = setTimeout(() => {
      this.closeModalWithAnimation();
    }, 5000);
  }

  hideMessages() {
    if (this.successMessage) {
      this.successMessage.hidden = true;
    }
    if (this.errorMessage) {
      this.errorMessage.hidden = true;
    }
  }

  scrollToMessage() {
    // Scroll the modal content to show the message
    setTimeout(() => {
      const modalContent = this.modal.querySelector('.quote-modal__content');
      if (modalContent) {
        modalContent.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  closeModalWithAnimation() {
    // Add fade out class for smooth animation
    const modalContent = this.modal.querySelector('.quote-modal__content');
    if (modalContent) {
      modalContent.style.animation = 'slideDown 0.3s ease';
    }

    // Close modal after animation
    setTimeout(() => {
      this.closeModal();
      if (modalContent) {
        modalContent.style.animation = '';
      }
    }, 300);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new QuoteModal();
  });
} else {
  new QuoteModal();
}
