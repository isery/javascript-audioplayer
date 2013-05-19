playerApp.controller('PlayerCtrl', ['$scope', '$http', function($scope, $http) {
	
    //===== public attribute ===== 

    $scope.activeTrack = 0;
    $scope.playState = false;
    $scope.shuffleActive = false;
    $scope.shuffleList = [];
    $scope.shuffleIndex = 0;
    $scope.volume = 0.9;
    $scope.duration = 0;
    $scope.progress = 0;
    //this flag helps to prevent that timeupdate will be called after pausing the player
    var playFlag = true;

    //===== public methods ===== 

    //could have used a setVolume method and call it from the view
    //wanted to try this 
    $scope.$watch('volume',function() {
        audioEl.volume = $scope.volume;
    });

    $scope.stop = function() {
	   audioEl.pause();
	   audioEl.currentTime = 0;
	};
    $scope.setTrackPos = function(pos) {
        audioEl.currentTime = pos;
    };

	$scope.pause = function() {
        playFlag = false;
	   audioEl.pause();
	};
	$scope.togglePlay = function() {
        playFlag = true;
        if($scope.playState) {
            audioEl.pause();
        }
        else {
            audioEl.play();   
        }
	}
    $scope.setActiveTrack = function(index) {
        $scope.activeTrack = index;
        audioEl.src = $scope.tracks[$scope.activeTrack].url; 
    }

    $scope.shuffle = function() {
        $scope.shuffleActive = !$scope.shuffleActive;
        $scope.shuffleIndex = 0;
        if($scope.shuffleActive) {
            console.log($scope.shuffleList);
            $scope.shuffleList=_.shuffle($scope.shuffleList);
            console.log($scope.shuffleList);
        }

    }

    $scope.reOrder = function(source,target) {
        var start = parseInt(source);
        var end = parseInt(target);
        if ($scope.activeTrack>start && $scope.activeTrack<end)
            $scope.activeTrack--;
        else if ($scope.activeTrack<start && $scope.activeTrack>end)
            $scope.activeTrack++;
        else if ($scope.activeTrack==start)
            $scope.activeTrack=end;
        else if ($scope.activeTrack==end)
            $scope.activeTrack=start; 
        if(start>end) {
            for(var i = start; i>end;i--) {
                mySwap(i,i-1);
            }
        }
        else {
            for(var i = start; i<end;i++) {
                mySwap(i,i+1);
            }
        }
    }

    //===== call right away ===== 

	$http.get('assets/tracklist.json').then(function(res) {
	   	$scope.tracks = res.data.tracks;
		audioEl.src = $scope.tracks[$scope.activeTrack].url;  
        for (var i = 0; i < $scope.tracks.length; i++) {
                    $scope.shuffleList[i]=i;
                };    
    });

    //==== private ======
	
	var audioEl = new Audio();
	audioEl.autoplay = true;
    audioEl.controls = true;
    audioEl.preload = 'none';
    audioEl.volume = $scope.volume;
    audioEl.style.width = '1000px'; //only debug
    window.document.body.appendChild(audioEl);
    audioEl.addEventListener('loadstart', function(e) {
    });

    audioEl.addEventListener('loadeddata', function(e) {

    });
    audioEl.addEventListener('durationchange', function(e) {
        $scope.$apply(function() {
            $scope.duration = audioEl.duration;
        });
    });

    audioEl.addEventListener('timeupdate', function(e) {
        if(playFlag) {
            $scope.$apply(function() {
                $scope.progress = audioEl.currentTime;
            });
        }
        
    });
    audioEl.addEventListener('ended', function(e) {
        nextSong();
        console.log('ended');
    });
    audioEl.addEventListener('progress', function(e) {
        
    });

    audioEl.addEventListener('volumechange', function(e) {
        //console.log('volumechange: ' + audioEl.volume);
    });

    audioEl.addEventListener('loadedmetadata', function(e) {
        //console.log('loadedMetaData');
    });

    audioEl.addEventListener('play', function(e) {
        console.log('play');
        //this apply is necessary, otherwise playstate wont be uptodate in the view
        $scope.$apply(function(){
           $scope.playState = true; 
        });
    });

    audioEl.addEventListener('playing', function(e) {
    });
    audioEl.addEventListener('pause', function(e) {
    	console.log('pause');
        //this apply is necessary, otherwise playstate wont be uptodate in the view
        $scope.$apply(function(){
           $scope.playState = false; 
        });
    });

    audioEl.addEventListener('canplay', function(e) {
        //console.log('canplay'); //initial: audio now can be played
    });

    

    var myInc = function(index) {
        index++;
        if(index >= $scope.tracks.length) {
            return 0;
        }
        else {
            return index;
        }
    };

    var nextSong = function() {
        if($scope.shuffleActive) {
            $scope.shuffleIndex++;
            if($scope.shuffleIndex >= $scope.tracks.length) {
                //end of list
                $scope.shuffleIndex= 0;
                $scope.$apply(function(){ 
                    $scope.activeTrack = $scope.shuffleList[$scope.shuffleIndex];
                });
            }
            else {
                //next song with shuffle
                $scope.setActiveTrack($scope.shuffleList[$scope.shuffleIndex]);
            }
        }
        else {
            $scope.activeTrack++;
            if($scope.activeTrack >= $scope.tracks.length) {
                //end of list
                $scope.$apply(function(){
                    $scope.activeTrack= 0;
                });
            }
            else {   
                //next song no shuffle 
                $scope.setActiveTrack($scope.activeTrack);
            }    
        }
    };
    var mySwap = function(i,j) {
        var start = parseInt(i);
        var end = parseInt(j);
        var temp = $scope.tracks[start];
        $scope.$apply($scope.tracks[start] = $scope.tracks[end]);
        $scope.$apply($scope.tracks[end] = temp); 
    }

}]);