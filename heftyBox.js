$.fn.heftyBox = function(args) {
    if ($(this).length) {
    //Set up defaults
    var a    =  $.extend({
        type   :  "checkbox",
        width  :  "auto",
        height :  ($(this).innerHeight() > 150) ? $(this).innerHeight() : 150
    }, args);

    //Gather original attributes, convert DOM, then reassgign attributes
    var attributes = $(this)[0].attributes;
    var optionsHTML = $(this).html();
    $(this).after('<ul id="tmpul">' + optionsHTML + '</ul>');
    $(this).remove();
    var ul = $('#tmpul')[0];
    for (var i = 0; i < attributes.length; i++) {
        $(ul).attr(attributes[i].name, attributes[i].value);
    }


    //Convert options to checkbox or radios
    var options = $(ul).children('option');
    var name = $(ul).attr('name');
    $(ul).removeAttr('name');
    var f = 0;
    $.each(options, function(key, option) {
        var itemAttributes = $(this)[0].attributes;
        var value = $(this).attr('value');
        var label = $(this).text();
        var selected = $(this).attr('selected') ? "checked" : ''
        selected += $(this).attr('disabled') ? " disabled" : ''
        var newLi;
        $(this).replaceWith(newLi = $('<li ' + selected + '><input type="' + a.type + '" id="option_' + name + '_' + f + '" name="' + name + '" value="' + value + '" ' + selected + '/><label for="option_' + name + '_' + f + '">' + label + '</label></li>') )
        for (var i = 0; i < itemAttributes.length; i++) {
            $(newLi).children('input').attr(itemAttributes[i].name, itemAttributes[i].value);
        }
        f++;
    })

    //Add Filter Box
    $(ul).before('<input id="' + name + '_filter" class="list_filter" />');
    var list = $(ul).children('li');
    var filter = $('#' + name + '_filter');
    filterBox($(filter), list);

    //Contain it all
    $(filter).before('<div class="heftyBox" id="' + name + '_container"></div>');
    var container = $('#' + name + '_container');
    $(filter).appendTo($(container));
    $(ul).appendTo($(container));

    //Select all box for checkboxes
    if (a.type == "checkbox") {
        $(filter).after($('<a href="#">Select All</a>').bind('click', function() {
            var checkboxes = $(this).next('ul').find('input:not([disabled])');
            if ($(checkboxes).length > $(checkboxes + ':checked').length) {
                $(checkboxes).attr('checked', 'checked').closest('li').attr('checked', 'checked');
            } else {
                $(checkboxes).removeAttr('checked', 'checked').closest('li').removeAttr('checked');
            }
            ($(this).text() == "Select All") ? $(this).text("Select None") : $(this).text("Select All")
            $(this).next('ul').trigger('change')
            return false;
        }))
    }

    //Write the Data to the DOM
    $(ul).data({
        heftyBox: a
    })

    //Apply DOM data
    updateheftyBox($(ul));

    //Handle Value Change
    $(this).bind('change', function() {updateheftyBox($(this));})
    }

    //scroll to first selected DOM
    if ($(ul).find('li[checked]:first').length) {
        var itemTop = $(ul).find('li[checked]:first').offset().top || $(ul).offset().top;
        var ulTop = $(ul).offset().top;
        $(ul).scrollTop(itemTop - ulTop);
    }
}

updateheftyBox = function(target) {
    var a = $(target).data().heftyBox;
    var container = $(target).parent('.heftyBox');
    var filter = $(target).siblings('.list_filter');
    var ul = $(target);

    //Gather created data
    a.value = [];
    $(ul).find('input:checked').each(function() {
        a.value.push($(this).val())
    })

    $(container).css({
        width: a.width,
        height: a.height,
        "min-width": $(filter).outerWidth()
    });
    $(ul).css({
        height: a.height - $(filter).outerHeight(),
        "margin-top": $(filter).outerHeight()
    })
    $(ul).val(a.value);
}


filterBox = function(target, blocks) {
    $(target).unbind('keyup change');
    $(target).bind('keyup change', function() {
        var inText = $(this).val().trim(); //remove trailing whitespace

        $.each(blocks, function() {
            var title = $(this).children('label').text(); //the title in the block
            if (matchAll(title, inText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        })

    })
}

matchAll = function(string, args) { //string= string to match, args= search input
    var die = 0; //return switch
    var checks = args.split(' '); //break input into array
    $.each(checks, function() {
        var myReg = new RegExp(this, 'i'); //search term to regex
        if (!string.match(myReg)) { //if it doesn't match, kill the function
            die = 1;
        } 
    })

    if (die == 1) {
        return false;
    } else {
        return true;
    }
}

$('.heftyBox li:has(input:checkbox)').live('click', function() {
    ($(this).has(':checked').length) ? $(this).attr('checked', 'checked') : $(this).removeAttr('checked')
})

