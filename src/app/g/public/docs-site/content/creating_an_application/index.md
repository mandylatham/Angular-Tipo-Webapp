---
title: Creating an Application
weight: 2
---

## Introduction
When you log in to your TipoTapp account, the first view that you'll see is the Home Page of the Dashboard with the `My Apps` tab selected. This is where you'll be able to access your created apps.

![My Apps](/images/creating_an_application_01.png)

TipoTapp allows you to create several applications. Each application that you create will own its data and it will also be isolated from other applications.

For each application that you create, you will have to model the objects that will hold its data. Objects are referred to as `Tipo`s and each Tipo represents a core module in your application. For example if you were to create a hospital management application, you might have the following Tipos: `Doctor`, `Patient`, `Department`, e.t.c. Each Tipo has fields that define its data. For example the `Doctor` Tipo might have the fields `ID`, `First Name`, `Last Name`, `Social Security Number`, `Department`, e.t.c.

Other than creating the objects that will hold your application's data, you can define access controls that will determine the access permission that different users will have when using the app. By combining different data and logic operations in your Tipos, you can create very simple to extremely complicated applications.

This first page of the guide will get you up and running with TipoTapp quickly. Think of it as a Crash Course. It will help you go from zero to functional app as fast as possible. To do this, we will only present the relevant information you need to create an application. The rest of the documentation dives deeper into the various features of TipoTapp.

## Creating the Application
The best way to learn is through examples, so we are going to demonstrate how to set up an application on TipoTapp by creating a simple demo application. We'll show how to create a simplified version of an application that could be used in a higher-learning institution to manage student data.

The application will be named **Student Management System** and will have the following Tipos with the listed fields:

**Student**

 - Student ID
 - First Name
 - Middle Name
 - Last Name
 - Date of Birth
 - Gender
 - Address
 - Phone Number
 - Email
 - Admission Date
 - Admission Number
 - Course
 
**Address**

 - Address ID
 - Street Address
 - Address Line 1
 - Address Line 2
 - State
 - Suburb/County
 - State/Province/Region
 - Country
 - Zip/Postal Code
 
**Course**

 - Course ID
 - Name
 - Units
 
**Unit**

 - Unit ID
 - Name

{{< note title="Tip" >}}
It is usually a good idea to start out planning your application on paper. Draft out what it will do, what data it will contain, who will have access to the data and the actions they will be able to take. Once you have this, creating the application will be much faster.
{{< /note >}}

To create an application, click on the + button on the bottom right side of the screen.

On the page that appears, fill in the details for the application.

![My Apps](/images/creating_an_application_02.png)

The App Name is the only required field here. You must ensure that the name entered is unique to your account. A user account cannot have apps sharing the same name. You can also add a Description of the app and select an Icon from a list of available Material Design icons.

The `App Link` will be automatically generated. As the name implies, this will be the URL used to access the app. For now, you can ignore the `App Version` field, this will be covered later on when we discuss Version Control.

If you publish an app as a Sample App, it will be publicly available and accessible via the `Sample Apps` tab of the Home Page.

![Sample Apps](/images/creating_an_application_03.png)

Here you'll find other apps that you can take a look at to see what's possible to build with TipoTapp. You can copy these and play around with them to get a feel of the system.

After creating an app, it will be visible on the Dashboard. Below, you can see the app I created with a custom Description and App Icon.

![Student Management System](/images/creating_an_application_04.png)

## Modelling App Data
You just created an application and it's immediately available for use, but without any useful data, it is not that useful to you. In this section, we'll take a look at how you can model your app's data.

From the Dashboard, click on the app you just created. A new tab will be opened in your browser. This view of the Dashboard will be specific to that application and you can use it to configure the app.

On the Dashboard, you will see some data associated to a Customer. Applications that you create come pre-loaded with some sample data that you can choose to delete, edit or use as-is. If you take a look at the Menu, you will see some other Tipos that have been added to the app. You can go through each to see the records that have been added. To add a new record, you can use the + button at the bottom right of the screen.

![Customer records](/images/creating_an_application_05.png)

