---
title: Reference Manual
weight: 6
---

## Tipo Types

Available Types |  Description 
------------ | ------------
Abstract | An abstract Tipo is similar to an abstract class in Object Oriented Design. You cannot create an instance of an abstract tipo but can link menu items to it. Abstract Tipos are available under Menu Definitions.
Singleton.Account | There is only one instance of this Tipo for each account e.g. `Subscription` is an account level singleton.
Singleton.Application | There is only one instance of this Tipo for each application. 
Singleton.User | There is only one instance of this tipo for every user within an account. e.g. `My Profile` is a user level singleton.

For example, let us consider a School Management App created by a Developer. Below are some of its core functionalities:

 - **School Management**: Schools subscribe to the application and would like to maintain details such as `School Name`, `Address` e.t.c.

 - **Staff, Parents and Students**: Teachers and Students will be invited into the application where they will be able to view and edit their personal details.

 - **Department**: A school will have different departments and each department would prefer to have its data to be self-contained and easily accessed e.g. the Social Sciences department might want to see all the teachers belonging to the department, relevant scorecards e.t.c.

 - **Admin**: The school might have an Admin department that would prefer to have a separate space in the app where all admin activities are stored e.g. setting up school holidays e.t.c.

Let us now examine how each of these scenarios, can be addressed using the available Tipo Types.

 - **School**: The `School` object will be marked as an `account.singleton` meaning that there will be only one instance of this Tipo for every account.

 - **Staff, Parents and Students (all users of the system)**: The `Staff, Parents and Student` object will be marked as `Singleton.User`.

 - **Application**: This will be of type `Singelton.Application`. At the app level, the developer will be able to do such things as set backup time e.t.c.

 - **Admin**: For this, an `Abstract` tipo will be created and other Objects related to the Admin functions will be added under this Tipo.

## Relationship

### Relationship Types

Available Types |  Description 
------------ | ------------
Reference | Only the Tipo's key will be stored against this Tipo
Embed | The Tipo will be embedded into the current Tipo. This is used in cases where a copy of another object is required instead of a reference. 


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

When a Tipo is part of another Tipo (i.e. they share a relationship), whenever this Tipo is shown as part of the containing Tipo, by default only its Id is displayed. This might not be the best identifier for a Tipo; if you just see its Id, you wouldn't know what Tipo record you are looking at. TipoTapp enables you to set one field of a Tipo as the Meaningful Key so that whenever a record of that Tipo is displayed as part of another Tipo, this field will be displayed instead of the record's Id. For example, let's say we had a `Course` Tipo that contains a field named `Units` that held `Unit` records associated with that Course. Without setting one of the Unit's fields as the Meaningful Key, then if you looked at a Course record, its Units would appear as a list of Ids. This wouldn't be useful as you wouldn't be able to easily identify the different units. To counter this, you can set a field of the Unit Tipo as the Meaningful Key, for instance the `Name` field. With this set, if you take a look at a Course record, its Unit's names will be listed. You can mark several fields of a Tipo as the Meaningful Key, but if you do this, only the first field that has been marked as Meaningful Key will be considered.

## Field Expression Attribute
TODO: Explain

Field Expression Attribute | Description | Client Side | Server Side
------------ | --------------- | ----------- | ----------
`expression` | Dynamically value is calculated. Simple JS expression to work out default values. This is used in the purely the create/edit forms. | Yes | No
`visibility_expression` | Where ng-if is generated for visibility for an action or a field. | Yes | No
`Relationship Filter Query` | Used in the queries sent to server in the drop-downs. | Yes | Yes
`query_params` | Additional information passed to the server | Yes | No
`Filter Query` | In the list view these filters are used to fetch only relevant records. Similar to relationship filters, these are elasticsearch queries. | No | Yes
`value_style & label.style` | When applying CSS field data access. | Yes | No

## Expression Pattern
TODO: Explain

Expression Pattern | Description | Client/Server
------------ | --------------- | ---------------
`$tipo_root`.<field_name> | Access data from the beginning of the object. | Client
`$tipo_root`.top_level_field.array[$index].child_field | Access data in other fields in the same array as  current. In PO line items, referring to line units in total can be accessed using `$tipo_root`.po_line_items[$index].units | Client
`$tipo`.<child_field> | Same example above can be expressed as `$tipo`.units | Client
`$tipo_handle`.user_meta | To access logged-in user details as documented in TipoHandle | Client
`$tipo_handle`.application_meta | To access logged-in application details as documented in TipoHandle | Client
`$tipo_context`| To access application context on the server | Server

## Transient 


## Filters

Filters are available under List Customization

Defining Filters - 



## Actions

Actions can be configured under List & Details Customization


## Cloud Functions



## Color Customization

Choosing colors outside of the palatte 




## GIT Repository Integration

Repository URL, Username, Password













