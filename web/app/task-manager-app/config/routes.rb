Rails.application.routes.draw do

  root 'kanbans#index'
  resources :kanbans, only: [:create, :update, :destroy]
  resources :tasks, only: [:create, :update, :destroy]
  get '/signup', to: 'users#new'
  post '/signup', to: 'users#create'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  get '/logout', to: 'sessions#destroy'
  get '/top', to: 'top#index'
end
