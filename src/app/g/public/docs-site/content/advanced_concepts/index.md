---
title: Advanced Concepts
weight: 3
---

## Introduction
In the Quickstart section of this guide, we looked at some basic concepts of building an app on TipoTapp. In this section, we are going to expand the Student Management System app that we built and introduce some more complex concepts like:

 - Perspectives
 - Tipo types
 - We'll take a look at more fetures you can use to customize your app like setting CSS Styles for fields and customizing select menus
 - We'll take a look at filters
 - We'll talk more on relationships
 - We'll cover more advanced concepts on user roles
 - We'll take a look at how you can set a usage Plan for your application
 
## Perspectives
Before we introduce the concept of Perspectives, let's first outline why you might need an object of that type.

Let's say that a school is using your Student Management System. The school has saved some Unit, Course and Student data but then comes into difficulty navigating its data because there is no way to structure the data in the same way the school is structured. Schools are usually divided into Departments. There are courses, students and staff members that belong to a particular department. So it would be nice to have a view that showed only the information belonging to a department. This is where Perspectives come in.

You can create a Tipo that is of type Perspective, that can be used to house other Tipos. When you access this Perspective, you will only see data belonging to it. By default, TipoTapp comes with some Perspectives created. We have the `Home`, `Settings`, `Profile` and `Develop` Perpectives created. Any Tipo that you create as part of the Menu for a Perpective will belong to that Perspective and when you navigate to that Perpective, you will be able to see the records of that Perspective's Tipos. We've seen this already in the Tipos we've created so far. For the Unit, Course and Student Tipos, we selected `Home` as the value for the `Choose Menu` field. With this setting, the Tipos automatically became part of the Home Perpective.

To demonstrate this, let's create a `Department` Tipo that will hold records belonging to a particular department.

Go to `App Definitions` and create this Tipo. Fill out the following fields in the `Meta Data` section:

 - **Name**: Department
 - **Description**: Department Tipo
 - **Icon**: grain
 - **Choose Menu**: Home
 - **Tipo UI Type**: perspective
 - **Perspective Field**: department

To specify that a Tipo is a Perspective, we set its `Tipo UI Type` to `perspective`. We've also added a `Perspective Field` to it. With this, any Tipo record that is created as part of this Perspective will have a field added to it named after the set `Perspective Field`.

The `tipo_id` of a Perspective Tipo is stored against every Tipo instance created within the Perspective

Add the `Name` field to the Tipo with the following values:

 - **Field**: Name
 - **Type**: Simple String
 - **Short Display**: Yes
 - **Mandatory** (from Advanced Editor): Yes
 - **Meaningful Key** (from Advanced Editor): Yes
 
Then add the `Building Location` field to the Tipo with the following values:

 - **Field**: Building Location
 - **Type**: Simple String
 
 Then add the `Consultation Hours` field to the Tipo with the following values:

 - **Field**: Consultation Hours
 - **Type**: Simple String

Save the Tipo. If you take a look at the Home menu, you will see `Department` added to the list.

Shortly, we'll create a `Staff` Tipo that will be part of this Perspective, but before we do that, let's create a `Master Data` Tipo that will be used in the `Staff` Tipo. `Master Data` will be used to store information pertaining to an staff member's employment.

Create a `Master Data` Tipo and set the following for its `Meta Data`.

 - **Name**: Master Data
 - **Description**: Master Data Tipo
 - **Icon**: data usage
 
Add the following fields to the Tipo.

`Category` field:

 - **Field**: Category
 - **Type**: Simple String
 - **Short Display**: Yes
 - **Allowed values** (from Data Settings section of the Advanced Editor): Employment Type, Leave Type
 
`Name` field:

 - **Field**: Name
 - **Type**: Simple String
 - **Short Display**: Yes
 
`Value` field:

 - **Field**: Value
 - **Type**: Simple String
 - **Short Display**: Yes
 
`Description` field:
 - **Field**: Description
 - **Type**: Simple String
 - **Short Display**: Yes

Next, create the `Staff` Tipo and fill out the following fields in its `Meta Data` section

 - **Name**: Staff
 - **Description**: Staff Tipo
 - **Icon**: person
 
