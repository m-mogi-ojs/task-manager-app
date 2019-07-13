# Description docker-compose and in container
docker-compose build  
docker-compose up -d  
docekr-compose exec web bash  

# 初回用メモ 
rails db:create  
rails db:migrate

# heroku deploy
cd ./web  
heroku container:push web  
heroku container:relase web  
