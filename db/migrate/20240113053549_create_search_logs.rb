class CreateSearchLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :search_logs do |t|
      t.string :term
      t.string :user_ip
      t.integer :search_count, default: 1

      t.timestamps
    end
  end
end
