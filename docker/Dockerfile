FROM atlassian/default-image:latest
RUN npm install -g bower@1.7.7 grunt-cli@0.1.13
RUN apt-get install -y python-pip
RUN pip install awscli --upgrade --user
RUN echo '{ "allow_root": true }' > /root/.bowerrc
