## Prompt 1
I'm having an issue running my JavaScript code. Here's the error message I'm getting: 

"!TypeError: Cannot set properties of null (setting 'textContent')"

Please help me understand what's wrong.

## Prompt 2
I'm having issues with my JavaScript code. Submitting the promo form refreshes the page and does not run the following code as expected:

promoForm.addEventListener('submit', function(event) {
  var userCode = promoCodeInput.value;
  var finalPrice = applyDiscount(basePrice, userCode);

  if (finalPrice < basePrice) {
    finalPriceElement.textContent = `Final Tickets Price: $${finalPrice}`;
    promoCodeInput.disabled = true;
  } else {
    promoCodeInput.placeholder = 'Invalid Promo Code!'
  }

  promoCodeInput.value = '';
});

Could you help me debug and fix this?

<!-- Challenge: Use ChatGPT to debug the applyDiscount function -->
## Prompt 3
I'm having trouble with this `applyDiscount` function. It isn't correctly applying a 50% discount only when I enter the code "HALF".

###
function applyDiscount(basePrice, userCode) {
  var discountRate = 0;
  if (userCode = "HALF") {
    discountRate = 0.5;
  }
  var finalPrice = basePrice - basePrice * discountRate;
  return finalPrice;
}
###

Could you help me debug and fix this function?

## Prompt 4
This JavaScript code works as expected, but I think it could be made more efficient and modern. Please provide a more streamlined and up-to-date version of this code.

var promoCodeInput = document.getElementById('promoCode');
var finalPriceElement = document.getElementById('finalPrice');
var promoForm = document.getElementById('promoForm'); 
var basePrice = '50';

finalPriceElement.textContent = `Ticket Price: $${basePrice}`;
function applyDiscount(basePrice, userCode) {
  var discountRate = 0;
  if (userCode === "HALF") {
    discountRate = 0.5;
  }
  var finalPrice = basePrice - basePrice * discountRate;
  return finalPrice;
}

promoForm.addEventListener('submit', function(event) {
  event.preventDefault(); 
    
  var userCode = promoCodeInput.value;
  var finalPrice = applyDiscount(basePrice, userCode);
  
  if (finalPrice < basePrice) {
    finalPriceElement.textContent = `Final Ticket Price: $${finalPrice}`;
    promoCodeInput.placeholder = '';
  } else {
    promoCodeInput.placeholder = 'Invalid Promo Code!';
  }
  promoCodeInput.value = '';
});

## Prompt 5
You are a senior developer reviewing my JavaScript code before I ship it to production. Please provide feedback on how I can improve this code, make it more maintainable, and handle cases where a user enters the promo code in lowercase.

var promoCodeInput = document.getElementById('promoCode');
var finalPriceElement = document.getElementById('finalPrice');
var promoForm = document.getElementById('promoForm'); 
var basePrice = '50';

finalPriceElement.textContent = `Ticket Price: $${basePrice}`;
function applyDiscount(basePrice, userCode) {
  var discountRate = 0;
  if (userCode === "HALF") {
    discountRate = 0.5;
  }
  var finalPrice = basePrice - basePrice * discountRate;
  return finalPrice;
}

promoForm.addEventListener('submit', function(event) {
  event.preventDefault(); 
    
  var userCode = promoCodeInput.value;
  var finalPrice = applyDiscount(basePrice, userCode);
  
  if (finalPrice < basePrice) {
    finalPriceElement.textContent = `Final Ticket Price: $${finalPrice}`;
    promoCodeInput.placeholder = '';
  } else {
    promoCodeInput.placeholder = 'Invalid Promo Code!';
  }
  promoCodeInput.value = '';
});