`Personal Details` field:

 - **Field**: Personal Details
 - **Type**: Divider
 
`First Name` field:

 - **Field**: First Name
 - **Type**: Simple String
 - **Short Display**: Yes
 - **Meaningful Key** (from Advanced Editor): Yes
 - **Mandatory** (from Advanced Editor): Yes

`Last Name` field:

 - **Field**: Last Name
 - **Type**: Simple String
 - **Short Display**: Yes
 - **Mandatory** (from Advanced Editor): Yes

`Gender` field:

 - **Field**: Gender
 - **Type**: Simple String
 - **Mandatory** (from Advanced Editor): Yes
 - **Allowed values** (from `Data Settings` section of the Advanced Editor): Male, Female, Other
 
`Date of Birth` field:

 - **Field**: Date of Birth
 - **Type**: Date/Time
 - **Mandatory** (from Advanced Editor): Yes
 
{{< note title="Tip" >}}
If you find that you have repeated fields in several Tipos like the above `First Name`, `Last Name`, `Gender`, `Date of Birth`, e.t.c. consider moving them into a separate Tipo and then using this Tipo whenever those fields are required in other Tipos. For instance, in our case, you can create a `Person` Tipo to hold the data that is common for the `Student` and `Staff` Tipos.
{{< /note >}}

`Address` field:

 - **Field**: Address
 - **Type**: Address (selected from the `Tipo Objects` section)
 - **Mandatory** (from Advanced Editor): Yes
 - **Relationship Type** (from `Relationship Settings` section of the Advanced Editor): embed
 
`Home Phone` field:

 - **Field**: Home Phone
 - **Type**: Simple String
 
 `Mobile Phone` field:

 - **Field**: Mobile Phone
 - **Type**: Simple String
 - **Mandatory** (from Advanced Editor): Yes
 
`Email` field:

 - **Field**: Email
 - **Type**: Simple String
 - **Mandatory** (from Advanced Editor): Yes
 - **Choose Validations** (from `Validations` section of the Advanced Editor): Email
 
`Bank Details` field:
 - **Field**: Bank Details
 - **Type**: Divider
 
`Bank Name` field:

 - **Field**: Bank Name
 - **Type**: Simple String
 
`Branch` field:

 - **Field**: Branch
 - **Type**: Simple String
 
`Account Name` field:

 - **Field**: Account Name
 - **Type**: Simple String
 
`BSB` field:

 - **Field**: BSB
 - **Type**: Simple String
 
`Account Number` field:

 - **Field**: Account Number
 - **Type**: Simple String
 
`Details for Contractors` field:
 - **Field**: Details for Contractors
 - **Type**: Divider
 
`Company Name` field:

 - **Field**: Company Name
 - **Type**: Simple String
 
`Company Address` field:

 - **Field**: Company Address
 - **Type**: Address
 
`Company Email` field:

 - **Field**: Company Email
 - **Type**: Simple String
 - **Choose Validations** (from `Validations` section of the Advanced Editor): Email
 
`ABN` field:

 - **Field**: ABN
 - **Type**: Simple String
 
`ACN` field:

 - **Field**: ACN
 - **Type**: Simple String
 
`Employment Details` field:
 - **Field**: Employment Details
 - **Type**: Divider
 
`Type` field:

 - **Field**: Type
 - **Type**: Master Data
 - **Relationship Filter** (from `Relationship Settings` section of the Advanced Editor): category:(Employment Type)
 - **Select Label Field**: name_
 - **Select Key Field**: value_
 
`Start Date` field:

 - **Field**: Start Date
 - **Type**: Date/Time
 
`End Date` field:

 - **Field**: End Date
 - **Type**: Date/Time
 
`Department` field:

 - **Field**: Department
 - **Type**: Department

Save this Tipo and go back to the `Department` Tipo and add a field to it labelled `Head of the Department` with the following details:

 - **Field**: Head of the Department
 - **Type**: Staff
 - **Short Display**: Yes

Then scroll down to the `Tipo Menu` section and add an item to the `Department`'s menu. As mentioned, when you add a Tipo to a Perspective's menu, that Tipo becomes part of that Perspective and the Perspective's Id is stored against the Tipo.

