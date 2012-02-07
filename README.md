Introduction
============

__HeftyBox__ is a project currently under development to facilitate the need for front end designers to provide an easy-to-navigate solution for choosing from many items. Multiple Select boxes and Checkboxes alone can be cumbersome, take up lots of space, and can be confusing for a user.

The idea behind __HeftyBox__ is to provide a dynamically generated list of items based off a pre-existing Multiple Select box. The list will then be equipped with a textbox used to dynamically filter through the list, allowing the user to quickly navigate through items.

Primary Concepts
================

  - The HeftyBox should be dynamic and not affect any attributes or user input that coould be collected by the original Select box
  - The HeftyBox should accept many options to match styling and uniqueness of the application it is being used for
  - The HeftyBox should be able to be modified and customized with calls to the object after it is initiated
  - The HeftyBox should be easy to implement, attractive, and functional with defualt setting

Long Term Goals
===============

  - Create a well documented and neat plugin with rolling updates
  - Create a ruby gem for easy implementation into Ruby on Rails based applications
  - Add classes pertaining to jQueryUI to allow theming and styling
  - Implement AJAX functionality for items

Short Term Goals
================

  - Have code refactored and reviewed by the community and by people who know far more than I do
  - Publicize this Git repository
  - Recruit developers interested in building this project

Usage
=====

__Javascript__

```javascript
    $(document).ready() {
      $('#my_select').heftyBox();
    }
```

__HTML__

```html
    <select name="test" id="my_select" multiple="multiple" bar="baz">
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3" foo="bar">Three</option>
    </select>
```

__Output__

```html
    <div class="heftyBox" id="test_container" style="width: auto; height: 150px; min-width: 159px; ">
      <input id="test_filter" class="list_filter">
      <a href="#">Select All</a>
      <ul id="my_select" multiple="multiple" bar="baz" style="height: 128px; margin-top: 22px; ">
        <li>
          <input type="checkbox" id="option_test_0" name="test" value="1">
          <label for="option_test_0">One</label>
        </li>
        <li>
          <input type="checkbox" id="option_test_1" name="test" value="2">
          <label for="option_test_1">Two</label>
        </li>
        <li>
          <input type="checkbox" id="option_test_2" name="test" value="3" foo="bar">
          <label for="option_test_2">Three</label>
        </li>
      </ul>
    </div>
```
