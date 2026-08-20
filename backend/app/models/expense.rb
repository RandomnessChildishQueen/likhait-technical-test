class Expense < ApplicationRecord
  belongs_to :category

  validates :occurred_at, presence: true
end
