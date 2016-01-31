/*var Screen = {
    width: 0,
    height: 0,
    fullscreen: false,
};
*/

Screen = new function () {

    var width = 0;
    var height = 0;

    var initialWidth = 0;
    var initialHeight = 0;

    var fullscreen = false;

    window.addEventListener("fullscreenchange", onFullScreenChange, false);
    window.addEventListener("webkitfullscreenchange", onFullScreenChange, false);
    window.addEventListener("mozfullscreenchange", onFullScreenChange, false);

    function onFullScreenChange(event) {
        var Monitor = Screen.getMonitorSize();
        //var isFullscreen = (Engine.Canvas.width == Monitor.x) && (Engine.Canvas.height == Monitor.y);

        if (!Screen.fullscreen) {
            Screen.initialWidth = Engine.Canvas.width;
            Screen.initialHeight = Engine.Canvas.height;

            Screen.width = Engine.Canvas.width = Monitor.x;
            Screen.height = Engine.Canvas.height = Monitor.y;

            Screen.fullscreen = true;
        }
        else {
            Screen.width = Engine.Canvas.width = Screen.initialWidth;
            Screen.height = Engine.Canvas.height = Screen.initialHeight;

            Screen.fullscreen = false;
        }

        Engine.SetupContext();//Видимо, надо
    }

    function toggleFullscreen() {
        if (!Screen.fullscreen) {
            if (Engine.Canvas.webkitRequestFullScreen) {
                Engine.Canvas.webkitRequestFullScreen();
            }
            else if (Engine.Canvas.mozRequestFullScreen) {
                Engine.Canvas.mozRequestFullScreen();
            }
            else if (Engine.Canvas.requestFullScreen) {
                Engine.Canvas.requestFullScreen();
            }
        }
        else {
            if (document.webkitRequestFullScreen) {
                document.webkitRequestFullScreen();
            }
            else if (document.mozRequestFullScreen) {
                document.mozRequestFullScreen();
            }
            else if (document.requestFullScreen) {
                document.requestFullScreen();
            }
        }
    }

    function getMonitorSize() {
        var x = screen.width;
        var y = screen.height;

        return new Vector2(x, y);
    }
    //
    return {
        width: width,
        height: height,
        initialWidth: initialWidth,
        initialHeight: initialHeight,
        fullscreen: fullscreen,
        toggleFullscreen: toggleFullscreen,
        getMonitorSize: getMonitorSize,
    };
}();