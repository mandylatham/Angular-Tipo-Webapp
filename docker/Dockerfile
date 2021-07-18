FROM atlassian/default-image:2

# Install python
RUN apt-get update && apt-get install -y python-pip
RUN pip install --upgrade pip
RUN pip install awscli boto3 docopt

#Upgrade node package manager
RUN npm i -g npm

RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash \
    && apt-get install nodejs -yq

RUN bash -i -c 'nvm install 10'
RUN bash -i -c 'nvm use 10; nvm uninstall 8'

#Angular CLI
RUN npm install -g @angular/cli

COPY package.json /tmp 

RUN cd /tmp \
	 && npm install -g