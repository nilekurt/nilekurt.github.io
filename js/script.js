$.getScript("/js/GameEngine.js")

var JSTest = JSTest || {};

$(function()
{
	var animFrame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		null ;

	var canvasElement = $('#screen');
	
	var Engine = new JSTest.GameEngine(canvasElement, animFrame.bind(window));
	
	canvasElement.addEventListener('mousedown', Engine.start.bind(Engine));
}
);
