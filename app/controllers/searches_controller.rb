class SearchesController < ApplicationController

  def index
    @search_logs = SearchLog.all
  end

  def new
  end
  def create
    term = params[:term].to_s.strip

    if valid_search?(term)
      user_ip = request = request.remote_ip if request.present?
      SearchLog.create!(term: term, user_ip: user_ip)
    end

    render json: {status: "ok"}
  end


  private

  def valid_search?(term)
    term.present? && term.length > 5
  end
end
