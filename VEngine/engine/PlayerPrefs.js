//Общий сток рабочих данных
//Задача приложения: опечпечить хранение данных (в PP3-2016-01a хранение осуществаляется на сервере через N-Proto)

PlayerPrefs = new function () {

    var Data = new Object(); //Все ключи здесь

    function SetData(JSONdata) {
        try{
            PlayerPrefs.Data = JSON.parse(JSONdata);
        }
        catch(e){
            console.log("PlayerPrefs.SetData - Error: " + JSONdata);
        }
    }

    function GetData() {
        return JSON.stringify(PlayerPrefs.Data);
    }

    function HasKey(k) {
        return PlayerPrefs.Data.HasKay(k);
    }

    function Set(k, data) {
        return PlayerPrefs.Data.Set(k, data);
    }

    function Get(k, alt) {
        return PlayerPrefs.Data.Get(k, alt);
    }

    //
    return {
        Data: Data,
        SetData: SetData,
        GetData: GetData,
        HasKey: HasKey,
        Set: Set,
        Get: Get,
    }
}();