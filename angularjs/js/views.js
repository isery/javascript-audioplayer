playerApp.directive('myCurrentTime', [function() {
	return {
		restrict: 'A',
		link: function ($scope, element, attrs) {
			dragSrcEl= 0;
			var domElement = element.html();
			function handleDragStart(e) {
				e.target.style.opacity = '0.4';
    			dragSrcEl = e.target;
	        }
	        function handleDragEnter(e) {
				if(dragSrcEl.id>=e.target.id)  {
        			e.target.classList.add('over');
			    }
			    else {
			        e.target.classList.add('under');
    			}
	        }
	        //Todo:
	        function handleDragOver(e) {
				if (e.preventDefault) {
			        e.preventDefault(); // Necessary. Allows us to drop.
			    }

			    return false;
	        }
	        function handleDragLeave(e) {
				e.target.classList.remove('under');  // this / e.target is previous target element.
    			e.target.classList.remove('over');  // this / e.target is previous target element.

	        }
	        function handleDrop(e) {
				// this/e.target is current target element.
			    if (e.stopPropagation) {
			        e.stopPropagation(); // Stops some browsers from redirecting.
			    }
			    // Don't do anything if dropping the same column we're dragging.
			    if (dragSrcEl != e.target && e.target.id != '') {
			    	$scope.$parent.reOrder(dragSrcEl.id,e.target.id)
			    }
			    e.target.classList.remove('over');
        		e.target.classList.remove('under');
			    return false;
	        }
	        function handleDragEnd(e) {
				e.target.style.opacity = '1.0';
	        }
	        element.bind('dragstart', handleDragStart);
	        element.bind('dragenter', handleDragEnter);
	        element.bind('dragover', handleDragOver);
	        element.bind('dragleave', handleDragLeave);
	        element.bind('drop', handleDrop);
	        element.bind('dragend', handleDragEnd);
		}
	};
}]);

playerApp.directive('myProgress', [function() {
	return {
		restrict: 'A',
		link: function ($scope, element, attrs) {
        	var progressslider = $('.prog').slider("hslider");
        	$('.input_value').hide();
        	$('.input_min').hide();
        	$('.input_max').hide();
        	$('.input_step').hide();

        	$scope.$watch('duration', function() {
        		$('.prog>.input_max').val($scope.duration);
            	$('.prog>.input_max').trigger('change');
        	});
        	$scope.$watch('progress', function() {
        		progressslider[0].setValue($scope.progress,true);
        	});
        	$(progressslider).on('change',function(e) {
	            var fullseconds = $('.prog>.thumb>.output_top>.value_output').html();
	            var seconds = Math.floor(fullseconds%60);
	            var minute =   Math.floor(fullseconds/60);
	            if(seconds<10) seconds = '0'+seconds;
	            var time = minute+':'+seconds;
	            if(!isNaN(seconds) || !isNaN(minute)) $('.prog>.thumb>.output_top>.value_output').html(time);
        	});
        	$(progressslider[0]).on('track', function(e) {
	            $scope.pause();
	            var value = progressslider[0].getValue();
	            $scope.setTrackPos(value);
	            $scope.togglePlay();
	        });
	        $(progressslider[0]).on('thump', function(e){
	            $scope.pause();
	        });
	        $(progressslider[0]).on('thumpup', function(e){
	            var value = progressslider[0].getValue();
	            $scope.setTrackPos(value);
	            $scope.togglePlay();
	        });
		}
	};
}]);

playerApp.directive('myVolume', [function() {
	return {
		restrict: 'A',
		link: function ($scope, element, attrs) {
			var slider = $('.slider').slider("hslider");
			$('.input_value').hide();
        	$('.input_min').hide();
        	$('.input_max').hide();
        	$('.input_step').hide();
        	var currentVolume = $('.value_output');
        	$('#volume>.input_value').val($scope.volume);
            $('#volume>.input_value').trigger('change');
			currentVolume.on('change', function (e) {
	            var val = currentVolume.html();
	            $scope.$apply(function() {
	            	$scope.volume=val;
		        });
			});
		}
	};
}]);