To edit the app's data objects, head over to the `Develop` menu by selecting the wrench icon on the top-right of the screen. The first page you'll see here will display some information about the app. Using the controls on the top-right of the screen, you can edit this data or you can delete the app altogether.

![Develop menu](/images/creating_an_application_06.png)

Open the menu to the left and select `App Definitions`. Remember, we'll thouroughly cover the interface later on, so for now, you don't need to know what the other options in the menu do.

![Develop menu](/images/creating_an_application_07.png)

The App Definitions menu displays Tipos that have been created to hold the app's data. Here you can view, edit, create and delete Tipos. At the moment, we can see the following Tipos that were automatically generated with the new app: `PurchaseOrder`, `Vendor`, `Customer` and `Address`. Feel free to click on any Tipo to see its various fields.

We'll delete the `PurchaseOrder`, `Vendor` and `Customer` Tipos here. We'll keep the `Address` one, since the `Student` Tipo that we'll create will store the studen't address, thus there is no need to recreate this object.

To delete a Tipo, select it from the menu and click on the middle Delete button at the top-right of the screen.

![Delete button](/images/creating_an_application_08.png)

With the App Definitions menu selected, use the + button at the bottom-right of the screen to add a Tipo to the app. We'll start with the `Unit` Tipo that will hold data related to a course unit. We'll keep things simple though. Our `Unit` object will only store the unit's ID and name.

At the top of the page that comes up, you can enter the Tipo's Meta Data. Below I've filled out its Name, Description, Icon and Menu. With the Home menu selected, the Tipo will appear on the Home menu and we'll be able to access its records from there.

![Field meta data](/images/creating_an_application_09.png)

To add fields to the Tipo, select the + control to the right of the `Fields` section and fill out the field's data. With this view of the Field control, you can add basic information about the field as shown.

![Field view](/images/creating_an_application_10.png)

Remeber we had mentioned that a Unit will have two fields: `Unit ID` and `Name`. There is no need to add an ID field as this will be automatically generated for any Tipo you add to the application.

The `Sequence` will hold a number that will determine the order the field will have among other fields belonging to the Tipo. If you leave this blank, it will be autogenerated by incrementing the Sequence value of a previous field. The ID field that will be autogenerated will have Sequence of `-1` and the Sequence of other fields that you add to the Tipo (while leaving the `Sequence` field blank) will start at `1` and increment from there.

The `Field` holds the name of the field and the `Type` specifies the type of data the field will hold. You can select the value from a list of Basic tipo Types or from Tipo Objects. We select `Simple String` for this field.

![Field type](/images/creating_an_application_11.png)

