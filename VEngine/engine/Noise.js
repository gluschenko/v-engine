Noise = new function () {

    
    //
    return {


    }
}();

function PerlinNoise(seed) {
    this.seed = seed;
    this.scale = 10;
}

PerlinNoise.prototype.Init = function () {
    Perlin.seed(this.seed);
}

PerlinNoise.prototype.getValue = function (n) {
    this.Init();
    return Perlin.perlin2(n / this.scale, 0);
}

PerlinNoise.prototype.getValue2 = function (x, y) {
    this.Init();
    return Perlin.perlin2(x / this.scale, y / this.scale);
}