require 'rails_helper'

RSpec.describe "Api::Categories", type: :request do
  describe "GET /api/categories" do
    let!(:food) { Category.create!(name: "Food") }
    let!(:transport) { Category.create!(name: "Transport") }
    let!(:supplies) { Category.create!(name: "Supplies") }

    it "returns all categories" do
      get "/api/categories"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |c| c["name"] }).to include("Food", "Transport", "Supplies")
    end

    it "returns categories in alphabetical order" do
      get "/api/categories"

      json = JSON.parse(response.body)
      expect(json.map { |c| c["name"] }).to eq([ "Food", "Supplies", "Transport" ])
    end
  end

  describe "POST /api/categories" do
    it "creates the category and returns it" do
      expect {
        post "/api/categories", params: { category: { name: "Groceries" } }
      }.to change(Category, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["name"]).to eq("Groceries")
      expect(json["id"]).to be_present
    end
    it "strips surrounding whitespace from the name" do
      post "/api/categories", params: { category: { name: "  Groceries  " } }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["name"]).to eq("Groceries")
    end

    it "includes the new category in the index response" do
      post "/api/categories", params: { category: { name: "Groceries" } }
      get "/api/categories"

      expect(JSON.parse(response.body).map { |c| c["name"] }).to include("Groceries")
    end

    it "rejects a blank name" do
      expect {
        post "/api/categories", params: { category: { name: "" } }
      }.not_to change(Category, :count)

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["errors"]).to include("Name can't be blank")
    end

    it "rejects a duplicate name regardless of case" do
      Category.create!(name: "Groceries")

      expect {
        post "/api/categories", params: { category: { name: "groceries" } }
      }.not_to change(Category, :count)

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["errors"]).to include("Name has already been taken")
    end

    it "rejects a name longer than 100 characters" do
      post "/api/categories", params: { category: { name: "a" * 101 } }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["errors"])
        .to include("Name is too long (maximum is 100 characters)")
    end
  end
end
