define(['jQuery', 'slider'], function($, slider) {
	var volumeView = function (model, $element) {
        $('<div class="slider" data-value="0.50" data-max="1" data-min="0" data-step="0.10"></div>').appendTo($element);
        $('.slider').slider("hslider");
        $('.input_value').hide();
        $('.input_min').hide();
        $('.input_max').hide();
        $('.input_step').hide();
        this.model = model;
        this.currentVolume = $('.value_output');
        var that = this;

        this.currentVolume.on('change', function (e) {
            var val = that.currentVolume.html();
            that.model.setVolume(val);
        });
    };
    volumeView.prototype.render = function (e) {
	};
	return volumeView;
});