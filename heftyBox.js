$.fn.heftyBox = (function($) {
    // usefull functions
    // declared in a self-executing function to not charge the global scope

    var updateheftyBox = function($target) {
        // $target is already a jQuery object, don't need to $() it again
        var box         = $target.data().heftyBox,
            $container  = $target.parent('.heftyBox'),
            $filter     = $target.siblings('.list_filter'); // caching $(filter)

        //Gather created data
        box.value = [];
        $target.find('input:checked').each(function() {
            // using this.value instead of .val(), jQuery tools is not needed
            box.value.push(this.value); 
        });

        $container.css({
            width: box.width,
            height: box.height,
            "min-width": $filter.outerWidth()
        });

        $target.css({
            height: box.height - $filter.outerHeight(),
            "margin-top": $filter.outerHeight()
        })
        $target.val(box.value);
    };


    var filterBox = function($target, blocks) {

        // use chaining
        $target.unbind('keyup change')
            .bind('keyup change', function() {
                var inText = this.value.trim(); //remove trailing whitespace

                $.each(blocks, function() {
                    var $that = $(this);
                    var title = $that.children('label').text(); //the title in the block
                    if (matchAll(title, inText)) {
                        $that.show();
                    } else {
                        $that.hide();
                    }
                });

            });
    };

    var matchAll = function(string, args) { //string= string to match, args= search input
        var checks = args.split(' '); //break input into array
        for(var i = checks.length; i--; ) {
            if (!string.match(new RegExp(checks[i], 'i'))) { // test if args[i] match the string
                return false; 
            }
        }
        return true;
    };



    return function(args) {
        var $that = $(this);
        if ($that.length) {
            //Set up defaults
            var opt = $.extend({
                        type   :  "checkbox",
                        width  :  "auto",
                        height :  ($that.innerHeight() > 150) ? $that.innerHeight() : 150
                    }, args
                ),
                attributes = $that[0].attributes, //Gather original attributes, convert DOM, then reassgign attributes
                optionsHTML = $that.html();
                $ul = $('<ul id="tmpul">' + optionsHTML + '</ul>'); // build ul, then use it | maybe use a random id instead of hardcoding one

            for (var i = attributes.length; i--; ) {
                $ul.attr(attributes[i].name, attributes[i].value);
            }


            //Convert options to checkbox or radios
            var options = $ul.children('option'),
                name = $ul.attr('name'),
                f = 0;
            $ul.removeAttr('name'),

            $.each(options, function(key, option) {
                var $that           = $(this),
                    itemAttributes  = $that[0].attributes,
                    value           = $that.value,
                    label           = $that.text(),
                    selected        = itemAttributes.selected ? "checked" : '';

                selected += itemAttributes.disabled ? " disabled" : '';

                var $newLi = $('<li ' + selected + '></li>'), 
                    $input = $('<input type="' + opt.type + '" id="option_' + name + '_' + f + '" name="' + name + '" value="' + value + '" ' + selected + '/><label for="option_' + name + '_' + f + '">' + label + '</label>');
                $newLi.append($input);
                $that.replaceWith($newLi);
                for (var i = attributes.length; i--; ) {
                    $input[0][attributes[i].name] = attributes[i].value;
                }

                f++;
            });

            //Add Filter Box
            var $filter = $('<input id="' + name + '_filter" class="list_filter" />');
            var list = $ul.children('li');
            filterBox($filter, list);

            // add filter and ul to new container
            var $container = $('<div class="heftyBox" id="' + name + '_container"></div>').append($filter, $ul);
            // replace existing element by new container
            $that.after($container).remove();

            //Select all box for checkboxes
            if (opt.type == "checkbox") {
                var $link = $('<a href="#">Select All</a>')
                        .bind('click', function() {
                            var $that = $(this);
                            //@todo get checked
                            // directly using $ul not using specific dom manipulation
                            var $checkboxes = $ul.find('input:not([disabled])');

                            //adding 'checked' attribute to an li is weird... maybe using a data-checked will be better
                            if ($checkboxes.length > $checkboxes.filter(':checked').length) {
                                $checkboxes.attr('checked', 'checked').closest('li').attr('checked', 'checked');
                            } else {
                                $checkboxes.removeAttr('checked').closest('li').removeAttr('checked');
                            }

                            $that.text( ($that.text() == "Select All") ? "Select None" : "Select All");
                            $ul.trigger('change');
                            return false;
                        }
                    );
                // divided creating and appending. just take one more line and is more readable
                $filter.after($link);
            }

            //Write the Data to the DOM
            $ul.data({ heftyBox: opt });

            //Apply DOM data
            updateheftyBox($ul);

            //Handle Value Change
            $ul.bind('change', function() { updateheftyBox($(this)); }) // change event when clickin
                .delegate('input:checkbox', 'click', function() { // delegate click event on checkbox
                    var li = $(this).parent();
                    (this.checked) ? li.attr('checked', 'checked') : li.removeAttr('checked');

                    // trigger change
                    $ul.trigger('change');
                });

            //scroll to first selected DOM
            if ($ul.find('li[checked]:first').length) {
                var itemTop = $ul.find('li[checked]:first').offset().top || $ul.offset().top,
                    ulTop = $ul.offset().top;
                $ul.scrollTop(itemTop - ulTop);
            }
        }

    };
    })(jQuery);