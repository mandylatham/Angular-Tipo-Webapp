---
title: Expressions and Filters Syntax
weight: 7
---

## Introduction
TipoTapp uses Expressions to determine the value of some fields or to determine what data will be shown to the user. There are different types of expressions which we'll soon take a look at.

Usually, an expression that you write will need to refer to a certain field of Tipo. To do these, there are various rules that determine how you would reference that field. We'll also look at these rules here.

## Field Expression
TipoTapp supports the following expressions. Each expression is used in a specific scenario. Some expressions only work on data on the client side while others work on data from the server. Others work on both. This is illustrated in the table below.

Field Expression Attribute | Description | Client Side | Server Side
------------ | --------------- | ----------- | ----------
`expression` | This is used whenever a dynamic value needs to be calculated or created according to some criteria. It uses JavaScript to determine the final value of a field. Lodash can also be used. We've seen an example of this when creating a Meaningful Key for the Student Tipo. We combined the values of the `first_name` and `last_name` fields. This expression is used in the create/edit forms. | Yes | No
`visibility_expression` | This is applied where `ng-if` (we use Angular) is generated for visibility for an action or a field. | Yes | No
`Relationship Filter Query` | This is used in the queries sent to server to fetch data that will be displayed in drop-down menus. | Yes | Yes
`query_params` | This includes additional information that is passed to the server | Yes | No
`Filter Query` | In list views, these filters are used to fetch only relevant records. Similar to relationship filters, these are elasticsearch queries. | No | Yes
`value_style & label.style` | These are used when applying CSS field data access. | Yes | No

## Expression Patterns
Below are the rules/syntax that you should use when referencing a field in your expressions. All of them are applied on the client side except for `tipo_context` which is an object that is sent to the server which holds information about the application and logged in user (more on this in [Server Side Actions](/server_side_actions/#tipo-context)

The placement of a field determines how you reference other fields. For example, if two field are at the same level, i.e. they are siblings, then an expression written on `field_1` that needs to refer to `field_2` will simply do so with `$tipo.field_2`. If the two fields aren't siblings, then you will need to start at the root level `$tipo_root` and go down the hierarchy to where the referenced field is situated.

Expression Pattern | Description | Client/Server
------------ | --------------- | ---------------
`$tipo_root`.<field_name> | This is used to access data from the beginning of the object. | Client
`$tipo_root`.top_level_field.array[$index].child_field | Access data in other fields in the same array as  current. In PO line items, referring to line units in total can be accessed using `$tipo_root`.po_line_items[$index].units | Client
`$tipo`.<child_field> | Same example above can be expressed as `$tipo`.units | Client
`$tipo_handle`.user_meta | This will access logged-in user details as documented in [TipoHandle](/client_side_actions/#tipo-handle) | Client
`$tipo_handle`.application_meta | This will access logged-in application details as documented in [TipoHandle](/client_side_actions/#tipo-handle) | Client
`$tipo_context`| This is used on the server to access application context | Server

As an example, take the following hierarchy of fields. Suppose I want to include an expression on the `item_1_child_2` field that references the `item_1_child_1`. Since these two fields are at the same level, I would use `$tipo.item_1_child_1`. If I wanted to reference `item_1_child_2` from `item_2_child_2`, I would use `$tipo_root.top_level_field_3.array[$item_1].item_1_child_2`. This would also work `$tipo_root.top_level_field_3.array[0].item_1_child_2`. Here, I've used the array index instead of the array element name.

```
tipo_root
│   top_level_field_1
│   top_level_field_2
│
└───top_level_field_3
│   │
│   └───item_1
│       │   item_1_child_1
│       │   item_1_child_2
│   │
│   └───item_2
│       │   item_2_child_1
│       │   item_2_child_2
│
└───top_level_field_4
    │   item_1
    │   item_2
```