class Category < ApplicationRecord
  has_many :expenses, dependent: :destroy

  normalize :name, with: ->(name) { name.strip }

  validates :name,
  presence: true,
  length: { maximum: 100 },
  uniqueness: { case_sensitive: false }
end
