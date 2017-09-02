#!/usr/bin/env python
# --------------------------------------------------------------
# Description: Import environment variables from dynamodb to .tfstate file
# Authors: Yegor Fadeev
# Date:    26/08/17
# --------------------------------------------------------------
"""
Script to import variables from DynamoDb to .tfstate file

Usage:
  import-env.py <deployment_id> [--output=OUTFILE]

Options:
  -h --help                   Show this screen.
  --version                   Show version.
"""
import sys, os, json
import boto3
from docopt import docopt
import decimal
from decimal import Decimal

table_name = 'tipo.SystemConfig'

def main():
    args = docopt(__doc__, version='')
    
    dynamodb = boto3.resource('dynamodb')
    
    deployment_id = args['<deployment_id>']
    output_file = args['--output']
    
    script_dir = os.path.dirname(os.path.realpath(__file__))
    props_file = script_dir + '/' + deployment_id + '.properties'
    if output_file is not None:
        props_file = script_dir + '/' + output_file

    table = dynamodb.Table(table_name)
    with open(props_file, 'w') as f:
        response = table.scan()
        for item in response['Items']:
            item_to_file(item, f)
        
        while 'LastEvaluatedKey' in response:
            response = table.scan(
                ExclusiveStartKey=response['LastEvaluatedKey']
            )
            for item in response['Items']:
                item_to_file(item, f)
    
    print('Terraform variables are written to {}'.format(props_file))

def item_to_file(item, f):
    key = item['hash_key']
    value = item['value']
    
    if value is None:
        f.write('{}=\n'.format(key))
    elif isinstance(value, dict):
        return
    elif isinstance(value, list):
        f.write('{}={}\n'.format(key, json.dumps(value, cls=DecimalEncoder)))
    else:
        f.write('{}={}\n'.format(key, value))
        
# Helper class to convert a DynamoDB item to JSON.
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)

if __name__ == '__main__':
    main()