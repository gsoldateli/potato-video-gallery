"use strict";

var controlPanel = (function () {

	var currentVideo;
	var playerControls;
	var currentTime;
	var totalTime;

	var buttons = {};
	function currentVideo() {
		return currentVideo;
	}
	function init() {
		currentVideo = document.getElementById('p-current-video');	
		totalTime = document.getElementById('p-total-time');
		currentTime = document.getElementById('p-current-time');
		playerControls = document.querySelector('.p-player__controls');	

		_registerButtons();
		buttons.volume.value = volume() * 100;

		
		//Register event that tracks timeupdate changes during the video
		currentVideo.addEventListener('timeupdate',_changeTime);

		//Set Html Total Time Number accordingly to the video
		currentVideo.addEventListener('playing',function() {
			totalTime.innerHTML = _readableTime(currentVideo.duration);
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

	function _changeTime(e) {
		
		currentTime.innerHTML = _readableTime(currentVideo.currentTime);
	}

	function _updateTimeDisplay() {
        var timePercent = (100 / currentVideo.duration) * currentVideo.currentTime;
        barSeeker.value = timePercent;
        barProgress.value = timePercent;
    };

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
	}

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


