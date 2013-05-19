define(['jQuery', 'handlebar'], function($, handlebar) {
    var trackListView = function (model, $element) {
        this.model = model;
        this.tracklist = this.model.getTracks();
        this.element = $element;
        this.render();
        this.update();
        this.model.setDragabble('.column');
        var that = this;
        $(this.model).on('endofsong', function(e) {
            that.update();
        });
        //console.log(handlebar);
    };

    trackListView.prototype.render = function () {
        this.element.empty();
        this.activeTrack = this.model.getActiveTrackID();
        $ul = $('<ul class="nav nav-pills nav-stacked">')
        $ul.appendTo(this.element);
        for(var track in this.tracklist) {
            if(track == this.activeTrack) {
                $('<li class="column" id="'+this.tracklist[track].id+'" draggable="true"><span class="label label-success trackList" id="'+this.tracklist[track].id+'">'+this.tracklist[track].title+'</span></li>').appendTo($ul);
            }
            else {
                $('<li class="column" id="'+this.tracklist[track].id+'" draggable="true"><span class="label trackList" id="'+this.tracklist[track].id+'">'+this.tracklist[track].title+'</span></li>').appendTo($ul);
            }
        }
        $('</ul>').appendTo(this.element);


    };

    trackListView.prototype.update = function() {
        var list = this.model.getTracks();
        var activeTrack = this.model.getActiveTrackID();
        console.log('activeTracklistview: '+activeTrack);
        var that = this;
        for(var i in list) {
            for(var track in list) {
                if(i == list[track].id) {
                    //console.log(i +' : '+list[track].title)

                    $('.column#'+i).empty();

                    if(i == activeTrack) {
                        $('.column#'+i).html('<span class="label label-success trackList" id="'+list[track].id+'">'+list[track].title+'</span>');
                    }
                    else {

                         $('.column#'+i).html('<span class="label trackList" id="'+list[track].id+'">'+list[track].title+'</span>');
                    }
                }
            }

        }
        $('.trackList').dblclick(function(e) {
            e.preventDefault();
            console.log(this);
            //console.log(this.getIDforPos(this.id));
            that.model.setActiveTrackID(parseInt(this.id));
            that.update();
        });

    };


    return trackListView;
});

