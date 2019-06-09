FROM ruby:2.6.3

# https
RUN apt-get update && apt-get install -y apt-transport-https 

RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -

RUN apt-get update && apt-get install -y build-essential libpq-dev postgresql-client nodejs

RUN apt-get update && apt-get install -y curl apt-transport-https wget && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn

RUN gem install rails
RUN mkdir /app
COPY ./app /app
WORKDIR /app/task-manager-app
RUN bundle install