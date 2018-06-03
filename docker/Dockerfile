FROM atlassian/default-image:2
RUN npm install -g bower@1.8.4 grunt-cli@0.1.13 mime@1.3.6
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# Install python
RUN apt-get update && apt-get install -y python-pip
RUN pip install awscli boto3 docopt
