"use strict";

var controlPanel = (function () {

	var currentVideo;
	var menuContainer;
	var playerControls;
	var currentTime;
	var timeBaloon;
	var seekbarBackground;
	var seekbarProgress;
	var seekbarPosition;
	var seekbarLoading;
	var totalTime;

	var buttons = {};
	function currentVideo() {
		return currentVideo;
	}
	function init() {
		currentVideo = document.getElementById('p-current-video');	
		menuContainer = document.querySelector('.p-config-menu-container');
		seekbarProgress = document.querySelector('.p-seekbar-progress');
		seekbarLoading = document.querySelector('.p-seekbar-loading');
		seekbarBackground = document.querySelector('.p-seekbar-background');
		seekbarPosition = document.querySelector('.p-seekbar-position');
		totalTime = document.getElementById('p-total-time');
		currentTime = document.getElementById('p-current-time');
		timeBaloon = document.querySelector('.p-time-baloon');
		playerControls = document.querySelector('.p-player__controls');	


		_registerButtons();
		buttons.volume.value = volume() * 100;

		
		//Register event that tracks timeupdate changes during the video
		currentVideo.addEventListener('timeupdate', _changeTime);

		//Set Html Total Time Number accordingly to the video
		currentVideo.addEventListener('playing', _renderTotalTime);
		
		seekbarBackground.addEventListener('click', _goToMoviePosition);
		seekbarBackground.addEventListener('mousemove', _showTimeBaloon);
		seekbarBackground.addEventListener('mousemove', _updateSeekbarPosition);

		currentVideo.addEventListener('progress', _updateSeekbarLoading);

	}

	function play() {
		currentVideo.play();
		buttons.playPause.innerHTML = 'pause';
	}

	function pause() {
		currentVideo.pause();
		buttons.playPause.innerHTML = 'play_arrow';
	}

	function rewind() {
		currentVideo.currentTime = 0;
	}

	function volume(volume) {
		
		if(volume === undefined )
		{
			return currentVideo.volume;
		}

		currentVideo.volume = volume;
		
	}

	function ended(fn) {
		_addCallback('ended', fn);
	}

	function setFullscreen() {
		if (currentVideo.requestFullscreen) {
			currentVideo.requestFullscreen();
		} 
		else if (currentVideo.mozRequestFullScreen) {
			currentVideo.mozRequestFullScreen();
		} 
		else if (currentVideo.webkitRequestFullscreen) {
			currentVideo.webkitRequestFullscreen();
		}		
	}

	function _addCallback(callback, fn) {
		currentVideo.addEventListener(callback, fn, false);
	}

	function _playPause() {
		if( currentVideo.paused ) {
			play();
		}
		else {
			pause();
		}
	}

	function _calculateCursorPercentage(e) {
		var rect = _getBackgroundSeekerRect();
		var x = e.clientX - rect.left;
		return (x / rect.width ) * 100;		
	}

	function _goToMoviePosition(e) {
		var posPercent = _calculateCursorPercentage(e);
		seekbarProgress.style.width = posPercent + '%';
		currentVideo.currentTime = (currentVideo.duration / 100) * posPercent;
	}
	
	function _getBackgroundSeekerRect() {
		return seekbarBackground.getBoundingClientRect();
	}


	function _showTimeBaloon(e, xOffset, yOffset) {
		var posPercent = _calculateCursorPercentage(e);
		var seekRect = _getBackgroundSeekerRect();
		var baloonXpos = e.clientX - seekRect.left - (timeBaloon.offsetWidth/2);
		

		//If extreme left of the player
		if(baloonXpos <= 0 )
		{
			//Fix position at left
			baloonXpos = 0;
		}
		//Or extreme right of the player
		else if( baloonXpos >= (seekRect.width - (timeBaloon.offsetWidth)) ) {
			//Fix position at right
			baloonXpos = (seekRect.width - (timeBaloon.offsetWidth));
		}

		timeBaloon.style.left = baloonXpos+'px';


		timeBaloon.innerHTML = (_readableTime((currentVideo.duration / 100) * posPercent));
	}

	function _changeTime(e) {
		
		currentTime.innerHTML = _readableTime(currentVideo.currentTime);

		_updateSeekbarProgress();
	}

	function _renderTotalTime() {
		totalTime.innerHTML = _readableTime(currentVideo.duration);
	}

	function _updateTimeDisplay() {
        var timePercent = (100 / currentVideo.duration) * currentVideo.currentTime;
    };

    function _updateSeekbarProgress() {
        var timePercent = (100 / currentVideo.duration) * currentVideo.currentTime;
        seekbarProgress.style.width = timePercent + '%';
    }

    /* TODO: Implement Y threshold for usability improvement */
    function _updateSeekbarLoading() {
		    var range = 0;
		    var bf = this.buffered;
		    var time = this.currentTime;

		    while(!(bf.start(range) <= time && time <= bf.end(range))) {
		        range += 1;
		    }
		    var loadStartPercentage = bf.start(range) / this.duration;
		    var loadEndPercentage = bf.end(range) / this.duration;
		    var loadedPercent = loadEndPercentage * 100;
		    seekbarLoading.style.width = loadedPercent + '%';
	}

    function _updateSeekbarPosition(e) {
        var percentage = _calculateCursorPercentage(e);
        seekbarPosition.style.width = percentage+ '%';

    }	

	function _readableTime(t) {
        var theMinutes = "0" + Math.floor(t / 60); // Divide seconds to get minutes, add leading zero
        var theSeconds = "0" + parseInt(t % 60); // Get remainder seconds
        var theTime = theMinutes.slice(-2) + ":" + theSeconds.slice(-2); // Slice to two spots to remove excess zeros
        return theTime;
    };    

	function _setVolume() {
		var inputValue = buttons.volume.value;
		if(parseInt(inputValue) === 0) {
			buttons.volumeToggle.innerHTML = 'volume_off';
		}
		else if(inputValue < 50) {
			buttons.volumeToggle.innerHTML = 'volume_down';
		}
		else {
			buttons.volumeToggle.innerHTML = 'volume_up';
		}

		volume(inputValue / 100);
	}

	function _toggleSound() {

		if ( parseInt(volume()) > 0 ) {
			buttons.volume.value = 0;
		} else {
			buttons.volume.value =100;
			
		}
		_setVolume();
		
	}

	function _registerButtons() {
		buttons.playPause = document.querySelector("#p-play-pause-button");
		buttons.playPause.addEventListener('click',function(){ _playPause()} );
		
		buttons.volume = document.querySelector("#p-audio-range-input");
		buttons.volume.addEventListener("mousemove", function(){ _setVolume(); });
		
		buttons.volumeToggle = document.querySelector("#p-audio-toggle-button");
		buttons.volumeToggle.addEventListener('click',function(){ _toggleSound()} );
		buttons.fullscreen = document.querySelector("#p-button-fullscreen");
		buttons.fullscreen.addEventListener('click',function(){ setFullscreen()} );
		buttons.settingToggle = document.querySelector(".p-setting-toggle");
		
		buttons.settingToggle.addEventListener('click', function(){
			html.toggleClass(this, 'active');
			html.toggleClass(menuContainer, 'active');
		});

	}

	var html = {
		
		hasClass: function(element, cls) {
			return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
		},

		addClass: function(element, cls) {
			element.className += ' '+ cls + ' ';
		},

		removeClass: function(element, cls) {

		    var newClassName = "";
		    var i;
		    var classes = element.className.split(" ");
		    for(i = 0; i < classes.length; i++) {
		        if(classes[i] !== cls) {
		            newClassName += classes[i] + " ";
		        }
		    }
		    element.className = newClassName;
		},

		toggleClass: function(element, cls ) {
			if( this.hasClass(element,cls) ) {
				this.removeClass(element, cls);
			}
			else {
				this.addClass(element, cls);	
			}

		}

	};



	return {
		init: init,
		play: play,
		pause: pause,
		rewind: rewind,
		volume: volume,
		ended: ended,
		setFullscreen: setFullscreen,
		video: currentVideo
	};

})();


function potatoInit() {
	controlPanel.init();
	controlPanel.ended(function(){ alert('Terminou')});
}

window.onload = function() {
	potatoInit();
}

//https://download.blender.org/peach/bigbuckbunny_movies/
//https://mainline.i3s.unice.fr/mooc/week2p1/video2.mp4
//https://mainline.i3s.unice.fr/mooc/week2p1/video3.mp4
//https://mainline.i3s.unice.fr/mooc/week2p1/video4.mp4



