"use strict";

var controlPanel = (function () {

	var currentVideo;

	function init() {
		currentVideo = document.getElementById('p-current-video');		
	}

	function play() {
		currentVideo.play();
	}

	function pause() {
		currentVideo.pause();
	}

	function rewind() {
		currentVideo.currentTime = 0;
	}

	function volume(volume) {
		
		if(!volume)
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



	return {
		init: init,
		play: play,
		pause: pause,
		rewind: rewind,
		volume: volume,
		ended: ended,
		fullscreen: setFullscreen
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

