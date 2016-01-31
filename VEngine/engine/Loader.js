//Файл участвует в запуске и "сшивании" кода

var _FILES = [ //Пути к активным файлам ядра и приложения (тут бегает парсер)
    //Мозги движка (партия)
    "Utils.js",
    "libs/PerlinLib.js",
    "libs/StackBlur.js",
    "Debug.js",
    "Structs.js",
    "Screen.js",
    "Graphics.js",
    "GameObject.js",
    "GUI.js",
    "Time.js",
    "Input.js",
    "Assets.js",
    "Game.js",
    "Scene.js",
    "Engine.js",
    "Noise.js",
    "PlayerPrefs.js",
    "Web.js",
    "GraphicsBuffer.js",
    "Physics.js",
    "Light.js",
    "",
    "",
    "",
    "",
    "",
    "",

    //Файлы приложения (пролы)
    "game/Application.js",
    "game/auto/Base64Files.js",
    "",
    "",
    "",
    "",
    "",

    //Файлы сцен (пролы)
    "game/scenes/MenuScene.js",
    "game/scenes/GameplayScene.js",
    "game/scenes/StarterScene.js",
    "game/scenes/DevScene.js",
    "",
    "",
    "",
    "",
    "",
    "",

    //Игровые скрипты (пролы)
    "game/scripts/GameConfig.js",
    "game/scripts/TestScript.js",
    "game/scripts/MenuScript.js",
    "game/scripts/GameCameraScript.js",
    "game/scripts/WorldScript.js",
    "game/scripts/UserData.js",
    "game/scripts/WebData.js",
    "game/scripts/CameraFollowScript.js",
    "game/scripts/PlayerScript.js",
    "game/scripts/GameScript.js",
    "game/scripts/SkyScript.js",
    "",
    "",
    "",
    "",
    "",
    "",

    //Запуск движка (партия)
    "Launcher.js",
];


Loader = new function () { //Загрузчик движка

    var FileIndex = 0;

    function LoadFile(src, onload) { //Асинхронно загружаем вскрипт на сторону вёрстки
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = src;
        s.onload = function () {
            onload();
            console.log("Load: " + src);
        };

        var preScript = document.getElementsByTagName("script")[0]; //Ищем в верстке самый первый скрипт
        preScript.parentNode.insertBefore(s, preScript); //Вставляем перед ним (а больше никак)
    }

    function LoadFiles() { //Метод загрузки 2.0
        if (Loader.FileIndex > _FILES.length - 1) return;
        var FilePath = _FILES[Loader.FileIndex];

        if (FilePath != "") {
            Loader.LoadFile(FilePath, function () {
                Loader.LoadFiles();
            });
        }

        Loader.FileIndex++;

        if (FilePath == "") Loader.LoadFiles();
    }

    /*function LoadFiles() { //Метод загрузки 1.0
        for (var i = 0; i < _FILES.length; i++) {
            if (_FILES[i] != "") Loader.LoadFile(_FILES[i]);
        }
    }*/
    //
    return {
        FileIndex: FileIndex,
        LoadFile: LoadFile,
        LoadFiles: LoadFiles,
    }
}();

Loader.LoadFiles();