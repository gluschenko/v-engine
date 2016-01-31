Web = new function () {

    function CreateXMLHTTP() { //Скроссбраузерный костыль на случай атомной войны (со всякими IE 6)
        var xmlhttp;

        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {
                xmlhttp = false;
            }
        }

        if (!xmlhttp && typeof XMLHttpRequest != "undefined")
        {
            xmlhttp = new XMLHttpRequest();
        }

        return xmlhttp;
    }

    //Британские учёные напоминают, что между доменами не работает (внутри одной машины и/или домена всё работает)
    function Request(type, url, message, success, error) {
        if (!success) success = function (data) { console.log(data); }; //Полиморфим коллбеки (templates of callbacks)
        if (!error) error = function (error) { console.log("XHR error: " + error); };
        //
        if (type != "POST" && type != "GET") return;

        var POSTData = null;

        if (type == "POST") {
            POSTData = message.ToURL();
        }

        if(type == "GET"){
            url += "?" + message.ToURL();
        }

        //
        var XHR = Web.CreateXMLHTTP(); //Создаем объект для запросов (заточено под Ишаки, но тестировать лень)

        XHR.open(type, url, true); //true возможно, когда-нибудь ударит граблями по затылку

        if (type == "POST") XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        XHR.onreadystatechange = function () {
            if (XHR.readyState == 4) { //Ловим момент, когда запрос совершён, а ответ от машины получен
                if (XHR.status == 200) {
                    success(XHR.responseText); //Ко-ко-ко, всё получилось
                }
                else {
                    error(XHR.statusText); //Не фортануло (петлю сюда не вешаем, т.к. можно уронить сервер)
                }
            }

        };

        XHR.send(POSTData);//Пыщ!
    }


    //
    return {
        CreateXMLHTTP: CreateXMLHTTP,
        Request: Request,
    }
}();

function WWWForm(){
    this.data = new Object();
}

WWWForm.prototype.AddField = function (name, text) {
    this.data[name] = text;
};

WWWForm.prototype.ToURL = function () {
    var output = "";

    for (var key in this.data) {
        if (typeof this.data[key] != "function") {
            output += key + "=" + encodeURIComponent(this.data[key]) + "&";
        }
    }

    return output;
};