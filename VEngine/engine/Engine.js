Engine = new function () {

    var projectName = "V Engine";
    var projectVersion = "0.5";

    var Classes = [
        "",
    ]; //Настрочить (вот чё я хотел настрочить?)

    //

    var isRunning = false;
    var RenderLoop = null;

    var Canvas = null; //Объект основного холста
    var Context = null;
    var Buffer = null; //Объект буфера
    var BufferContext = null;

    function Run(canvasName, width, height) {
        if (this.isRunning) return;
        //
        Screen.width = width;
        Screen.height = height;

        this.Canvas = document.getElementById(canvasName);

        if (this.Canvas.getContext) { //Если поддерживается
            //
            this.Context = this.Canvas.getContext("2d");
            this.SetupContext();

            //Создаём буфер для пререндеринга графики
            this.Canvas.innerHTML = "<canvas id='buffer' width='10' height='10' style='display: none;'></canvas>";
            this.Buffer = document.getElementById("buffer");
            this.BufferContext = this.Buffer.getContext("2d");
            //

            Engine.Start();

            //
            this.isRunning = true;
        }
        else {
            this.Canvas.innerHTML = "<div>Canvas in not supported on your browser. Update it, please :)</div>";
            this.isRunning = false;
        }

    }

    function SetupContext() {
        this.Context.mozImageSmoothingEnabled = false;
        //this.Context.webkitImageSmoothingEnabled = false;
        this.Context.msImageSmoothingEnabled = false;
        this.Context.imageSmoothingEnabled = false;
    }

    function Start() {
        Input.Start();
        Game.Start();
        Graphics.Render();
    }

    function Update() {
        Game.Update();
        //
        Engine.OnGUI();
        //
        Engine.CallScripts("Update");
        //
        Engine.LateUpdate();
    }

    function LateUpdate() {
        Input.LateUpdate();
        Game.LateUpdate();
        Engine.CallScripts("LateUpdate");
    }

    function OnGUI() {
        GUI.Update();
        Engine.CallScripts("OnGUI");
    }

    function OnFocus() {
        Time.timeScaleEngine = 1;
    }

    function OnBlur() {
        Time.timeScaleEngine = 0;
    }

    function Call(obj, func) {
        if (obj[func]) {
            obj[func]();
            return true;
        }
        return false;
    }

    function CallScripts(func) {
        if (SceneData != null) {
            for (var i = 0; i < SceneData.GameObjects.length; i++) {
                var GO = SceneData.GameObjects[i];

                if (GO) {
                    for (var c in GO.components) {
                        Engine.Call(GO.components[c], func);
                    }
                }
            }
        }
    }

    return {
        projectName: projectName,
        projectVersion: projectVersion,
        isRunning: isRunning,
        RenderLoop: RenderLoop,
        Canvas: Canvas,
        Context: Context,
        Buffer: Buffer,
        BufferContext: BufferContext,
        Run: Run,
        SetupContext: SetupContext,
        Start: Start,
        Update: Update,
        LateUpdate: LateUpdate,
        OnGUI: OnGUI,
        OnFocus: OnFocus,
        OnBlur: OnBlur,
        Call: Call,
        CallScripts: CallScripts,
    };
}();

//Отлов событий окна
window.onload = function () {

    window.onblur = function () {
        Engine.OnBlur();

        return false;
    };

    window.onfocus = function () {
        Engine.OnFocus();

        return false;
    };

};