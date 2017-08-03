## Authentication details

`AccessToken`, `IdToken` and `RefreshToken` are returned in responese when authentication is successful.
Use `Authentication` header with `IdToken` value in HTTP request in order to access TipoTapp resource
Use `RefreshToken` to obtain a new `IdToken` when it has expired

### Use case 1:

For the given URL https://dev.tipotapp.com/app/ submit the request to https://dev.tipotapp.com/auth (replace /app or /app/ with /auth)

    POST https://dev.tipotapp.com/auth
    {
        "AuthFlow": "ADMIN_NO_SRP_AUTH",
        "AuthParameters": {
            "USERNAME": $USER_EMAIL,
            "PASSWORD": $USER_PASSWORD
        }
    }

You should receive the response:

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

Take out `IdToken` and supply it in a subsequent HTTP request as `Authentication` header. Go to `Dashboard` page https://dev.tipotapp.com/app/#/dashboard in the subsequent request

    `Authentication`: $ID_TOKEN_VALUE

When `IdToken` expires and you start receiving `401 Unauthorized` in HTTP response use `RefreshToken` to get a new `IdToken`. 
(Please note that `RefreshToken` is valid for 24 hours. After 24 hours you should authenticate again)

    POST https://dev.tipotapp.com/auth
    {
        "AuthFlow": "REFRESH_TOKEN_AUTH",
        "AuthParameters": {
            "REFRESH_TOKEN": $TOKEN_OBTAIN_ON_AUTHENTICATION_STEP
        }
    }

You should receive the response:

    {
        "ChallengeParameters": {},
        "AuthenticationResult": {
            "AccessToken": $ACCESS_TOKEN_VALUE,
            "ExpiresIn": 3600,
            "TokenType": "Bearer",
            "IdToken": $ID_TOKEN_VALUE
        }
    }

    
### Use case 2:

For the given URL https://dev.tipotapp.com/app/d/tipotapp/librarymanagement/ submit the request 

    POST https://dev.tipotapp.com/auth/d/tipotapp/librarymanagement/
    {
        "AuthFlow": "ADMIN_NO_SRP_AUTH",
        "AuthParameters": {
            "USERNAME": $USER_EMAIL,
            "PASSWORD": $USER_PASSWORD
        }
    }

For gettting a `RefreshToken` submit the request

    POST https://dev.tipotapp.com/auth/d/tipotapp/librarymanagement/
    {
        "AuthFlow": "REFRESH_TOKEN_AUTH",
        "AuthParameters": {
            "REFRESH_TOKEN": $TOKEN_OBTAIN_ON_AUTHENTICATION_STEP
        }
    }

You should receive the response with the same format as in `Use case 1`

If authentication is successful go to https://dev.tipotapp.com/app/d/tipotapp/librarymanagement/#/dashboard and supply `IdToken` as `Authentication` header.

