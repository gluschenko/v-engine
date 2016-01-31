Debug = new function () {

    var enabled = true;
    var FPSEnabled = true;
    var boundsEnabled = false;
    var collidersEnabled = false;

    function Log(text) { //"Официальные" логи движка
        if (Debug.enabled) console.log(Engine.projectName + " -> " + text);
    }

    function Trace(obj) { //Трассировка
        if (Debug.enabled) console.log(obj);
    }

    //
    return {
        enabled: enabled,
        FPSEnabled: FPSEnabled,
        boundsEnabled: boundsEnabled,
        collidersEnabled: collidersEnabled,
        Log: Log,
        Trace: Trace,
    }
}();