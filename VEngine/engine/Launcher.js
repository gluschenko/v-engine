//Точка запуска движка
//Исполняется в самую последнюю очередь

setTimeout(function () {
    Debug.Log("Startup!");
    //
    var DeviceObj = document.getElementById(Game.deviceID); //Холст
    //
    Engine.Run(Game.deviceID, DeviceObj.clientWidth, DeviceObj.clientHeight);
}, 250);


/*

«Factum est factum»

*/