class Expense < ApplicationRecord
  belongs_to :category

  validates :occurred_at, presence: true
  validate :occurred_at_cannot_be_in_the_future

  private

  def occurred_at_cannot_be_in_the_future
    return if occurred_at.blank?

    if occurred_at.to_date > Time.current
      errors.add(:occurred_at, "cannot be in the future")
    end
  end
end
