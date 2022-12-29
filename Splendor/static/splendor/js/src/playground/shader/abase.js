let m3 = {
  projection: function (width, height) {
    // Note: This matrix flips the Y axis so that 0 is at the top.
    return [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ];
  },

  identity: function () {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
  },

  translation: function (tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  },

  rotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c, -s, 0,
      s, c, 0,
      0, 0, 1,
    ];
  },

  scaling: function (sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  },

  multiply: function (a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },
};

function get_matrix(gl, translation, rotation, scale, normal) {
  let matrix = m3.identity();
  if (!normal) {
    matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
  }
  matrix = m3.multiply(matrix, m3.translation(translation[0], translation[1]));
  matrix = m3.multiply(matrix, m3.rotation(rotation));
  matrix = m3.multiply(matrix, m3.scaling(scale[0], scale[1]));
  return matrix;
}

let W = 'W';
let B = 'B';
let I = 'I';
let R = 'R';
let G = 'G';
let O = 'O';
let GemColor2Index = { W: 0, B: 1, I: 2, R: 3, G: 4 };
let NSColor2Index = { W: 1, B: 2, I: 0, R: 4, G: 3 };
let TokenColor2Index = { W: 1, B: 2, I: 3, R: 4, G: 0, O: 5 };


let origin_nobles = [
  { "id": 41, "score": 3, "backIndex": [0, 0], "spend": [{ "color": "I", "need": 4 }, { "color": "R", "need": 4 }] },
  { "id": 42, "score": 3, "backIndex": [0, 1], "spend": [{ "color": "R", "need": 4 }, { "color": "G", "need": 4 }] },
  { "id": 43, "score": 3, "backIndex": [0, 2], "spend": [{ "color": "G", "need": 4 }, { "color": "B", "need": 4 }] },
  { "id": 44, "score": 3, "backIndex": [0, 3], "spend": [{ "color": "B", "need": 4 }, { "color": "W", "need": 4 }] },
  { "id": 45, "score": 3, "backIndex": [0, 4], "spend": [{ "color": "W", "need": 4 }, { "color": "I", "need": 4 }] },
  { "id": 46, "score": 3, "backIndex": [1, 0], "spend": [{ "color": "I", "need": 3 }, { "color": "R", "need": 3 }, { "color": "G", "need": 3 }] },
  { "id": 47, "score": 3, "backIndex": [1, 1], "spend": [{ "color": "R", "need": 3 }, { "color": "G", "need": 3 }, { "color": "B", "need": 3 }] },
  { "id": 48, "score": 3, "backIndex": [1, 2], "spend": [{ "color": "G", "need": 3 }, { "color": "B", "need": 3 }, { "color": "W", "need": 3 }] },
  { "id": 49, "score": 3, "backIndex": [1, 3], "spend": [{ "color": "B", "need": 3 }, { "color": "W", "need": 3 }, { "color": "I", "need": 3 }] },
  { "id": 410, "score": 3, "backIndex": [1, 4], "spend": [{ "color": "W", "need": 3 }, { "color": "I", "need": 3 }, { "color": "R", "need": 3 }] }
];


