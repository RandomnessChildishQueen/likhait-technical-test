class RenameOccuredAtToOccurredAt < ActiveRecord::Migration[7.2]
  def up
    if column_exists?(:expenses, :occured_at)
      rename_column :expenses, :occured_at, :occurred_at
    end

    if index_name_exists?(:expenses, :index_expenses_on_occured_at)
      rename_index :expenses,
        :index_expenses_on_occured_at,
        :index_expenses_on_occurred_at
    end
  end

  def down
    if index_name_exists?(:expenses, :index_expenses_on_occurred_at)
      rename_index :expenses,
        :index_expenses_on_occurred_at,
        :index_expenses_on_occured_at
    end

    if column_exists?(:expenses, :occurred_at)
      rename_column :expenses, :occurred_at, :occured_at
    end
  end
end
