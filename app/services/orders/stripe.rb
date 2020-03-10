require 'stripe'
Stripe.api_key = 'sk_test_YapgQKcY7BbcSXD7yclJVrMI00WbpGmni0'

class Orders::Stripe
  INVALID_STRIPE_OPERATION = 'Invalid Stripe Operation'

  def self.execute(order:, user:)
    product = order.product
    # Check if the order is a plan
    if product.stripe_plan_name.blank?
      charge = Stripe::Charge.create({
            amount: product.price_cents.to_s,
            currency: "inr",
            description: product.name,
            source: order.token
      })
    else
     #SUBSCRIPTIONS WILL BE HANDLED HERE
    end
    unless charge&.id.blank?
      # If there is a charge with id, set order paid.
      order.charge_id = charge.id
      order.set_paid
      order.save!
    end
    byebug
  rescue Stripe::StripeError => e
    # If a Stripe error is raised from the API,
    # set status failed and an error message
    order.error_message = INVALID_STRIPE_OPERATION
    order.set_failed
  end
  
  # private

  # def self.execute_charge(price_cents:, description:, card_token:)
  #   Stripe::Charge.create({
  #     amount: price_cents.to_s,
  #     currency: "usd",
  #     description: description,
  #     source: card_token
  #   })
  # end
end