class Task < ApplicationRecord
  belongs_to :kanban
  validates :name, presence: true
end