When you turn on `Short Display`, the field will be visible whenever an instance of the Tipo is displayed in a listview. This can be seen when viewing the records of a certain Tipo or in a form where the particular Tipo is embedded in another Tipo (we'll see an example of this later on).

Basically any data object you can add on TipoTapp, has two Edit menus - a Basic one and an Advanced one. To access the Advanced menu, use the following icon that is located to the right of the Basic menu.

![Advanced edit](/images/creating_an_application_12.png)

If you open the Advanced Edit menu of the Name field we just added, you will see a lot more options you can configure for the field. We'll cover what they all do in another part of the documentation, but for now head over to the `Data Settings` section and switch on the `Meaningful Key?` control.

To explain what this does, let's first take a look at the `Course` Tipo that we'll create. As mentioned previously, a Course will have the following fields: `Course ID`, `Name` and `Units`. The Units that a course will have will be of type `Unit`. When creating a Course record, we'll be able to select its units from a dropdown menu. Without specifying any of the Tipo's fields as the `Meaningful Key`, the ID will be taken as the Meaningful Key and it is what will be displayed in the list of Units on the dropdown menu. This won't be very useful as it will be hard to identify the various Units. So, by switching on `Meaningful Key` for the `Name` field of the Unit Tipo, a Unit's name will be visible whenever the Unit is part of another Tipo.

You can specify several fields of a Tipo to be the Meaningful Key, but if you do this, only the first field that has been marked as Meaningful Key will be considered.

Finally, scroll down the Advanced Edit menu and turn on the `Mandatory?` switch in the `Display Settings` section. With this switched on, the field will be a Required field and an instance of the Tipo won't be able to be saved without entering some value for the field.

Click on the `DONE` button at the bottom-right of the Advanced Editor to go back to the Basic Editor and from there, you can save the Tipo with the check mark Button at the top-right.

If you head back to `App Definitions` from the menu, you will see the newly created Tipo listed there. From here, you can edit or delete the Tipo.

Next, we'll add the `Course` Tipo. Use the `+` button from `App Definitions` to bring up the Tipo creation form.

Fill out the following fields in the `Meta Data` section:

 - **Name**: Course
 - **Description**: Course Tipo
 - **Icon**: school
 - **Choose Menu**: Home

Add the `Name` field to the Tipo with the following values:

 - **Field**: Name
 - **Type**: Simple String
 - **Short Display**: Yes
 - **Mandatory** (from Advanced Editor): Yes
 - **Meaningful Key** (from Advanced Editor): Yes
 
Then add the `Units` field to the Tipo with the following values:

 - **Field**: Units
 - **Type**: Unit (selected from the `Tipo Objects` section)
 - **Multi-valued/Array** (from `Data Settings` section of the Advanced Editor): Yes
 
Setting a field as `Multi-valued/Array` will allow the field to hold several values. This is appropriate since each course will be able to have several Units associated to it.

Lastly, add the `Student` Tipo with the following values.

`Meta Data`:

 - **Name**: Student
 - **Description**: Student Tipo
 - **Icon**: perm identity
 - **Choose Menu**: Home
 
`First Name` field:

 - **Field**: First Name
 - **Type**: Simple String
 - **Short Display**: Yes
 - **Mandatory** (from Advanced Editor): Yes
 
`Middle Name` field:

 - **Field**: Middle Name
 - **Type**: Simple String

`Last Name` field:

 - **Field**: Last Name
 - **Type**: Simple String
 - **Short Display**: Yes
 - **Mandatory** (from Advanced Editor): Yes
 
`Date of Birth` field:

 - **Field**: Date of Birth
 - **Type**: Date/Time
 - **Mandatory** (from Advanced Editor): Yes
 
`Gender` field:

 - **Field**: Gender
 - **Type**: Simple String
 - **Short Display**: Yes
 - **Mandatory** (from Advanced Editor): Yes
 - **Allowed values** (from `Data Settings` section of the Advanced Editor): Male, Female, Other
 
Adding `Allowed values` to a field will add a drop down menu to that field in the Tipo creation form, populated with the values you insert here.
 
{{< warning title="Note" >}}
Do not separate the options with commas, instead press the `Return` key after every option entered. This will ensure that every value entered before `Return` is a separate option. If you use commas, then the value ` Male, Female, Other` will be taken as a single option. If you use Return, then your options should look as shown below.
{{< /note >}}

![Allowed values](/images/creating_an_application_13.png)
 
`Address` field:

 - **Field**: Address
 - **Type**: Address (selected from the `Tipo Objects` section)
 - **Mandatory** (from Advanced Editor): Yes
 - **Relationship Type** (from `Relationship Settings` section of the Advanced Editor): embed
 
Each Student will have an address. Instead of adding address-related fields to the Student tipo, we instead separate them out into another Tipo: `Address`. TipoTapp is modelled on [Object Oriented Programming principles](https://en.wikipedia.org/wiki/Object-oriented_programming) and one concept that we encourage is the [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) when building your Tipos. Your Tipos should follow the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle) in that, a Tipo should have responsibility over a single part of the functionality provided by the software.

Having address-related data in a separate Tipo also encourages object reuse. If we decided to add a `Teacher` or `Staff` Tipo to the application, we could reuse the `Address` Tipo here instead of creating address fields in these Tipos.

For the Student Tipo, we specify `embed` as the relationship type of the Address field. There are two relationship types: `embed` and `reference`.

With `embed`, the Tipo will be embedded into the current Tipo. This is used in cases where a copy of another object is required instead of a reference. You'll see later in the Student creation form, fields from the Address Tipo will be part of the form as though they are part of the Student Tipo.

With `reference` relationship, only the Tipo's key will be stored in the current Tipo.

{{< note title="Note" >}}
There are two caveats about the embedded Tipos that we want you to note at this point:

 - Whether or not the fields belonging to the embedded Tipo appear in listviews depends on the `Short Display` value for those fileds and not on the `Short Display` value of the particular field in the current Tipo. To clarify this further, let's look at the Student Tipo. We haven't switched on the `Short Display` value for its Address field. However, the `Address` has some fields whose `Short Display` has been switched on. Therefore, these fields will be visible even though the `Address` field of the Student Tipo has been set to not be visible. If you don't want an embedded field to be displayed, you should turn off `Short Display` for all its fields as well.
 - When you select `embed` for a Tipo's field and also specify that field as `Mandatory`, the field will pass validation as long as there is any value entered in the embedded Tipo's fields. For example, in this example, we set the Student's Address field as `Mandatory`, but if you take a look at the `Address` Tipo, its fields haven't been set as `Mandatory`. Therefore, as long as the user enters a value for at least one Address field, then the form will pass. Obviously, this isn't the behaviour you'd like so you should also edit the Address Tipo and set some of its important field as `Mandatory` (e.g. `Address Line 1`, `Country`, `Zip/Postal Code`). We won't do this in this guide, we'll leave it up to you.
{{< /note >}}

`Phone Number` field:

 - **Field**: Phone Number
 - **Type**: Simple String
 - **Short Display**: Yes
 - **Mandatory** (from Advanced Editor): Yes
 
There is a section in the Advanced Editor labelled `Validations`. Here, you can add validations to the fields. The validations are [regular expressions](https://en.wikipedia.org/wiki/Regular_expression) that the field's value will be validated against. You can select from a list of available regular expressions from the `Choose Validations` dropdown menu (like we do below for the `Email` field), or you can add your own to the `Custom Validations` field.

`Email` field:

 - **Field**: Email
 - **Type**: Simple String
 - **Short Display**: Yes
 - **Mandatory** (from Advanced Editor): Yes
 - **Choose Validations** (from `Validations` section of the Advanced Editor): Email
 
`Admission Date` field:

 - **Field**: Admission Date
 - **Type**: Date/Time
 - **Short Display**: Yes
 - **Mandatory** (from Advanced Editor): Yes
 
`Admission Number` field:

 - **Field**: Admission Number
 - **Type**: Simple String
 - **Short Display**: Yes
 - **Mandatory** (from Advanced Editor): Yes
 
`Course` field:

 - **Field**: Course
 - **Type**: Course
 - **Short Display**: Yes
 - **Mandatory** (from Advanced Editor): Yes
 
Before we start adding data to the app, let's do some housekeeping on the Home Menu. Open `Menu Definitions` from the menu and select `Home` from the list shown. Click on the Edit control at the top-right of the screen and then scroll down to the `Tipo Menu` section. Here, the Tipos that we set `Home` for their `Choose Menu` field are listed. From here, you can set their order of appearance or remove them from the menu.

You'll notice that the `PurchaseOrder`, `Vendor` and `Customer` Tipos that you had deleted previously are still listed here. Remove them by using the Delete button to the right of the particular Tipo. You can also order the Tipos by changing their Sequence. We set the sequences of our `Student`, `Course` and `Unit` Tipos as 1, 2 and 3 respectively.

Go back to the app's homepage and you should see the Tipos that you created added to the Home menu.

![Home menu](/images/creating_an_application_14.png)

You can now add data to the app.

## Configuring Forms
### Form Fields
You can edit the number of columns that a field in a form takes up. By default, a form takes 3 columns. You can see this in the fields shown below.

![3 column field](/images/creating_an_application_16.png)

To do this, go to `App Definitions` and select the Tipo you want modified

Now the First Name field is taking up 6 columns.

![6 column field](/images/creating_an_application_17.png)

### Dividers
You can add dividers to a form to improve how it looks by separating related fields from the rest. To add a divider, go to `App Definitions` and edit the Tipo whose form you want a divider added. Add a field of Type `Divider` and set its Sequence to be a number that is between the two Tipos where you want the divider positioned. The number can be a floating point. An example is shown below.

![6 column field](/images/creating_an_application_18.png)

### Field Groups

## Configuring How Data is Displayed
### Flow Layout
### Grid Layout

## Customizing the App