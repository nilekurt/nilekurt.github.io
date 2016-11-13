
var JSTest = JSTest || {};
JSTest.GameEngine = JSTest.GameEngine || {};

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

    var Engine = new JSTest.GameEngine(canvasElement, animFrame.bind(window));

    Engine.start();
}

// MAIN
$(function()
{
    $.getScript("js/GameEngine.js")
    .done(
        function() {
            var JSTest.GameEngine.loadResources = JSTest.GameEngine.loadResources || (function() {});
            JSTest.GameEngine.loadResources(importsLoaded);
        }
    )
    .fail(
        function() {
            alert('Failed to load import!');
            }
    );
}
);
