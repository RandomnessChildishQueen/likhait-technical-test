class Api::ExpensesController < ApplicationController
  def index
    expenses = Expense
      .includes(:category)
      .order(occurred_at: :desc, created_at: :desc)

    if params[:year].present? && params[:month].present?
      year = params[:year].to_i
      month = params[:month].to_i

      start_at = Time.utc(year, month, 1)
      end_at = start_at.next_month

      expenses = expenses.where(occurred_at: start_at...end_at)
    end

    render json: expenses.map { |expense| format_expense(expense) }
  rescue ArgumentError
    render json: { errors: [ "Invalid year or month" ] }, status: :unprocessable_entity
  end

  def create
    expense = Expense.new(expense_params)

    if expense.save
      render json: format_expense(expense), status: :created
    else
      render json: { errors: expense.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    expense = Expense.find(params[:id])

    if expense.update(expense_params)
      render json: format_expense(expense)
    else
      render json: { errors: expense.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    expense = Expense.find(params[:id])
    expense.destroy
    head :no_content
  end

  private

  def expense_params
    params.require(:expense).permit(
      :description,
      :amount,
      :category_id,
      :occurred_at
    )
  end

  def format_expense(expense)
    {
      id: expense.id,
      description: expense.description,
      amount: expense.amount.to_f,
      category: expense.category.name,
      occurred_at: expense.occurred_at.strftime("%Y-%m-%dT%H:%M:%S"),
      created_at: expense.created_at,
      updated_at: expense.updated_at
    }
  end
end
