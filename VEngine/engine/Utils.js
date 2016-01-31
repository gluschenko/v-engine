//Расширение строк
String.prototype.Insert = function (ix, rem, s) {
    return (this.slice(0, ix) + s + this.slice(ix + Math.abs(rem)));
};

String.prototype.Cut = function (start, end) {
    return (this.substr(0, start) + this.substr(end, this.length));
};

//Дополнение к объектам (используется в PlayerPrefs)
Object.prototype.HasKey = function (k) {
    return this[k] != null;
};

Object.prototype.Set = function (k, data) {
    return this[k] = data;
};

Object.prototype.Get = function (k, alt) {
    if (!alt) alt = "";
    if (this.HasKey(k)) return this[k];
    return alt;
};

//Дополнение массивов
Array.prototype.Remove = function (index) {
    if (index > -1) {
        this.splice(index, 1);
    }
};

Array.prototype.RemoveObj = function (obj) {
    var index = this.indexOf(obj);
    this.Remove(index);
};

//Дополение матана
Math.Lerp = function (a, b, ratio) { //Линейная интерполяция (linear interpolation)
    return a + ((b - a) * ratio);
}

Math.Slerp = function (a, b, ratio) { //То же самое, но с поправкой на ветер
    if (!ratio) ratio = 1;
    return Math.Lerp(a, b, Time.deltaTime * ratio);
}

//Рандом
Math.RandomRange = function (a, b) {
    //return Math.floor(Math.floor(Math.random() * (b - a + 1)) + a); - СЛОЖНА, ТАКОЕ ТОЛЬКО НА ЕГЭ!!!11

    var rnd = Math.random();
    return Math.round(Math.Lerp(a, b, rnd));
}

Math.FloatRandomRange = function(a, b) {
    //return (Math.random() * (b - a + 1) + a); - ТОЖЫ ОЧИНЬ СЛОЖНА

    var rnd = Math.random();
    return Math.Lerp(a, b, rnd);
}


//Функции из Sunrise Engine
function Write(id, val) {
    Find(id).innerHTML = val;
}

function WriteForward(id, val) {
    Find(id).innerHTML = val + Find(id).innerHTML;
}

function WriteEnd(id, val) {
    Find(id).innerHTML += val;
}

function Clear(id) {
    Write(id, "");
}

function Find(id) {
    var obj = document.getElementById(id);
    return obj;
}

function Hide(id) {
    if (document.getElementById(id)) {
        document.getElementById(id).style.display = "none";
    }
}

function Show(id, visible_param) {
    if (!visible_param) var visible_param = "block";

    if (document.getElementById(id)) {
        document.getElementById(id).style.display = visible_param;
    }
}

function Hidden(id) {
    if (Find(id).style.display == "none") return true;
    return false;
}

function SetVisibility(id, state, visible_param) {
    if (!visible_param) var visible_param = "block";

    if (state) {
        Show(id, visible_param);
    }
    else {
        Hide(id);
    }
}

function Exists(id) {
    if (document.getElementById(id)) return true;
    return false;
}

function ReplaceDisplayStatus(first, second) {
    var firstStatus = Find(first).style.display;
    var secondStatus = Find(second).style.display;

    Find(first).style.display = secondStatus;
    Find(second).style.display = firstStatus;
}

function ToJSON(data) {
    return JSON.stringify(data);
}

function FromJSON(data) {
    return JSON.parse(data);
}

//

