define(['jQuery'], function($) {
	var PlayerController = function (model) {
		this.model = model;
	};

	PlayerController.prototype.togglePlay = function () {	
		var state = this.model.getPlayState();
		if(state == 'PLAYING') {
			this.model.pauseSong();
		}
		else if(state == 'PAUSING') {
			this.model.playSong();
		}
	};

	return PlayerController;
});
