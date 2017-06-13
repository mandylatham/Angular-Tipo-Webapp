### Tipo Definition - Explained ###
Tipo Definition is very similar to Swagger definitions with a lot of extensions. However the framework doesn't complete take Swagger as the bassis in order to grow without any direct dependecies on other frameworks. Nevertheless it is quite easy to generate a swagger defintion using tipo metadata. Swagger goals are for documentation, Tipo goals are rapid web application development. Hence introducing a direct dependency will result in unforeseen complexities at a later stage. 

### Tipo_Definition Key Fields ###

  | Field Name  | Description | 
  | ----------  | ----------- | 
  | **`tipo_name*`** | Tipo name ** E.g. PurchaseOrder, Person **|
  | **`tipo_type`**  | Defines a high level behaviour for the tipo. Currently supported types are `Cached` -  Server will cache the tipo in AWS elastic cache **Default: ** *`Empty`* | 
  | **`tipo_list_view`** | AngularJS directive that controls how a list of tipos are displayed. By default this will show small table for each element with fields where ShortDisplay is true. None of the child tipos are shown in this view. E.g Purchase Order details without line-items is shown. |
  | **`tipo_detail_view`**  | Controls how a complete Tipo is displayed. All the child tiops is displayed. Respect group field to group some of the fields into a separate section.  |
  | **`tipo_edit_view`**  | High level form layout to capture data. |
  | **`main_menu`** | Should this tipo be included in the main menu? Boolean Yes/No. ** Default: ** `No`
  | ** `*` ** | Denotes mandatory |
  
  
#### Tipo Field Attributes ####
  | Name  | Description | 
  | ----------  | ----------- | 
  | **`field_name*`** | Tipo field name ** E.g. FirstName, LastName **|
  | **`field_type*`** | Can be a primitive or another tipo. Primitives: `integer, float, double, string, boolean, date` (ISO3339), `date_time` (ISO3339). In case of another tipo type, it can be simply reference to a field in another tipo or a whole tipo itself. This is explained further below. |
  |**`tipo_array`**  | Takes a boolean value. Represents if this field repeats. In case of relationship to another tipo, this will indicate if the relationship is one-2-many or one-2-one.|
  |**`meaningful_key`** | This is a boolean to indicate if the field is a meaningful label that system user will be able to understand. For example, in a PurchaseOrder detail view sowing customer ID is not helpful to the user, instead it makes sense to show customer name. In such case, when defining Customer tipo, set this field to `true` for the CustomerName field. |
  |**`relationship_type`**  | This field can take either aggregation or composition to indicate the relationship type with the other related Tipo.  |
  |**`relationship_filter`**  | This will help limit the list of tipos fetched in this relationship. This field can take same as tipo_filter parameter in the /tipo/{tipo_name} GET operation. Refer to the /tipo/{tipo_name} GET section below. UI framework will replace any mustache tags before sending the filter to the server. Mustache tags will support the keyword `this` to refer to another field at the same level. E.g. `this.region` can be used in country relationship_filter assuming both `regision and country` are present in the same level in Address tipo.  |
  |**`depends_on`**  | There is no point showing all the fields all the time. Some fields make sense only if the other fields have certain values. In order to facilitate those requirements, code in this field is evaluated by the UI. Show only if the result of evaluation is true. UI will also support mustache tag replacement. e.g. when creating tipo defintion the depends_on field can be `{{this.field_type}}.substring(0,5) == 'Tipo.'`. Even in this field `this` keyword is supported. **`This has not been implemented. We need more use-cases to pursue implementation.`**|


