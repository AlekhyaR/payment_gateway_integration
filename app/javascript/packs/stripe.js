(function setupStripe() {
  //Initialize stripe with publishable key
  var stripe = Stripe('pk_test_E3HR4HrjDrP4gAJWTG4IQvz7005rPwzLKG');

  //Create Stripe credit card elements.
  var elements = stripe.elements();
  var card = elements.create('card');

  // Mount Stripe card element in the #card-element div.
  card.mount('#card-element');

  //Add a listener in order to check if
  card.addEventListener('change', function(event) {
    //the div card-errors contains error details if any
    var displayError = document.getElementById('card-errors');
    document.getElementById('submit-stripe').disabled = false;
    if (event.error) {
      // Display error
      displayError.textContent = event.error.message;
    } else {
      // Clear error
      displayError.textContent = '';
    }
  });


  
  var form = document.getElementById('order-details');
  // This will be called when the #submit-stripe button is clicked by the user.
  form.addEventListener('submit', function(event) {
    $('#submit-stripe').prop('disabled', true);
    event.preventDefault();
    stripe.createToken(card).then(function(result) {
      if (result.error) {
        // Inform that there was an error.
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Now we submit the form. We also add a hidden input storing 
        // the token. So our back-end can consume it.
        var $form = $("#order-details");
        // Add a hidden input orders[token]
        $form.append($('<input type="hidden" name="orders[token]"/>').val(result.token.id));
        // Set order type
        $('#order-type').val('stripe');
        $form.submit();
      }
    });
    return false;
  });
}


  (function changeTab() {
    var newActiveTabID = $('input[name="payment-selection"]:checked').val();
    $('.paymentSelectionTab').removeClass('active');
    $('#tab-' + newActiveTabID).addClass('active');
  }) 
);
