function Vector2(x, y) {
    this.x = x;
    this.y = y;
}

Vector2.Zero = new Vector2(0, 0);
Vector2.Up = new Vector2(0, 1);
Vector2.Down = new Vector2(0, -1);
Vector2.Left = new Vector2(-1, 0);
Vector2.Right = new Vector2(1, 0);

Vector2.prototype.Normalize = function () { //Нормализует вектор (данная магия не доказана)
    var len = Math.sqrt(this.x * this.x + this.y * this.y);
    if (len == 0) return new Vector2(0, 0);

    return new Vector2(this.x / len, this.y / len);
};

Vector2.Scalar = function (a) {
    return Math.sqrt(a.x * a.x + a.y * a.y);
};

Vector2.Angle = function (first, second) { //Угол между точками
    var X1 = first.x;
    var Y1 = first.y;
    var X2 = second.x;
    var Y2 = second.y;

    var A = Math.atan2(Y2 - Y1, X2 - X1) * (180 / Math.PI);
    A = (A < 0) ? A + 360 : A;

    return A;
};

Vector2.Rotate = function (Input, degAngle) { //Поворот вектора
    var A = degAngle * (Math.PI / 180);
    var x = Input.x;
    var y = Input.y;

    var rx = (x * Math.cos(A)) - (y * Math.sin(A));
    var ry = (x * Math.sin(A)) + (y * Math.cos(A));

    return new Vector2(rx, ry);
};

Vector2.RotateAround = function (Input, Base, degAngle) { //Поворот вектора вокруг точки
    var delta = new Vector2(Input.x - Base.x, Input.y - Base.y);
    var rotDelta = Vector2.Rotate(delta, degAngle);

    return new Vector2(Base.x + rotDelta.x, Base.y + rotDelta.y);
};

Vector2.Distance = function (a, b) { //Дистанция между векторами
    var vx = b.x - a.x;
    var vy = b.y - a.y;

    return Math.abs(Math.sqrt(vx * vx + vy * vy));
};

Vector2.AngleBetween = function (v, a, b) { //Геометрический угол
    //Нормализуем вектора
    var ax = a.x - v.x;
    var ay = a.y - v.y;
    var bx = b.x - v.x;
    var by = b.y - v.y;
    //
    var s = (ax * bx) + (ay * by); //Скалярное произведение

    var ma = Math.sqrt(ax * ax + ay * ay);
    var mb = Math.sqrt(bx * bx + by * by);
    var m = ma * mb;

    var angle = 0;
    if (m > 0) angle = Math.acos(s / m) * (180 / Math.PI);

    return angle;
};

Vector2.Lerp = function (first, second, ratio) {
    var x = Math.Lerp(first.x, second.x, ratio);
    var y = Math.Lerp(first.y, second.y, ratio);

    return new Vector2(x, y);
};

Vector2.Slerp = function (first, second, ratio) {
    var x = Math.Slerp(first.x, second.x, ratio);
    var y = Math.Slerp(first.y, second.y, ratio);

    return new Vector2(x, y);
};

Vector2.Delta = function (a, b) {
    return new Vector2(a.x - b.x, a.y - b.y);
};

//

function Matrix2(x, y) {
    this.x = x;
    this.y = y;
    this.length = x * y;
    this.data = null;
    //
    this.data = new Array(x);
    for (var i = 0; i < this.data.length; i++) {
        this.data[i] = new Array(y);
    }
}

Matrix2.prototype.get = function (x, y, alt) {

    if (this.data[x]) {
        if (this.data[x][y]) {

            return this.data[x][y];
        }
    }
    return alt;


    /*if(this.data[x][y]){ - было вот так, а потом мне не понравилось
        return this.data[x][y];
    }
    return alt;*/
};

Matrix2.prototype.set = function (x, y, obj) {
    this.data[x][y] = obj;
};

//

function Color4(r, g, b, a) {
    if (r < 0) r = 0;
    if (g < 0) g = 0;
    if (b < 0) b = 0;
    if (a < 0) a = 0;

    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    if (a > 1) a = 1;
    //
    this.r = r; //Красный
    this.g = g; //Зелёный
    this.b = b; //Голубой
    this.a = a; //Альфа-канал
}

Color4.prototype.toString = function () {
    return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
};

Color4.toRGBA = function (hex) {
    //Где-то взято
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result)
    {
        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);

        return new Color4(r, g, b, 1);
    }

    return false;

    /*return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;*/
};

Color4.Lerp = function (a, b, ratio) {
    var red = Math.round(Math.Lerp(a.r, b.r, ratio));
    var green = Math.round(Math.Lerp(a.g, b.g, ratio));
    var blue = Math.round(Math.Lerp(a.b, b.b, ratio));
    var alpha = Math.Lerp(a.a, b.a, ratio);

    return new Color4(red, green, blue, alpha);
};