let origin_cards = {
  level1: [
    { "id": 11, "score": 1, "gem": "I", "backIndex": [1, 3], "spend": [{ "color": "B", "need": 4 }] }, { "id": 12, "score": 1, "gem": "R", "backIndex": [2, 2], "spend": [{ "color": "W", "need": 4 }] }, { "id": 13, "score": 1, "gem": "G", "backIndex": [4, 1], "spend": [{ "color": "I", "need": 4 }] }, { "id": 14, "score": 1, "gem": "B", "backIndex": [4, 1], "spend": [{ "color": "R", "need": 4 }] }, { "id": 15, "score": 1, "gem": "W", "backIndex": [4, 2], "spend": [{ "color": "G", "need": 4 }] }, { "id": 16, "score": 0, "gem": "G", "backIndex": [4, 2], "spend": [{ "color": "B", "need": 3 }, { "color": "G", "need": 1 }, { "color": "W", "need": 1 }] }, { "id": 17, "score": 0, "gem": "B", "backIndex": [3, 3], "spend": [{ "color": "G", "need": 3 }, { "color": "B", "need": 1 }, { "color": "R", "need": 1 }] }, { "id": 18, "score": 0, "gem": "W", "backIndex": [1, 3], "spend": [{ "color": "W", "need": 3 }, { "color": "I", "need": 1 }, { "color": "B", "need": 1 }] }, { "id": 19, "score": 0, "gem": "I", "backIndex": [1, 2], "spend": [{ "color": "R", "need": 3 }, { "color": "I", "need": 1 }, { "color": "G", "need": 1 }] }, { "id": 110, "score": 0, "gem": "R", "backIndex": [2, 3], "spend": [{ "color": "I", "need": 3 }, { "color": "R", "need": 1 }, { "color": "W", "need": 1 }] }, { "id": 111, "score": 0, "gem": "I", "backIndex": [3, 3], "spend": [{ "color": "B", "need": 2 }, { "color": "W", "need": 2 }, { "color": "R", "need": 1 }] }, { "id": 112, "score": 0, "gem": "R", "backIndex": [2, 2], "spend": [{ "color": "W", "need": 2 }, { "color": "I", "need": 2 }, { "color": "G", "need": 1 }] }, { "id": 113, "score": 0, "gem": "G", "backIndex": [2, 2], "spend": [{ "color": "I", "need": 2 }, { "color": "R", "need": 2 }, { "color": "B", "need": 1 }] }, { "id": 114, "score": 0, "gem": "B", "backIndex": [3, 1], "spend": [{ "color": "R", "need": 2 }, { "color": "G", "need": 2 }, { "color": "W", "need": 1 }] }, { "id": 115, "score": 0, "gem": "W", "backIndex": [3, 0], "spend": [{ "color": "G", "need": 2 }, { "color": "B", "need": 2 }, { "color": "I", "need": 1 }] }, { "id": 116, "score": 0, "gem": "I", "backIndex": [1, 4], "spend": [{ "color": "B", "need": 2 }, { "color": "W", "need": 1 }, { "color": "R", "need": 1 }, { "color": "G", "need": 1 }] }, { "id": 117, "score": 0, "gem": "R", "backIndex": [0, 0], "spend": [{ "color": "W", "need": 2 }, { "color": "I", "need": 1 }, { "color": "G", "need": 1 }, { "color": "B", "need": 1 }] }, { "id": 118, "score": 0, "gem": "G", "backIndex": [4, 1], "spend": [{ "color": "I", "need": 2 }, { "color": "R", "need": 1 }, { "color": "B", "need": 1 }, { "color": "W", "need": 1 }] }, { "id": 119, "score": 0, "gem": "B", "backIndex": [3, 3], "spend": [{ "color": "R", "need": 2 }, { "color": "G", "need": 1 }, { "color": "W", "need": 1 }, { "color": "I", "need": 1 }] }, { "id": 120, "score": 0, "gem": "W", "backIndex": [0, 1], "spend": [{ "color": "G", "need": 2 }, { "color": "B", "need": 1 }, { "color": "I", "need": 1 }, { "color": "R", "need": 1 }] }, { "id": 121, "score": 0, "gem": "G", "backIndex": [2, 0], "spend": [{ "color": "B", "need": 2 }, { "color": "R", "need": 2 }] }, { "id": 122, "score": 0, "gem": "B", "backIndex": [3, 2], "spend": [{ "color": "I", "need": 2 }, { "color": "G", "need": 2 }] }, { "id": 123, "score": 0, "gem": "W", "backIndex": [1, 0], "spend": [{ "color": "I", "need": 2 }, { "color": "B", "need": 2 }] }, { "id": 124, "score": 0, "gem": "I", "backIndex": [1, 1], "spend": [{ "color": "G", "need": 2 }, { "color": "W", "need": 2 }] }, { "id": 125, "score": 0, "gem": "R", "backIndex": [3, 1], "spend": [{ "color": "R", "need": 2 }, { "color": "W", "need": 2 }] }, { "id": 126, "score": 0, "gem": "I", "backIndex": [1, 1], "spend": [{ "color": "R", "need": 1 }, { "color": "G", "need": 1 }, { "color": "W", "need": 1 }, { "color": "B", "need": 1 }] }, { "id": 127, "score": 0, "gem": "R", "backIndex": [2, 4], "spend": [{ "color": "G", "need": 1 }, { "color": "B", "need": 1 }, { "color": "I", "need": 1 }, { "color": "W", "need": 1 }] }, { "id": 128, "score": 0, "gem": "G", "backIndex": [3, 1], "spend": [{ "color": "B", "need": 1 }, { "color": "W", "need": 1 }, { "color": "R", "need": 1 }, { "color": "I", "need": 1 }] }, { "id": 129, "score": 0, "gem": "B", "backIndex": [1, 0], "spend": [{ "color": "W", "need": 1 }, { "color": "I", "need": 1 }, { "color": "G", "need": 1 }, { "color": "R", "need": 1 }] }, { "id": 130, "score": 0, "gem": "W", "backIndex": [0, 2], "spend": [{ "color": "I", "need": 1 }, { "color": "R", "need": 1 }, { "color": "B", "need": 1 }, { "color": "G", "need": 1 }] }, { "id": 131, "score": 0, "gem": "G", "backIndex": [2, 3], "spend": [{ "color": "R", "need": 3 }] }, { "id": 132, "score": 0, "gem": "B", "backIndex": [2, 0], "spend": [{ "color": "I", "need": 3 }] }, { "id": 133, "score": 0, "gem": "W", "backIndex": [1, 0], "spend": [{ "color": "B", "need": 3 }] }, { "id": 134, "score": 0, "gem": "I", "backIndex": [0, 2], "spend": [{ "color": "G", "need": 3 }] }, { "id": 135, "score": 0, "gem": "R", "backIndex": [1, 2], "spend": [{ "color": "W", "need": 3 }] }, { "id": 136, "score": 0, "gem": "I", "backIndex": [4, 2], "spend": [{ "color": "G", "need": 2 }, { "color": "R", "need": 1 }] }, { "id": 137, "score": 0, "gem": "R", "backIndex": [2, 0], "spend": [{ "color": "B", "need": 2 }, { "color": "G", "need": 1 }] }, { "id": 138, "score": 0, "gem": "G", "backIndex": [2, 1], "spend": [{ "color": "W", "need": 2 }, { "color": "B", "need": 1 }] }, { "id": 139, "score": 0, "gem": "B", "backIndex": [1, 1], "spend": [{ "color": "I", "need": 2 }, { "color": "W", "need": 1 }] }, { "id": 140, "score": 0, "gem": "W", "backIndex": [0, 0], "spend": [{ "color": "R", "need": 2 }, { "color": "I", "need": 1 }] }
  ],
  level2: [
    { "id": 21, "score": 3, "gem": "I", "backIndex": [2, 3], "spend": [{ "color": "I", "need": 6 }] }, { "id": 22, "score": 3, "gem": "R", "backIndex": [1, 0], "spend": [{ "color": "R", "need": 6 }] }, { "id": 23, "score": 3, "gem": "G", "backIndex": [0, 3], "spend": [{ "color": "G", "need": 6 }] }, { "id": 24, "score": 3, "gem": "B", "backIndex": [3, 3], "spend": [{ "color": "B", "need": 6 }] }, { "id": 25, "score": 3, "gem": "W", "backIndex": [1, 1], "spend": [{ "color": "W", "need": 6 }] }, { "id": 26, "score": 2, "gem": "G", "backIndex": [0, 3], "spend": [{ "color": "G", "need": 3 }, { "color": "B", "need": 5 }] }, { "id": 27, "score": 2, "gem": "B", "backIndex": [4, 3], "spend": [{ "color": "B", "need": 3 }, { "color": "W", "need": 5 }] }, { "id": 28, "score": 2, "gem": "W", "backIndex": [1, 1], "spend": [{ "color": "I", "need": 3 }, { "color": "R", "need": 5 }] }, { "id": 29, "score": 2, "gem": "I", "backIndex": [1, 0], "spend": [{ "color": "R", "need": 3 }, { "color": "G", "need": 5 }] }, { "id": 210, "score": 2, "gem": "R", "backIndex": [4, 4], "spend": [{ "color": "W", "need": 3 }, { "color": "I", "need": 5 }] }, { "id": 211, "score": 2, "gem": "G", "backIndex": [3, 1], "spend": [{ "color": "G", "need": 5 }] }, { "id": 212, "score": 2, "gem": "B", "backIndex": [4, 2], "spend": [{ "color": "B", "need": 5 }] }, { "id": 213, "score": 2, "gem": "W", "backIndex": [2, 0], "spend": [{ "color": "R", "need": 5 }] }, { "id": 214, "score": 2, "gem": "I", "backIndex": [0, 2], "spend": [{ "color": "W", "need": 5 }] }, { "id": 215, "score": 2, "gem": "R", "backIndex": [0, 2], "spend": [{ "color": "I", "need": 5 }] }, { "id": 216, "score": 2, "gem": "I", "backIndex": [4, 1], "spend": [{ "color": "G", "need": 4 }, { "color": "R", "need": 2 }, { "color": "B", "need": 1 }] }, { "id": 217, "score": 2, "gem": "R", "backIndex": [3, 4], "spend": [{ "color": "B", "need": 4 }, { "color": "G", "need": 2 }, { "color": "W", "need": 1 }] }, { "id": 218, "score": 2, "gem": "G", "backIndex": [2, 4], "spend": [{ "color": "W", "need": 4 }, { "color": "B", "need": 2 }, { "color": "I", "need": 1 }] }, { "id": 219, "score": 2, "gem": "B", "backIndex": [0, 2], "spend": [{ "color": "I", "need": 4 }, { "color": "W", "need": 2 }, { "color": "R", "need": 1 }] }, { "id": 220, "score": 2, "gem": "W", "backIndex": [1, 0], "spend": [{ "color": "R", "need": 4 }, { "color": "I", "need": 2 }, { "color": "G", "need": 1 }] }, { "id": 221, "score": 1, "gem": "I", "backIndex": [4, 2], "spend": [{ "color": "G", "need": 3 }, { "color": "W", "need": 3 }, { "color": "I", "need": 2 }] }, { "id": 222, "score": 1, "gem": "R", "backIndex": [0, 0], "spend": [{ "color": "B", "need": 3 }, { "color": "I", "need": 3 }, { "color": "R", "need": 2 }] }, { "id": 223, "score": 1, "gem": "G", "backIndex": [4, 1], "spend": [{ "color": "W", "need": 3 }, { "color": "R", "need": 3 }, { "color": "G", "need": 2 }] }, { "id": 224, "score": 1, "gem": "B", "backIndex": [3, 1], "spend": [{ "color": "I", "need": 3 }, { "color": "G", "need": 3 }, { "color": "B", "need": 2 }] }, { "id": 225, "score": 1, "gem": "W", "backIndex": [4, 1], "spend": [{ "color": "R", "need": 3 }, { "color": "B", "need": 3 }, { "color": "W", "need": 2 }] }, { "id": 226, "score": 1, "gem": "G", "backIndex": [3, 4], "spend": [{ "color": "B", "need": 3 }, { "color": "W", "need": 2 }, { "color": "I", "need": 2 }] }, { "id": 227, "score": 1, "gem": "B", "backIndex": [2, 1], "spend": [{ "color": "R", "need": 3 }, { "color": "G", "need": 2 }, { "color": "B", "need": 2 }] }, { "id": 228, "score": 1, "gem": "W", "backIndex": [2, 2], "spend": [{ "color": "G", "need": 3 }, { "color": "I", "need": 2 }, { "color": "R", "need": 2 }] }, { "id": 229, "score": 1, "gem": "I", "backIndex": [1, 3], "spend": [{ "color": "W", "need": 3 }, { "color": "G", "need": 2 }, { "color": "B", "need": 2 }] }, { "id": 230, "score": 1, "gem": "R", "backIndex": [4, 2], "spend": [{ "color": "I", "need": 3 }, { "color": "W", "need": 2 }, { "color": "R", "need": 2 }] }
  ],
  level3: [
    { "id": 31, "score": 5, "gem": "I", "backIndex": [2, 4], "spend": [{ "color": "I", "need": 3 }, { "color": "R", "need": 7 }] }, { "id": 32, "score": 5, "gem": "R", "backIndex": [3, 4], "spend": [{ "color": "R", "need": 3 }, { "color": "G", "need": 7 }] }, { "id": 33, "score": 5, "gem": "G", "backIndex": [2, 1], "spend": [{ "color": "G", "need": 3 }, { "color": "B", "need": 7 }] }, { "id": 34, "score": 5, "gem": "B", "backIndex": [0, 2], "spend": [{ "color": "B", "need": 3 }, { "color": "W", "need": 7 }] }, { "id": 35, "score": 5, "gem": "W", "backIndex": [1, 2], "spend": [{ "color": "W", "need": 3 }, { "color": "I", "need": 7 }] }, { "id": 36, "score": 4, "gem": "I", "backIndex": [0, 0], "spend": [{ "color": "I", "need": 7 }] }, { "id": 37, "score": 4, "gem": "R", "backIndex": [1, 4], "spend": [{ "color": "R", "need": 7 }] }, { "id": 38, "score": 4, "gem": "G", "backIndex": [4, 4], "spend": [{ "color": "G", "need": 7 }] }, { "id": 39, "score": 4, "gem": "B", "backIndex": [2, 4], "spend": [{ "color": "B", "need": 7 }] }, { "id": 310, "score": 4, "gem": "W", "backIndex": [3, 3], "spend": [{ "color": "W", "need": 7 }] }, { "id": 311, "score": 4, "gem": "I", "backIndex": [4, 4], "spend": [{ "color": "I", "need": 3 }, { "color": "R", "need": 6 }, { "color": "G", "need": 3 }] }, { "id": 312, "score": 4, "gem": "R", "backIndex": [3, 3], "spend": [{ "color": "R", "need": 3 }, { "color": "G", "need": 6 }, { "color": "B", "need": 3 }] }, { "id": 313, "score": 4, "gem": "G", "backIndex": [4, 4], "spend": [{ "color": "G", "need": 3 }, { "color": "B", "need": 6 }, { "color": "W", "need": 3 }] }, { "id": 314, "score": 4, "gem": "B", "backIndex": [4, 4], "spend": [{ "color": "B", "need": 3 }, { "color": "W", "need": 6 }, { "color": "I", "need": 3 }] }, { "id": 315, "score": 4, "gem": "W", "backIndex": [2, 1], "spend": [{ "color": "W", "need": 3 }, { "color": "I", "need": 6 }, { "color": "R", "need": 3 }] }, { "id": 316, "score": 3, "gem": "I", "backIndex": [0, 3], "spend": [{ "color": "G", "need": 5 }, { "color": "R", "need": 3 }, { "color": "W", "need": 3 }, { "color": "B", "need": 3 }] }, { "id": 317, "score": 3, "gem": "R", "backIndex": [3, 3], "spend": [{ "color": "B", "need": 5 }, { "color": "G", "need": 3 }, { "color": "I", "need": 3 }, { "color": "W", "need": 3 }] }, { "id": 318, "score": 3, "gem": "G", "backIndex": [1, 2], "spend": [{ "color": "W", "need": 5 }, { "color": "B", "need": 3 }, { "color": "R", "need": 3 }, { "color": "I", "need": 3 }] }, { "id": 319, "score": 3, "gem": "B", "backIndex": [2, 1], "spend": [{ "color": "I", "need": 5 }, { "color": "W", "need": 3 }, { "color": "G", "need": 3 }, { "color": "R", "need": 3 }] }, { "id": 320, "score": 3, "gem": "W", "backIndex": [0, 4], "spend": [{ "color": "R", "need": 5 }, { "color": "I", "need": 3 }, { "color": "B", "need": 3 }, { "color": "G", "need": 3 }] }
  ],
};