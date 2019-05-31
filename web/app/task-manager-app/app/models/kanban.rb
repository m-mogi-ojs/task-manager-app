class Kanban < ApplicationRecord
  belongs_to :user
  has_many :tasks
end
