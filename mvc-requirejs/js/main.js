require.config({
	baseUrl: "js",
	waitSeconds: 15,
	
	paths: {
		'jQuery': '../vendor/jquery-1.9.1.min',
        'bootstrap': '../vendor/bootstrap/js/bootstrap.min.js',
        'handlebar' : '../vendor/handlebar'
	},
	shim: {
		'jQuery': {
			exports: '$'
		}
	}
});
require(['jQuery', 'model', 'controller', 'draggable', 'handlebar',
	'views/ControlView', 'views/ProgressView', 'views/TrackListView', 'views/TrackInfoView', 'views/VolumeView'],

	function($, PlayerModel, PlayerController, draggable, handlebar, ControlView, ProgressView, TrackListView, TrackInfoView, VolumeView) {
        var draggableList = draggable;
		var model = new PlayerModel(draggableList);
		var controller = new PlayerController(model);

		var controlView = new ControlView(model, controller, $('#controlView'));
        var progressView = new ProgressView(model, $('#progressView'));
        var trackListView = new TrackListView(model, $('#trackListView'));
        var trackInfoView = new TrackInfoView(model, $('#trackInfoView'));
        var volumeView = new VolumeView(model, $('#volumeView'));


});