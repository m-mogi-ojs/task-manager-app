# Description docker-compose and in container
docker-compose build  
docker-compose up -d  
docekr-compose exec web bash  

# init
rails db:create  
rails db:migrate

# heroku deploy
cd ./web  
heroku container:push web  
heroku container:relase web  
  
# heroku reset db
heroku pg:reset DATABASE_URL  
