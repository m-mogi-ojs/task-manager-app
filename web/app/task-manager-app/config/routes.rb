Rails.application.routes.draw do

  root 'kanbans#index'
  post 'kanbans/create'
  post 'kanbans/update'
  post 'kanbans/destroy'
  get '/tasks', to: 'tasks#index'
  post 'tasks/create'
  post 'tasks/update'
  post 'tasks/destory'
  get '/signup', to: 'users#new'
  post '/signup', to: 'users#create'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  get '/logout', to: 'sessions#destroy'
  get '/top', to: 'top#index'
end
