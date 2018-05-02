FROM atlassian/default-image:latest
RUN npm install -g bower@1.7.8 grunt-cli@0.1.13 mime@1.3.6
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# Install python
RUN apt-get install -y python-pip
RUN pip install awscli boto3 docopt
