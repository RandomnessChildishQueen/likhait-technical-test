require 'rails_helper'

RSpec.describe Category, type: :model do
  describe "validations" do
    it "is valid with a name" do
      expect(Category.new(name: "Groceries")).to be_valid
    end

    it "requires a name" do
      category = Category.new(name: nil)

      expect(category).not_to be_valid
      expect(category.errors[:name]).to include("can't be blank")
    end

    it "rejects a name that is only whitespace" do
      expect(Category.new(name: "   ")).not_to be_valid
    end

    it "rejects a duplicate name regardless of case" do
      Category.create!(name: "Groceries")
      category = Category.new(name: "GROCERIES")

      expect(category).not_to be_valid
      expect(category.errors[:name]).to include("has already been taken")
    end

    it "rejects a name longer than 100 characters" do
      expect(Category.new(name: "a" * 101)).not_to be_valid
      expect(Category.new(name: "a" * 100)).to be_valid
    end
  end

  describe "normalization" do
    it "strips surrounding whitespace from the name" do
      expect(Category.create!(name: "  Groceries  ").name).to eq("Groceries")
    end
  end

  describe "emoji" do
    it "is optional" do
      expect(Category.new(name: "Groceries", emoji: nil)).to be_valid
    end

    it "accepts a single emoji" do
      expect(Category.new(name: "Groceries", emoji: "🥑")).to be_valid
    end

    it "accepts a multi-codepoint emoji" do
      expect(Category.new(name: "Groceries", emoji: "🛍️")).to be_valid
    end

    it "rejects more than one character" do
      category = Category.new(name: "Groceries", emoji: "🥑🍔")

      expect(category).not_to be_valid
      expect(category.errors[:emoji]).to include("must be a single character")
    end

    it "rejects a plain ASCII character" do
      category = Category.new(name: "Groceries", emoji: "x")

      expect(category).not_to be_valid
      expect(category.errors[:emoji]).to include("must be an emoji")
    end

    it "stores blank as nil" do
      expect(Category.create!(name: "Groceries", emoji: "  ").emoji).to be_nil
    end
  end
end
