class UsersController < ApplicationController

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      flash[:info] = "会員登録が完了しました。"
      log_in @user
      redirect_to root_url
    else
      flash[:warning] = @user.errors.full_messages.join("<br>").html_safe
      render 'new'
    end
  end

  private
    
    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end

end
