"use strict";

var controlPanel = (function () {

	var currentVideo;
	var playerControls;

	var buttons = {};

	function init() {
		currentVideo = document.getElementById('p-current-video');	
		playerControls = document.querySelector('.p-player__controls');	

		_registerButtons();
		buttons.volume.value = volume() * 100;
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

	function _setVolume() {
		var inputValue = buttons.volume.value;
		console.log(inputValue);
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
		if(buttons.volume.value > 0 ) {
			_setVolume(0);
		} else {
			_setVolume(1);
		}
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
		setFullscreen: setFullscreen
	};

})();


function potatoInit() {
	controlPanel.init();
	controlPanel.ended(function(){ alert('Terminou')});
}

//https://download.blender.org/peach/bigbuckbunny_movies/
//https://mainline.i3s.unice.fr/mooc/week2p1/video2.mp4
//https://mainline.i3s.unice.fr/mooc/week2p1/video3.mp4
//https://mainline.i3s.unice.fr/mooc/week2p1/video4.mp4

