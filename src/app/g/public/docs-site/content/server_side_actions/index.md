---
title: Server Side Actions
weight: 6
---

## Introduction
As mentioned in the previous guide on Client Side Actions, an Action is a button that you can add on the TipoTapp UI and define some code for it that will be run when the user engages with the button. Server Side Actions are Actions that run code on a server when engaged with. In particular, TipoTapp supports the use of [AWS Lambda](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html) functions. AWS Lambda is a compute service that lets you run code without provisioning or managing servers. You can write your code there in one of the supported languages (currently Node.js, Java, C# and Python) and it will be available to be called by other applications that you link to it.

For instructions on how to create a Lambda function, [check the documentation](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html).

## How Server Side Actions Work
To create a Server Side Action, you need to first define a Lambda function on AWS. You then create an Action on TipoTapp that will call this function. You can select the data that gets sent to the server. For instance, you can include the `tipo_context` object in the request which holds such data as the user and account information. You can also include some additional data via Dependencies. We'll take a look at `tipo_context` and Dependencies later on in the guide.

On AWS, you can choose to only have one function per Action created. You can also define a pre-function and a post-function that will be run before and after your main Lambda function is run, respectively.

After your cloud function runs, a response is returned back to TipoTapp, where you can then use its data.

To explain the process in a more detailed way, take this example: suppose you created an Action on TipoTapp that  ran server side code when clicked. Suppose the Cloud function you wrote on AWS required additional information other than what's found in the `tipo_context` (if you recall, `tipo_context` holds such data as the user and account information, more on this later). To include such information in the request to the server, you would use client side or server side dependencies.

Client side dependency is information gathered from the user that you can then send in the request body to the server. How you collect such data is via a form that is shown to the user right after they click on the Action button, and before a request is made to the server. After the user fills the form and submits it, its data will be included in the request to the server.

Server side dependency is also additional data that you send in the request body, but rather than collecting the information from the user, you define what data will be sent when creating the Action. Server side dependencies are basically a list of Tipos that are referenced by the Cloud Function you've defined. Suppose your Lambda function needs to reference other Tipos other than the Tipo you are creating an Action for. For this, you would have to specify the list of Tipos that the Cloud Function needs to know about. The list is then sent in the request to the server.

Now, to continue with our example, suppose you defined three functions on AWS that will process the request: a pre-function, that will be the first to be run, a main function (we'll sometimes refer to this as the Cloud Function) and a post function, which will be run just before a response is sent back to TipoTapp.

When the user activates the Action on TipoTapp, a request will be sent to the server. Since we've defined a pre-function, this willl be the first to receive the request. It will process the data and then send a response (consider this the pre-function's response/output, but the Cloud Function's request/input) to the Cloud Function. The Cloud Function will then process this data, making requests to the database if necessary. When done, it will then send its output to the post-function, which will process the data before sending a final response back to TipoTapp. TipoTapp will then act on the data sent back. We'll look at this process in detail in the rest of this guide.

Remember that pre and post functions are optional.

![Server Customizations](/images/developer/ServerCustomisations.png)

### Pre Function
On AWS, you can specify a function that will be run before your main function is run. An example use case for this is, you might want to process the request before passing it to the main function. For this, you would define a pre-function that would process the request and then send its response to the main Cloud Function.

![Pre Function](/images/developer/PreFunction.png)

### Post Function
Just as you can define a pre-function on AWS, you can also define a post-function. This will be run after your Cloud Function completes execution, before the response is sent back to TipoTapp.

![Post Function](/images/developer/PostFunction.png)

### Input/Output Structure 
Below, you can see the structure of the request and response objects that make up the input and output respectively of a Cloud Function.

The Input consists of the `tipo_request`, available `server_dependencies` (we'll look what these are later) and the `tipo_context` if it was provided (we'll also look at this later).

The Output consists of a `tipo_request` which is the request sent to a post-function if it's available, a `tipo_response` that consist of data returned from the Cloud Function back to TipoTapp, the `response_header` and `http_header`. In the `response_header` you can include a `tab_url` attribute whose value is a URL that will be opened in a new tab once the response is received on TipoTapp. You can also include a `user_message` that will be displayed to the user in a flash message. Additionally, you can include a `return_url` that will be navigated to once the response is received on TipoTapp.

![Input Output Structures](/images/developer/InputOutput.png)

### Signature
Tipo Cloud Functions only take a single JSON input and a single JSON output, both these are explained in the Request Structure and Response Structure sections below.

  *`tipo_fn_response` handler ( `tipo_context`, `tipo_request`, `tipo_response`, `server_dependencies`);*

### Request Structure
Tipo Cloud Function request is a JSON object with the following four members.

Member name | Description
------------ | ---------------
`tipo_context` | Tipo Context contains all the contextual information about the user, application, current request and user actions
`tipo_request []` | Contains array of all the requests from the client. Only bulk action will contain more than one array item, but the structure will always be an array.
`tipo_response []`| Function may be called after performing database action, in which case there will be responses as well as requests.
`server_dependencies []`| This is a list of Tipos that are referenced by the Cloud Function. The list is sent in the request to the server.

Here is an example of complete request structure

```
{
  "tipo_request": [
    {
      "tipo_name": "Customer",
      "db_action": "PUT",
      "data": {
        "tipo_id": "123",
        "first_name": "ABC",
        "last_name": "XYZ"
      }
    },
    {
      "tipo_name": "PurchaseOrder",
      "db_action": "PUT",
      "data": {
        "tipo_id": "111",
        "order_amount": 1000,
        "ordered_product": 123
      }
    }
  ],
  "server_dependencies": [
    {
      "tipo_name": "Countries",
      "data": [
        {
          "tipo_id": "123",
          "country_name": "Australia",
          "country_code": "AU"
        },
        {
          "tipo_id": "124",
          "country_name": "New Zealand",
          "country_code": "NZ"
        }
      ]
    },
    {
      "tipo_name": "PurchaseOrder",
      "data": [
        {
          "tipo_id": "111",
          "order_amount": 1000,
          "ordered_product": 123
        }
      ]
    }
  ],
  "tipo_context": {
    "user": "test_user",
    "account": "acme",
    "gateway_request": {
      "tipo_name": "Customer",
      "tipo_filter": "(status:Active) OR (first_name:John) AND _exists_:(dept)"
    }
  }
}
```

### Response Structure
Tipo Cloud Function response is a JSON object with the following members.

Member name | Description
------------ | ---------------
`tipo_request []` | If you've defined a post-function, then the response of your Cloud Function will contain a request that will be processed by the post-function, before data is sent back to TipoTapp. This is optional; if there is no post--function, then there will be no request.
`tipo_response []`| This holds the data that is sent back to TipoTapp.
`response_header` | This holds additional instructions of what should happen once the response gets back to TipoTapp. For instance it can contain a `user_message` that will be shown to the user as a flash message, or it can contain a `return_url` which holds a URL that will be navigated to once the response reaches TipoTapp, it can also contain a `tab_url` that will hold a URL which will be opened in a new tab.
`http_header` | This carries HTTP headers which can hold information about the response, server or the objects sent back in the message body.

Here is an example of complete response structure:

```
{
  "tipo_request": [
    {
      "tipo_name": "SomeOtherObject1",
      "db_action": "PUT",
      "data": {
        "tipo_id": "123",
        "first_name": "ABC",
        "last_name": "XYZ"
      }
    },
    {
      "tipo_name": "SomeOtherObject2",
      "db_action": "PUT",
      "data": {
        "tipo_id": "111",
        "order_amount": 1000,
        "ordered_product": 123
      }
    },
    {
      "tipo_name": "SomeOtherObject3",
      "db_action": "DELETE",
      "data": {
        "tipo_id": "111",
        "order_amount": 1000,
        "ordered_product": 123
      }
    }
  ],
  "tipo_response": [
    {
      "tipo_name": "Countries",
      "status_code": 200,
      "data": [
        {
          "tipo_id": "123",
          "country_name": "Australia",
          "country_code": "AU"
        },
        {
          "tipo_id": "124",
          "country_name": "New Zealand",
          "country_code": "NZ"
        }
      ]
    },
    {
      "tipo_name": "PurchaseOrder",
      "status_code": 200,
      "data": [
        {
          "tipo_id": "111",
          "order_amount": 1000,
          "ordered_product": 123
        }
      ]
    }
  ],
  "response_header": {
    "user_message": "Hi User, Successfully done something !!!",
    "return_url": "/tipo/WhereToGo/tipo_id",
    "tab_url": "https://opennewtab.com"
  },
  "http_header": {
    "Cache-Control": "no-cache",
    "Connection": "close",
    "Date": "Wed, 21 Oct 2015 07:28:00 GMT"
  }
}
```

## Linking an Amazon AWS Account
Now that we've seen how Server Side functions work, let's create a few to demonstrate the setup process. We'll start by liking an Amazon AWS account in TipoTapp.

To use AWS Lambda, you can either use your own credentials or you can decide that the app will use the credentials of its subscribers (e.g. each school that the Student Management System will be sold to). We'll take the former option, to ensure that the app comes fully loaded with Cloud Function support instead of leaving this up to the subscribers.

To add the credentials, open `Develop` and select `Configurations`. Add your AWS `Access Key ID` and the `Secret Key`.

![AWS Settings](/images/actions/image_004.png)

## Registering your Cloud Functions
Before you can use a Lambda function, you have to register it. Each function you create on AWS comes with a unique identifier (the ARN). TipoTapp uses this to link to the functions you register.

To register a Cloud Function, head to `Develop` and select `Cloud Functions` from the menu. Bring up the Create form with the Add button.

![Register Cloud Function](/images/actions/image_005.png)

Give a name to your function, set `Type` to `AWS Lambda`, add its `Lambda Function ARN`, switch on `Use App AWS Credentials` which will use the AWS credentials you added. Also switch on `Supply TipoContext`. This will include the `tipo_context` object in the body of the request to the server. Tipo Context contains all the contextual information about the user, application, current request and user actions. Below are its attributes.

## Tipo Context
As mentioned, the `tipo_context` object holds contextual information about the user, application, current request and user actions. It has the following attributes:

Context Variable |  Description 
------------ | ------------
`$tipo_context`.**user** | Logged-in user id (Email)
`$tipo_context`.**user_role** | Logged-in user role
`$tipo_context`.**account** | Logged-in user account ID
`$tipo_context`.**account_name** | Logged-in user account name
`$tipo_context`.**application** | Logged-in application ID
`$tipo_context`.**application_name** | Logged-in application name
`$tipo_context`.**application_owner_account** | Logged-in application owner account ID
`$tipo_context`.**application_owner_account_name** | Logged-in application owner account name
`$tipo_context.gateway_request`.**tipo_name** | TipoName in the request URL
`$tipo_context.gateway_request`.**tipo_id** | TipoID in the request URL
`$tipo_context.gateway_request`.**tipo_action** | Query parameter `tipo_action` value
`$tipo_context.gateway_request`.**http_method** | Request HTTP method (GET, PUT, POST, DELETE)
`$tipo_context.gateway_request`.**page** | During pagination, this will be the requested page
`$tipo_context.gateway_request`.**per_page** | How many results in a single response.
`$tipo_context.gateway_request`.**tipo_filter** | Filter to apply on the data being fetched.
`$tipo_context.gateway_request`.**params** | HTTP request parameters. To get the value of a specific parameter passed by the client, simply add parameter name after params. E.g. `$tipo_context.gateway_request.params.spcial_code` will give you the value for the parameter by the name `special_code`
`$tipo_context.current_tipo`.**{}** | When Actions are performed in the detail/update view, the current tipo will contain the data upon which the action is currently being executed.
`$tipo_context.user_attributes` | Name value pairs of attributes associated during user registraion. Role identification TipoName and ID. For example, if the invited user is Supplier. 
`$tipo_context.user_attributes.user_tipo` | E.g. Patient, PartnerContact
`$tipo_context.user_attributes.user_tipo_id` | E.g. Patient ID (1234), PartnerContact ID (2222)
`$tipo_context.user_attributes.org_tipo` | E.g. PartnerOrg, SupplierOrg
`$tipo_context.user_attributes.org_tipo_id` | E.g. PartnerOrg ID (PARTNER_11), SupplierOrg ID (SUPP_2222)

You should use the above format in the `tipo_filter` when specifying dependencies for dynamic replacement i.e. `$tipo_context.application` will be replaced on the server with the actual application name.

```
*** Example tipo_context - Input to TipoFunction***
{
  "user" : "test_user",
  "account" : "acme",
    "gateway_request": {
      "tipo_name" : "Customer",
      "tipo_filter" "(status:Active) OR (first_name:John) AND _exists_:(dept)"
    }
}
```

## Single Actions
You can create an Action that works on a single record, or one that can process several records. Let's start by looking at Single Actions. We'll add an Action to the `Application` Tipo we had created in the Advanced Concepts guide.
 
As mentioned in the Client Side Actions guide, you can create Actions on list views, detail views and edit views. You can also specify Actions that run on deletion of an object. The Single Action we are going to create here will be on the List View of the Application Tipo records.

Next, we created the following Lambda function on Amazon AWS. The function processes the current record and sets its `application_status` to `Approved`.

```
// TestFunc
exports.handler = (event, context, callback) => {
   // TODO implement
   console.log('Pre Function --- Input');
   console.log(event);
   /** Received event with tipo_context, tipo_request and server_dependencies if any*/
   /** Inside the tipo_context, the current_tipo contains the data for the application to be approved. */
   var resp = {};
if (event.tipo_context.current_tipo.course === "9123843365" 
&& event.tipo_context.current_tipo.application_status != "Approved") {
    var tipo_request = [{}];
    tipo_request[0].tipo_name = "Application";
    tipo_request[0].db_action = "PUT";
    tipo_request[0].data = {};
    tipo_request[0].data.tipo_id = event.tipo_context.current_tipo.tipo_id;
    tipo_request[0].data.application_status = "Approved";
    resp.tipo_request = tipo_request;
}

   console.log('Post Function --- Output');
   console.log(resp);

   callback(null, resp);
};
```

On TipoTapp, we registered the function as shown below:

![Register Cloud Function](/images/actions/image_006.png)

To create an Action on the Tipo's list view, open the `List` tab on the Tipo, open the Advanced Editor of the `List` section and add a `Custom Action.

![Register Cloud Function](/images/actions/image_007.png)

Before we can see the results of our changes, let's add some dependencies to the Action.

### Client Side Dependencies
You can add some data to the Action request before sending it to the AWS server. This is done by including a form for the user to fill. When the user clicks on the Action's button, the form will be shown to them. The data that they add to the form will be sent in the request to the Cloud Function.

To do this, we'll add another Tipo that will hold the form data. Create a Tipo named `StudentApplicationImport` and add the following fields and Meta Data to it.

 - **Name**: StudentApplicationImport
 - **Description**: StudentApplicationImport Tipo
 - **Tipo Type**: Entity Tipo
 
`Form Text` field:

 - **Field**: Form Text
 - **Type**: Rich Text
 
`Student Application CSV` field:

 - **Field**: Student Application CSV
 - **Type**: File

Save the Tipo and go back to editing the `Application` Tipo. Edit the Action you had added to this Tipo and add a `Client Dependence` to it. Select the `StudentApplicationImport` as the `Related Tipo Form`.

![Client Side Dependency](/images/actions/added_image_001.png)

Save your results. If you go back to home, and check the Application list view, you will be able to see your added Action. Try adding some Applications and then select one and approve it. You will see that its status changes.

![Single Action](/images/actions/added_image_002.png)

### Server Side Dependencies
This is a list of Tipos that are referenced by the Cloud Function. The list is sent in the request to the server.  In the TipoDefinition an array of Tipos and `tipo_filters` are defined.
  
In the TipoDefinition configuration for server dependecies is captured under various actions. 
  
Server dependency is an array each containing the following:

  1. `tipo_name`
  2. `tipo_filter`
  
```
*** Example of server dependencies object ***

[
  {
    "tipo_name": "Countries",
    "data" : [{
      "tipo_id": "123",
      "country_name": "Australia",
       "country_code": "AU"
    },
    {
      "tipo_id": "124",
      "country_name": "New Zealand",
      "country_code": "NZ"
    }]
  },
  {
    "tipo_name": "PurchaseOrder",
      "data" : [{
        "tipo_id": "111",
        "order_amount": 1000.00,
        "ordered_product" : 123 
      }]
  }
]
```

## Bulk Actions
As mentioned, you can create an Action that processes several records. To demonstrate this, we created the following function that iterates through several records, setting their `application_status` to `Approved`.

```
// BulkApproval
exports.handler = (event, context, callback) => {
   // TODO implement
   console.log('Pre Function --- Input');
   console.log(event);
   /** Received event with tipo_context, tipo_request and server_dependencies if any*/
   /** Inside the tipo_context, the current_tipo contains the data for the application to be approved. */
   var resp = {};
   
    var result_tipo_requests = [];
   for(var i = 0; i < event.tipo_request.length; i++) {
        var tipo_request = event.tipo_request[i];       
       console.log('request is ');
       console.log(tipo_request);
       console.log('data is');
       console.log(tipo_request.data);
       var new_req = {};
       new_req.tipo_name = "Application";
       new_req.db_action = "PUT";
       new_req.data = {};
       new_req.data.tipo_id = tipo_request.data.tipo_id;
       new_req.data.application_status = "Approved";
       result_tipo_requests.push(new_req);
   }
   
   resp.tipo_request = result_tipo_requests;

    var response_headers = {};
    response_headers.user_message = "Successfully Approved All Applications";
    response_headers.return_url = "/tipo/Application";
    
    resp.response_headers = response_headers;
    
   console.log('Pre Function --- Output');
   console.log(resp);

   callback(null, resp);
};
```

On TipoTapp, we registered the function as shown.

![Register Cloud Function](/images/actions/image_008.png)

On creating and saving your Action, you will be able to select several records and have them all processed by clicking on the Action button.

![Bulk Action](/images/actions/added_image_003.png)