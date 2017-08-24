---
title: Creating an Application - Intermediate
weight: 3
---

## Introduction

In the first section of this guide, we looked at some basic concepts of building an app on TipoTapp. In this section, we are going to expand the Student Management System app that we built and introduce some more complex concepts.

This section will cover: (TODO: Will edit these when done with the guide)

 - Introduce perspectives, abstract tipos
 - Tipo Standing Data etc
 - Relationships
 - Option to choose custom colour palette
 - Pop up select
 - Applying Styles
 - Validations
 - Input patterns
 
## Perspectives

Before we introduce the concept of Perspectives, let's first outline why you might need an object of that type.

Let's say that a school is using your Student Management System. The school has saved some Unit, Course and Student data but then comes into difficulty navigating its data because there is no way to structure the data in the same way the school is structured. Schools are usually divided into Departments. There are courses, students and staff members that belong to a particular department. So it would be nice to have a view that showed only the information belonging to a department. This is where Perspectives come in.

You can create a Tipo that is of type Perspective, that can be used to house other Tipos. When you access this Perspective, you will only see data belonging to it. When By default, TipoTapp comes with some Perspectives created. We have the `Home`, `Settings`, `Profile` and `Develop` Perpectives created. Any Tipo that you create as part of the Menu for a Perpective will belong to that Perspective and when you navigate to that Perpective, you will be able to see the records of that Tipo. We've seen this already in the Tipos we've created so far. For the Unit, Course and Student Tipos, we selected `Home` as the value for the `Choose Menu` field. With this setting, the Tipos automatically became part of that Perpective.

## Abstract Menu Type

## Customizing the App's Color Palette
 
In the first part of this guide, we saw how you could change your app's color by selecting from an available palette. 

![My Apps](/images/creating_an_application_intermediate/image_001.png)

You are not restricted to the palette that TipoTapp makes available to you, you can set your own. To do this, in Edit Mode, open the Advanced Editor of the `Appearance Settings` section. Then scroll down to `Material Theme` and open its Advanced Editor.

![My Apps](/images/creating_an_application_intermediate/image_002.png)

Here, you can add material design color codes for the app's `primary`, `accent`, `warn` and `background` pallets. You can use this website [http://mcg.mbitson.com](http://mcg.mbitson.com) to generate the color codes.

![My Apps](/images/creating_an_application_intermediate/image_003.png)

When you navigate to the website, you will find a palette that has already been added to the workspace. You can edit this as well as add another palette. Below, are two palettes we've added to the workspace.

![My Apps](/images/creating_an_application_intermediate/image_004.png)

To add a palette to the workspace, use the following icon found on the navigation bar.

![My Apps](/images/creating_an_application_intermediate/image_005.png)

To edit a palette, use the following controls found at the top of the palette.

![My Apps](/images/creating_an_application_intermediate/image_006.png)

You can set the palette Name, view its code with the clipboard icon, delete it with the icon next to that and edit its color with the rightmost icon. When you are done selecting your palette's color, view its code and copy all of it with the `Copy ` button at the top-right corner of the dialog box.

![My Apps](/images/creating_an_application_intermediate/image_007.png)

Back in TipoTapp, paste the color code. Do this for any of the other fields (`primary`, `accent`, `warn` and `background`) that you want to change. Save your app and the changes will be reflected.