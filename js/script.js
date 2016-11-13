
var JSTest = JSTest || {};

var importsLoaded = function()
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

$(function()
{
    $.getScript("js/GameEngine.js")
    .done(importsLoaded)
    .fail(
        function() {
            alert('Failed to load import!');
            }
    );
};
