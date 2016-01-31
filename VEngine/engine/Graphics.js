Graphics = new function () {

    function Render() {
        Graphics.Clear();
        //
        Time.calcDeltaTime();
        //

        if (SceneData) {
            Graphics.setBackground(SceneData.background);

            SceneData.mainCamera = SceneData.getMainCamera();
            
            if (SceneData.mainCamera) {
                Graphics.DrawGameObjects();
            }
            else {
                Debug.Log("No camera");
            }

            //
            Engine.Update();
            Graphics.Update();
        }
        //
        var WaitTime = 15 * (Graphics.FPS / 70);
        //if (Graphics.FPS < 40) WaitTime = 1;
        //
        setTimeout(function () { Graphics.Render(); }, WaitTime);

        //RenderInterval = setInterval(function () { Graphics.Render(); clearInterval(RenderInterval); }, 15);
    }

    //

    var FPSCount = 0;
    var FPS = 0;
    var FPSLoop = setInterval(function () { Graphics.UpdateFPS(); }, 500);

    function UpdateFPS() {
        this.FPS = this.FPSCount * 2;
        this.FPSCount = 0;
    }

    var PixelsPerMeter = 50; //1 метр - 50 точек

    //

    function Update() {
        this.FPSCount++;
        //
        if (Debug.FPSEnabled) {
            GUI.Label(new Rect(10, 10, 0, 0), this.FPS + " FPS (" + (Time.deltaTime * 1000) + " ms)", GUI.customSkin.freeLabel);

            var AssetsStatus = Assets.GetStatus();
            if (AssetsStatus.loaded != AssetsStatus.all) {
                GUI.Label(new Rect(10, 30, 0, 0), "Assets: " + AssetsStatus.loaded + "/" + AssetsStatus.all, GUI.customSkin.freeLabel);
            }
        }
    }

    function DrawGameObjects() { //Перебирает массив игровых объектов в порядке возрастания слоя
        var layers = new Array(100);

        for (var i = 0; i < SceneData.GameObjects.length; i++) {
            
            var gol = SceneData.GameObjects[i].layer;

            if (!layers[gol]) layers[gol] = [];

            layers[gol][layers[gol].length] = SceneData.GameObjects[i];
        }

        for (var j = 0; j < layers.length; j++) {
            if (!layers[j]) continue;

            for (var i = 0; i < layers[j].length; i++) {
                var GO = layers[j][i];

                Graphics.DrawGameObject(layers[j][i]);

            }
        }
    }

    function DrawGameObject(GO) { //Рисует игровой объект на холсте
        GO.Apply();

        //var globalActive = IGameObject.getGlobalActive(GO);
        var layerVisible = GO.layer <= SceneData.mainCamera.layer;

        //
        var cameraScale = SceneData.mainCamera.camera.scale;
        var MeterPixRatio = Graphics.PixelsPerMeter * cameraScale;
        //
        /*var globalPos = IGameObject.getParentRotatedPosition(GO);
        var globalRotaion = IGameObject.getGlobalRotation(GO);
        var globalScale = IGameObject.getGlobalScale(GO);*/

        var parentRotation = GO.globalRotation - GO.rotation;
        //
        /*GO.globalPosition = globalPos;
        GO.globalRotation = globalRotaion;
        GO.globalScale = globalScale;*/
        //

        var deltaPos = new Vector2(0, 0);
        deltaPos.x = GO.globalPosition.x - SceneData.mainCamera.globalPosition.x;
        deltaPos.y = GO.globalPosition.y - SceneData.mainCamera.globalPosition.y;

        var screenPos = new Vector2(0, 0);
        screenPos.x = deltaPos.x * MeterPixRatio;
        screenPos.y = -deltaPos.y * MeterPixRatio;

        var screenScale = new Vector2(0, 0);
        screenScale.x = GO.globalScale.x * MeterPixRatio;
        screenScale.y = GO.globalScale.y * MeterPixRatio;

        var offsetPos = new Vector2(0, 0);
        offsetPos.x = screenScale.x * GO.offset.x;
        offsetPos.y = screenScale.y * GO.offset.y;

        //
        var finalPosition = new Vector2(Screen.width / 2 + screenPos.x, Screen.height / 2 + screenPos.y);
        finalPosition = Vector2.RotateAround(finalPosition, new Vector2(Screen.width / 2, Screen.height / 2), SceneData.mainCamera.globalRotation);
        //
        GO.screenPosition = finalPosition;
        //
        var finalRotation = GO.globalRotaion - SceneData.mainCamera.globalRotation;
        var cotextRot = -finalRotation * (Math.PI / 180); //Объявление отдельной переменной убирает сдвиг шириной в атом.

        if (GO.globalActive && layerVisible) {
            var DrawingRect = new Rect(0 - offsetPos.x, 0 - offsetPos.y, screenScale.x, screenScale.y);
            var DefactoRect = new Rect(finalPosition.x - offsetPos.x, finalPosition.y - offsetPos.y, screenScale.x, screenScale.y);

            if (DefactoRect.isVisible()) {
                Engine.Context.translate(finalPosition.x, finalPosition.y);
                Engine.Context.rotate(cotextRot);
                //
                if (GO.spriteAlpha < 1) Engine.Context.globalAlpha = GO.spriteAlpha;

                var DirectionFactorX = GO.globalScale.x > 0 ? 1 : -1; //Направление рисования спрайта
                var DirectionFactorY = GO.globalScale.y > 0 ? 1 : -1;

                Engine.Context.scale(DirectionFactorX, DirectionFactorY);

                if (GO.visible) {
                    if (GO.sprite) {
                        GUI.DrawTexture(DrawingRect, GO.sprite, GO.clip);
                    }
                }

                Engine.Context.scale(DirectionFactorX, DirectionFactorY);

                if (GO.spriteAlpha < 1) Engine.Context.globalAlpha = 1;
                //
                if (Debug.boundsEnabled) { //Трассировка контура спрайта
                    GUI.DrawFrame(DrawingRect, "#ff0");
                    GUI.DrawBox(new Rect(-3, -3, 6, 6), 0, "#ff0");
                    GUI.Label(new Rect(0, 0, 100, 30), GO.name, GUI.customSkin.freeLabel);
                }
                //
                Engine.Context.rotate(-cotextRot);
                Engine.Context.translate(-finalPosition.x, -finalPosition.y);
                //

                if (Debug.collidersEnabled) { //Трассировка коллайдера (шик и блеск)
                    for (var i = 0; i < GO.rigidbody.globalCollider.length; i += GO.collider.step) {

                        for (var p = 0; p < GO.collider.step; p++) {
                            var A = GO.rigidbody.globalCollider[i + p];
                            var B = GO.rigidbody.globalCollider[i + 0];

                            if (p < GO.collider.step - 1) B = GO.rigidbody.globalCollider[i + p + 1];

                            //
                            A = SceneData.mainCamera.camera.WorldToScreen(A);
                            B = SceneData.mainCamera.camera.WorldToScreen(B);

                            GUI.DrawLine(A, B, "#00f");
                        }
                    }
                }
            }
        }
    }

    //

    function setBackground(color) {
        if (Engine.isRunning) {
            Engine.Context.fillStyle = color;
            Engine.Context.fillRect(0, 0, Screen.width, Screen.height);
        }
    }

    function Clear() {
        Engine.Context.clearRect(0, 0, Screen.width, Screen.height);
    }

    

    //
    return {
        Render: Render,
        FPSCount: FPSCount,
        FPS: FPS,
        UpdateFPS: UpdateFPS,
        PixelsPerMeter: PixelsPerMeter,
        Update: Update,
        DrawGameObjects: DrawGameObjects,
        DrawGameObject: DrawGameObject,
        setBackground: setBackground,
        Clear: Clear,
    }
}();