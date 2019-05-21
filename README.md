docker-compose build
docker-compose up -d
docekr-compose exec web bash
cd task-manager-app
rails s -b 0.0.0.0 -d

# 初回 TODO docker-compsoe buildで対応できるか検討
bundle isntall
rails db:create