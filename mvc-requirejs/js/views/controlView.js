define(['jQuery'], function($) {
    var controlView = function (model, controller, $element) {
        $('<span id="play"><a href="#" class="btn btn-small"><i class="icon-play" id="playSymbol"></i></a></span> <span id="stop"><a href="#" class="btn btn-small"><i class="icon-stop"></i></a></span>').appendTo($element);
        this.model = model;
        this.controller = controller;
        var that = this;

        $('#play').on('click', function(e) {
        	that.controller.togglePlay();
            //that.model.playSong();
        });
        $('#stop').on('click', function(e) {
        	that.render();
            that.model.stopSong();
        });       
        $(this.model).on('PlayState', function(e) {
            that.render();
        });
    };
    
    controlView.prototype.render = function () {
		var state = this.model.getPlayState();
		if(state == 'PLAYING') {
			$('#playSymbol').addClass('icon-pause');
			$('#playSymbol').removeClass('icon-play');
		}
		else if(state == 'PAUSING') {
			$('#playSymbol').removeClass('icon-pause');
			$('#playSymbol').addClass('icon-play');
		}
	};
    return controlView;
});