![Tipo menu](/images/advanced_concepts/image_001.png)

Your Home menu should now look as shown:

![Home menu with Department](/images/advanced_concepts/image_002.png)

You can now create Department records. At the moment, we have no way of accessing the `Staff` and `Master Data` creation forms. We'll add this in the next section.

## Tipo Types
### Abstract Tipos and Abstract Menu Types

TipoTapp allows you to create Abstract Tipos. An Abstract Tipo is similar to an Abstract class in programming in that, you cannot create an instance of the Tipo. So the big question now is, why would you want a Tipo that you can't create an instance of?
 
So far, we've added different Tipos to the app that we can create different records of. The app can store several Student, Department and Course records. What if you needed a Tipo that you could only have one record of that type. For the Student Management System, we could for instance require a Tipo that held everything related to administration. Like `Department`, this Tipo would be a Perspective since it will be housing other Tipos, but unlike the `Department` Tipo which we can create many department records for, we would not want to be able to create several `Admin` Tipos. The assumption is that there is one Administration block/center in a school that administers over everything in the school. Therefore the Tipo for this would have to be an Abstract Perspective.

To create this, head over to `Menu Definitions` and create a Tipo named `Admin`. Note, we are creating the Tipo in `Menu Definitions` because we want it to also be a Menu.

 - **Name**: Admin
 - **Description**: Admin Tipo
 - **Icon**: business center
 - **Tipo type**: abstract
 - **Choose Menu**: Home
 - **Tipo UI Type**: perspective
 
Scroll down to `Tipo Menu` and add the following two menu items:

![Admin menu items](/images/advanced_concepts/image_003.png)

These will be accessible from the Admin menu and they will also be part of the Admin Perspective. Save the app and head back to the Home page. Admin will have been added to the Home menu. If not, you can add it yourself in `Menu Definitions` by editing `Home` and adding Admin to the `Tipo Menu`.

![Home menu with Admin](/images/advanced_concepts/image_004.png)

If you select `Admin`, you will be able to see its menu. From here, you can access the Staff and Master Data records.

![Home menu with Admin](/images/advanced_concepts/image_005.png)

### Singleton.Account
TODO

### Singleton.Application
TODO

### Singleton.User
TODO

## More on Relationships
We've briefly covered relationships in other sections of the guide so far. We've seen that there are two types of relationships: `reference` and `embed`. With the former, only a related Tipo's key is stored against the current Tipo while the latter embedds a Tipo into another. We've seen how to mark a Tipo's field as the Meaningful Key so that when a record of that Tipo appears in another Tipo, that field will be displayed.

By default, when two Tipos are related by reference, TipoTapp stores the referenced Tipo's `tipo_id` field against the current/containing Tipo and displays its Meaningful Key (if no field is set, this defaults to `tipo_id`). We've seen this already. However, you can change this default behaviour. You can configure your app so that another field is stored against the containing Tipo and another one is displayed.

To do this, you need to make the following changes to the `Relationship Settings` of a field. You should change the value of `Select Label Field` to the field you want stored and `Select Key Field` to the field you want displayed.

![Relationship Settings](/images/advanced_concepts/image_014.png)

Remember to use the real field names and not their labels. The label if the value you put for the `Field` field when creating the field e.g. `First Name` while the field name is the field's representation in the database. If you don't set this, TipoTapp stores the lowercased equivalent of your label delimited by underscores, e.g. `first_name`. You can see the Field Name of any field by looking at its Detailed View.

## Filters
TipoTapp allows you to set Filters on your data that determine the data displayed to the user. There are two types of filters: Relationship Filters and Quick Filters. We have already seen the former in use in the Quickstart guide, but we didn't delve deep into its details. We'll do this next.

