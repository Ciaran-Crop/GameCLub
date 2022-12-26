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
  { id: 41, score: 3, backIndex: [0, 1], spend: [{color: W, need: 4}, {color: B, need: 4}] },
  { id: 41, score: 3, backIndex: [0, 2], spend: [{color: W, need: 4}, {color: I, need: 4}] },
  { id: 41, score: 3, backIndex: [1, 1], spend: [{color: W, need: 3}, {color: B, need: 3}, {color: I, need: 3}] },
  { id: 41, score: 3, backIndex: [1, 2], spend: [{color: R, need: 3}, {color: I, need: 3}, {color: G, need: 3}] },
];

let origin_cards = {
  level1: [
    { id: 11, gem: W, score: 0, backIndex: [1, 2], spend: [{ color: W, need: 1 }, { color: B, need: 1 }, { color: I, need: 1 }, { color: G, need: 1 }] },
    { id: 12, gem: W, score: 0, backIndex: [1, 3], spend: [{ color: W, need: 1 }, { color: B, need: 1 }, { color: I, need: 1 }, { color: G, need: 1 }] },
    { id: 13, gem: W, score: 0, backIndex: [1, 4], spend: [{ color: W, need: 1 }, { color: B, need: 1 }, { color: I, need: 1 }, { color: G, need: 1 }] },
    { id: 14, gem: W, score: 0, backIndex: [1, 1], spend: [{ color: W, need: 1 }, { color: B, need: 1 }, { color: I, need: 1 }, { color: G, need: 1 }] },
  ],
  level2: [
    { id: 21, gem: W, score: 2, backIndex: [2, 1], spend: [{ color: W, need: 2 }, { color: B, need: 3 }, { color: I, need: 3 }] },
    { id: 22, gem: W, score: 1, backIndex: [2, 2], spend: [{ color: W, need: 2 }, { color: B, need: 2 }, { color: I, need: 3 }] },
    { id: 23, gem: W, score: 2, backIndex: [2, 3], spend: [{ color: W, need: 2 }, { color: B, need: 3 }, { color: I, need: 3 }] },
    { id: 24, gem: W, score: 1, backIndex: [2, 4], spend: [{ color: W, need: 2 }, { color: B, need: 2 }, { color: I, need: 3 }] },
  ],
  level3: [
    { id: 31, gem: B, score: 5, backIndex: [3, 1], spend: [{ color: W, need: 3 }, { color: B, need: 7 }] },
    { id: 32, gem: G, score: 5, backIndex: [3, 2], spend: [{ color: W, need: 3 }, { color: B, need: 7 }] },
    { id: 33, gem: B, score: 4, backIndex: [3, 3], spend: [{ color: W, need: 3 }, { color: B, need: 3 }, { color: I, need: 3 }, { color: R, need: 5 }] },
    { id: 34, gem: I, score: 5, backIndex: [3, 4], spend: [{ color: W, need: 3 }, { color: B, need: 7 }] },
  ],
};