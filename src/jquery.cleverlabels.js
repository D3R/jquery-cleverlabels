/* D3R Cleverlabels
You will need some styling in your css a bit like this:

div.field input.cleverlabel,
div.field textarea.cleverlabel {
    background: #F0F0F0;
    color: #A0A0A0;
    border-color: #E1E1E1;
}
div.password .cleverpassword {
    position: relative;
}
div.password input.password {
    position: relative;
}
div.password input.cleverlabel {
    position: absolute;
    z-index: 0;
    left: 0;
    bottom: 0;
}
.js div.field .form_note {
    display: none;
}
*/
(function($) {
    $.cleverlabels = function(el, override, options) {
        var base = this;

        base.$el = $(el);
        base.el = el;
        base.labeltext = override;

        base.$el.data("cleverlabels", base);

        base.init = function() {
            base.override = override;
            base.options = $.extend({},$.cleverlabels.defaultOptions, options);
            if (undefined === base.labeltext) {
                base.labeltext = base.$el.attr('placeholder');
            }
            if (undefined === base.labeltext || base.labeltext.length < 1) {
                base.labeltext = $('#'+base.$el.attr('id')+'_note').text();
            }
            if (undefined === base.labeltext || base.labeltext.length < 1) {
                base.labeltext = $('label[for='+base.$el.attr('id')+']').text();
                if(base.options.allowAsterisk !== true) {
                    base.labeltext = base.labeltext.replace(/\*/,"");
                }
            }

            if (undefined !== base.labeltext ) {
                base.labeltext = $('<span>').html(base.labeltext + "&nbsp;").text();
            }

            if (!$.cleverlabels.html5Support()) {
                if ('password' == base.$el.attr('type')) {
                    var $dummy = $('<input type="text" value="'+base.labeltext+'" class="'+base.options.inputClass+' cleverlabel"/>');
                    var $height = (base.$el.outerHeight() === 0) ? 'auto' : base.$el.outerHeight();
                    $dummy.css({width: base.$el.outerWidth(), height: $height});
                    $dummy.focus(function(e){
                        base.$el.focus();
                    });
                    base.$el.wrap('<div class="cleverpassword"></div>');
                    base.$el.before($dummy);

                    base.clearval = function() {
                        base.$el.css({opacity:1});
                        $dummy.css({opacity: 0});
                    };
                    base.fillval = function() {
                        if (base.$el.val() === '') {
                            base.$el.css({opacity:0});
                            $dummy.css({opacity: 1});
                        }
                    };
                }
                base.fillval();
                base.$el.bind('focus', base.clearval);
                base.$el.bind('blur change', base.fillval);
                base.$el.closest('form').submit(base.clearval);
            } else if (base.$el.attr('placeholder') != base.labeltext) {
                base.$el.attr('placeholder', base.labeltext);
            }
        };

        base.clearval = function() {
            if (base.$el.val() == base.labeltext) {
                base.$el.val('');
                base.$el.removeClass('cleverlabel');
            }
        };

        base.fillval = function() {
            base.$el.removeClass('cleverlabel');
            if (base.$el.val() === '' || base.$el.val() === base.labeltext) {
                base.$el.val(base.labeltext);
                base.$el.addClass('cleverlabel');
            }
        };

        base.init();
    };

    $.cleverlabels.defaultOptions = {
        allowAsterisk: false,
        inputClass: 'input'
    };

    $.cleverlabels.html5Support = function() {
        if ('undefined' == typeof $.support.placeholder) {
            $.support.placeholder = 'placeholder' in document.createElement('input');
        }
        return $.support.placeholder;
    };

    $.fn.cleverlabels = function(override, options){
        return this.each(function(){
            (new $.cleverlabels(this, override, options));
        });
    };

    $.fn.fillcleverlabels = function(){
        if (!$.cleverlabels.html5Support()) {
            return this.each(function(){
                if (!!$(this).data('cleverlabels')) {
                    $(this).data('cleverlabels').fillval();
                }
            });
        }
        return this;
    };

    $.fn.clearcleverlabels = function(){
        if (!$.cleverlabels.html5Support()) {
            return this.each(function(){
                if (!!$(this).data('cleverlabels')) {
                    $(this).data('cleverlabels').clearval();
                }
            });
        }
        return this;
    };
})(jQuery);
