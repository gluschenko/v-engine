Time = new function () {

    var deltaTime = 0;
    var deltaTimeNormal = 0;

    var currentTime = 0;

    var timeScale = 1;
    var timeScaleEngine = 1; //Специальный множитель для управления со стороны движка

    function calcDeltaTime() {
        var date = new Date();
        //
        if (this.currentTime == 0) this.currentTime = date.getTime();

        var nowTime = date.getTime();
        //
        this.deltaTime = Math.abs(nowTime - this.currentTime) / 1000; //Вычислени дельты
        this.deltaTimeNormal = this.deltaTime; //Реальная дельта

        this.deltaTime *= this.timeScale * this.timeScaleEngine; //Перемножаем на временные масштабы
        this.currentTime = nowTime;
    }

    //
    return {
        deltaTime: deltaTime,
        deltaTimeNormal: deltaTimeNormal,
        currentTime: currentTime,
        timeScale: timeScale,
        timeScaleEngine: timeScaleEngine,
        calcDeltaTime: calcDeltaTime,
    }
}();