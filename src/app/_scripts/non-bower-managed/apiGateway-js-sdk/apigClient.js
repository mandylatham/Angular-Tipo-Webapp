/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var apigClientFactory = {};
apigClientFactory.newClient = function (config) {
    var apigClient = { };
    if(config === undefined) {
        config = {
            accessKey: '',
            secretKey: '',
            sessionToken: '',
            region: '',
            apiKey: undefined,
            defaultContentType: 'application/json',
            defaultAcceptType: 'application/json'
        };
    }
    if(config.accessKey === undefined) {
        config.accessKey = '';
    }
    if(config.secretKey === undefined) {
        config.secretKey = '';
    }
    if(config.apiKey === undefined) {
        config.apiKey = '';
    }
    if(config.sessionToken === undefined) {
        config.sessionToken = '';
    }
    if(config.region === undefined) {
        config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if(config.defaultContentType === undefined) {
        config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if(config.defaultAcceptType === undefined) {
        config.defaultAcceptType = 'application/json';
    }

    
    // extract endpoint and path from url
	// api endpoint derived based on url - e.g. tipo application url should be https://api.tipotapp.com/tipo whereas billionbase application should be https://api.tipotapp.com/deltagene.billionbases
	var hostname = window.location.hostname;
	var domainarray = string.split('.');
	var domain0 = domainarray[0];
	var domain1 = domainarray[1];
	var invokeUrl;
	
	if (domain0 == app) {
		invokeUrl = 'https://api.tipotapp.com/tipo';
	} else {
		invokeUrl = 'https://api.tipotapp.com/deltagene.billionbases';
	}
	
    // var invokeUrl = 'https://74oj0xr2l2.execute-api.us-east-1.amazonaws.com/dev';
    var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    var pathComponent = invokeUrl.substring(endpoint.length);

    var sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var authType = 'NONE';
    if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
        authType = 'AWS_IAM';
    }

    var simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);
    
    
    
    apigClient.tipoTipoNameGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['tipo_action', 'page', 'tipo_filter', 'per_page', 'tipo_version', 'compression', 'tipo_fields', 'tipo_name'], ['body']);
        
        var tipoTipoNameGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo/{tipo_name}').expand(apiGateway.core.utils.parseParametersToObject(params, ['tipo_name'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, ['compression', ]),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['tipo_action', 'page', 'tipo_filter', 'per_page', 'tipo_version', 'tipo_fields', ]),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoTipoNameGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tipoTipoNamePut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['tipo_action', 'tipo_version', 'tipo_name', 'body'], ['body']);
        
        var tipoTipoNamePutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo/{tipo_name}').expand(apiGateway.core.utils.parseParametersToObject(params, ['tipo_name', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['tipo_action', 'tipo_version', ]),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoTipoNamePutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tipoTipoNameDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['tipo_action', 'tipo_version', 'tipo_name', 'body'], ['body']);
        
        var tipoTipoNameDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo/{tipo_name}').expand(apiGateway.core.utils.parseParametersToObject(params, ['tipo_name', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['tipo_action', 'tipo_version', ]),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoTipoNameDeleteRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tipoTipoNameOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var tipoTipoNameOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo/{tipo_name}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoTipoNameOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tipoTipoNameIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['tipo_action', 'tipo_version', 'compression', 'tipo_fields', 'tipo_name', 'id'], ['body']);
        
        var tipoTipoNameIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo/{tipo_name}/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['tipo_name', 'id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, ['compression', ]),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['tipo_action', 'tipo_version', 'tipo_fields', ]),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoTipoNameIdGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tipoTipoNameIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['tipo_action', 'tipo_version', 'tipo_name', 'id', 'body'], ['body']);
        
        var tipoTipoNameIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo/{tipo_name}/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['tipo_name', 'id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['tipo_action', 'tipo_version', ]),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoTipoNameIdPutRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tipoTipoNameIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['tipo_action', 'tipo_version', 'tipo_name', 'id'], ['body']);
        
        var tipoTipoNameIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo/{tipo_name}/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['tipo_name', 'id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['tipo_action', 'tipo_version', ]),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoTipoNameIdDeleteRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tipoTipoNameIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var tipoTipoNameIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo/{tipo_name}/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoTipoNameIdOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tipoDefGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var tipoDefGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo_def').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoDefGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tipoDefOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var tipoDefOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo_def').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoDefOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tipoDefTipoNameGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['tipo_version', 'tipo_name'], ['body']);
        
        var tipoDefTipoNameGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo_def/{tipo_name}').expand(apiGateway.core.utils.parseParametersToObject(params, ['tipo_name'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['tipo_version', ]),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoDefTipoNameGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tipoDefTipoNameOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var tipoDefTipoNameOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/tipo_def/{tipo_name}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tipoDefTipoNameOptionsRequest, authType, additionalParams, config.apiKey);
    };
    

    return apigClient;
};
