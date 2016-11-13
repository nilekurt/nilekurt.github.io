$.getScript("/js/GameEngine.js",
function( data, textStatus, jqxhr ) {
  console.log( data ); // Data returned
  console.log( textStatus ); // Success
  console.log( jqxhr.status ); // 200
  console.log( "Load was performed."); 
}
);

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
