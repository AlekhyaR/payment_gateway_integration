class Order < ApplicationRecord
  enum status: {pending: 0, failed: 1, paid: 2, paypal_executed: 3}
  enum payment_gateway: {stripe: 0, paypal: 1}
  belongs_to :product
  belongs_to :user

  scope :recently_created, -> {where(created_at: 1.minute_ago..DateTime.now)}

  # ["paid", "failed", "paypal_executed"].each do |status_value|
  #   define_method("set_#{status_value}") do
  #     self.status = Order.statuses[":#{status_value}"]
  #   end
  # end

  def set_paid
    self.status = Order.statuses[:paid]
  end
  def set_failed
    self.status = Order.statuses[:failed]
  end
  def set_paypal_executed
    self.status = Order.statuses[:paypal_executed]
  end

end