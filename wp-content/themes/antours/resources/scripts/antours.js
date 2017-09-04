jQuery(document).ready(function(){
    (function($, AntoursValidator){
        // register reservation config
        AntoursValidator.setMapper(reservation_config);
        var quickFields = AntoursValidator.getMapper();
        var validators = AntoursValidator.validators;

        var page = 0;
        var canLoadComments = true;
        var canSendContactForm = true;
        var commentList = $(".comment-list");
        var buttonSenderContact = $("#contact-btn");
        var loadCommentsButton = $('#load-comments');
        var iconProgress = $('#progress-icon');
        var btnReservation = $(".btn-reserve");
        var iconProgressContact = $("#progress-icon-contact");
        var alert = $("#alert");
        var alertMessage = $("#alert-message");
        var loadBtnText = $('#load-btn-text');
        var contactBtnText = $("#contact-btn-text");
        var currentDate = new Date();
        var tomorrow = new Date();
        var contactFields = $('.contact-field');
        var contactInformation = {};
        var reservation = {};

        tomorrow.setDate(tomorrow.getDate() + 1);

        var datePickerOptions = {
            startDate: currentDate,
            format: 'dd/mm/yyyy',
            days: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
            daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
            daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        };

        var timePickerOptions = {
            'minTime': new Date(),
            'timeFormat': 'H:i'
        };

        $("#go-date-transport").datepicker(datePickerOptions);
        $("#go-date-transport").datepicker("setDate", currentDate);

        $("#goback-date-transport").datepicker(datePickerOptions);
        $("#goback-date-transport").datepicker("setDate", tomorrow);

        $("#go-time-transport").timepicker(timePickerOptions);
        $("#goback-time-transport").timepicker({ 'timeFormat': 'H:i' });

        // handle btn-category to change its class css
        var lastActive = $(".btn-category.active");
        $(".btn-category").click(function(){
            lastActive.removeClass("active");
            lastActive = $(this);
            lastActive.addClass("active");
        });

        /* QUICK FORM */
        // handle open and close mini reserve window
        $('.btn-reserve').on('click' ,function(){
            var currentPackage = $(this);
            var quickForm = currentPackage.data("id");
            var fields = $("#" + quickForm + ' .quick-field');

            if (!reservation.hasOwnProperty(quickForm)) {
                reservation[quickForm] = {};
            }

            fields.each(function(index, element){
                var current = $(element);
                var name = current.attr('name');

                reservation[quickForm][name] = {
                    value: current.val(),
                    field: current
                }
            });

            $("#" + quickForm).addClass("open");
        });

        // handle close quick form
        $('.btn-close-quick-form').on('click', function(){
            var currentPackage = $(this);
            var targetId = currentPackage.data("id");
            var target = $("#" + targetId);
            var quickForm = $("#" + targetId + " form");
            if (quickForm.length && quickForm[0] instanceof HTMLElement) {
                quickForm[0].reset();
            }

            // remove any data stored if close the quick form
            if (reservation[targetId]) {
                delete reservation[targetId];
            }

            target.removeClass("open");
        });

        $('.quick-field').on('keyup', function(e){
            var currentField = $(this);
            var currentPackage = currentField.data('id');
            var name = currentField.attr('name');
            var value = $.trim(currentField.val());

            var currentReservation = reservation[currentPackage];

            currentReservation[name].value = value;
        });

        $('.btn-makeReserve').on('click', function() {
            var packageId = $(this).data("id");
            var form = $("#" + packageId + " form");
            var fields = reservation[packageId];
            var emptyFormMessage = quickFields.empty;
            var postId = packageId.split("-");
            postId = postId ? postId.pop() : false;

            if (!fields) {
                window.alert(emptyFormMessage);
                return;
            }

            var fieldsToValidate = quickFields.validators;
            var errors = [];

            for (field in fieldsToValidate) {
                var currentField = fieldsToValidate[field];
                var attributes = currentField.attributes;
                var isRequired = attributes.required;
                var currentData = fields[field];
                var currentValue = currentData ? currentData.value : false;
                var currentFieldHTML = currentData.field;
                var errorItem = currentFieldHTML.next();

                if (isRequired || (currentValue && $.trim(currentValue).length > 0)) {
                    var validator = validators[field];
                    var error;

                    if (validator) {
                        isValid = validator(currentValue, attributes);

                        if (!isValid) {
                            var errorMessage = currentField.error;
                            currentFieldHTML.parent().addClass('has-error');
                            errorItem.text(errorMessage);
                            errors.push(true);
                            break;
                        }
                    }

                    if (!errorItem.is(':empty')) {
                        errorItem.text("");
                        currentFieldHTML.parent().removeClass('has-error');
                    }
                }
            }

            if (errors.length > 0) {
                return; 
            }

            var data = normalizeDataPackage(fields);

            data.action = quickFields.actionName;
            data.nonce = quickFields.nonce;
            data.postId = postId;
            var loader = $("#"+ packageId + " .layout-loader");
            var btnClosing = $("#" + packageId + " .btn-close-quick-form");

            sendRequest(data, function(data, status) {
                if (form.length > 0) {
                    form.trigger("reset");
                    btnClosing.trigger("click");
                }
            }, function(XHR) {
                console.log("XHR error", XHR);
            }, function() {
                loader.addClass("active");
            }, function() {
                loader.removeClass("active");
            });
            
        });
        /* QUICK FORM */

        function normalizeDataPackage(fields) {
            var data = {};
            $.each(fields, function(fieldName, object) {
                var value = object['value'];
                if (value.length > 0) {
                    data[fieldName] = value;
                }
            });

            return data;
        }

        function sendRequest(data, onSuccess, onError, beforeSend, onComplete) {
            $.ajax({
                url : contact_form_config.ajax_url,
                type : 'post',
                data : data,
                success: function(_data, textStatus, XHR) {
                    if (onSuccess) {
                        onSuccess(_data, textStatus, XHR);
                    }
                },
                error: function(XHR, textStatus, errorThrown) {
                    if (onError) {
                        onError(XHR, textStatus, errorThrown);
                    }
                },
                beforeSend: function(XHR, object) {
                    if (beforeSend) {
                        beforeSend(XHR, object);
                    }
                },
                complete: function(XHR, textStatus) {
                    if(onComplete) {
                        onComplete(XHR, textStatus);
                    }
                }
            });
        }

        //handle scrollable links
        $('.menu-link').on('click', function(e){
            var self = $(this);
            var isScrollable = self.data('scrollable');
            if (isScrollable) {
                e.preventDefault();
                var target = self.attr('href');
                target = $(target);

                if (target.length > 0) {
                    var offset = target.offset();
                    var screen = $('html, body');
                    screen.stop().animate({scrollTop: offset.top}, 500, 'swing');
                }
            }
        });

        var validatorByName = {
            fullname: function(field) {
                var isSuccessful = false;
                var maxLength = 100;
                var minLength = 5;
                var value = $.trim(field.val());
                var isRequired = field.attr('required');
                var length = value.length;

                if (isRequired) {
                    if (length >= minLength && length <= maxLength) {
                        isSuccessful = true;
                    }
                }

                return isSuccessful;
            },
            id_number: function(field) {
                var isSuccessful = false;
                var idNumberRegExp = /^(?!^0+$)[a-zA-Z0-9]{3,20}$/;
                var value = field.val();

                if (value.match(idNumberRegExp)) {
                    isSuccessful = true;
                }

                return isSuccessful;
            },
            phones: function(field) {
                var isSuccessful = false;
                var phoneRegExp = /^[0-9]{5,15}$/;
                var value = field.val();

                if (value.match(phoneRegExp)) {
                    isSuccessful = true;
                }

                return isSuccessful;
            },
            amount_passenger: function(field) {
                var isSuccessful = false;
                var amountRegExp = /^[0-9]{1,3}$/;
                var value = field.val();

                if (value.match(amountRegExp)) {
                    isSuccessful = true;
                }

                return isSuccessful;
            },
            hotel_address: function(field) {
                var isSuccessful = true;
                var value = field.val();

                if ($.trim(value).length > 0) {
                    if (value.length > 255) {
                        isSuccessful = false;
                    }
                }

                return isSuccessful;
            },
            service_type: function(field) {
                var isSuccessful = true;
                var value = field.val();

                return isSuccessful;
            },
            email: function(field) {
                var isSuccessful = false;
                var value = field.val();
                var emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (value.match(emailRegexp)) {
                    isSuccessful = true;
                }

                return isSuccessful;
            }
        }

        function validateFields(postId) {
            if (!postId) return false;
            var fields = $('#package-'+postId+' .quick-field');
            var limit = fields.length;
            var hasValidInputs = true;
            
            fields.each(function(index, element){
                if (!hasValidInputs) {
                    return false;
                }

                var field = $(this);
                var name = field.attr('name');

                if (validatorByName.hasOwnProperty(name)) {
                    hasValidInputs = validatorByName[name](field);
                    if (!hasValidInputs) {
                        field.addClass('error');
                    }
                }
            });

            return !hasValidInputs;
        }

        function makeReservation(button, loader) {

        }

        // handle active links
        var pathname = document.location.pathname;
        var links = $('.menu-link');
        
        links.each(function(index, element){
            var self = $(element);
            var href = self.data('href');

            if (href) {
                if (pathname.indexOf(href) > -1) {
                    self.addClass('active');
                    return;
                }
            }
        });

        function hideButtonWhenNotMore(more) {
            var loaderText = comment_config.loaderCommentText;
            if(!more) {
                loadBtnText.text(loaderText);
                iconProgress.addClass('hide');
                loadCommentsButton.addClass('hide');
                canLoadComments = false;
                return;
            }
            
            loadBtnText.text(loaderText);
            iconProgress.addClass('hide');
            canLoadComments = true;
        }

        contactFields.on('keyup', function(){
            var input = $(this);
            var type = input.attr("name");

            if(type) {
                var value = input.val();
                contactInformation[type] = value;
            }
        });

        function cleanFields() {
            if ($("#contact-form").length > 0) {
                $("#contact-form")[0].reset();
            }
        }

        buttonSenderContact.click(function(event){
            event.preventDefault();

            if(!canSendContactForm) {
                return;
            }

            jQuery.ajax({
                url : contact_form_config.ajax_url,
                type : 'post',
                data : {
                    action: contact_form_config.actionName,
                    nonce: contact_form_config.nonce,
                    name: contactInformation.name,
                    lastname: contactInformation.lastname,
                    subject: contactInformation.subject,
                    message: contactInformation.message
                },
                success : function( response ) {
                    if (response.success && response.data.sent) {
                        contactInformation = {};
                    }

                    if(!response.success) {
                        alertMessage.text(response.data.error);
                        alert.addClass('alert alert-dismissible alert-danger').removeClass('hide');
                    }

                    contactBtnText.text(contact_form_config.contact_text);
                    iconProgressContact.addClass('hide');
                    canSendContactForm = true;
                    cleanFields();
                },
                error : function(error) {
                    console.log("error", error);
                    canSendContactForm = true;
                },
                beforeSend: function() {
                    contactBtnText.text(contact_form_config.contact_progress_text);
                    iconProgressContact.removeClass('hide');
                    canSendContactForm = false;
                }
            });
        });

        $("#loader_posts").click(function(){
            var self = $(this);

            if (page === 0) {
                page = 1;
            }

            page++;

            jQuery.ajax({
                url : services_config.ajax_url,
                type : 'post',
                data : {
                    action: services_config.actionName,
                    nonce: services_config.nonce,
                    page: page,
                    taxID: self.data('tax')
                },
                success : function( response ) {
                    if (response.success) {
                        var packages = response.data.packages;

                        if (packages && packages.length > 0) {
                            packages.forEach(function(item){
                                $('.each-package').append(item);
                            });
                        }
                    }
                    
                    if (!response.data.more) {
                        self.remove();
                    }
                },
                error : function(error) {
                    console.log("error", error);
                },
                beforeSend: function() {
                    return;
                }
            });
        });

        loadCommentsButton.click(function(){
            if (!canLoadComments) {
                return;
            }
            
            page++;

            jQuery.ajax({
                url : comment_config.ajax_url,
                type : 'post',
                data : {
                    action : 'get_more_comments',
                    post_id : comment_config.post_id,
                    page: page,
                    nonce: comment_config.nonce
                },
                success : function( response ) {
                    var more = response.data.more;
                    
                    if (response.success) {
                        var comments = response.data.comments;
                        if (comments.length > 0) {
                            comments.forEach(function(comment) {
                                commentList.append(comment);
                            });
                        }
                    }

                    hideButtonWhenNotMore(more);
                },
                error : function(error) {
                    console.log("error", error);
                },
                beforeSend: function() {
                    loadBtnText.text(comment_config.loadingCommentText);
                    iconProgress.removeClass('hide');
                    canLoadComments = false;
                }
            });
        });
    })(jQuery, AntoursValidator);
});