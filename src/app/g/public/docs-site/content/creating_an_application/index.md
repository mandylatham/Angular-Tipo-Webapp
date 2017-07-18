---
title: Creating an Application
weight: 2
---

## Introduction
When you log in to your TipoTapp account, the first view that you'll see is the Home Page of the Dashboard with the `My Apps` tab selected. This is where you'll be able to access your created apps.

![My Apps](../assets/images/creating_an_application_01.png)

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

![My Apps](../../assets/images/creating_an_application_02.png)

The App Name is the only required field here. You must ensure that the name entered is unique to your account. A user account cannot have apps sharing the same name. You can also add a Description of the app and select an Icon from a list of available Material Design icons.

The `App Link` will be automatically generated. As the name implies, this will be the URL used to access the app. For now, you can ignore the `App Version` field, this will be covered later on when we discuss Version Control.

If you publish an app as a Sample App, it will be publicly available and accessible via the `Sample Apps` tab of the Home Page.

![Sample Apps](../../../assets/images/creating_an_application_03.png)

Here you'll find other apps that you can take a look at to see what's possible to build with TipoTapp. You can copy these and play around with them to get a feel of the system.

After creating an app, it will be visible on the Dashboard. Below, you can see the app I created with a custom Description and App Icon.

![Student Management System](../../../../assets/images/creating_an_application_04.png)

## Modelling App Data
You just created an application and it's immediately available for use, but without any useful data, it is not that useful to you. In this section, we'll take a look at how you can model your app's data.

From the Dashboard, click on the app you just created. A new tab will be opened in your browser. This view of the Dashboard will be specific to that application and you can use it to configure the app.

On the Dashboard, you will see some data associated to a Customer. Applications that you create come pre-loaded with some sample data that you can choose to delete, edit or use as-is. If you take a loo at the Menu, you will see some other Tipos that have been added to the app. You can go through each to see the records tha have been added. To add a new record, you can use the + button at the bottom right of the screen.

![Customer records](/images/creating_an_application_05.png)

To edit the app's data objects, head over to the `Develop` menu by selecting the wrench icon on the top-right of the screen. The first page you'll see here will display some information about the app. Using the controls on the top-right of the screen, you can edit this data or you can delete the app altogether.

![Develop menu](/images/creating_an_application_06.png)

Open the menu to the left and select `App Definitions`. Remember, we'll thouroughly cover the interface later on, so for now, you don't need to know what the other options in the menu do.

![Develop menu](/images/creating_an_application_07.png)

The App Definition menu displays Tipos that have been created to hold the app's data. Here you can view, edit, create and delete Tipos. At the moment, we can see the following Tipos that were automatically generated with the new app: `PurchaseOrder`, `Vendor`, `Customer` and `Address`. Feel free to click on any Tipo and see its various fields.

We'll delete the `PurchaseOrder`, `Vendor` and `Customer` Tipos here. We'll keep the `Address` one, since the `Student` Tipo that we'll create will store the studen't address, therefore there is no need to recreate this object.

To delete a Tipo, select it from the menu and click on the middle Delete button at the top-right of the screen.

![Delete button](/images/creating_an_application_08.png)

With the App Definitions menu selected, use the + button at the bottom-right of the screen to add a Tipo to the app. We'll start with the `Unit` Tipo that will hold data related to a course unit. We'll keep things simple though. Our `Unit` object will only store the unit's ID and name.

At the top of the page that comes up, you can enter the Tipo's Meta Data. Below I've filled out its Name, Description, Icon and Menu. With the Home menu selected, the Tipo will appear on the Home menu and we'll be able to access its records from there.

![Field meta data](/images/creating_an_application_09.png)

To add fields to the Tipo, select the + control to the right of the `Fields` section and fill out the field's data. With this view of the Field control, you can add basic information about the field as shown.

![Field view](/images/creating_an_application_10.png)

The `Sequence` will hold an integer that will determine the order the field will have among other fields belonging to the Tipo. If you leave this blank, it will be autogenerated by incrementing the Sequence value of a previous field.

The `Field` field holds the name of the field and the `Type` specifies the type of data the field will hold. You can select the value from a list of Basic tipo Types or from Tipo Objects. We select `Simple String` for this field.

![Field type](/images/creating_an_application_11.png)

Basically any data object you can add on TipoTapp, has two Edit menus - a Basic one and an Advanced one. To access the Advanced menu, use the following icon that is located to the right of the Basic menu.

![Advanced edit](/images/creating_an_application_12.png)


## Saving Data

## Customizing the App