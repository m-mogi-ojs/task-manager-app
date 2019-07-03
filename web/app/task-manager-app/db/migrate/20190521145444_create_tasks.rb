class CreateTasks < ActiveRecord::Migration[5.2]
  def change
    create_table :tasks do |t|
      t.references :kanban, foreign_key: true
      t.string :name, null: false
      t.date :deadline
      t.boolean :complete_flg, default: false
      t.integer :sort

      t.timestamps
    end
  end
end
