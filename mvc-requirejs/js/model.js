define(['jQuery', 'tracklist'], function($,tracklist) {
	var PlayerModel = function (draggable) {
        this.draggable = draggable;
		this._tracks = tracklist.tracks;
        for(var i in this._tracks) {
            this._tracks[i].id = i;
        }
        this._playState = 0;
        this._trackProgress = 0;
        this._trackDuration = 0;
        this._volume = 0;
        this._activeTrackID = 0;

		this.events = {
			CHANGE:'change'
		};
        this.audio = new Audio();
        this.audio.src = this._tracks[this._activeTrackID].url;
        this.audio.autoplay = false;
        this.audio.controls = true;
        this.audio.preload = 'none';
        var that = this;

        //ProgressView



        this.audio.addEventListener('loadstart', function(e) {
            that.playSong();
        });

        this.audio.addEventListener('loadeddata', function(e) {
            //console.log('loadeddata');
            //audio.currentTime = 200;
        });
        this.audio.addEventListener('durationchange', function(e) {
            //console.log('durationchange: ' + Math.floor(that.audio.duration/60)+' : '+Math.floor(that.audio.duration%60));
            //now we know our duration
            that._trackDuration=that.audio.duration;
            $(that).trigger('durationchange');
        });

        this.audio.addEventListener('timeupdate', function(e) {
            //playhead position changed
            var state = that.getPlayState();
            if(state=='PLAYING') {
                //console.log('timeupdate: ' + that.audio.currentTime);
                $(that).trigger('progress');
            }


        });
        this.audio.addEventListener('ended', function(e) {
            //playhead reached end of audio file
            //console.log('endSong');
            that.setActiveTrackID(parseInt(that._activeTrackID)+1);
            that.setPlayState('PAUSING');
            $(that).trigger('progress');
            $(that).trigger('endofsong');
        });
        this.audio.addEventListener('progress', function(e) {
            if(that.audio.buffered.length) {
                //console.log('progress, buffer end: ' + (that.audio.buffered.end(that.audio.buffered.length-1)) + ", length: " + that.audio.buffered.length);
            } else {
                //console.log('no progress');
            }
        });

        this.audio.addEventListener('volumechange', function(e) {
            //console.log('volumechange: ' + that.audio.volume);
        });

        this.audio.addEventListener('loadedmetadata', function(e) {
            //console.log('loadedMetaData');
        });

        this.audio.addEventListener('play', function(e) {
            console.log('clicked');
            that.setPlayState('PLAYING');
            $(that).trigger('update');
        });

        this.audio.addEventListener('playing', function(e) {
            //console.log('playing');
        });
        this.audio.addEventListener('pause', function(e) {
            that.setPlayState('PAUSING');
        });

        this.audio.addEventListener('canplay', function(e) {
            //console.log('canplay'); //initial: audio now can be played
        });
	};

    PlayerModel.prototype.setDragabble = function (element) {
        this.test = new this.draggable(element);
        that = this;
        $(this.test).on('reorder', function(e,array) {
          //  console.log(that._tracks);
            var test = that._activeTrackID;
            var order = [];
           for(var i in that._tracks) {
               for(var j in array) {
                    if(that._tracks[i].id==array[j]) {
                        //console.log(that._tracks[i].id);
                        if(that._tracks[i].id==test) {
                            //console.log(that._tracks[i].title);
                            //console.log('setActive: '+i);
                            that._activeTrackID = parseInt(i);
                        }
                        order.push(j);

                    }
               }
            }
            for(var i in that._tracks) {
                that._tracks[i].id = order[i];

            }
            that._activeTrackID = that._tracks[that._activeTrackID].id;
            $(that).trigger('endofsong');
        });
    };

	PlayerModel.prototype.playSong = function () {
        //console.log('loadstart: ' + this.audio.src);
        //this.audio.src=this.getTrackByID(this._activeTrackID);
        this.audio.play();
	};

	PlayerModel.prototype.pauseSong = function () {
    	this.audio.pause();
        this.setPlayState('PAUSING');
	};

	PlayerModel.prototype.stopSong = function () {
		this.audio.pause();
        this.audio.currentTime = 0;
	};

    PlayerModel.prototype.playNext = function () {
        this.audio.play();
    };

	PlayerModel.prototype.setTrackPos = function (pos) {
        //console.log('time: '+pos);
        this.audio.currentTime = pos;
	};

    PlayerModel.prototype.getTracks = function () {
        //console.log(this._tracks);
        return this._tracks;
    };

    PlayerModel.prototype.setTrack = function (track) {
        this._tracks.push(track);
    };

    PlayerModel.prototype.getPlayState = function () {
        return this._playState;
    };

    PlayerModel.prototype.setPlayState = function (state) {
        this._playState = state;
        $(this).trigger('PlayState');
    };

    PlayerModel.prototype.getTrackProgress = function () {
        return this.audio.currentTime;
    };

    PlayerModel.prototype.setTrackProgress = function (progress) {
        this._trackProgress = progress;
    };

    PlayerModel.prototype.getTrackDuration = function () {
        return this._trackDuration;
    };

    PlayerModel.prototype.setTrackDuration = function (duration) {
        this._trackDuration = duration;
    };

    PlayerModel.prototype.getVolume = function () {
        return this._volume;
    };

    PlayerModel.prototype.setVolume = function (volume) {
        this._volume = volume;
        this.audio.volume = this._volume;
    };

    PlayerModel.prototype.getActiveTrackID = function () {
        return this._activeTrackID;
    };

    PlayerModel.prototype.setActiveTrackID = function (id) {
        this._activeTrackID = parseInt(id);
        if(this._activeTrackID>=this._tracks.length) {
        	this._activeTrackID = 0;
            var trackOne = this.getTrackByID(this._activeTrackID);
            //this.audio.src = trackOne.url;
            this.setTrackPos(0);
        	$(this).trigger('update'); //weil trigger nur im play ist
            $(this).trigger('endofsong');

        }
        else {
             for(var i in this._tracks) {
                if(this._tracks[i].id == this._activeTrackID) {
                    this.audio.src = this._tracks[i].url;
                }
             }
        }
        console.log('setter: '+this._activeTrackID);
    };

    PlayerModel.prototype.getTrackByID = function (id) {
        for(var i in this._tracks) {
            if(this._tracks[i].id==id) {
                var ret = this._tracks[i];
            }
        }
        return ret;
    };

    PlayerModel.prototype.getIDforPos = function (id) {
        for(var i in this._tracks) {
            if(this._tracks[i].id==id) {
                var ret = this._tracks[i].id;
            }
        }
        return ret;
    };

	return PlayerModel;
});
