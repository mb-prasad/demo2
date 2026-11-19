(function () {
  'use strict';

  var LETTER_PATTERN = /\p{L}/u;
  var DIGIT_PATTERN = /\d/;

  function validateName(value, label) {
    if (!value) return label + ' is required.';
    if (DIGIT_PATTERN.test(value)) return label + ' cannot contain numbers.';
    if (!LETTER_PATTERN.test(value)) return label + ' must contain at least one letter.';
    return '';
  }

  function validateCity(value) {
    return validateName((value || '').trim(), 'City name');
  }

  function validateCountry(value) {
    return validateName((value || '').trim(), 'Country');
  }

  var api = {
    validateCity: validateCity,
    validateCountry: validateCountry
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (typeof document === 'undefined') return;

  var form = document.getElementById('add-city-form');
  if (!form) return;

  var list = document.getElementById('city-list');

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
    var errors = {
      city: validateCity(fieldValue('city')),
      country: validateCountry(fieldValue('country'))
    };

    var firstInvalid = null;
    Object.keys(errors).forEach(function (name) {
      setError(name, errors[name]);
      if (errors[name] && !firstInvalid) firstInvalid = form.elements[name];
    });

    return firstInvalid;
  }

  function addToList(city, country) {
    var item = document.createElement('li');
    var cityEl = document.createElement('span');
    cityEl.textContent = city;
    var countryEl = document.createElement('span');
    countryEl.className = 'city-country';
    countryEl.textContent = country;
    item.appendChild(cityEl);
    item.appendChild(countryEl);
    list.appendChild(item);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var firstInvalid = validateAll();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    addToList(fieldValue('city'), fieldValue('country'));
    form.reset();
    setError('city', '');
    setError('country', '');
    form.elements['city'].focus();
  });

  // Clear an error as soon as the user edits the field.
  form.addEventListener('input', function (event) {
    var name = event.target.name;
    if (name) setError(name, '');
  });
})();
