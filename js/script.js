
var JSTest = JSTest || {};

var Engine;

// DO ACTUAL STUFF
var importsLoaded = function()
{
    var animFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        null ;

    var canvasElement = $('#screen')[0];

    Engine = new JSTest.GameEngine(canvasElement, animFrame.bind(window));

    Engine.start();
}

// MAIN
$(function()
{
	$.when(
            $.getScript('js/GameStates.js'),
            $.getScript('js/GameEngine.js')
        )
	.done(importsLoaded)
	.fail(
		function()
		{
			alert('Failed to load import!');
		}
	);
}
);