##### FieldType Explained #####

  `Simple fields are explained in the model at the bottom. field_type is a complex field and is an important field. Hence this section is dedicated to explaining field_type`

  
  Apart from taking the primitive types, a relationship to another tipo is represented here. When it comes to relationship to another Tipo or a group of fields, field type will start with 'Tipo'. In such case read `relationship_type` to understand if it is aggregation or composition. 
    
  * If it is `composition`. There are two examples for this, 
    * A) **PurchaseOrder** and **POLineItem** When defining PurchaseOrder metadata, a field POLineItem with field type `FieldGroup.POLineItem.` indidates that POLineItem will be embedded in PurchaseOrder tipo and if the `TipoArray` is true, the line item will repeat.
    * B) **PurchaseOrder** and **Address**. In this case **Address** is a separate Tipo but will be embedded in PurchaseOrder. In this case, field type will be `Tipo.Address`
    
  * If the relationship is `aggregation`, the FieldType will point to another tipo similar to the address above. For example, **PurchaseOrder** relationship with **Customer**. This relationship is captured by storing Customer object with its primary key and meaningful keys in the PurchaseOrder. UI will render the meaningful_key value instead of the ID in the detail views. FieldType in this case is `Tipo.Customer`
  
  Both relationship types are demonstrated in the example below. `[Field names in the sample are slightly outdated, please refer to the model definition at the bottom of this specification. (TODO)]`
  
        {
          \"tipo_def\":
          {
            \"tipo_meta\": {
              \"tipo_name\": \"PurchaseOrder\",
              \"tipo_type\": \"cached\",
              \"main_menu\": true
            },
            \"tipo_fields\": [
              {
                \"field_name\": \"purchaseorder_id\",
                \"field_type\": \"integer\",
                \"field_description\": \"Unique order number\",
                \"primary_key\": true,
                \"display_name\": \"Order Number\",
                \"display_type\": \"tpKeyField\",
                \"short_display\": true,
                \"sample_value\": \"1001\",
                \"input_type\": \"Tipo.RemoteFunction.AutogeneratedID\",
                \"mandatory\": true
              },
              {
                \"field_name\": \"total\",
                \"field_type\": \"double\",
                \"field_description\": \"Total order amount\",
                \"display_name\": \"Order Total\",
                \"display_type\": \"tpCurrency\",
                \"short_display\": true,
                \"input_type\": \"Tipo.RemoteFunction.AutogeneratedID\",
                \"input_validator\": \"some_javaScript?\",
                \"mandatory\": true
              },
              {
                \"field_name\": \"required_by_date\",
                \"field_type\": \"date_time\",
                \"field_description\": \"When this order must be full-filled by \",
                \"display_name\": \"Required by date\",
                \"display_type\": \"tpDate\",
                \"short_display\": true,
                \"input_type\": \"tpinDate\",
                \"input_validator\": \"some_javaScript?\"
              },
              {
                \"field_name\": \"customer\",
                \"field_type\": \"Tipo.Customer\",
                \"relationship_type\": \"aggregation\",
                \"field_description\": \"Customer who placed the purchase order\",
                \"secondary_index\": true,
                \"field_validator\": \"some_javaScript?\",
                \"display_name\": \"Customer Name\",
                \"short_display\": true,
                \"sample_value\": \"KFC\",
                \"input_type\": \"tpinIDName - A means to select Name and store both ID and Name\",
                \"input_validator\": \"some_javaScript?\",
                \"mandatory\": true
              },
              {
                \"field_name\": \"line_item\",
                \"field_description\": \"An array of line items included in the purchase order. In this case the field type will refer to LineItem object, not a single field - unlike in the customer case.\",
                \"tipo_array\": true,
                \"display_name\": \"Line Item\",
                \"field_type\": \"FieldGroup.POLineItem\"
              },
              {
                \"field_name\": \"ship_to_address\",
                \"field_description\": \"ShipTo address\",
                \"tipo_array\": false,
                \"display_name\": \"ShipTo Address\",
                \"display_type\": \"tpAddress\",
                \"field_type\": \"Tipo.Address\",
                \"relationship_type\": \"composition\"
              },
              {
                \"field_name\": \"bill_to_address\",
                \"field_description\": \"BillTo address\",
                \"tipo_array\": false,
                \"display_name\": \"BillTo Address\",
                \"display_type\": \"tpAddress\",
                \"field_type\": \"Tipo.Address\",
                \"relationship_type\": \"composition\"
              }
            ],
              \"tipo_field_groups\": [
                {
                  \"tipo_group_name\": \"POLineItem\",
                  \"tipo_fields\": [
                    {
                      \"field_name\": \"item_number\",
                      \"field_description\": \"Item Number\",
                      \"display_name\": \"Item Number\",
                      \"display_type\": \"tpNumber\",
                      \"input_type\": \"tpNumber\"
                    },
                    {
                      \"field_name\": \"item_quantity\",
                      \"field_description\": \"item quantity\",
                      \"display_name\": \"Item Quantity\",
                      \"display_type\": \"tpNumber\",
                      \"input_type\": \"tpNumber\"
                    },
                    {
                      \"field_name\": \"unit_price\",
                      \"field_type\": \"double\",
                      \"field_description\": \"each unity price\",
                      \"display_name\": \"Unit Price\",
                      \"display_type\": \"tpDollar\"
                    }
                  ]
                }
              ],
              \"tipo_actions\": [
                {
                  \"tipo_action\": \"GET\"
                },
                {
                  \"tipo_action\": \"PUT\"
                },
                {
                  \"tipo_action\": \"DELETE\"
                },
                {
                  \"tipo_action\": \"Fulfill\"
                }
              ]
          }
        }
          
  