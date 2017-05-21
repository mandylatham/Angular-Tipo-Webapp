#!/usr/bin/env bash

# 1. Compress and upload project's' content 
# 2. Add Content-Encoding gzip metadata key-value

find ./target-grunt/dist -name "*" | cut -c 21- | xargs -I {} sh -c "gzip -c ./target-grunt/dist/{} | aws s3 cp - s3://${S3_BUCKET}/{} --content-encoding gzip"
