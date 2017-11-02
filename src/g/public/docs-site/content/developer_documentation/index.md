---
title: Developer Documentation
weight: 4
---
  
There are various ways developers can use the TipoTapp platform. The platform automatically renders user interface as soon as the Tipo Definitions are created. However, you aren't stuck with this default user interface. TipoTapp offers many features that you can use to tailor the UI to be in line with your business needs.

You can customize both the client and server sides of the application by defining client side JavaScript functions or server side Cloud functions respectively.

If the client/server customization is not sufficient and if your requirements demand a completely custom user interface using brand new sets of technologies, the TipoTapp platform can be used as a Back-end as a Service platform while still leveraging all the security restrictions and the framework for modeling business applications.

## Using TipoTapp as BaaS (Back-end as a Service)
In order to use TipoTapp as BaaS, the developer first needs to create all the necessary APIs that will be used by their front-end code. Creation the back-end is no different to creating an application on TipoTapp. You create all the necessary Tipo Definitions as well as the roles to control who has access to what in the system.

Once the definitions and roles are in place, the following sections describe how to access the API.

## 1. Authenticating User
Every API call is required to pass an authentication token to make sure the data returned in the API is restricted based on the user role. You invoke the `/auth` API and submit a username and password to receive an `IdToken` which can be used to set HTTP header `Authorization` to all the subsequent API calls. The `IdToken` supplied will expire after 24 hours and it should be refreshed by sending a different input to the `/auth` API as shown below.

`AccessToken`, `IdToken` and `RefreshToken` are returned in response when authentication is successful.  Use `Authentication` header with `IdToken` value in HTTP request in order to access TipoTapp resource. Use `RefreshToken` to obtain a new `IdToken` when it has expired.

### Use case 1: Authentication when using custom domain
For the given URL `https://yourdomain.com` you submit the request to `https://yourdomain.com/auth`

```
POST https://yourdomain.com/auth
{
    "AuthFlow": "ADMIN_NO_SRP_AUTH",
    "AuthParameters": {
        "USERNAME": $USER_EMAIL,
        "PASSWORD": $USER_PASSWORD
    }
}
```

You should receive the response:

```
{
    "ChallengeParameters": {},
    "AuthenticationResult": {
        "AccessToken": $ACCESS_TOKEN_VALUE,
        "ExpiresIn": 3600,
        "TokenType": "Bearer",
        "RefreshToken": $REFRESH_TOKEN_VALUE,
        "IdToken": $ID_TOKEN_VALUE
    }
}
```

Take out `IdToken` and supply it in a subsequent HTTP request as `Authentication` header. Go to `Dashboard` page `https://yourdomain.com/#/dashboard` in the subsequent request

```
`Authentication`: $ID_TOKEN_VALUE
```

When `IdToken` expires and you start receiving `401 Unauthorized` in HTTP response use `RefreshToken` to get a new `IdToken`. **Please note that `RefreshToken` is valid for 24 hours. After 24 hours you should authenticate again**.

```
POST https://yourdomain.com/auth
{
    "AuthFlow": "REFRESH_TOKEN_AUTH",
    "AuthParameters": {
        "REFRESH_TOKEN": $TOKEN_OBTAIN_ON_AUTHENTICATION_STEP
    }
}
```

You should receive the response:

```
{
    "ChallengeParameters": {},
    "AuthenticationResult": {
        "AccessToken": $ACCESS_TOKEN_VALUE,
        "ExpiresIn": 3600,
        "TokenType": "Bearer",
        "IdToken": $ID_TOKEN_VALUE
    }
}
```
    
### Use case 2: Authentication when using standard TipoTapp URL
For the given URL `https://app.tipotapp.com/app/d/your_account_name/your_app/` submit the request:

```
POST https://app.tipotapp.com/auth/d/your_account_name/your_app/auth
{
    "AuthFlow": "ADMIN_NO_SRP_AUTH",
    "AuthParameters": {
        "USERNAME": $USER_EMAIL,
        "PASSWORD": $USER_PASSWORD
    }
}
```

For getting a `RefreshToken` submit the request:

```
POST https://app.tipotapp.com/auth/d/your_account_name/your_app/
{
    "AuthFlow": "REFRESH_TOKEN_AUTH",
    "AuthParameters": {
        "REFRESH_TOKEN": $TOKEN_OBTAIN_ON_AUTHENTICATION_STEP
    }
}
```

You should receive the response with the same format as in `Use case 1`

If authentication is successful go to `https://app.tipotapp.com/app/d/tipotapp/librarymanagement/#/dashboard` and supply `IdToken` as `Authentication` header.

## 2. Invoking API
The back-end API correlates to the fragment part of the URI. When the application is accessed in the browser, please check the address bar to identify the associated URI to a given screen.

The following table summarizes the mapping of URI to the API.

### Tipo Level
Item | Detail 
------------ | --------------- 
**API End Point** | `HOST_NAME/api/{tipo_name}`
**Application URI Fragment** | `HOST_NAME#/tipo/{tipo_name}` 
**Supported HTTP Methods** | `GET`
**Description** | Tipo name is the object being accessed, e.g. PurchaseOrder, Customer etc.

![List View API](/images/developer/TipoAPIListRR.png)

### Tipo Instance Level
Item | Detail
------------ | --------------- 
**API End Point** | `HOST_NAME/api/{tipo_name}/{tipo_id}` 
**Application URI Fragment** | `HOST_NAME#/tipo/{tipo_name}/{tipo_id}`
**Supported HTTP Methods** | `GET, PUT, POST, DELETE`
**Description** | Tipo id identifies the individual instances of the particular Tipo.

![List View API](/images/developer/TipoAPIRR.png)