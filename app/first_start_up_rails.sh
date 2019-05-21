#!/bin/bash
cd taskedule
bundle install
rails db:create
#rials db:migrate
rails s -b 0.0.0.0
exit 0