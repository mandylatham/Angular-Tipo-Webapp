---
title: Reference Manual
weight: 6
---

# Reference Manual

## Tipo Types

Available Types |  Description 
------------ | ------------
Abstract | An abstract tipo is similar to an abstract class in Object Orientation. You cannot create an instance of an abstract tipo but can link menu items to an abstract tipo. Astract Tipos will be available under Menu Definitions.
Singleton.Account | There is only instance of this tipo for every account. e.g. Subscription is an account level singleton
Singleton.Application | There is only one instance of this tipo for every application. 
Singleton.User | There is only one instance of this tipo for every user with an account. e.g. My Profile is a user level singleton

Example - 

Let us consider a School Management App created by a Developer. Below is the requirement - 

School Management: The schools subscribe to the application and would like to maintain School Details, Address etc..

Staff & Parents & Students: The teachers & Students will be invited into the application and will fill in their personal details.

Department: The Social Sciences department would like to see all the teachers belonging to their department, relevant scorecards etc..

Admin: The Admin department likes a seperate space where all admin activities will be grouped e.g. set up school holidays etc..

Lets us now examine how each of these scenarios, can be addressed using the available Tipo Types

School: The school object will be marked as a 'account.singleton' meaning there will be only one instance of this tipo for every account

Staff & Parents & Students (all users of the system): The staff, parents & student object will be marked as 'Singleton.User'


Singelton.Application: At the app level, the developer would like to set backup time etc..


Abstract: Because the admin team in the school, a abstract tipo will be created and add objects related to the admin functions will be added under the abstract tipo



## Relationship

### Relationship Types

Available Types |  Description 
------------ | ------------
Reference | Only the Tipo's key will be stored against this Tipo
Embed | The tipo will be embedded into the current Tipo. This is used in cases where a copy of another object is required instead of a reference. 


### Relationship filter

Using filters you can limit the list of items available in the dropdown

Defining relationships : LHS = RHS

LHS: Will be target Tipo
RHS: Will be the current Tipo

Pop-Up select, allow create when choosing related

## Tipo UI Type
Prespective - A tipo of type

{{< note title="Note" >}}
Lets consider a Patient Management Application. The doctor would like to see the patient details, past medical history, history of admissions, day visits etc. 
{{< /note >}}


### Prespective Field
In the above case, patient id will the prespective key


## Meaningful Key



## Transient 


## Filters

Filters are available under List Customization

Defining Filters - 



## Actions

Actions can be configured under List & Details Customization


## Cloud Functions



## Color Customization

Choosing colors outside of the palatte

## Advanced Datatypes

### Rich Text
- Embed videos
- Embed images


### Image Type

- Embed simple images as base64 encoded string and store in database. In case of an array, images are shown in slide-show.

### Actions - as Field Type

TipoActions can be added on a screen anywhere by simply adding them as field types and positioning them in a given location. This is to allow users to perform contextual actions with data within a field group as an example.


## Client Side Actions

For applications where serverside cloud functions is not required for simple businesss logic, the client side actions can be used. And these actions will allow user to provide javascript and specifiy if the current object should be saved after the javascript code is executed.

### JavaScript code behind actions along with Lambda function support

### Conditional visibility for actions
e.g. $tipo.`field_name` > 100 or any such javascript expressions resulting in boolean can be supplied. 
$tipo gives the object data that is in context in the detail view.
This feature is not to be used in list view.



## GIT Repository Integration

Repository URL, Username, Password













