;(function ( $, window, document, undefined ) {

		// Create the defaults once
		var pluginName = "checkIt",
      action_options = {
        string_actions_html: '<option value="equals">Equals</option><option value="not_equals">Not equals</option><option value="contains">Contains</option><option value="not_contains">Not contains</option>',
        numeric_actions_html: '<option value="equals">Equals</option><option value="not_equals">Not equals</option><option value="contains">Contains</option><option value="not_contains">Not contains</option><option value="between">Between</option></option><option value="not_between">Not between</option>',
        date_actions_html: '<option value="equals">Equals</option><option value="not_equals">Not equals</option><option value="between">Between</option><option value="not_between">Not between</option>'
      },
      defaults = {
        case_sensitive: false,
        highlight_color: "#92b427",
        show_filter: true,
        accents: false
      };

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._action_options = action_options;
				this._name = pluginName;
				this.init();
		}

		Plugin.prototype = {

        // Initialize
				init: function () {

          // Store plugin object into a variable
          var self = this;

          // Set jQuery :contains case-insensitive
          if( this.settings.case_sensitive === false ){
            jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
                return function( elem ) {
                    return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
                };
            });
          }

          // Toggle filter types
          this.toggleFilterTypes();
          
          // Show/hide filter section
          this.toggleDisplayFilter();

          // Initialize control for advanced filter
          self.initAdvancedFilter();

          // Submit checkit quick filter event
          $("#checkit-control input[name='checkit_quick_filter']").on(
            'click', function(){

              // Clear selected checkboxes
              self.clearSelectedCheckboxes();

              // Filter checkboxes
              var filtered_checkboxes = self.quickFilterCheckboxes();
              if( filtered_checkboxes.length ){

                // Check filtered checkboxes
                self.checkFilteredCheckboxes( filtered_checkboxes );
              }
              else {
                alert('No results found that match your search!');
              }

              // Stop submit action
              return false;
            }
          );

          // Submit checkit advanced filter event
          $("#checkit-control input[name='checkit_advanced_filter']").on(
            'click', function(){

              // Clear selected checkboxes
              self.clearSelectedCheckboxes();

              // Filter checkboxes
              var filtered_checkboxes = self.advancedFilterCheckboxes();
              if( filtered_checkboxes.length ){

                // Check filtered checkboxes
                self.checkFilteredCheckboxes( filtered_checkboxes );
              }
              else {
                alert('No results found that match your search!');
              }

              // Stop submit action
              return false;
            }
          );

          // Submit checkit all event
          $("#checkit-control input[name='checkit_all']").on(
            'click', function(){

              // Clear selected checkboxes
              self.clearSelectedCheckboxes();

              // Check all checkboxes
              self.checkAllCheckboxes();

              // Stop submit action
              return false;
            }
          );

          // Clear checkboxes event
          $("#checkit-control input[name='checkit_clear']").on(
            'click', function(){

              // Clear selected checkboxes
              self.clearSelectedCheckboxes();

              // Stop submit action
              return false;
            }
          );

          // Toggle display filter section
          $("#checkit-control input[name='checkit_filter']").on(
            "click", function(){
              $("#checkit-filter-container").toggle("fast");
            }
          );

          // Change advanced filter parameter action
          $("#checkit-control select.select-action").on(
            "change", function(){
              var action = $(this).val();
              var $input_html = $(this).next("input");
              var number_of_inputs = $(this).parent().find("input").length;

              if( $.trim( action ).length ){

                // For interval type
                if( action === "between" || action === "not_between" ){

                  // Clear input value
                  $input_html.val("");
                  
                  // Get parameter key
                  if( number_of_inputs === 1 ){
                    var parameter_key = $input_html.attr("id").split("-");
                    parameter_key = parameter_key[parameter_key.length - 1];
                  }
                  else if( number_of_inputs === 2 ) {
                    var parameter_key = $input_html.attr("id").split("-");
                    parameter_key = parameter_key[parameter_key.length - 2];
                  }

                  // Set DOM elements
                  var $input_html_from = $input_html.clone();
                  var $input_html_to = $input_html.clone();
                  $input_html_from.prop("id", "advanced-filter-" + parameter_key + "-from" );
                  $input_html_from.prop("name", "advanced_filter_" + parameter_key + "_from" );
                  $input_html_to.prop("id", "advanced-filter-" + parameter_key + "-to" );
                  $input_html_to.prop("name", "advanced_filter_" + parameter_key + "_to" );

                  // Remove current input
                  $(this).parent().find("input").remove();

                  // Append new inputs
                  $(this).parent().find("button").before( $input_html_from );
                  $(this).parent().find("button").before( $input_html_to );
                }

                // For not interval type
                else if( action !== "between" && action !== "not_between" && number_of_inputs === 2 ) {

                  // Get parameter key
                  var parameter_key = $input_html.attr("id").split("-");
                  parameter_key = parameter_key[parameter_key.length -2];

                  // Set dom element
                  var $new_input_html = $input_html.clone();
                  $new_input_html.prop("id", "advanced-filter-" + parameter_key);
                  $new_input_html.prop("name", "advanced_filter_" + parameter_key);

                  // Remove current inputs
                  $(this).parent().find("input").remove();

                  // Append new inputs
                  $(this).parent().find("button").before( $new_input_html );
                }
              }
            }
          );

          // Set background to transparent if checkbox is unchecked
          $(this.element).find("tbody :checkbox").on(
            "click", function(){
              if( !$(this).is(":checked") ){
                $(this).closest("tr").css("background", "transparent");
              }
            }
          );

          // Clear filter parameter values
          $('button.clear-filter').on(
            "click", function(){
              $(this).parent().find('input').val("");

              // Recheck chekboxes
              $(this).closest("div#checkit-advanced-filter").find("input[type='submit']").trigger("click");

              return false;
            }
          );

				},

        // Display/hide filter section
        toggleDisplayFilter: function(){

          if( this.settings.show_filter === true ){
            $("#checkit-filter-container").show();
          }
          else {
            $("#checkit-filter-container").hide();
          }
        },

        // Switch between filter types
        toggleFilterTypes: function(){

          // Get filter sections
          var $quick_filter_section = $("#checkit-filter-container").find("#checkit-quick-filter");
          var $advanced_filter_section = $("#checkit-filter-container").find("#checkit-advanced-filter");

          // Hide advanded filter by default
          $advanced_filter_section.hide();

          // Switch to advanced filter
          $("#checkit-filter-container input[name='display_advanced_filter']").on(
            "click", function(){

              // Hide quick filter section
              $quick_filter_section.hide("fast");

              // Display advanced filter section
              $advanced_filter_section.show("fast");
              
            }
          );

          // Switch to quick filter
          $("#checkit-filter-container input[name='display_quick_filter']").on(
            "click", function(){

              // Hide advanced filter section
              $advanced_filter_section.hide("fast");

              // Display quick filter section
              $quick_filter_section.show("fast");
            }
          );

        },

        // Init advanced filter
        initAdvancedFilter: function(){

          // Store plugin object into a variable
          var self = this;

          // Collect filter parameters
          var filter_params = [];
          $(self.element).find("thead td").each(function( index, element ){
            if( $.trim( $(element).text() ).length ){

              var filter_param = {};
              filter_param.name = $(element).text();

              // Remove accents for key
              if( self.settings.accents === true ){
                filter_param.key = $(element).text().latinise().toLowerCase().replace(' ', '_');
              }
              else {
                filter_param.key = $(element).text().toLowerCase().replace(' ', '_');
              }

              filter_param.type = $(element).data("type");
              filter_param.index = $(this).parent().children().index($(this));

              // Set interval param if it was set on element
              if( ( filter_param.type === "numeric" || filter_param.type === "date" ) && $(element).data("interval") === true ){
                filter_param.interval = true;
              }
              filter_params.push( filter_param );
            }
          });

          // Append filter paramters to advanced filter control box
          if( filter_params.length ){

            // Save filter params to plugin object
            self.filter_params = filter_params;

            var $filter_control_container = $("#checkit-control").find("#checkit-advanced-filter .advanced-filters");
            $.each( filter_params, function( index, element ){

              var append_param_html = "";

              // For string type
              if( element.type === "string" ){

                // Append filter parameter
                append_param_html = '<div><label for="advanced-filter-'+ element.key +'">'+ element.name +'</label><select name="actions_'+ element.key +'" class="select-action">'+ self._action_options.string_actions_html +'</select><input type="text" name="advanced_filter_'+ element.key +'" id="advanced-filter-'+ element.key +'"><button class="button red-button clear-filter">Clear</button></div>';
              }

              // For numeric type
              else if( element.type === "numeric" ){

                // Append filter parameter
                append_param_html = '<div><label>'+ element.name +'</label><select name="actions_'+ element.key +'" class="select-action">'+ self._action_options.numeric_actions_html +'</select><input type="number" name="advanced_filter_'+ element.key +'" id="advanced-filter-'+ element.key +'"><button class="button red-button clear-filter">Clear</button></div>';
              }

              // For date type
              else if( element.type === "date" ) {

                // Append filter parameter
                append_param_html = '<div><label>'+ element.name +'</label><select name="actions_'+ element.key +'" class="select-action">'+ self._action_options.date_actions_html +'</select><input type="date" name="advanced_filter_'+ element.key +'" id="advanced-filter-'+ element.key +'"><button class="button red-button clear-filter">Clear</button></div>';
              }

              // Append params to
              $filter_control_container.append(append_param_html);
            });
          }

        },

        // Quick filter checkboxes
        quickFilterCheckboxes: function(){

          var filtered_checkboxes = [];
          var filter_parameters = 0;
          $(this.element).find("tbody tr").each(function(index, element){

            // Filter by text
            if( $("#checkit-control input[name='search_text']").val() ){
              var search_text = $("#checkit-control input[name='search_text']").val();

              if( $(element).find("td:Contains('"+ search_text +"')").length <= 0 ){
                return;
              }
              filter_parameters++;
            }
            filtered_checkboxes.push(element);
          });
          return filter_parameters > 0 ? filtered_checkboxes:[];
        },

        // Advanced filter checkboxes
        advancedFilterCheckboxes: function(){

          // Store plugin object into a variable
          var self = this;

          var filter_parameters = 0;
          var filtered_checkboxes = [];
          $(this.element).find("tbody tr").each(function(index, element){

            var selectable = true;
            $.each( self.filter_params, function( key, params ){

              // Get column by params index
              var $column_object = $(element).find("td").eq(params.index);

              if( $column_object.length ){

                // For string parameters
                if( params.type === "string" ){

                  // Get filter input element
                  var $filter_element = $("#checkit-control").find("#checkit-advanced-filter .advanced-filters input[name='advanced_filter_"+ params.key +"']");

                  // Get action dom element
                  var action = $("#checkit-control").find("#checkit-advanced-filter .advanced-filters select[name='actions_"+ params.key +"']").val();

                  if( $filter_element.val() && action.length ){

                    filter_parameters++;

                    // Equals action
                    if( action === "equals" ){
                      if( $column_object.text().toLowerCase() !== $filter_element.val().toLowerCase() ){
                        selectable = false;
                        return false;
                      }
                    }
                    
                    // Not equals action
                    else if( action === "not_equals" ){
                      if( $column_object.text().toLowerCase() === $filter_element.val().toLowerCase() ){
                        selectable = false;
                        return false;
                      }
                    }

                    // Contains action
                    else if( action === "contains" ){
                      if( $column_object.text().toLowerCase().search( $filter_element.val().toLowerCase() ) < 0 ){
                        selectable = false;
                        return false;
                      }
                    }

                    // Not contains action
                    else if( action === "not_contains" ){
                      if( $column_object.text().toLowerCase().search( $filter_element.val().toLowerCase() ) >= 0 ){
                        selectable = false;
                        return false;
                      }
                    }
                  }
                }

                // For numeric parameters
                else if( params.type === "numeric" ){

                  // Get action dom element
                  var action = $("#checkit-control").find("#checkit-advanced-filter .advanced-filters select[name='actions_"+ params.key +"']").val();

                  if( action.length ){


                    // Non-interval filters
                    if( action !== "between" && action !== "not_between" ){
                      
                      // Get filter input element
                      var $filter_element = $("#checkit-control").find("#checkit-advanced-filter .advanced-filters input[name='advanced_filter_"+ params.key +"']");

                      if( $filter_element.val() ){
                        filter_parameters++;

                        // Equals action
                        if( action === "equals" ){
                          if( parseFloat( $column_object.text() ) !== parseFloat( $filter_element.val() ) ){
                            selectable = false;
                            return false;
                          }
                        }

                        // Not equals action
                        else if( action === "not_equals" ){
                          if( parseFloat( $column_object.text() ) === parseFloat( $filter_element.val() ) ){
                            selectable = false;
                            return false;
                          }
                        }

                        // Contains action
                        else if( action === "contains" ){
                          if( $column_object.text().search( parseFloat( $filter_element.val() ) ) < 0 ){
                            selectable = false;
                            return false;
                          }
                        }

                        // Not contains action
                        else if( action === "not_contains" ){
                          console.log( $column_object.text().search( parseFloat( $filter_element.val() ) ) );
                          if( $column_object.text().search( parseFloat( $filter_element.val() ) ) >= 0 ){
                            selectable = false;
                            return false;
                          }
                        }
                      }
                    }

                    // Interval actions
                    else {

                      // Get filter parameters
                      var $filter_from_element = $("#checkit-control").find("#checkit-advanced-filter .advanced-filters input[name='advanced_filter_"+ params.key +"_from']");
                      var $filter_to_element = $("#checkit-control").find("#checkit-advanced-filter .advanced-filters input[name='advanced_filter_"+ params.key +"_to']");

                      // If both value were set
                      if( $filter_from_element.val() !== "" && $filter_to_element.val() !== "" ){

                        // Maximum value must be bigger than minimum
                        if( $filter_from_element.val() <= $filter_to_element.val() ){

                          filter_parameters++;

                          // Between action
                          if( action === "between" ){
                            if( parseFloat( $column_object.text() ) < $filter_from_element.val() || parseFloat( $column_object.text() ) > $filter_to_element.val() ){
                              selectable = false;
                              return false;
                            }
                            
                          }
                          
                          // Not between action
                          else if( action === "not_between" ){
                            if( parseFloat( $column_object.text() ) >= parseFloat( $filter_from_element.val() ) && parseFloat( $column_object.text() ) <= parseFloat( $filter_to_element.val() ) ){
                              selectable = false;
                              return false;
                            }
                          }
                          

                        }
                        else {
                          return false;
                        }
                      }

                      // If minimum value was set
                      else if( $filter_from_element.val() !== "" ){
                        filter_parameters++;

                        // Between action
                        if( action === "between" ){
                          if( parseFloat( $column_object.text() ) < $filter_from_element.val() ){
                            selectable = false;
                          }
                        }

                        // Not between action
                        else if( action === "not_between" ){
                          if( parseFloat( $column_object.text() ) > $filter_from_element.val() ){
                            selectable = false;
                          }
                        }
                      }

                      // If maximum value was set
                      else if( $filter_to_element.val() !== "" ){
                        filter_parameters++;

                        // Between action
                        if( action === "between" ){
                          if( parseFloat( $column_object.text() ) > $filter_from_element.val() ){
                            selectable = false;
                          }
                        }

                        // Not between action
                        else if( action === "not_between" ){
                          if( parseFloat( $column_object.text() ) < $filter_from_element.val() ){
                            selectable = false;
                          }
                        }
                      }
                    }
                  }
                }

                // For date parameters
                else if( params.type === "date" ){

                  // Get action dom element
                  var action = $("#checkit-control").find("#checkit-advanced-filter .advanced-filters select[name='actions_"+ params.key +"']").val();

                  if( action.length ){

                    // Non-interval actions
                    if( action !== "between" && action !== "not_between" ){
                      
                      // Get filter input element
                      var $filter_element = $("#checkit-control").find("#checkit-advanced-filter .advanced-filters input[name='advanced_filter_"+ params.key +"']");

                      if( $filter_element.val() ){

                        filter_parameters++;

                        // Get current date value
                        var date_value = new Date( $column_object.text() );
                        date_value.setHours(0);

                        // Equals action
                        if( action === "equals" ){
                          $filter_element = new Date( $filter_element.val() );
                          $filter_element.setHours(0);
                          if( date_value.getTime() !== $filter_element.getTime() ){
                            selectable = false;
                            return false;
                          }
                        }

                        // Not equals action
                        else if( action === "not_equals" ){
                          $filter_element = new Date( $filter_element.val() );
                          $filter_element.setHours(0);
                          if( date_value.getTime() === $filter_element.getTime() ){
                            selectable = false;
                            return false;
                          }
                        }

                        // Contains action
                        else if( action === "contains" ){
                          if( $column_object.text().toLowerCase().search( $filter_element.val().toLowerCase() ) < 0 ){
                            selectable = false;
                            return false;
                          }
                        }

                        // Not contains action
                        else if( action === "not_contains" ){
                          if( $column_object.text().toLowerCase().search( $filter_element.val().toLowerCase() ) >= 0 ){
                            selectable = false;
                            return false;
                          }
                        }
                      }
                    }

                    // Interval actions
                    else {

                      var $filter_from_element = $("#checkit-control").find("#checkit-advanced-filter .advanced-filters input[name='advanced_filter_"+ params.key +"_from']");
                      var $filter_to_element = $("#checkit-control").find("#checkit-advanced-filter .advanced-filters input[name='advanced_filter_"+ params.key +"_to']");

                      // Convert string values to date
                      if( $filter_from_element.val() ){
                        $filter_from_element = new Date( $filter_from_element.val() );
                        $filter_from_element.setHours(0);
                      }
                      else {
                        $filter_from_element = undefined;
                      }

                      if( $filter_to_element.val() ){
                        $filter_to_element = new Date( $filter_to_element.val() );
                        $filter_to_element.setHours(0);
                      }
                      else {
                        $filter_to_element = undefined;
                      }

                      // Get date value
                      var date_value = new Date( $column_object.text() );
                      date_value.setHours(0);


                      // If both value were set
                      if( $filter_from_element !== undefined  && $filter_to_element !== undefined ){

                        // Maximum value must be bigger than minimum
                        if( $filter_from_element.getTime() <= $filter_to_element.getTime() ){

                          filter_parameters++;

                          // Between
                          if( action === "between" ){
                            if( date_value.getTime() < $filter_from_element.getTime() || date_value.getTime() > $filter_to_element.getTime() ){
                              selectable = false;
                              return false;
                            }
                          }
                          else if( action === "not_between" ){
                            if( date_value.getTime() > $filter_from_element.getTime() && date_value.getTime() < $filter_to_element.getTime() ){
                              selectable = false;
                              return false;
                            }
                          }
                        }
                        else {
                          return false;
                        }
                      }

                      // If minimum value was set
                      else if( $filter_from_element !== undefined ){
                        filter_parameters++;

                        // Between
                        if( action === "between" ){
                          if( date_value.getTime() < $filter_from_element.getTime() ){
                            selectable = false;
                            return false;
                          }
                        }
                        
                        // Not between
                        else if( action === "not_between" ){
                          if( date_value.getTime() > $filter_from_element.getTime() ){
                            selectable = false;
                            return false;
                          }
                        }
                      }

                      // If maximum value was set
                      else if( $filter_to_element !== undefined ){
                        filter_parameters++;

                        // Between
                        if( action === "between" ){
                          if( date_value.getTime() > $filter_to_element.getTime() ){
                            selectable = false;
                            return false;
                          }
                        }
                        // Not between
                        else if( action === "not_between" ){
                          if( date_value.getTime() < $filter_to_element.getTime() ){
                            selectable = false;
                            return false;
                          }
                        }
                      }
                    }
                  }
                }
              }

            });

            if( selectable === true ){
              filtered_checkboxes.push(element);
            }
            else {
              return;
            }
          });

          return filter_parameters > 0 ? filtered_checkboxes : [];

        },

        // Check filtered checkboxes
        checkFilteredCheckboxes: function( items ){

          // Store plugin object into a variable
          var self = this;

          $.each(items, function(index, element){
            $(element).find("input[type='checkbox']:first").prop("checked", true);
            $(element).css("background", self.settings.highlight_color);
          });
        },

        // Check all checkboxes
        checkAllCheckboxes: function(){

          // Store plugin object into a variable
          var self = this;

          $(this.element).find('tbody :checkbox').prop("checked", true);
          $(this.element).find('tbody tr').css("background", self.settings.highlight_color);
        },

        // Clear selection
        clearSelectedCheckboxes: function(){
          $(this.element).find('tbody :checkbox').prop("checked", false);
          $(this.element).find('tbody tr').css("background", "white");
        }
		};

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};
})( jQuery, window, document );
