
(function ($) {
jQuery.fn.slider = function(attr){
	var slider = $(this);
    var array = [];
	config = {
            view:slider,
            min:parseFloat(slider.attr('data-min')),
            max:parseFloat(slider.attr('data-max')),
            value:parseFloat(slider.attr('data-value'))
        }
	if(attr=="hslider") {

        array.push(new HSlider(config));
	}
	else {
		new VSlider(config);
	}
    return array;
}

    if (!Function.prototype.bind) {
        Function.prototype.bind = function (scope) {
            var f = this;

            return function () {
                f.apply(scope, arguments);
            }
        }
    }
    
    

    var applySuperClass = function (SubSclass, SuperClass) {
        var F = function () {
        };
        F.prototype = SuperClass.prototype; // reference auf (gleiches) prototype Object
        SubSclass.prototype = new F(); // ein Objekt wird erzeut mit demselben prototype Object, aber Constructor-Body von Person wird *jetzt* nicht ausgeführt
        SubSclass.superproto = SuperClass.prototype; // optional
        SuperClass.prototype.constructor = SubSclass;
    };

    //--------------------------------------------------------------------------------------

    var AbstractSlider = function (config) {
    	this.view = config.view; // the jquery object of slider
        this.view.append('<div class="thumb"></div><div class="track">');
		this.view.append('<input name="value" class="input_value">');
		this.view.append('<input name="value" class="input_min">');
		this.view.append('<input name="value" class="input_max">');
		this.view.append('<input name="value" class="input_step">');


        this.track = this.view.find('.track');
        this.thumb = this.view.find('.thumb');
       
        this.min = parseFloat(this.view.data('min'));
        this.max = parseFloat(this.view.data('max'));
        this.value = parseFloat(config.value);
        this.step = parseFloat(this.view.data('step'));

        this.input_value = this.view.find('.input_value');
        this.input_value.val(this.value);
        this.input_min = this.view.find('.input_min');
        this.input_min.val(this.min);
        this.input_max = this.view.find('.input_max');
        this.input_max.val(this.max);
        this.input_step = this.view.find('.input_step');
        this.input_step.val(this.step);
        
        this.input_min.on('change',this.change.bind(this));
        this.input_max.on('change',this.change.bind(this));
        this.input_value.on('change',this.change.bind(this));
        this.input_step.on('change',this.change.bind(this));
        
    }
    

    AbstractSlider.prototype.getValueField = function(){
    	return this.input_value;
    }
    
    AbstractSlider.prototype.getMin = function (){
    	return this.min;
    }
    
    AbstractSlider.prototype.getMax = function (){
    	return this.max;
    }

    AbstractSlider.prototype.getValue = function (){
    	return this.value;
    }
    //event on the input fields! if new values are there it will check it and save it
    AbstractSlider.prototype.change = function(e) {
    	if(e!=undefined) {
				if (e.target == this.input_min[0]) {
					if (e.target.value <= this.value && e.target.value <= this.max) {
						this.min = parseFloat(e.target.value);
						//alert(this.value);
						this.setValue(this.value, false);
					} else {
						this.input_min.val(this.min);
						//alert("Not Possible");
					}

				} else if(e.target == this.input_max[0]) {
					if (e.target.value >= this.value && e.target.value >= this.min) {
						this.max = parseFloat(e.target.value);
						this.setValue(this.value, false);
					} else {
						this.input_max.val(this.max);
						//alert("Not Possible");
					}
				}
				else if(e.target == this.input_value[0]){
					if (e.target.value >= this.min && e.target.value <= this.max) {
						this.value = parseFloat(e.target.value);
						this.setValue(this.value, false);
					} else {
						this.input_value.val(this.value);
						//alert("Not Possible");
					}
					
				}
				else if(e.target == this.input_step[0]){
					if (e.target.value >0 && e.target.value <= (this.max-this.min) ) {
						this.step = parseFloat(e.target.value);
						this.setValue(this.step, false);
					} else {
						this.input_step.val(this.step);
						//alert("Not Possible");
					}
					
				}

    	}
    }

	AbstractSlider.prototype.snapping = function(new_value) {
				//downDifference is difference to smaller step
				//upperDifference is difference to upper step
				
				/*
				 * Slider range 0 -> 10 click on 4,7 = new_value
				 * then downdifference = 0,7 and upperdifference = 1,3
				 * if step = 2
				 */
				var downDifference=parseFloat(new_value%this.step);
                var upperDifference = (this.step-Math.abs(downDifference));
                //console.log("value: "+new_value+" downDifference "+downDifference +" upperDifference: "+upperDifference+" step "+this.step);
                 
                 //first part of if = is click in the lower or upper part of the step
                 //second part: check if the range is negative -> pretty complex -> not for everyone pretty ;)
              
                 if((Math.abs(downDifference)>(this.step/2))||(this.step>downDifference && downDifference >1)){
                 	//check if clicked value is negative 
                 	//if so go to upper step
                 	if(new_value<0) new_value-=upperDifference
                 	else new_value+=upperDifference;
                 }
                 else {
                 	new_value-=downDifference;
                 }
                 return new_value;
	}
    //------------------------------------------------------------------------------------------

    var HSlider = function (config) {
    	AbstractSlider.apply(this, arguments);
        this.dx;
	    this.trackLeft = this.track.offset().left;   
	    this.trackWidth = this.track.width();
        this.thumbWidth = this.thumb.width();
        this.track.on('mousedown', this.onMouseDown.bind(this));
       	this.thumb.on('mousedown', this.onMouseDown.bind(this));  
       	this.thumb.animate({left:this.valueToPosition(this.value)},400);
       	
       	this.thumb.append('<div class="output_top"></div>');
        this.tooltip = this.view.find('.output_top');
        this.tooltip.append('<p class="value_output"></p>');
        this.tooltip_value=this.view.find('.value_output');

  		this.tooltip_value.html(this.value);
  
        
    }

    applySuperClass(HSlider, AbstractSlider);

    HSlider.prototype.animateThumb = function (position) {
        this.thumb.animate({left:position}, 100);
    }
    
    HSlider.prototype.valueToPosition = function (value) {
    	var position = (value - this.min) / (this.max - this.min) * (this.trackWidth - this.thumbWidth);
        return position;
    }

    HSlider.prototype.positionToValue = function (position) {
    	var value = position / (this.trackWidth - this.thumbWidth) * (this.max - this.min) + this.min;
        return value;
    }
    
    HSlider.prototype.setValue = function (val, isDragged) {

        if (val === this.value && isDragged)
        	return;
        this.value = this.snapping(val);
       	
       	//if value out of range -> set to min or max
        if(this.value>=this.max) {this.value=this.max;}
        else if (this.value<=this.min) {this.value=this.min;}
       	
	    this.input_value.val(this.value);
		this.tooltip_value.html(Math.round(this.value*10)/10);
        this.tooltip_value.change();
		if(isDragged) {
			this.thumb.css('left', this.valueToPosition(this.value));
		}
		else {
			this.thumb.animate({left:this.valueToPosition(this.value)},400);	
		}
        // dispatch the change event to notify the app's business logic about the new value
        $(this).trigger('change');
    }
    
    HSlider.prototype.onMouseDown = function (e) {
        // todo: add the jQuery code for the event handling (mouse interactions)
        // because of bind() in the constructor, this can be assumed to point to the Slider instance
       	var that = this;

        if (e.target == this.thumb[0]) {
                // click on thumb > drag it
                this.dx = e.pageX - this.thumb.offset().left; // keep a fixed distance between mouse and thumb
                console.log('slider:onthump');

        } else if (e.target == this.track[0]) {
                // click on the track
                //step here!!!!!
                console.log('track');
                this.dx = this.thumbWidth / 2;
                var position = Math.max(0,
                    Math.min(this.trackWidth - this.thumbWidth, e.pageX - this.dx - this.trackLeft));
                this.setValue(this.positionToValue(position),false);
                // $(this).trigger('track');

        }
            $(this).trigger('thump');
            this.thumb.addClass('down');
            this.view.find('.output_top').addClass('down');

        $(document).on('mousemove', function (e) {
                var position = Math.max(0,
                    Math.min(that.trackWidth - that.thumbWidth, e.pageX - that.dx - that.trackLeft));
                that.setValue(that.positionToValue(position),true);
            });

            $(document).on('mouseup.sliderDragging', function () {
                console.log('up');
                that.thumb.removeClass('down');
                that.view.find('.output_top').removeClass('down');
                $(document).off('mouseup.sliderDragging'); // jQuery namespace
                $(document).off('mousemove');
                $(that).trigger('thumpup');

            });

            e.preventDefault();
    };

    //------------------------------------------------------------------------------------------

    var VSlider = function (config) {
    	AbstractSlider.apply(this, arguments);
        this.dy;
	    this.trackTop = this.track.offset().top;   
	    this.trackHeight = this.track.height();
        this.thumbHeight = this.thumb.height();  
        this.track.on('mousedown', this.onMouseDown.bind(this));
       	this.thumb.on('mousedown', this.onMouseDown.bind(this));  
       	this.thumb.animate({top:this.valueToPosition(this.value)},400);   
       	
       	this.thumb.append('<div class="output_right"></div>');
        this.tooltip = this.view.find('.output_right');
        this.tooltip.append('<p class="value_output"></p>');
        this.tooltip_value=this.view.find('.value_output');
 		this.tooltip_value.html(this.value);
    }

    applySuperClass(VSlider, AbstractSlider);

    VSlider.prototype.animateThumb = function (position) {
        this.thumb.animate({top:position}, 100);
    }
    
    VSlider.prototype.valueToPosition = function (value) {
    	var position = (value - this.min) / (this.max - this.min) * (this.trackHeight - this.thumbHeight);
        return position;
    }

    VSlider.prototype.positionToValue = function (position) {
    	var value = position / (this.trackHeight - this.thumbHeight) * (this.max - this.min) + this.min;
        return value;
    }
    
    VSlider.prototype.setValue = function (val, isDragged) {

        if (val === this.value && isDragged)
        	return;
        	
       	this.value = this.snapping(val);
       	
        if(this.value>=this.max) {this.value=this.max;}
        else if (this.value<=this.min) {this.value=this.min;}
		
		this.input_value.val(this.value);
		this.tooltip_value.html(this.value);
		if(isDragged) {
			this.thumb.css('top', this.valueToPosition(this.value));
		}
		else {
			this.thumb.animate({top:this.valueToPosition(this.value)},400);	
		}
        // dispatch the change event to notify the app's business logic about the new value
        $(this).trigger('change');
    }
    
    VSlider.prototype.onMouseDown = function (e) {
        // todo: add the jQuery code for the event handling (mouse interactions)
        // because of bind() in the constructor, this can be assumed to point to the Slider instance
       	var that = this;

        if (e.target == this.thumb[0]) {
                // click on thumb > drag it
                this.dy = e.pageY - this.thumb.offset().top; // keep a fixed distance between mouse and thumb
            } else if (e.target == this.track[0]) {
                // click on the track
                this.dy = this.thumbHeight / 2;
                var position = Math.max(0,
                    Math.min(this.trackHeight - this.thumbHeight, e.pageY - this.dy - this.trackTop));
                this.setValue(this.positionToValue(position),false);
            }

            this.thumb.addClass('down');
            $(document).on('mousemove', function (e) {
                var position = Math.max(0,
                    Math.min(that.trackHeight - that.thumbHeight, e.pageY - that.dy - that.trackTop));
                that.setValue(that.positionToValue(position),true);
            });

            $(document).on('mouseup.sliderDragging', function () {
                that.thumb.removeClass('down');
                that.view.find('.output_top').removeClass('down');
                $(document).off('mouseup.sliderDragging'); // jQuery namespace
                $(document).off('mousemove');

            });

            e.preventDefault();
    };
})(jQuery);