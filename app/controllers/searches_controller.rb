class SearchesController < ApplicationController

  def index
    @search_logs = SearchLog.all.order(search_count: :desc)
  end

  def new
  end
  def create
    term = params[:term].to_s.strip

    if valid_search?(term)
      user_ip = request = request.remote_ip if request.present?
      if search_log = SearchLog.find_by(term: term)
        search_log.increment_search_count
      else
        SearchLog.create!(term: term, user_ip: user_ip)
      end
      # SearchLog.create!(term: term, user_ip: user_ip)
      log_search(term, user_ip)
    end

    render json: {status: "ok"}
  end


  private

  def valid_search?(term)
    term.present? && term.length > 5
  end

  def log_search(term, user_ip)
    search_log = SearchLog.find_or_initialize-by(term: term)
    search_log.increment_search_count
    search_log.update(user_ip: user_ip) if search_log.new_record?
  end
end
