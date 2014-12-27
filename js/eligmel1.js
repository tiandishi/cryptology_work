/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var pow = Math.pow,
    floor = Math.floor;

//曲线上的点
function point(x, y){
    if(!(this instanceof point))
        return new point(x, y);

    if(x == Infinity && y == Infinity)
        this.inf = true;
    else
        this.inf = false;

    this.x = x;
    this.y = y;
}

/*
 * 曲线类
 * 
 *参数 a b 和 素数 fp
 * 
 */

function curve(A, B, Fp){
    if (!(this instanceof curve))
        return new curve(A, B, Fp);

    this.A  = A;
    this.B  = B;
    this.Fp = Fp;
}


curve.prototype.contains = function(p){
    return this.mod((p.y*p.y), this.Fp) == this.mod(((p.x*p.x*p.x) + this.A*p.x + this.B), this.Fp);
}

/*
 * 取模运算
 * 
 */

curve.prototype.mod = function(a, b){
    return (((a % b) + b) % b);
}

/*
 * 最大公约数
 */

curve.prototype.gcd = function(a, b){
    while(b != 0){
        var t = b;
        b = this.mod(a, b);
        a = t;
    }
    return a;
}

/*
 * 计算
 *
 * ax - by = gcd(a, b) = 1
 *
 * @returns {Integer[]} [x, -y]
 */

curve.prototype.ext_gcd = function(a, b){
    var lx = 0, ly = 1,
        x  = 1, y  = 0;

    while(b !== 0){
        var r = this.mod(a, b),
            q = (a - r) / b,
            tmpx = x,
            tmpy = y;

        x = lx - (q*x);
        lx = tmpx;

        y = ly - (q*y);
        ly = tmpy;

        a = b;
        b = r;
    }

    return [ly, lx];
}

/*
 * Computes the solution to equations
 * of the form
 *
 * a/b = x (mod p)
 *
 * where a, b are given and p = Fp.
 *
 * @param {Integer} a
 * @param {Integer} b
 *
 * @returns {Integer} x
 *
 * @public
 */

curve.prototype.mod_inv = function(a, b){
    var res = this.ext_gcd(b, this.Fp),
        dis = res[1],
        x   = (a - (this.Fp*dis*a)) / b;

    return this.mod(x, this.Fp);
}

/*
 * Subtracts two points on the curve.
 *
 * See mod_add below for a description of the
 * algorithm.
 *
 * @param {Point} a
 * @param {Point} b
 *
 * @returns {Point} a - b
 *
 * @api public
 */

curve.prototype.mod_sub = function(a, b){
    return this.mod_add(a, point(b.x, -b.y));
}

/*
 * Adds two points on the curve.
 *
 * @param {Point} a
 * @param {Point} b
 *
 * @returns {Point} a + b
 *
 * @api public
 */

curve.prototype.mod_add = function(a, b){
    if(b.inf) return a;
    if(a.inf) return b;

    var x1 = a.x,
        x2 = b.x,
        y1 = a.y,
        y2 = b.y;

    if((x1 == x2) && (y1 == -y2))
        return point(Infinity, Infinity);

    if((x1 == x2) && (y1 == y2)){
        var lambda = this.mod_inv((3*(pow(x1, 2))) + this.A, 2*y1)
    } else {
        var lambda = this.mod_inv((y2 - y1), (x2 - x1));
    }

    var x3 = this.mod(((pow(lambda, 2)) - x1 - x2), this.Fp);
    var y3 = this.mod(((lambda*(x1 - x3)) - y1), this.Fp);

    return point(x3, y3);
}

/*
 * Adds a point on the curve, P,
 * to itself n times.
 *
 * This has been implemented using the Double-and-Add
 * algorithm.
 *
 * @param {Point} p
 * @param {Integer} n
 *
 * @returns {Point} q = np
 *
 * @api public
 */

curve.prototype.mod_mult = function(p, n){
    var q = p,
        r = point(Infinity, Infinity);

    while(n > 0){
        if(n % 2 == 1)
            r = this.mod_add(r, q);

        q = this.mod_add(q, q);
        n = floor(n / 2);
    }

    return r;
}


//  
function elgamel(curve, point, key){
    if(!(this instanceof elgamel))
        return new elgamel(curve, point, key);

    this.ec = curve;
    this.point = point;
    this.key = key;
}

/*
 * Computes the public key based on the private key.
 *
 * @returns {Point} public key
 *
 * @api public
 */

elgamel.prototype.computePublicKey = function(){
    return this.ec.mod_mult(this.point, this.key);
}

/*
 * Encrypts a point using a public key.
 *
 * The callback returns the ciphertext as it's
 * first parameter.
 *
 * @param {Point} plaintext
 * @param {Point} pub_key
 * @param {Function} callback
 *
 * @returns {Point} ciphertext
 *
 * @api public
 */

elgamel.prototype.encrypt = function(plaintext, pub_key, callback){
    var self = this,
        curve = self.ec;
          var  k = 13;
      var c1 = curve.mod_mult(self.point, k),
            c2 = curve.mod_add(plaintext, curve.mod_mult(pub_key, k));     
            console.log("密文c1");
            console.log(c1);
            console.log("密文c2");
            console.log(c2);
        return callback(point(c1, c2));
  
}

/*
 * Decrypts a point using the given private key.
 *
 * @param {Point} ciphertext
 *
 * @returns {Point} plaintext
 *
 * @api public
 */

elgamel.prototype.decrypt = function(ciphertext){
    var c1 = ciphertext.x,
        c2 = ciphertext.y,
        curve = this.ec;

    return curve.mod_sub(c2, curve.mod_mult(c1, this.key));
}



var curve = curve(13, 22, 23),
    s_pt  = point(10, 5);

var alice = elgamel(curve, s_pt, 7),
    alice_pub = alice.computePublicKey();
    console.log("公钥");
    console.log(alice_pub);

var bob = elgamel(curve, s_pt, 7),
    bob_pub = bob.computePublicKey(),
    message = point(11, 1);
    console.log("加密点");
    console.log(message);
   

bob.encrypt(message, alice_pub, function(ciphertext){
    //console.log(ciphertext);
    var plaintext = alice.decrypt(ciphertext);
    console.log("解密信息");
    console.log(plaintext);
    //console.log(message);
});

