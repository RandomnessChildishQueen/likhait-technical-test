class ReplaceDateWithOccuredAt < ActiveRecord::Migration[7.2]
  def up
    add_column :expenses, :occured_at, :datetime, null: true

    execute <<~SQL.squish
        UPDATE expenses
        SET occured_at = date
        WHERE occured_at IS NULL
    SQL

    change_column_null :expenses, :occured_at, false
    add_index :expenses, :occured_at

    remove_column :expenses, :date
  end

  def down
    add_column :expenses, :date, :datetime, null: true

    execute <<~SQL.squish
        UPDATE expenses
        SET date = DATE(occured_at)
        WHERE date IS NULL
    SQL

    change_column_null :expenses, :date, false
    remove_index :expenses, :occured_at
    remove_column :expenses, :occured_at
  end
end
