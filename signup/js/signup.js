(function () {
  'use strict';

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_PATTERN = /^\+?\d{7,15}$/;
  var MIN_PASSWORD_LENGTH = 8;

  function validateEmail(value) {
    if (!value) return 'Email is required.';
    if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address.';
    return '';
  }

  function validatePassword(value) {
    if (!value) return 'Password is required.';
    if (value.length < MIN_PASSWORD_LENGTH) {
      return 'Password must be at least ' + MIN_PASSWORD_LENGTH + ' characters.';
    }
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
      return 'Password must contain at least one letter and one number.';
    }
    return '';
  }

  function validateConfirmPassword(value, password) {
    if (!value) return 'Please confirm your password.';
    if (value !== password) return 'Passwords do not match.';
    return '';
  }

  function validatePhone(value) {
    if (!value) return 'Phone number is required.';
    // Allow common separators (spaces, dashes, dots, parentheses) and strip them before checking.
    var digits = value.replace(/[\s\-.()]/g, '');
    if (!PHONE_PATTERN.test(digits)) {
      return 'Enter a valid phone number (7 to 15 digits, optional leading +).';
    }
    return '';
  }

  var api = {
    validateEmail: validateEmail,
    validatePassword: validatePassword,
    validateConfirmPassword: validateConfirmPassword,
    validatePhone: validatePhone
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (typeof document === 'undefined') return;

  var form = document.getElementById('signup-form');
  if (!form) return;

  function fieldValue(name) {
    return form.elements[name].value.trim();
  }

  function setError(name, message) {
    var input = form.elements[name];
    var errorEl = document.getElementById(name + '-error');
    errorEl.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateAll() {
    var email = fieldValue('email');
    var password = form.elements['password'].value;
    var confirm = form.elements['confirm-password'].value;
    var phone = fieldValue('phone');

    var errors = {
      email: validateEmail(email),
      password: validatePassword(password),
      'confirm-password': validateConfirmPassword(confirm, password),
      phone: validatePhone(phone)
    };

    var firstInvalid = null;
    Object.keys(errors).forEach(function (name) {
      setError(name, errors[name]);
      if (errors[name] && !firstInvalid) firstInvalid = form.elements[name];
    });

    return firstInvalid;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var firstInvalid = validateAll();
    if (firstInvalid) {
      firstInvalid.focus();
    }
  });

  // Clear an error as soon as the user edits the field.
  form.addEventListener('input', function (event) {
    var name = event.target.name;
    if (name) setError(name, '');
  });
})();
