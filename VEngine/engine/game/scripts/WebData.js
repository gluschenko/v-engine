WebData = new function () {

    ReceiverUrl = "//likescope.ru/_vengine/receiver_1.php";

    function Call(act, params, response, fail) { //string, object, function, function
        var message = WebData.AuthForm(); //Берём шаблон для актового запроса
        message.AddField("act", act); //Привязываем имя серверной процедуры
        
        for (var key in params) {
            message.AddField(key, params[key]); //Аттачим к форме параметры задачи
        }

        Web.Request("POST", WebData.ReceiverUrl, message, response, fail); //Шлём AJAX-запросом в сторону ресивера
    }

    function AuthForm() { //Обязательно при любом запросе на ресивер
        var F = new WWWForm();

        F.AddField("id", GlobalUserData.Get("id", "")); //Глобальный ID
        F.AddField("platform", GlobalUserData.Get("platform", "")); //Платформа профиьного пространства
        F.AddField("token", GlobalUserData.Get("token", "")); //Ключ системы безопасности

        return F;
    }

    //
    return {
        ReceiverUrl: ReceiverUrl,
        Call: Call,
        AuthForm: AuthForm,
    }
}();