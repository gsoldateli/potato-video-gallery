"use strict";

var controlPanel = (function () {

	var currentVideo,
		menuContainer,
		playerControls,
		currentTime,
		baloon,
		seekbarBackground,
		seekbarProgress,
		seekbarPosition,
		seekbarLoading,
		totalTime;

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
		baloon = document.querySelector('.p-baloon');
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

		_initTitle();

	}

	function _initTitle() {
		var elTitles = document.querySelectorAll('[data-title]');

		elTitles.forEach(function (el, i) {
		    // código...
		    el.addEventListener('mouseover', function() {
	    		_showTitle(el);
		    });
			
			el.addEventListener('mouseout', _hideTitle );

		    console.log(i, el);
		});
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
		volume === undefined ? currentVideo.volume : (currentVideo.volume = volume);
		return currentVideo.volume;
	}

	function ended(fn) {
		_addCallback('ended', fn);
	}

	function setFullscreen() {
		if (currentVideo.requestFullscreen) {
			currentVideo.requestFullscreen();
			return;
		} 
		
		if (currentVideo.mozRequestFullScreen) {
			currentVideo.mozRequestFullScreen();
			return;
		} 
		
		if (currentVideo.webkitRequestFullscreen) {
			currentVideo.webkitRequestFullscreen();
			return;
		}		
	}

	function _addCallback(callback, fn) {
		currentVideo.addEventListener(callback, fn, false);
	}

	function _playPause() {

		currentVideo.paused ? play() : pause();
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

	function _showTitle(el) {
		//Display block must be here, otherwise baloonRect.width will be 0
		baloon.innerHTML = el.dataset.title;
		html.addClass(baloon,'p-baloon--active');

		var seekRect = _getBackgroundSeekerRect();
		var baloonRect = baloon.getBoundingClientRect();

		var titleXpos = (el.offsetLeft - (baloonRect.width/2.8));

		titleXpos = _protectBoundaries(titleXpos);

		

		baloon.style.left = titleXpos + 'px';
		
	}

	function _hideTitle() {
		html.removeClass(baloon,'p-baloon--active');
	}

	function _protectBoundaries(xPos) {
		var seekRect = _getBackgroundSeekerRect();
		//xPos += baloon.offsetWidth;
		//console.log(xPos,baloon.offsetWidth);
		//If extreme left of the player
		if(xPos <= 0 )
		{
			//Fix position at left
			xPos = 0;
		}
		//Or extreme right of the player
		else if( xPos >= (seekRect.width - (baloon.offsetWidth)) ) {
			//Fix position at right
			xPos = (seekRect.width - (baloon.offsetWidth));
		}

		return xPos;		
	}

	function _showTimeBaloon(e) {
		var posPercent = _calculateCursorPercentage(e);
		var seekRect = _getBackgroundSeekerRect();

		var baloonXpos = e.clientX - seekRect.left - (baloon.offsetWidth/2);
		
		baloonXpos = _protectBoundaries(baloonXpos);

		baloon.style.left = baloonXpos+'px';


		baloon.innerHTML = (_readableTime((currentVideo.duration / 100) * posPercent));
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

		volume(inputValue / 100);

		if(parseInt(inputValue) === 0) {
			buttons.volumeToggle.innerHTML = 'volume_off';
			buttons.volumeToggle.dataset.title =
			baloon.innerHTML = "Turn On";
			return;
		}
		else if(inputValue < 50) {
			buttons.volumeToggle.innerHTML = 'volume_down';
			buttons.volumeToggle.dataset.title =
			baloon.innerHTML = "Turn Off";
			return;
		}
		else {
			buttons.volumeToggle.innerHTML = 'volume_up';
			buttons.volumeToggle.dataset.title =
			baloon.innerHTML = "Turn Off";
			return;
		}
	}

	function _toggleSound() {
		(parseInt(volume()) > 0) ? (buttons.volume.value = 0) : (buttons.volume.value =100);
		_setVolume();
	}

	function _registerButtons() {
		buttons.playPause = document.querySelector("#p-play-pause-button");
		buttons.playPause.addEventListener('click', _playPause );
		
		buttons.volume = document.querySelector("#p-audio-range-input");
		buttons.volume.addEventListener("mousemove", _setVolume );
		
		buttons.volumeToggle = document.querySelector("#p-audio-toggle-button");
		buttons.volumeToggle.addEventListener('click', _toggleSound );
		buttons.fullscreen = document.querySelector("#p-button-fullscreen");
		buttons.fullscreen.addEventListener('click', setFullscreen );
		buttons.settingToggle = document.querySelector(".p-setting-toggle");
		
		buttons.settingToggle.addEventListener('click', function() {
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