### Relationship Filters
Relationship Filters can be used to limit the list of items available in dropdown menus that show records of a Tipo that are related to the current object. They can also be used to filter the data shown in tabs when you want to display data related to a particular record. We saw [an example](/quickstart/#displaying-related-data) of this in the Quickstart guide.

To set a Relationship Filter on a Tipo's field, open its Advanced Editor and set the `Relationship Filter Query` in `Relationship Settings`.

![Relationship Settings](/images/advanced_concepts/image_017.png)

To set a value for the `Relationship Filter Query`, you use a Query DSL that we'll look at shortly.

### Quick Filters
Quick Filters are used to filter the data displayed in list views. When used, only the relevant records will be fetched from the server. Query Filters also use the Query DSL specified in the next section.

To demonstrate Query Filters, we'll add a new Tipo to the Student Management System. This Tipo will be used to hold information regarding Applications that the institution receives.

Add a Tipo named `Application` to the app and add the following fields to it.

TODO: Add Fields later

In Edit mode, scroll down to `List View Configuration` and open the Advanced Editor.

Add the following Quick Filters:

![Quick Filters](/images/advanced_concepts/image_018.png)

![Quick Filters](/images/advanced_concepts/image_019.png)

With the above settings, the user will be able to filter the records shown according to the status of the application.

When you set a Quick Filter, the following control is added to the list view of that Tipo.

![Quick Filters](/images/advanced_concepts/image_020.png)

On clicking on it, you will be able to select from a list of filters that you added.

![Quick Filters](/images/advanced_concepts/image_021.png)

### Query DSL Syntax
TipoTapp provides a Query DSL that is used when setting filters. The following are its specifications:

#### Field Names
the default_field is searched for the search terms, but it is possible to specify other fields in the query syntax:

 - Where the `status` field contains `active`

```
status:active
```

```
title:(quick OR brown)
title:(quick brown)
```

 - Where the field `title` has any non-null value:

```
_exists_:title
```

#### Wildcards
Wildcard searches can be run on individual terms, using `?` to replace a single character, and `*` to replace zero or more characters:

```
qu?ck bro*
```

#### Regular expressions
Regular expression patterns can be embedded in the query string by wrapping them in forward-slashes (`/`):

```
name:/joh?n(ath[oa]n)/
```

#### Fuzziness
We can search for terms that are similar to, but not exactly like our search terms, using the “fuzzy” operator:

```
quikc~ brwn~ foks~
```
This uses the [Damerau-Levenshtein distance](http://en.wikipedia.org/wiki/Damerau-Levenshtein_distance) to find all terms with a maximum of two changes, where a change is the insertion, deletion or substitution of a single character, or transposition of two adjacent characters.

The default edit distance is `2`, but an edit distance of `1` should be sufficient to catch 80% of all human misspellings. It can be specified as:

```
quikc~1
```

#### Ranges
Ranges can be specified for date, numeric or string fields. Inclusive ranges are specified with square brackets `[min TO max]` and exclusive ranges with curly brackets `{min TO max}`.

 - All days in 2012:

```
date:[2012-01-01 TO 2012-12-31]
```

 - Numbers 1..5

```
count:[1 TO 5]
```

 - Tags between alpha and omega, excluding alpha and omega:

```
tag:{alpha TO omega}
```

 - Numbers from 10 upwards

```
count:[10 TO *]
```

 - Dates before 2012

```
date:{* TO 2012-01-01}
```

 - Curly and square brackets can be combined. E.g. numbers from 1 up to but not including 5:

```
count:[1 TO 5}
```

 - Ranges with one side unbounded can use the following syntax:

```
age:>10
age:>=10
age:<10
age:<=10
```
 - To combine an upper and lower bound with the simplified syntax, you would need to join two clauses with an AND operator:

```
age:(>=10 AND <20)
age:(+>=10 +<20)
```

#### Grouping
Multiple terms or clauses can be grouped together with parentheses, to form sub-queries:

```
(quick OR brown) AND fox
```

Groups can be used to target a particular field, or to boost the result of a sub-query:

```
status:(active OR pending) title:(full text search)^2
```

## User Roles
TODO

### Defining User Roles
TODO

### EnterprisePlanRole
TODO

### ProfessionalPlanRole
TODO

### Admin
TODO

## Plans
TODO

### Basic
TODO

### Professional
TODO

### Enterprise
TODO

## Menu Access Control
TODO

## Further App Customization
### Customizing Select Menus
So far, you've seen several fields with select menus in your forms. Below is an example of this on the Department creation form (look at `Head of Department`).

![Select menu](/images/advanced_concepts/image_006.png)

![Select menu options](/images/advanced_concepts/image_007.png)

The menu's options show the first names of that department's Staff members. If you recall we set the first name as the Meaningful Key. Now this data isn't enough to identify a person, you might need more information on an individual in order to make your selection. We've already looked at one solution to this problem - combining multiple fields into one field that will then be marked as the Meaningful Key. This works, but might not always be the best solution. Suppose you want to select a department head and the person selected has to pass some criteria, for instance they have to have a certain role, they have to have been employed there for X number of years, e.t.c. A meaningful key field created with all this information might be too long, plus it will also be a bit contrived; the field won't make much sense if it appeared anywhere else where the meaningful key is used.

A better solution to this, would be to change this field from using a Select Menu to using a Pop-up Select Menu. To do this, head over to `App Definitions` and edit the `Department` Tipo.

Open the Advanced Editor of the `Head of Department` field and then scroll down to the `Relationship Settings` section. Turn on the `Popup Select` switch and save your changes.

Now if you go back to the Department form and try to select an option from the Head of Department menu, a separate menu will pop out containing the options with more of their fields displayed. By default, the options will appear in a Flow layout.

![Pop out select menu options](/images/advanced_concepts/image_008.png)

To change this to a Grid Layout, edit the Staff Tipo and set its Desktop and Tablet Grid to true (switch on the switch)

![Grid Layout](/images/advanced_concepts/image_009.png)

Then set its Grid Max Columns to 6 to increase the number of columns seen.

![Grid Max Columns](/images/advanced_concepts/image_010.png)

Now if you look at the pop-up select menu, it will display the options in a Grid Layout with 6 columns.

![Grid Layout](/images/advanced_concepts/image_011.png)

You can modify this menu to allow the creation of an option (in this case a Staff member). To do this, edit the Department Tipo and open the Advanced Editor of the `Head of Department` field. In the `Relationship Settings` section, switch on the `Allow Create When Choosing Related` switch and save the Tipo.

Now, your pop-up select menu should look as shown below. You will be able to create an option on the fly right before selecting it.

![Pop out select menu](/images/advanced_concepts/image_012.png)

If you click on the `New` button, a dialog window will pop up containing a Staff creation form. A record that you create with this will be automatically added to your list of options for the select menu as well as to your Staff database of records.

![Create option pop up dialog](/images/advanced_concepts/image_013.png)

### Applying CSS Styles to Fields

TipoTapp allows you to set CSS styles for your field's labels and values. This can be useful if for instance, you want to color-code a particular field for easy identification. From the Advanced Editor of a field, down at the `Display Settings` section, you can either choose from an available selection of CSS styles or you can add your own custom styles. The custom fields support valid CSS e.g. `{'border-bottom':'1px solid white'}`.

![Relationship Settings](/images/advanced_concepts/image_015.png)

By default, any style you set will be applied to all rows of your records, but you can also select to have different colors according to a certain condition. For instance, suppose the School Management System had a field named `Status` in its `Student` Tipo. This field was to be used to indicate wether the student was still in the school or not and it had four possible values:

 - **Admitted**: The student has been admitted to the school after sending in their application, but they are still not enrolled.
 - **Enrolled**: The student has started their program.
 - **Graduated**: The student completed their program and graduated.
 - **Dropped**: The student had been enrolled, but dropped out before completing their program.
 
Using a different color code for the different status would be helpful when scrolling a list of all student records. You would find it easier to identify the various stages a student was in.

Below is an example of a CSS style you can use to set different styles for different status.

```
($tipo.status_ === 'Admitted' && {'background-color': '#852487','border-radius': '5px' ,'padding': '5px', 'color': 'white'}) || ($tipo.status_ === 'Graduated' && {'background-color': '#e5d010','border-radius': '5px','padding': '5px', 'color': 'white' }) || ($tipo.status_ === 'Enrolled' && {'background-color': '#accc2e','border-radius': '5px' ,'padding': '5px', 'color': 'white'}) || ($tipo.status_ === 'Dropped' && {'background-color': '#911d3e','border-radius': '5px' ,'padding': '5px', 'color': 'white'})
```

Below you can see how the field of a student who is Enrolled would look like.

![Relationship Settings](/images/advanced_concepts/image_016.png)