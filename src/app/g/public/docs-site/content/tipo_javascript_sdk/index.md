# Client Side JavaScript

## Tipo Handle

TipoHandle is a utility service that allows client side javascript to perform common operations such as fetching data from server, saving data or even tailoring the UI as required.


###  ```getConfirmation (user_message) ```

Present user with a confirmation message and get user response.

	- user_message : User will be promoted to confirm using this user messsage.
	// return boolean; True if user selected "Yes".

	Example Usage:
	tipo_handle.getConfirmation("Please confirm if the object 234234 can be saved or deleted.");

###  ```hideElement (element_class) or showElement(element_class) ```

Each field has a class assocated to uniquely identify the field to hide or show.
Example 1: Say Purchase Order has a order_total field, there will be a class called `order_total`.
Example 2: To hide something in an array of a group field, i.e. in a Purchase Order line item cescription, a class will be associated with the line item description in the following pattern: `line_item_n_description` (`n` is the array index) 

	- element_class: element identifier to show/hide element
	//return void;
	
- Scenario 1: Hide or Show Fields
- Scenario 2: Hide or show Actions
Each action uses action_name as the class associated to uniquely identify the action, so that it can be hidden or shown. If the action is already hidden in the meta-data, it will not be available in the client for show/hide
	

### ``` getTipoDefinition(tipo_name) ```

Fetch TipoDefinition for the Tipo specified in `tipo_name`.

	- tipo_name : Tipo name to fetch TipoDefinition for.
	// return TipoDefinition

### ``` callAction(tipo_name, action_name, selected_tipo_ids, additional_tipo_name, additional_tipo) ```

Perform action specified in `action_name` on the Tipo specified in `tipo_name`.

	- tipo_name: Tipo name of the detail view to be refreshed.
	- tipo_id: Tipo Id for which detail view to refresh.
	- selected_tipo_ids: this is an array that contains the selected tipo ids.
	- additional_tipo_name: if there is additional data that action requires specify the name here.
	- additional_tipo: supply the additional data here.
	// return tipo_response; //result from the server is supplied back to the caller.


### ``` routeTo(url) ```

User will be presented with the URL specified in `url`. Please specify the path after the `#` character.

	- url : resource location after `#`. E.g. /tipo/PurchaseOrder/93829282782 or /tipo/Customer
	// return void;


### ``` saveTipo(tipo_name, tipo_id, tipo_data) ```

Save tipo on server with the data supplied in `tipo_data`.

	- tipo_name
	- tipo_id
	- tipo_data
	// return boolean; If true save tipo is successful.

### ``` deleteTipo(tipo_name,tipo_id) ```

Delete tipo with name specified in `tipo_name` and ID specified in `tipo_id`.

	- tipo_name
	- tipo_id
	// return boolean; If true delete tipo is successful.

### ``` getTipo(tipo_name, tipo_id, query_params) ```

Get tipo data for `tipo_name` with ID specified in `tipo_id`.

	- tipo_name
	- tipo_id
	- query_params
	// return tipo;

### ``` getTipos(tipo_name, query_params) ```

Get tipo data for `tipo_name` with query parameters specified in `query_params`.

	- tipo_name
	- query_params
	// return tipos;
	
### ``` presentForm(tipo_name, tipo, submit_label, show_cancel) ```

Present create form using the structure of the tipo definition specified in `tipo_name` and the `submit_label` is displayed to the user. This function does not save the data collected on the server, instead it will simply save data in `tipo_data`.
	
	- tipo_name: Tipo name for which create form will be presented to the user
	- tipo: once user submits data is saved in this object
	- submit_label: Name to the submit button
	- show_cancel: boolean to indicate if the cancel button should be displayed
	// return void;
	

### ``` presentFormWithData(tipo_name, tipo, submit_label, show_cancel) ```

Present edit form using the structure of the tipo definition specified in `tipo_name` and the `submit_label` is displayed to the user.
	
	- tipo_name: Tipo name for which edit form will be presented to the user
	- tipo: data from this will be presented to the user and also after user submits, the results are saved in this object
	- submit_label: name to the submit button
	- show_cancel: boolean to indicate if the cancel button should be displayed
	//return void;

### ``` generateTipoConfigs(file) ```

Provide a JSON file to generate TipoDefinition from JSON data sample.


## Tipo Level Events

Tipo lovel events are fired when a new instance of a tipo is created/cloned, updated, deleted, listed and clicked in a list.


### OnList: ``` `<Tipo Name>`_OnList(tipo_handle,tipo_list) ```

This is triggered before presenting the list of tipos in a list view. The can be useful to suppress certain items or add some addtional items to the list returned by the server.

    - tipo_handle: handle to the utility service
    - tipo_list: list of tipos,  
    // return void;

