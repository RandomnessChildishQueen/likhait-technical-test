class Category < ApplicationRecord
  has_many :expenses, dependent: :destroy

  normalizes :name, with: ->(name) { name.strip }
  normalizes :emoji, with: ->(emoji) { emoji.strip.presence }

  validates :name,
  presence: true,
  length: { maximum: 100 },
  uniqueness: { case_sensitive: false }

  private

  def single_emoji_only
    if emoji.grapheme_clusters.size > 1
      errors.add(:emoji, "must be a single character")
    elsif emoji.match?(/\A\p{ASCII}\z/)
      errors.add(:emoji, "must be an emoji")
    end
  end
end
