define(['jQuery'], function($) {
    var trackInfoView = function (model, $element) {

        this.model = model;
        this.element = $element;
        var that = this;
        this.render();

        $(this.model).on('update', function(e) {
            that.render();
        });
    };
    trackInfoView.prototype.render = function () {
        this.element.empty();
        this.currentTrack = this.model.getActiveTrackID();
        this.trackInfo = this.model.getTrackByID(this.currentTrack);
        $('<div class="row">').appendTo(this.element);
        $('<span class="label">Titel: '+this.trackInfo.title+'</span>'+'<span class="label">'+' Album: '+this.trackInfo.album+'</span>').appendTo(this.element);
        $('</div>').appendTo(this.element);
        $('<div class="row">').appendTo(this.element);
        $('<span class="label"> Artist: '+this.trackInfo.artist + '</span>'+'<span class="label">'+' Genre: '+this.trackInfo.genre+'</span>').appendTo(this.element);
        $('</div>').appendTo(this.element);

    };
    return trackInfoView;
});