### OnCreate: ``` `<Tipo Name>`_OnCreate(tipo_handle,tipo_list, cloned_tipo) ```

This is triggered when user performs create new or clone in the list view. Only short display fields will be present the tipo_list and cloned_tipo.

    - tipo_handle: handle to the utility service
    - tipo_list: if the create is performed from the list view, this contains all the tipos in the list view. 
    - cloned_tipo - Present only if the create event was fired due to clone operation. 
    // return boolean; //Return true to continue creating/saving tipo

### OnClick: ``` `<Tipo Name>`_OnClick(tipo_handle,tipo_list, selected_tipo, event) ```

This is triggered only when the list item is clicked in the list view. When actions like, delete/clone are performed on a tipo in the list view, this event is not fired. Only short display fields will be present the tipo_list and selected_tipo. 

    - tipo_handle: handle to the utility service
    - tipo_list: list of tipos in the list view
    - selected_tipo - tipo data for the selected tipo.
	// return boolean; //Return true to continue creating/saving tipo
    
### OnDelete: ``` `<Tipo Name>`_OnDelete(tipo_handle,tipo) ```

This event is triggered when a tipo is selected for deletion. This can be useful to control the behaviour when a tipo is deleted. For example, if this is a prent tipo and this event can be used to delete the child tipos before continuing with the deletion.

    - tipo_handle: handle to the utility service
    - tipo: contains  data for the tipo that is selected for deletion.
    // return boolean/promise; Returns true, default delete will be executed. Returns false, deafult action will not be executed.



### OnView: ``` `<Tipo Name>`_OnView(tipo_handle,tipo) ```

This event is fired when user selects tipo for viewing. Before presenting the detailed view any customisations required can be performed using this event.
	
	- tipo_handle: handle to the utility service.
	- tipo: contains data for the tipo that is selected for viewing details of the tipo.
    // return void;

### OnSave: ``` `<Tipo Name>`_OnSave(tipo_handle, tipo, mode) ```

OnSave is fired when a new tipo is created or edited. In both cases, before sending the data to server, this event is fired. Data going to server can be modified by changing the data in tipo. Tipo Handle provides a number of functions to save an object in server. 

	- tipo_handle: handle to the utility service.
	- tipo: contains data for the tipo.
    // return boolean/promise; Only if true data will be saved in the server.


## Tipo Field Level Events


//TODO for Murali. The following still needs to be documented properly.

### OnChange:	``` `<Tipo Name>`_`<FieldName>`_OnChange(tipo_handle,tipo,this, old_value, new_value)```

This is applicable only in create or edit forms. This event is triggered when user changes the value of a field.

	- tipo_handle: handle to the utility service.
	- tipo: contains data for the tipo.
	- this: handle to the current context in a deep json structure. When in an array to refer to the neighboring field that is in the same array index, simply use this.
	- old_value: value before change
	- new_value: value after change.
	// return boolean; If true change is propogated, if false change is not propagated.
    

### OnArrayItemAdd:	``` `<Tipo Name>`_`<FieldName>`_OnArrayItemAdd(tipo_handle, tipo, this, array , item)```

	- tipo_handle: handle to the utility service.
	- tipo: contains data for the tipo.
	- this: handle to the current context in a deep json structure. When in an array to refer to the neighboring field that is in the same array index, simply use this.
	- array: handle to the array
	- item: newly added item.
	// return boolean; If true add will continue;
	
### OnArrayItemRemove: ``` `<Tipo Name>`_`<FieldName>`_OnArrayItemRemove(tipo_handle, tipo, this, array , item)```

	- tipo_handle: handle to the utility service.
	- tipo: contains data for the tipo.
	- this: handle to the current context in a deep json structure. When in an array to refer to the neighboring field that is in the same array index, simply use this.
	- array: handle to the array
	- item: removed item.
	// return boolean; If true delete will continue;

### BeforeLookup: ``` `<Tipo Name>`_`<FieldName>`_BeforeLookup(tipo_handle,tipo,this, query_params)```

	- tipo_handle: handle to the utility service.
	- tipo: contains data for the tipo.
	- this: handle to the current context in a deep json structure. When in an array to refer to the neighboring field that is in the same array index, simply use this.
	- query_params: is an array of objects with two fields `param_name` and `param_value`. Important key is `tipo_filter` that contains the filter used on the serverside for lookups. By altering this, the lookup behaviour can be altered.
	// return void;

### AftereLookup: ``` `<Tipo Name>`_`<FieldName>`_AfterLookup(tipo_handle, tipo, this, tipo_list, options)```

	- tipo_handle: handle to the utility service.
	- tipo: contains data for the tipo.
	- this: handle to the current context in a deep json structure. When in an array to refer to the neighboring field that is in the same array index, simply use this.
	- tipo_list: contains the result data of lookup.
	- options: an array of objects with two fields `key` and `label`
	// return void;

