// setup variables
const walkAcceleration = 2.5; // how much is added to the speed each frame
const gravity = 0.5; // how much is subtracted from speedY each frame
const friction = 1.5; // how much the player is slowed each frame
const maxSpeed = 8; // maximum horizontal speed, not vertical
const playerJumpStrength = 12; // this is subtracted from the speedY each jump
const projectileSpeed = 8; // the speed of projectiles

/////////////////////////////////////////////////
//////////ONLY CHANGE ABOVE THIS POINT///////////
/////////////////////////////////////////////////

// Base game variables
const frameRate = 60;
const playerScale = 0.8; //makes the player just a bit smaller. Doesn't affect the hitbox, just the image

// Player variables
const player = {
  x: 50,
  y: 100,
  speedX: 0,
  speedY: 0,
  width: undefined,
  height: undefined,
  onGround: false,
  facingRight: true,
  deadAndDeathAnimationDone: false,
};

let hitDx;
let hitDy;
let hitBoxWidth = 50 * playerScale;
let hitBoxHeight = 105 * playerScale;
let firstTimeSetup = true;

const keyPress = {
  any: false,
  up: false,
  left: false,
  down: false,
  right: false,
  space: false,
};

// Player animation variables
const animationTypes = {
  duck: "duck",
  flyingJump: "flying-jump",
  frontDeath: "front-death",
  frontIdle: "front-idle",
  jump: "jump",
  lazer: "lazer",
  run: "run",
  stop: "stop",
  walk: "walk",
};
let currentAnimationType = animationTypes.run;
let frameIndex = 0;
let jumpTimer = 0;
let duckTimer = 0;
let DUCK_COUNTER_IDLE_VALUE = 14;
let debugVar = false;

let spriteHeight = 0;
let spriteWidth = 0;
let spriteX = 0;
let spriteY = 0;
let offsetX = 0;
let offsetY = 0;

// Platform, cannon, projectile, and collectable variables
let platforms = [];
let cannons = [];
const cannonWidth = 118;
const cannonHeight = 80;
let projectiles = [];
const defaultProjectileWidth = 24;
const defaultProjectileHeight = defaultProjectileWidth;
const collectableWidth = 40;
const collectableHeight = 40;
let collectables = [];

// canvas and context variables; must be initialized later
let canvas;
let ctx;

// setup function variable
let setup;

let halleImage;
let animationDetails = {};

var collectableList = {
  database: { image: "images/collectables/database.png" },
  diamond: { image: "data:image/jpeg;base64,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" },
  grace: { image: "images/collectables/grace-head.png" },
  kennedi: { image: "images/collectables/kennedi-head.png" },
  max: { image: "images/collectables/max-head.png" },
  steve: { image: "images/collectables/steve-head.png" },
};
