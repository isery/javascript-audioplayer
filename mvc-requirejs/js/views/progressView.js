define(['jQuery', 'slider'], function($, slider) {
    var progressView = function (model, $element) {
        this.model = model;
        $('<div class="prog" data-value="0" data-max="100" data-min="0" data-step="1"></div>').appendTo($element);
        this.progress = $('.prog').slider("hslider");
        //$(this.model.audio).appendTo($element);
        //this.model.audio.style.width = '400px'; //only debug
        var that = this;
        $(this.model).on('progress', function(e) {
            var value=that.model.getTrackProgress();
            that.progress[0].setValue(value,true);

        });

        $(this.progress).on('change',function(e) {
            var fullseconds = $('.prog>.thumb>.output_top>.value_output').html();
            var seconds = Math.floor(fullseconds%60);
            var minute =   Math.floor(fullseconds/60);
            if(seconds<10) seconds = '0'+seconds;
            var time = minute+':'+seconds;
            if(!isNaN(seconds) || !isNaN(minute)) $('.prog>.thumb>.output_top>.value_output').html(time);

        });

        $(this.model).on('durationchange', function(e) {
            var value = that.model.getTrackDuration();
            $('.prog>.input_max').val(value);
            $('.prog>.input_max').trigger('change');
        });

        $(this.progress[0]).on('track', function(e){
            that.model.pauseSong();
            var value= that.progress[0].getValue();
            that.model.setTrackPos(value);
            that.model.playSong();
        });
        $(this.progress[0]).on('thump', function(e){
            that.model.pauseSong();

        });
        $(this.progress[0]).on('thumpup', function(e){
            var value= that.progress[0].getValue();
            that.model.setTrackPos(value);
            that.model.playSong();
        });
    };

    return progressView;
});

