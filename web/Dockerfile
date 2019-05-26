FROM ruby:2.6.3

RUN apt-get update && apt-get install -y build-essential libpq-dev postgresql-client
RUN gem install rails
RUN mkdir /app
COPY ./app /app
WORKDIR /app/task-manager-app
RUN bundle install