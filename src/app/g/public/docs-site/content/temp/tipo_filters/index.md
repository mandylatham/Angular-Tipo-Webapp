---
title: Tipo Filters
weight: 27
---

### Tipo Filter ###
  * **tipo_filter**: this is the where clause. Supported by the GET operations.
      
    **Example 1**: When retriving a customer to restrict age to greater than 20.
      Customer.age >= 20
      * `age`: field_name of the tipo that is being queried. Field name can be nested fields such as **tipo_meta.tipo_name** or **tipo_field[0].field_type**
      * `20`: values must be enclosed in `double quotes` for strings. Even for integers enclosing in double quotes still works, but not required. 
      * `>=`: operator. Supported operators `=, >=, <=, >, <, between <val1> and <val2>, begins_with(Tipo.field_name, <val>)`
      
    **Example 2**: Limit TipoDefinitions created in last 10 days with the name starting with name 
      TipoDefinition.created_dt >= <<javascript:{{_.now() - 10*24*60*60*1000}}>> and tipo_name begins_with({{TipoDefinition.tipo_name}})
    
      * Server-side will evaluate in-line javascript functions.
      * The only javascript frameworks currently supported are: lodash.
      * Server will replace **{{ }}** tags if there is data in context. However, in a GET situation, there is no data. Hence, it is expected to be done by the client.
      * Client-side will replace the tags in braces **{{ }}**. This is useful for the relationship_filter.