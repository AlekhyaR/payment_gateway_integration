(function setupPaypal() {
  function isPayment() {
    return $('[data-charges-and-payments-section] input[name="orders[product_id]"]:checked').length
  }

  function submitOrderPaypal(chargeID) {
    var $form = $("#order-details");
    // Add a hidden input orders[charge_id]
    $form.append($('<input type="hidden" name="orders[charge_id]"/>').val(chargeID));
    // Set order type
    $('#order-type').val('paypal');
    $form.submit();
  }

  paypal.Buttons({
    env: "#{ENV['PAYPAL_ENV']}",
    createOrder: function() {
      $('#order-type').val("paypal");
      if (isPayment()) {
        return $.post("#{paypal_create_payment_url}", $('#order-details').serialize()).then(function(data) {
          return data.token;
        });
      } else {
      }
    },
    onApprove: function(data) {
      if (isPayment()) {
        return $.post("#{paypal_execute_payment_url}", {
          paymentID: data.paymentID,
          payerID:   data.payerID
        }).then(function() {
          submitOrderPaypal(data.paymentID)
        });
      } else {
       }
      }
    }).render('#submit-paypal');
 }



)