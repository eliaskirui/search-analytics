class SearchLog < ApplicationRecord
  validates :term, presence: true

  def increment_search_count
    increment!(:search_count)
  end
end
