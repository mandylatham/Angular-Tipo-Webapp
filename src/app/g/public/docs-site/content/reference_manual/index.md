# Reference Manual

## Application Definitions

### Tipo Meta

#### Name
Name of the Tipo Object e.g. Customer 

#### Icon
Choose Icon

#### Description
Brief description of the Object 

#### Tipo Type
Available Types |  Description 
------------ | ------------
Abstract | An abstract tipo is similar to an abstract class in Object Orientation. You cannot create an instance of an abstract tipo but can link menu items to an abstract tipo.
Singleton.Account | There is only instance of this tipo for every account. e.g. Subscription is an account level singleton
Singleton.Application | There is only one instance of this tipo for every application. 
Singleton.User | There is only one instance of this tipo for every user with an account. e.g. My Profile is a user level singleton


{{< note title="Note" >}}
Lets consider School Management SaaS application. In this case, you would like each school to have their own logo
{{< /note >}}


#### Choose Menu

Choose Menu where this object need to be shown

Available Menus |  Description 
------------ | ------------
Home | The Tipo will be available in the home page of your application
Settings | The Tipo will be available under settings
Profile | The Tipo will be available under settings 
Any Abstract Tipo | Will be added to the menu of an abstract tipo

#### Tipo UI Type
Prespective - A tipo of type

{{< note title="Note" >}}
Lets consider a Patient Management Application. The doctor would like to see the patient details, past medical history, history of admissions, day visits etc. 
{{< /note >}}


#### Prespective Field
In the above case, patient id will the prespective key

#### Default Page Size
Default number of records to be returned from the server each time the user click or scrolls through the Tipo



