/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AudioContro.ts":
/*!****************************!*\
  !*** ./src/AudioContro.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AudioControl": () => (/* binding */ AudioControl)
/* harmony export */ });
class AudioControl {
    constructor(audioElemId, playbackRate, loop, volume) {
        //footstep config vars play back rate
        this.walkingPlayBackRate = 1;
        this.runningPlayBackRate = 2;
        this.crouchingPlayBackRate = 0.7;
        //footstep config vars volume
        this.walkingVolume = 0.3;
        this.runningVolume = 0.45;
        this.crouchingVolume = 0.15;
        this.playBackRate = playbackRate ? playbackRate : this.walkingPlayBackRate;
        this.audio = document.getElementById(audioElemId);
        this.audio.loop = loop ? loop : true;
        this.volume = volume ? volume : this.walkingVolume;
    }
    setAudioData() {
        this.audio.playbackRate = this.playBackRate;
        this.audio.volume = this.volume;
    }
    setPlayBackRate(playbackRate) {
        this.playBackRate = playbackRate;
        this.setAudioData();
    }
    setVolume(volume) {
        this.volume = volume;
        this.setAudioData();
    }
    play() {
        this.audio.play();
    }
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
    // footsteps method
    setAudioWalking() {
        this.playBackRate = this.walkingPlayBackRate;
        this.volume = this.walkingVolume;
        this.setAudioData();
    }
    setAudioCrouching() {
        this.playBackRate = this.crouchingPlayBackRate;
        this.volume = this.crouchingVolume;
        this.setAudioData();
    }
    setAudioRunning() {
        this.playBackRate = this.runningPlayBackRate;
        this.volume = this.runningVolume;
        this.setAudioData();
    }
}


/***/ }),

/***/ "./src/Block.ts":
/*!**********************!*\
  !*** ./src/Block.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Block": () => (/* binding */ Block)
/* harmony export */ });
class Block {
    constructor(blockType, row, col) {
        this.row = row;
        this.col = col;
        this.blockType = blockType;
    }
    getBlockType() {
        return this.blockType;
    }
    getRow() {
        return this.row;
    }
    getCol() {
        return this.col;
    }
}


/***/ }),

/***/ "./src/BlockType.ts":
/*!**************************!*\
  !*** ./src/BlockType.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BlockType": () => (/* binding */ BlockType)
/* harmony export */ });
var BlockType;
(function (BlockType) {
    BlockType[BlockType["Empty"] = 0] = "Empty";
    BlockType[BlockType["Wall"] = 1] = "Wall";
})(BlockType || (BlockType = {}));


/***/ }),

/***/ "./src/Bullet.ts":
/*!***********************!*\
  !*** ./src/Bullet.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bullet": () => (/* binding */ Bullet)
/* harmony export */ });
/* harmony import */ var _UnitVector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UnitVector */ "./src/UnitVector.ts");
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util */ "./src/Util.ts");


var ObjectHit;
(function (ObjectHit) {
    ObjectHit[ObjectHit["Player"] = 0] = "Player";
    ObjectHit[ObjectHit["Wall"] = 1] = "Wall";
    ObjectHit[ObjectHit["Ray"] = 2] = "Ray";
    ObjectHit[ObjectHit["None"] = 3] = "None";
})(ObjectHit || (ObjectHit = {}));
class Bullet {
    constructor(startX, startY, uVecDir, canvas2D, mapSizeInfo, crouchedBullet) {
        this.velocity = 3;
        this.dim = 5; //i.e square side length
        this.crouchedBullet = false; //if bullet was created while player crouched (needed for rendering height of bullet in 3d)
        this.util = new _Util__WEBPACK_IMPORTED_MODULE_1__.Util();
        this.xPos = startX - this.dim / 2; //center bullet around player
        this.yPos = startY - this.dim / 2; //center bullet around player
        this.uVecDir = uVecDir;
        this.canvas2D = canvas2D;
        this.mapSizeInfo = mapSizeInfo;
        this.crouchedBullet = crouchedBullet;
    }
    moveBullet() {
        this.xPos += this.velocity * this.uVecDir.getX();
        this.yPos += this.velocity * this.uVecDir.getY();
    }
    //this algo expects the y to be relative to origin at bottom left
    pointAfterRotation(unRotatedX, unRotatedY, clockWiseRotation, centerOfRotX, centerOfRotY) {
        let newX = (unRotatedX - centerOfRotX) * Math.cos(-clockWiseRotation) - (unRotatedY - centerOfRotY) * Math.sin(-clockWiseRotation) + centerOfRotX;
        let newY = (unRotatedX - centerOfRotX) * Math.sin(-clockWiseRotation) + (unRotatedY - centerOfRotY) * Math.cos(-clockWiseRotation) + centerOfRotY;
        return { x: newX, y: newY };
    }
    //the pont of this method is to project x even spaced vecs out of a side of the bullet (which is a square) and determine if any of those are in a player, ray, or wall
    checkIfBulletSideInObject(side, map, mapSizeInfo) {
        //this vec is in the dir of the side of the bullet we care about
        let uVec = new _UnitVector__WEBPACK_IMPORTED_MODULE_0__.UnitVector(this.uVecDir.getDirDeg());
        let mapHeight = mapSizeInfo.cellHeight * mapSizeInfo.rows;
        //the roation algo uses normal cartesian convention of bottom left as (0, 0) so need to inv y
        let inverseY = mapHeight - this.yPos;
        let midX = this.xPos + this.dim / 2;
        let midY = inverseY - this.dim / 2;
        //assume no rotation and move across top face of bullet from left to right
        //then rotate points with rotation of bullet + additional rotatation dep on side
        //***using special formula for point after rotation: https://math.stackexchange.com/questions/270194/how-to-find-the-vertices-angle-after-rotation --> the second expanded formula
        let curPoint;
        //FORWARD dir is same dir as unit vec for dir bullet is pointing
        if (side === 'LEFT') {
            uVec.updateDir(-90);
        }
        else if (side === 'RIGHT') {
            uVec.updateDir(90);
        }
        else if (side === 'BOTTOM') {
            uVec.updateDir(180);
        }
        let numProjections = 50;
        let space = this.dim / numProjections;
        //really how far out from sied of sqaure we want to go
        let projMag = 0.01;
        let projX;
        let projY;
        for (let i = 0; i <= numProjections; i++) {
            curPoint = this.pointAfterRotation(this.xPos + i * space, inverseY, uVec.getDirRad(), midX, midY);
            projX = curPoint.x + uVec.getX() * projMag;
            projY = (mapHeight - curPoint.y) + uVec.getY() * projMag; //re inv y so it follows canvas convention
            if (this.util.inMapBlock(projX, projY, mapSizeInfo, map)) {
                return ObjectHit.Wall;
            }
        }
        return ObjectHit.None;
    }
    checkObjectHit(map, mapSizeInfo) {
        if (this.checkIfBulletSideInObject('FORWARD', map, mapSizeInfo) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }
        if (this.checkIfBulletSideInObject('LEFT', map, mapSizeInfo) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }
        if (this.checkIfBulletSideInObject('RIGHT', map, mapSizeInfo) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }
        if (this.checkIfBulletSideInObject('BOTTOM', map, mapSizeInfo) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }
        return ObjectHit.None;
    }
    draw2D() {
        // expand out from each side a bit to see if in block
        let ctx = this.canvas2D.getContext('2d');
        ctx.fillStyle = 'grey';
        let midX = this.xPos + this.dim / 2;
        let midY = this.yPos + this.dim / 2;
        ctx.translate(midX, midY);
        ctx.rotate(this.uVecDir.getDirRad());
        ctx.translate(-midX, -midY);
        ctx.fillRect(this.xPos, this.yPos, this.dim, this.dim);
        ctx.resetTransform();
    }
    getX() {
        return this.xPos;
    }
    getY() {
        return this.yPos;
    }
    //accounts for rotation
    //A --> B --> C --> D is clockwise around rectangle from top left
    getBoundingBox(mapSizeInfo) {
        let mapHeight = mapSizeInfo.cellHeight * mapSizeInfo.rows;
        //the roation algo uses normal cartesian convention of bottom left as (0, 0) so need to inv y
        let inverseY = mapHeight - this.yPos;
        let midX = this.xPos + this.dim / 2;
        let midY = inverseY - this.dim / 2;
        let A = this.pointAfterRotation(this.xPos, inverseY, this.uVecDir.getDirRad(), midX, midY);
        A.y = (mapHeight - A.y);
        let B = this.pointAfterRotation(this.xPos + this.dim, inverseY, this.uVecDir.getDirRad(), midX, midY);
        B.y = (mapHeight - B.y);
        let D = this.pointAfterRotation(this.xPos, inverseY - this.dim, this.uVecDir.getDirRad(), midX, midY);
        D.y = (mapHeight - D.y);
        let C = this.pointAfterRotation(this.xPos + this.dim, inverseY - this.dim, this.uVecDir.getDirRad(), midX, midY);
        C.y = (mapHeight - C.y);
        return {
            A: A,
            B: B,
            C: C,
            D: D
        };
    }
    getCrouchedBullet() {
        return this.crouchedBullet;
    }
}


/***/ }),

/***/ "./src/GameState.ts":
/*!**************************!*\
  !*** ./src/GameState.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GameState": () => (/* binding */ GameState)
/* harmony export */ });
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ "./src/Player.ts");
/* harmony import */ var _Map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Map */ "./src/Map.ts");
/* harmony import */ var _UnitVector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UnitVector */ "./src/UnitVector.ts");



var ObjectHit;
(function (ObjectHit) {
    ObjectHit[ObjectHit["Player"] = 0] = "Player";
    ObjectHit[ObjectHit["Wall"] = 1] = "Wall";
    ObjectHit[ObjectHit["Ray"] = 2] = "Ray";
    ObjectHit[ObjectHit["None"] = 3] = "None";
})(ObjectHit || (ObjectHit = {}));
class GameState {
    constructor(canvas2D, canvas3D, mapTemplate, audioControl) {
        this.canvas2D = canvas2D;
        this.canvas3D = canvas3D;
        this.mapSizeInfo = { rows: mapTemplate.length,
            cols: mapTemplate[0].length,
            cellWidth: canvas2D.width / mapTemplate[0].length,
            cellHeight: canvas2D.height / mapTemplate.length };
        this.map = new _Map__WEBPACK_IMPORTED_MODULE_1__.Map(this.mapSizeInfo, mapTemplate, canvas2D);
        this.player = new _Player__WEBPACK_IMPORTED_MODULE_0__.Player(300, 350, new _UnitVector__WEBPACK_IMPORTED_MODULE_2__.UnitVector(270), this.map, canvas2D, canvas3D, audioControl, this.mapSizeInfo);
    }
    //Player info
    isPlayerMoving() {
        return this.player.isPlayerMoving();
    }
    isPlayerCrouching() {
        return this.player.isPlayerCrouching();
    }
    isPlayerRunning() {
        return this.player.isPlayerRunning();
    }
    getCenterX() {
        return this.player.getXMid();
    }
    getCenterY() {
        return this.player.getYMid();
    }
    getCenterDir() {
        let centerDir = this.player.getUnitVec();
        return centerDir;
    }
    //Map info
    getMapSizeInfo() {
        return this.mapSizeInfo;
    }
    getMap() {
        return this.map;
    }
    //Drawing
    drawMap() {
        this.map.drawMap();
    }
    drawPlayer() {
        this.player.draw2D();
    }
    //Updating and drawing bullets
    updateAndDrawBullets() {
        let bullets = this.player.getBullets().slice(0);
        bullets.forEach((bullet, i) => {
            bullet.moveBullet();
            if (bullet.checkObjectHit(this.map, this.mapSizeInfo) === ObjectHit.Wall) {
                this.player.removeBullets(i);
            }
        });
        //gonna draw even after collision
        bullets.forEach(bullet => bullet.draw2D());
    }
    getAllBullets() {
        //let bullets: Bullet[] = this.player.getBullets().slice(0);
        return this.player.getBullets();
    }
}


/***/ }),

/***/ "./src/Map.ts":
/*!********************!*\
  !*** ./src/Map.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Map": () => (/* binding */ Map)
/* harmony export */ });
/* harmony import */ var _Block__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Block */ "./src/Block.ts");
/* harmony import */ var _BlockType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BlockType */ "./src/BlockType.ts");


class Map {
    constructor(mapSizeInfo, mapTemplate, canvas) {
        this.blocks = new Array();
        this.canvas = canvas;
        this.mapSizeInfo = mapSizeInfo;
        if (mapTemplate) {
            mapTemplate.forEach((row, iRow) => {
                let r = new Array();
                row.forEach((bType, iCol) => {
                    r.push(new _Block__WEBPACK_IMPORTED_MODULE_0__.Block(bType, iRow, iCol));
                });
                this.blocks.push(r);
            });
        }
    }
    drawMap() {
        let context = this.canvas.getContext('2d');
        this.blocks.forEach((row, iRow) => {
            row.forEach((block, iCol) => {
                if (block.blockType === _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall) {
                    context.beginPath();
                    context.rect(this.mapSizeInfo.cellWidth * iCol, this.mapSizeInfo.cellHeight * iRow, this.mapSizeInfo.cellWidth, this.mapSizeInfo.cellHeight);
                    context.stroke();
                }
            });
        });
    }
    getBlocks() {
        return this.blocks;
    }
}


/***/ }),

/***/ "./src/Player.ts":
/*!***********************!*\
  !*** ./src/Player.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Player": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _UnitVector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UnitVector */ "./src/UnitVector.ts");
/* harmony import */ var _Bullet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Bullet */ "./src/Bullet.ts");
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Util */ "./src/Util.ts");



//not using WASD because it was causing problems
//specifically when crouching + moving forward/backward and then trying to rotatae right (wouldnt rotate but for some reason rotate left worked)
var KEYS;
(function (KEYS) {
    KEYS["UP"] = "w";
    KEYS["LEFT_ROTATION"] = "a";
    KEYS["DOWN"] = "s";
    KEYS["RIGHT_ROTATION"] = "d";
    KEYS["CROUCH"] = "c";
    KEYS["RUN"] = " ";
})(KEYS || (KEYS = {}));
class Player {
    constructor(xPos, yPos, startingDirUVec, map, canvas2D, canvas3D, audioControl, mapSizeInfo) {
        this.standingVel = 1.5;
        this.crouchingVel = 0.75;
        this.runningVel = 3;
        this.standingAngularVel = 9;
        this.crouchingAngularVel = 1.5;
        this.playerCircleRadius = 2;
        this.keysState = {};
        this.bullets = [];
        this.util = new _Util__WEBPACK_IMPORTED_MODULE_2__.Util();
        this.xPos = xPos;
        this.yPos = yPos;
        this.dirUVec = startingDirUVec;
        this.map = map;
        this.canvas2D = canvas2D;
        this.canvas3D = canvas3D;
        this.audioControl = audioControl;
        this.mapSizeInfo = mapSizeInfo;
        window.addEventListener('click', () => {
            let ang = Math.atan((this.curMousePosX - 700 / 2) / 350) + this.dirUVec.getDirRad();
            let uVec = new _UnitVector__WEBPACK_IMPORTED_MODULE_0__.UnitVector(this.util.toDeg(ang));
            this.bullets.push(new _Bullet__WEBPACK_IMPORTED_MODULE_1__.Bullet(this.getXMid(), this.getYMid(), uVec, this.canvas2D, this.mapSizeInfo, this.isPlayerCrouching()));
        });
        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case KEYS.RUN:
                    //release the run key only does anything when we are cur running but not crouching
                    //we dont want to change audio to walking when we are crouching+moving and just press and rlease the run key
                    if (!this.keysState[KEYS.CROUCH]) {
                        this.audioControl.setAudioWalking();
                        this.keysState[KEYS.RUN] = false;
                    }
                    break;
                case KEYS.CROUCH:
                    //we dont want someone to press and release crouch key while running and change audio to walking
                    if (!this.keysState[KEYS.RUN]) {
                        this.audioControl.setAudioWalking();
                        this.keysState[KEYS.CROUCH] = false;
                    }
                    break;
                case KEYS.UP:
                    //dont want someone to press and release up while moving back and stop audio
                    if (!this.keysState[KEYS.DOWN]) {
                        this.audioControl.stop();
                        clearInterval(this.keysState[KEYS.UP]);
                        this.keysState[KEYS.UP] = null;
                    }
                    break;
                case KEYS.DOWN:
                    //dont want someone to press and release down while moving forward and stop audio
                    if (!this.keysState[KEYS.UP]) {
                        this.audioControl.stop();
                        clearInterval(this.keysState[KEYS.DOWN]);
                        this.keysState[KEYS.DOWN] = null;
                    }
                    break;
                case KEYS.LEFT_ROTATION:
                    clearInterval(this.keysState[KEYS.LEFT_ROTATION]);
                    this.keysState[KEYS.LEFT_ROTATION] = null;
                    break;
                case KEYS.RIGHT_ROTATION:
                    clearInterval(this.keysState[KEYS.RIGHT_ROTATION]);
                    this.keysState[KEYS.RIGHT_ROTATION] = null;
                    break;
            }
        });
        window.addEventListener('mousemove', (e) => {
            let rect = this.canvas3D.getBoundingClientRect();
            let xPos = e.clientX - rect.left;
            this.curMousePosX = xPos;
            console.log(e.clientX);
        });
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case KEYS.RUN:
                    if (!this.keysState[KEYS.CROUCH]) { //cant run when crouching
                        this.audioControl.setAudioRunning();
                        this.keysState[KEYS.RUN] = true;
                    }
                    break;
                case KEYS.CROUCH:
                    if (!this.keysState[KEYS.RUN]) { //cant get from running to crouch
                        this.audioControl.setAudioCrouching();
                        this.keysState[KEYS.CROUCH] = true;
                    }
                    break;
                case KEYS.UP:
                    if (this.keysState[KEYS.DOWN])
                        return; //cant go forward and back at same time
                    //so if ur already crouching and then start moving, audio wont overwrite to walking standin audio
                    //similar idea for run
                    if (!this.keysState[KEYS.CROUCH] && !this.keysState[KEYS.RUN]) {
                        this.audioControl.setAudioWalking();
                    }
                    this.audioControl.play();
                    if (!this.keysState[KEYS.UP]) {
                        this.keysState[KEYS.UP] = setInterval(() => {
                            this.moveForward();
                        }, 25);
                    }
                    break;
                case KEYS.DOWN:
                    if (this.keysState[KEYS.UP])
                        return; //cant go forward and back at same time
                    //so if ur already crouching and then start moving, audio wont overwrite to walking standin audio
                    //similar idea for run
                    if (!this.keysState[KEYS.CROUCH] && !this.keysState[KEYS.RUN]) {
                        this.audioControl.setAudioWalking();
                    }
                    this.audioControl.play();
                    if (!this.keysState[KEYS.DOWN]) {
                        this.keysState[KEYS.DOWN] = setInterval(() => {
                            this.moveBackward();
                        }, 25);
                    }
                    break;
                case KEYS.LEFT_ROTATION:
                    if (!this.keysState[KEYS.LEFT_ROTATION]) {
                        this.keysState[KEYS.LEFT_ROTATION] = setInterval(() => {
                            this.rotate('LEFT');
                        }, 25);
                    }
                    break;
                case KEYS.RIGHT_ROTATION:
                    if (!this.keysState[KEYS.RIGHT_ROTATION]) {
                        this.keysState[KEYS.RIGHT_ROTATION] = setInterval(() => {
                            this.rotate('RIGHT');
                        }, 25);
                    }
                    break;
            }
        });
    }
    isPlayerMoving() {
        return this.keysState[KEYS.UP] || this.keysState[KEYS.DOWN];
    }
    isPlayerCrouching() {
        return this.keysState[KEYS.CROUCH];
    }
    isPlayerRunning() {
        return this.keysState[KEYS.RUN];
    }
    getBullets() {
        return this.bullets;
    }
    setBullets(bullets) {
        this.bullets = bullets;
    }
    removeBullets(index) {
        this.bullets.splice(index, 1);
    }
    // rotateOnMousePos(canvas: HTMLCanvasElement, dirForward: boolean):void {
    //     let rect = canvas.getBoundingClientRect();
    //     let xPos: number = this.curMousePosX - rect.left;
    //     if (xPos < canvas.width/3) {
    //         this.dirUVec.updateDir(dirForward ? -this.angularVelocity : this.angularVelocity);
    //     } else if (xPos > 2*canvas.width/3) {
    //         this.dirUVec.updateDir(dirForward ? this.angularVelocity : -this.angularVelocity);
    //     }
    // }
    rotate(dir) {
        let vel = this.keysState[KEYS.CROUCH] ? this.crouchingAngularVel : this.standingAngularVel;
        if (dir === 'LEFT') {
            this.dirUVec.updateDir(-vel);
        }
        else if (dir === 'RIGHT') {
            this.dirUVec.updateDir(vel);
        }
    }
    //crouching takes prio over running
    moveForward() {
        let vel = this.keysState[KEYS.CROUCH] ? this.crouchingVel : (this.keysState[KEYS.RUN] ? this.runningVel : this.standingVel);
        let changeX = vel * this.dirUVec.getX();
        let changeY = vel * this.dirUVec.getY();
        if (!this.util.inMapBlock(this.xPos + changeX, this.yPos + changeY, this.mapSizeInfo, this.map)) {
            this.yPos += vel * this.dirUVec.getY();
            this.xPos += vel * this.dirUVec.getX();
        }
    }
    //crouching takes prio over running
    moveBackward() {
        let vel = this.keysState[KEYS.CROUCH] ? this.crouchingVel : (this.keysState[KEYS.RUN] ? this.runningVel : this.standingVel);
        let changeX = -vel * this.dirUVec.getX();
        let changeY = -vel * this.dirUVec.getY();
        if (!this.util.inMapBlock(this.xPos + changeX, this.yPos + changeY, this.mapSizeInfo, this.map)) {
            this.yPos -= vel * this.dirUVec.getY();
            this.xPos -= vel * this.dirUVec.getX();
        }
    }
    draw2D() {
        let ctx = this.canvas2D.getContext('2d');
        let radAngle = this.dirUVec.getDirRad();
        ctx.translate(this.xPos, this.yPos);
        ctx.rotate(radAngle);
        ctx.translate(-this.xPos, -this.yPos);
        //ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.playerCircleRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    getUnitVec() {
        return this.dirUVec;
    }
    getXMid() {
        return this.xPos;
    }
    getYMid() {
        return this.yPos;
    }
}


/***/ }),

/***/ "./src/Ray.ts":
/*!********************!*\
  !*** ./src/Ray.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ray": () => (/* binding */ Ray)
/* harmony export */ });
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Util */ "./src/Util.ts");

class Ray {
    constructor(gState, canvas2D, canvas3D, uVecDir) {
        this.walkingFrameCount = 0;
        this.walkingFrameIncr = 4; //formula for num of up and downs is 1/(2/walingFrameIncr)
        this.util = new _Util__WEBPACK_IMPORTED_MODULE_0__.Util();
        this.gState = gState;
        this.canvas2D = canvas2D;
        this.canvas3D = canvas3D;
        this.uVecDir = uVecDir;
        //floor will be at max half way up the screen i.e canvas3d height / 2
        let color = { r: 0, g: 183, b: 255 };
        this.grd = canvas3D.getContext('2d').createLinearGradient(0, canvas3D.height, 0, canvas3D.height / 2);
        let numPixToAddNewStopColor = 2.5;
        let colorChangePerStopColor = 1;
        let numIncrs = Math.ceil((canvas3D.height / 2) / numPixToAddNewStopColor);
        let stopColorStep = 1 / numIncrs;
        for (let i = 0; i < numIncrs; i++) {
            this.grd.addColorStop(i * stopColorStep, `rgb(${color.r}, ${color.g}, ${color.b})`);
            this.adjustColor(color, { r: 0, g: -colorChangePerStopColor, b: -colorChangePerStopColor * 1.4 }); //that *1.4 is just there because to acc darken from light to dark blue to black the b part changes at a rate of 1.4
        }
    }
    getEdgeCords(block) {
        let cellWidth = this.gState.getMapSizeInfo().cellWidth;
        let cellHeight = this.gState.getMapSizeInfo().cellHeight;
        let blockX = cellWidth * block.getCol();
        let blockY = cellHeight * block.getRow();
        return { C: { x: blockX, y: blockY + cellHeight },
            D: { x: blockX + cellWidth, y: blockY + cellHeight },
            B: { x: blockX + cellWidth, y: blockY },
            A: { x: blockX, y: blockY } };
    }
    checkEdgeRay(blockHit) {
        let edgeCoords = this.getEdgeCords(blockHit);
        this.edgeRay = false;
        let startToEdgeVec = null;
        let startToEdgeVecMag = null;
        let angleBetweenRayAndStartToEdgeVec = null;
        let distBetweenRayEndAndStartToEdgeVecEnd = null;
        Object.keys(edgeCoords).forEach(key => {
            startToEdgeVec = { x: edgeCoords[key].x - this.gState.getCenterX(), y: edgeCoords[key].y - this.gState.getCenterY() };
            startToEdgeVecMag = Math.sqrt(Math.pow(startToEdgeVec.x, 2) + Math.pow(startToEdgeVec.y, 2));
            //doing dot prod to get angle between ray vec nad start to edge vec
            angleBetweenRayAndStartToEdgeVec = Math.acos((this.uVecDir.getX() * startToEdgeVec.x + this.uVecDir.getY() * startToEdgeVec.y) / (startToEdgeVecMag)) * 180 / Math.PI;
            //dist formula
            distBetweenRayEndAndStartToEdgeVecEnd = Math.sqrt(Math.pow((edgeCoords[key].x - this.endX), 2) + Math.pow((edgeCoords[key].y - this.endY), 2));
            //so both the angle between the cur ray and the projected ray from endge to start has to be within a limit BUT ALSO
            //the dist b/w end of ray and each edge has to be within a limit too
            if (angleBetweenRayAndStartToEdgeVec <= 0.1 && distBetweenRayEndAndStartToEdgeVecEnd <= 3.5) {
                this.edgeRay = true;
            }
        });
    }
    calculateCollisionsAndIfEdge() {
        let curX = this.gState.getCenterX();
        let curY = this.gState.getCenterY();
        this.bulletHitEndX = null;
        this.bulletHitEndY = null;
        let bullets = this.gState.getAllBullets();
        while (!this.util.inMapBlock(curX, curY, this.gState.getMapSizeInfo(), this.gState.getMap())) {
            if (!this.bulletHitEndX && !this.bulletHitEndY) {
                for (let i = 0; i < bullets.length; i++) {
                    let bullet = bullets[i];
                    if (Math.sqrt(Math.pow((curX - bullet.getX()), 2) + Math.pow((curY - bullet.getY()), 2)) < 7) { //choosing 14 cause thats the diagonal of a square with side len 10
                        let boundingBox = bullet.getBoundingBox(this.gState.getMapSizeInfo());
                        if (this.util.pointInRectangle({ x: curX, y: curY }, boundingBox)) {
                            this.bulletHitEndX = curX;
                            this.bulletHitEndY = curY;
                            this.crouchedBullet = bullet.getCrouchedBullet();
                            break;
                        }
                    }
                }
            }
            curX += this.uVecDir.getX() / 4;
            curY += this.uVecDir.getY() / 4;
        }
        this.endX = curX;
        this.endY = curY;
        let curBlock = this.util.getMapBlockFromCoord(curX, curY, this.gState.getMapSizeInfo());
        let blockHit = this.gState.getMap().getBlocks()[curBlock.y][curBlock.x];
        this.checkEdgeRay(blockHit);
    }
    getAdjustedLength(endX, endY) {
        let rayLen = Math.sqrt(Math.pow((this.gState.getCenterX() - endX), 2) + Math.pow((this.gState.getCenterY() - endY), 2));
        //lin alg eqn i.e dot prod of two vecs / prod of their magniture = cos of angle between em (mag of both here is 1 tho)
        let cosTheta = this.uVecDir.getX() * this.gState.getCenterDir().getX() + this.uVecDir.getY() * this.gState.getCenterDir().getY();
        return rayLen * cosTheta;
    }
    performRayCalculations(newUVecDir) {
        this.uVecDir = newUVecDir;
        this.calculateCollisionsAndIfEdge();
        this.length = this.getAdjustedLength(this.endX, this.endY);
        if (this.bulletHitEndX && this.bulletHitEndY) {
            this.lengthToBullet = this.getAdjustedLength(this.bulletHitEndX, this.bulletHitEndY);
        }
        //walking frame incr controls how many pix the screen moves up and down per frame (so walking count is b/w osscilates b/w 0 and 60) while player moves
        //so need to set it different dep on if crouching, walking or running
        //first normalzie walkign frame incr to 1 and then multip by factor
        //cant just say = 3 or = 6 cause they mighta been a neg num before
        if (this.gState.isPlayerCrouching()) {
            this.walkingFrameIncr = this.walkingFrameIncr / Math.abs(this.walkingFrameIncr);
            this.walkingFrameIncr *= 2;
        }
        else if (this.gState.isPlayerRunning()) {
            this.walkingFrameIncr = this.walkingFrameIncr / Math.abs(this.walkingFrameIncr);
            this.walkingFrameIncr *= 8;
        }
        else {
            this.walkingFrameIncr = this.walkingFrameIncr / Math.abs(this.walkingFrameIncr);
            this.walkingFrameIncr *= 4;
        }
        if (!this.gState.isPlayerMoving()) {
            this.walkingFrameCount = 0;
        }
        else if (this.walkingFrameCount <= 60 && this.walkingFrameCount >= 0) {
            this.walkingFrameCount += this.walkingFrameIncr;
        }
        else {
            this.walkingFrameIncr *= -1;
            this.walkingFrameCount += this.walkingFrameIncr;
        }
    }
    drawRay2D() {
        let ctx = this.canvas2D.getContext('2d');
        if (this.gState.getCenterDir().getDirRad() == this.uVecDir.getDirRad()) { //this is the center col
            ctx.strokeStyle = "#FF0000";
        }
        else {
            ctx.strokeStyle = "black";
        }
        ctx.beginPath();
        ctx.moveTo(this.gState.getCenterX(), this.gState.getCenterY());
        if (this.bulletHitEndX && this.bulletHitEndY) {
            ctx.strokeStyle = 'blue';
            ctx.lineTo(this.bulletHitEndX, this.bulletHitEndY);
            ctx.stroke();
            ctx.strokeStyle = 'green';
            ctx.lineTo(this.endX, this.endY);
        }
        else {
            ctx.lineTo(this.endX, this.endY);
        }
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
        ctx.strokeStyle = "black";
    }
    adjustColor(startColor, colorChange) {
        startColor.r = Math.max(startColor.r + colorChange.r, 0);
        startColor.g = Math.max(startColor.g + colorChange.g, 0);
        startColor.b = Math.max(startColor.b + colorChange.b, 0);
    }
    drawRay3D(sliceWidth, sliceCol) {
        let ctx = this.canvas3D.getContext('2d');
        //crouching and running animation
        let crouchingPixhift = -250;
        let crouchingFactor = crouchingPixhift * (1 / (this.length / 12)); //need to factor in length of ray because clsoer stuff gets more tall than stuff thats further away
        let walkingFactor = this.walkingFrameCount / 10;
        //calculating ceiling and floor given length of ray + walking and crouching animation
        let ceiling = this.canvas3D.height / 2 - this.canvas3D.height / (this.length / 12) + (this.gState.isPlayerCrouching() ? crouchingFactor : 0) + walkingFactor;
        let floor = this.canvas3D.height - ceiling + walkingFactor * 2 + (this.gState.isPlayerCrouching() ? crouchingFactor * 2 : 0);
        let distFromCeilToFloor = floor - ceiling;
        //wall shading based on ray length
        let color = { r: 175, g: 175, b: 175 };
        this.adjustColor(color, { r: -this.length / 3.5, g: -this.length / 3.5, b: -this.length / 3.5 });
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        //coloring center col and edge cols differently
        if (Math.abs(this.gState.getCenterDir().getDirRad() - this.uVecDir.getDirRad()) <= 0.0075) {
            ctx.fillStyle = "#FF0000";
        }
        else if (this.edgeRay) {
            let color = { r: 125, g: 125, b: 125 };
            this.adjustColor(color, { r: -this.length / 3.5, g: -this.length / 3.5, b: -this.length / 3.5 });
            ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        }
        //WALL COLUMN
        ctx.fillRect(((sliceCol) * sliceWidth), ceiling, sliceWidth, distFromCeilToFloor);
        //FLOOR COLUMN
        ctx.fillStyle = this.grd;
        ctx.fillRect(((sliceCol) * sliceWidth), floor, sliceWidth, this.canvas3D.height - floor);
        //SKY COLUMN
        ctx.fillStyle = 'black';
        ctx.fillRect(((sliceCol) * sliceWidth), 0, sliceWidth, ceiling);
        //calcualting bullet ceil and floor if bullet in ray viewa
        if (this.bulletHitEndX && this.bulletHitEndY) {
            //cant use the ceiling and floor from above since the crouching and walking shift mess stuff up
            //all we really want is a floor and ceiling rel to center of screen but crouchign shift makes stuff off center
            //closer stuff will go up more than farther stuff and be even more off center
            let ceil = this.canvas3D.height / 2 - this.canvas3D.height / (this.length / 12) + walkingFactor;
            let flr = this.canvas3D.height - ceil + walkingFactor * 2;
            let crouchedBulletShift = crouchingPixhift * (1 / (this.lengthToBullet / 12));
            let mid = (flr - ceil) / 2 + ceil;
            if (!this.gState.isPlayerCrouching()) {
                if (this.crouchedBullet) {
                    mid += crouchedBulletShift * -1;
                }
            }
            else {
                if (!this.crouchedBullet) {
                    mid += crouchedBulletShift;
                }
            }
            let shiftFromMid = this.canvas3D.height / (this.lengthToBullet / 1.5);
            let bulletCeil = mid - shiftFromMid;
            let bulletFloor = mid + (mid - bulletCeil);
            //wall shading based on ray length
            let color = { r: 224, g: 86, b: 0 };
            this.adjustColor(color, { r: -((this.lengthToBullet / 3) * 2.6), g: -this.lengthToBullet / 3, b: 0 });
            ctx.fillStyle = 'white';
            ctx.fillRect(((sliceCol) * sliceWidth), bulletCeil - 0.5, sliceWidth, (bulletFloor - bulletCeil) + 1);
            ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
            ctx.fillRect(((sliceCol) * sliceWidth), bulletCeil, sliceWidth, bulletFloor - bulletCeil);
        }
    }
}


/***/ }),

/***/ "./src/Rays.ts":
/*!*********************!*\
  !*** ./src/Rays.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Rays": () => (/* binding */ Rays)
/* harmony export */ });
/* harmony import */ var _Ray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Ray */ "./src/Ray.ts");
/* harmony import */ var _UnitVector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UnitVector */ "./src/UnitVector.ts");
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Util */ "./src/Util.ts");



class Rays {
    constructor(gState, canvas2D, canvas3D) {
        this.rays = [];
        this.fov = 90;
        this.distToProjection = 350;
        this.playerMoving = false;
        this.util = new _Util__WEBPACK_IMPORTED_MODULE_2__.Util();
        this.gState = gState;
        this.canvas2D = canvas2D;
        this.canvas3D = canvas3D;
    }
    //some resources used:
    //https://stackoverflow.com/questions/24173966/raycasting-engine-rendering-creating-slight-distortion-increasing-towards-edges
    //https://gamedev.stackexchange.com/questions/156842/how-can-i-correct-an-unwanted-fisheye-effect-when-drawing-a-scene-with-raycastin/156853#156853
    //https://gamedev.stackexchange.com/questions/97574/how-can-i-fix-the-fisheye-distortion-in-my-raycast-renderer
    //https://www.gamedev.net/forums/topic/272526-raycasting----fisheye-distortion/?page=1
    //so theres two effects, one is the fisheye correction but another is the non linearity of angle increases between rays
    setupRays() {
        let centerUVec = this.gState.getCenterDir();
        this.distToProjection = this.canvas3D.width / 2 / (Math.tan(this.util.toRad(this.fov / 2)));
        let counter = 0;
        for (let i = 0; i < this.canvas3D.width; i += 1) {
            let ang = Math.atan((i - this.canvas3D.width / 2) / this.distToProjection) + centerUVec.getDirRad();
            let uVec = new _UnitVector__WEBPACK_IMPORTED_MODULE_1__.UnitVector(this.util.toDeg(ang));
            if (this.rays[counter]) {
                this.rays[counter].performRayCalculations(uVec);
            }
            else {
                let newRay = new _Ray__WEBPACK_IMPORTED_MODULE_0__.Ray(this.gState, this.canvas2D, this.canvas3D, uVec);
                newRay.performRayCalculations(uVec);
                this.rays.push(newRay);
            }
            counter++;
        }
    }
    draw2D() {
        this.rays.forEach(ray => ray.drawRay2D());
    }
    draw3D() {
        let raySliceWidth = this.canvas3D.width / this.rays.length;
        this.rays.forEach((ray, i) => {
            ray.drawRay3D(raySliceWidth, i);
        });
    }
}


/***/ }),

/***/ "./src/UnitVector.ts":
/*!***************************!*\
  !*** ./src/UnitVector.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UnitVector": () => (/* binding */ UnitVector)
/* harmony export */ });
class UnitVector {
    constructor(dir) {
        this.dir = dir;
        this.x = Math.cos(this.toRad(dir));
        this.y = Math.sin(this.toRad(dir));
    }
    updateDir(change) {
        this.dir += change;
        this.x = Math.cos(this.toRad(this.dir));
        this.y = Math.sin(this.toRad(this.dir));
    }
    toRad(deg) {
        return deg * Math.PI / 180;
    }
    getDirDeg() {
        return this.dir;
    }
    getDirRad() {
        return this.dir * Math.PI / 180;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
}


/***/ }),

/***/ "./src/Util.ts":
/*!*********************!*\
  !*** ./src/Util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Util": () => (/* binding */ Util)
/* harmony export */ });
/* harmony import */ var _BlockType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BlockType */ "./src/BlockType.ts");

class Util {
    constructor() { }
    //algo from the followin resources: 
    //***requires for A B and C to follow one another i.e A is top left, B is top right, C is bottom right
    //https://math.stackexchange.com/questions/2157931/how-to-check-if-a-point-is-inside-a-square-2d-plane
    //https://stackoverflow.com/questions/2752725/finding-whether-a-point-lies-inside-a-rectangle-or-not/37865332#37865332
    pointInRectangle(m, r) {
        var AB = this.vector(r.A, r.B);
        var AM = this.vector(r.A, m);
        var BC = this.vector(r.B, r.C);
        var BM = this.vector(r.B, m);
        var dotABAM = this.dot(AB, AM);
        var dotABAB = this.dot(AB, AB);
        var dotBCBM = this.dot(BC, BM);
        var dotBCBC = this.dot(BC, BC);
        return 0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC;
    }
    vector(p1, p2) {
        return {
            x: (p2.x - p1.x),
            y: (p2.y - p1.y)
        };
    }
    toRad(deg) {
        return deg * Math.PI / 180;
    }
    toDeg(rad) {
        return rad / Math.PI * 180;
    }
    dot(u, v) {
        return u.x * v.x + u.y * v.y;
    }
    getMapBlockFromCoord(x, y, mapSizeInfo) {
        let cellWidth = mapSizeInfo.cellWidth;
        let cellHeight = mapSizeInfo.cellHeight;
        let curXBlockIndex = Math.ceil(x / cellWidth) - 1;
        let curYBlockIndex = Math.ceil(y / cellHeight) - 1;
        return { x: curXBlockIndex, y: curYBlockIndex };
    }
    inMapBlock(x, y, mapSizeInfo, map) {
        return map.getBlocks()[this.getMapBlockFromCoord(x, y, mapSizeInfo).y][this.getMapBlockFromCoord(x, y, mapSizeInfo).x].getBlockType() === _BlockType__WEBPACK_IMPORTED_MODULE_0__.BlockType.Wall;
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AudioContro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioContro */ "./src/AudioContro.ts");
/* harmony import */ var _BlockType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BlockType */ "./src/BlockType.ts");
/* harmony import */ var _GameState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GameState */ "./src/GameState.ts");
/* harmony import */ var _Rays__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Rays */ "./src/Rays.ts");




let canvas2D = document.querySelector('#canvasLeft');
let canvas3D = document.querySelector('#canvasRight');
//https://www.youtube.com/watch?v=dnRX_bHbYgs got audio from here
//audio initial values
let audioControl = new _AudioContro__WEBPACK_IMPORTED_MODULE_0__.AudioControl('audio');
let mapTemplate = [
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Empty, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
    [_BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall, _BlockType__WEBPACK_IMPORTED_MODULE_1__.BlockType.Wall],
];
const GState = new _GameState__WEBPACK_IMPORTED_MODULE_2__.GameState(canvas2D, canvas3D, mapTemplate, audioControl);
const rays = new _Rays__WEBPACK_IMPORTED_MODULE_3__.Rays(GState, canvas2D, canvas3D);
// window.addEventListener('mousemove', (e) => {
//     var rect = canvas.getBoundingClientRect();
//     console.log(e.clientX - rect.left, e.clientY - rect.top);
// });
function clearCanvas(canvas) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function main() {
    clearCanvas(canvas2D);
    clearCanvas(canvas3D);
    GState.drawMap();
    GState.drawPlayer();
    rays.setupRays();
    rays.draw2D();
    GState.updateAndDrawBullets();
    //GState.drawBullets();
    rays.draw3D();
}
setInterval(main, 1000 / 60);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yYXktY2FzdGVyLy4vc3JjL0F1ZGlvQ29udHJvLnRzIiwid2VicGFjazovL3JheS1jYXN0ZXIvLi9zcmMvQmxvY2sudHMiLCJ3ZWJwYWNrOi8vcmF5LWNhc3Rlci8uL3NyYy9CbG9ja1R5cGUudHMiLCJ3ZWJwYWNrOi8vcmF5LWNhc3Rlci8uL3NyYy9CdWxsZXQudHMiLCJ3ZWJwYWNrOi8vcmF5LWNhc3Rlci8uL3NyYy9HYW1lU3RhdGUudHMiLCJ3ZWJwYWNrOi8vcmF5LWNhc3Rlci8uL3NyYy9NYXAudHMiLCJ3ZWJwYWNrOi8vcmF5LWNhc3Rlci8uL3NyYy9QbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vcmF5LWNhc3Rlci8uL3NyYy9SYXkudHMiLCJ3ZWJwYWNrOi8vcmF5LWNhc3Rlci8uL3NyYy9SYXlzLnRzIiwid2VicGFjazovL3JheS1jYXN0ZXIvLi9zcmMvVW5pdFZlY3Rvci50cyIsIndlYnBhY2s6Ly9yYXktY2FzdGVyLy4vc3JjL1V0aWwudHMiLCJ3ZWJwYWNrOi8vcmF5LWNhc3Rlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yYXktY2FzdGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9yYXktY2FzdGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcmF5LWNhc3Rlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3JheS1jYXN0ZXIvLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjO0FBQ2hRLEtBQUssc0RBQWMsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjO0FBQy9QLEtBQUssc0RBQWMsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsc0RBQWMsRUFBRSx1REFBZSxFQUFFLHNEQUFjLEVBQUUsdURBQWUsRUFBRSxzREFBYyxFQUFFLHNEQUFjLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSxzREFBYyxFQUFFLHNEQUFjO0FBQzNQLEtBQUssc0RBQWMsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsc0RBQWMsRUFBRSx1REFBZSxFQUFFLHNEQUFjLEVBQUUsdURBQWUsRUFBRSxzREFBYyxFQUFFLHNEQUFjLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjO0FBQzVQLEtBQUssc0RBQWMsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsc0RBQWMsRUFBRSx1REFBZSxFQUFFLHNEQUFjLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjO0FBQzdQLEtBQUssc0RBQWMsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsc0RBQWMsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjO0FBQzlQLEtBQUssc0RBQWMsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsc0RBQWMsRUFBRSxzREFBYyxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjO0FBQzVQLEtBQUssc0RBQWMsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjLEVBQUUsdURBQWUsRUFBRSxzREFBYyxFQUFFLHNEQUFjLEVBQUUsc0RBQWMsRUFBRSx1REFBZSxFQUFFLHNEQUFjO0FBQzVQLEtBQUssc0RBQWMsRUFBRSx1REFBZSxFQUFFLHNEQUFjLEVBQUUsc0RBQWMsRUFBRSxzREFBYyxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjO0FBQzdQLEtBQUssc0RBQWMsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHVEQUFlLEVBQUUsdURBQWUsRUFBRSx1REFBZSxFQUFFLHNEQUFjO0FBQ2hRLEtBQUssc0RBQWMsRUFBRSxzREFBYyxFQUFFLHNEQUFjLEVBQUUsc0RBQWMsRUFBRSxzREFBYyxFQUFFLHNEQUFjLEVBQUUsc0RBQWMsRUFBRSxzREFBYyxFQUFFLHNEQUFjLEVBQUUsc0RBQWMsRUFBRSxzREFBYyxFQUFFLHNEQUFjLEVBQUUsc0RBQWMsRUFBRSxzREFBYyxFQUFFLHNEQUFjO0FBQ25QO0FBQ0EsbUJBQW1CLGlEQUFTO0FBQzVCLGlCQUFpQix1Q0FBSTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEF1ZGlvQ29udHJvbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihhdWRpb0VsZW1JZCwgcGxheWJhY2tSYXRlLCBsb29wLCB2b2x1bWUpIHtcclxuICAgICAgICAvL2Zvb3RzdGVwIGNvbmZpZyB2YXJzIHBsYXkgYmFjayByYXRlXHJcbiAgICAgICAgdGhpcy53YWxraW5nUGxheUJhY2tSYXRlID0gMTtcclxuICAgICAgICB0aGlzLnJ1bm5pbmdQbGF5QmFja1JhdGUgPSAyO1xyXG4gICAgICAgIHRoaXMuY3JvdWNoaW5nUGxheUJhY2tSYXRlID0gMC43O1xyXG4gICAgICAgIC8vZm9vdHN0ZXAgY29uZmlnIHZhcnMgdm9sdW1lXHJcbiAgICAgICAgdGhpcy53YWxraW5nVm9sdW1lID0gMC4zO1xyXG4gICAgICAgIHRoaXMucnVubmluZ1ZvbHVtZSA9IDAuNDU7XHJcbiAgICAgICAgdGhpcy5jcm91Y2hpbmdWb2x1bWUgPSAwLjE1O1xyXG4gICAgICAgIHRoaXMucGxheUJhY2tSYXRlID0gcGxheWJhY2tSYXRlID8gcGxheWJhY2tSYXRlIDogdGhpcy53YWxraW5nUGxheUJhY2tSYXRlO1xyXG4gICAgICAgIHRoaXMuYXVkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhdWRpb0VsZW1JZCk7XHJcbiAgICAgICAgdGhpcy5hdWRpby5sb29wID0gbG9vcCA/IGxvb3AgOiB0cnVlO1xyXG4gICAgICAgIHRoaXMudm9sdW1lID0gdm9sdW1lID8gdm9sdW1lIDogdGhpcy53YWxraW5nVm9sdW1lO1xyXG4gICAgfVxyXG4gICAgc2V0QXVkaW9EYXRhKCkge1xyXG4gICAgICAgIHRoaXMuYXVkaW8ucGxheWJhY2tSYXRlID0gdGhpcy5wbGF5QmFja1JhdGU7XHJcbiAgICAgICAgdGhpcy5hdWRpby52b2x1bWUgPSB0aGlzLnZvbHVtZTtcclxuICAgIH1cclxuICAgIHNldFBsYXlCYWNrUmF0ZShwbGF5YmFja1JhdGUpIHtcclxuICAgICAgICB0aGlzLnBsYXlCYWNrUmF0ZSA9IHBsYXliYWNrUmF0ZTtcclxuICAgICAgICB0aGlzLnNldEF1ZGlvRGF0YSgpO1xyXG4gICAgfVxyXG4gICAgc2V0Vm9sdW1lKHZvbHVtZSkge1xyXG4gICAgICAgIHRoaXMudm9sdW1lID0gdm9sdW1lO1xyXG4gICAgICAgIHRoaXMuc2V0QXVkaW9EYXRhKCk7XHJcbiAgICB9XHJcbiAgICBwbGF5KCkge1xyXG4gICAgICAgIHRoaXMuYXVkaW8ucGxheSgpO1xyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICB0aGlzLmF1ZGlvLnBhdXNlKCk7XHJcbiAgICAgICAgdGhpcy5hdWRpby5jdXJyZW50VGltZSA9IDA7XHJcbiAgICB9XHJcbiAgICAvLyBmb290c3RlcHMgbWV0aG9kXHJcbiAgICBzZXRBdWRpb1dhbGtpbmcoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5QmFja1JhdGUgPSB0aGlzLndhbGtpbmdQbGF5QmFja1JhdGU7XHJcbiAgICAgICAgdGhpcy52b2x1bWUgPSB0aGlzLndhbGtpbmdWb2x1bWU7XHJcbiAgICAgICAgdGhpcy5zZXRBdWRpb0RhdGEoKTtcclxuICAgIH1cclxuICAgIHNldEF1ZGlvQ3JvdWNoaW5nKCkge1xyXG4gICAgICAgIHRoaXMucGxheUJhY2tSYXRlID0gdGhpcy5jcm91Y2hpbmdQbGF5QmFja1JhdGU7XHJcbiAgICAgICAgdGhpcy52b2x1bWUgPSB0aGlzLmNyb3VjaGluZ1ZvbHVtZTtcclxuICAgICAgICB0aGlzLnNldEF1ZGlvRGF0YSgpO1xyXG4gICAgfVxyXG4gICAgc2V0QXVkaW9SdW5uaW5nKCkge1xyXG4gICAgICAgIHRoaXMucGxheUJhY2tSYXRlID0gdGhpcy5ydW5uaW5nUGxheUJhY2tSYXRlO1xyXG4gICAgICAgIHRoaXMudm9sdW1lID0gdGhpcy5ydW5uaW5nVm9sdW1lO1xyXG4gICAgICAgIHRoaXMuc2V0QXVkaW9EYXRhKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIEJsb2NrIHtcclxuICAgIGNvbnN0cnVjdG9yKGJsb2NrVHlwZSwgcm93LCBjb2wpIHtcclxuICAgICAgICB0aGlzLnJvdyA9IHJvdztcclxuICAgICAgICB0aGlzLmNvbCA9IGNvbDtcclxuICAgICAgICB0aGlzLmJsb2NrVHlwZSA9IGJsb2NrVHlwZTtcclxuICAgIH1cclxuICAgIGdldEJsb2NrVHlwZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ibG9ja1R5cGU7XHJcbiAgICB9XHJcbiAgICBnZXRSb3coKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm93O1xyXG4gICAgfVxyXG4gICAgZ2V0Q29sKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbDtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgdmFyIEJsb2NrVHlwZTtcclxuKGZ1bmN0aW9uIChCbG9ja1R5cGUpIHtcclxuICAgIEJsb2NrVHlwZVtCbG9ja1R5cGVbXCJFbXB0eVwiXSA9IDBdID0gXCJFbXB0eVwiO1xyXG4gICAgQmxvY2tUeXBlW0Jsb2NrVHlwZVtcIldhbGxcIl0gPSAxXSA9IFwiV2FsbFwiO1xyXG59KShCbG9ja1R5cGUgfHwgKEJsb2NrVHlwZSA9IHt9KSk7XHJcbiIsImltcG9ydCB7IFVuaXRWZWN0b3IgfSBmcm9tIFwiLi9Vbml0VmVjdG9yXCI7XHJcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuL1V0aWwnO1xyXG52YXIgT2JqZWN0SGl0O1xyXG4oZnVuY3Rpb24gKE9iamVjdEhpdCkge1xyXG4gICAgT2JqZWN0SGl0W09iamVjdEhpdFtcIlBsYXllclwiXSA9IDBdID0gXCJQbGF5ZXJcIjtcclxuICAgIE9iamVjdEhpdFtPYmplY3RIaXRbXCJXYWxsXCJdID0gMV0gPSBcIldhbGxcIjtcclxuICAgIE9iamVjdEhpdFtPYmplY3RIaXRbXCJSYXlcIl0gPSAyXSA9IFwiUmF5XCI7XHJcbiAgICBPYmplY3RIaXRbT2JqZWN0SGl0W1wiTm9uZVwiXSA9IDNdID0gXCJOb25lXCI7XHJcbn0pKE9iamVjdEhpdCB8fCAoT2JqZWN0SGl0ID0ge30pKTtcclxuZXhwb3J0IGNsYXNzIEJ1bGxldCB7XHJcbiAgICBjb25zdHJ1Y3RvcihzdGFydFgsIHN0YXJ0WSwgdVZlY0RpciwgY2FudmFzMkQsIG1hcFNpemVJbmZvLCBjcm91Y2hlZEJ1bGxldCkge1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSAzO1xyXG4gICAgICAgIHRoaXMuZGltID0gNTsgLy9pLmUgc3F1YXJlIHNpZGUgbGVuZ3RoXHJcbiAgICAgICAgdGhpcy5jcm91Y2hlZEJ1bGxldCA9IGZhbHNlOyAvL2lmIGJ1bGxldCB3YXMgY3JlYXRlZCB3aGlsZSBwbGF5ZXIgY3JvdWNoZWQgKG5lZWRlZCBmb3IgcmVuZGVyaW5nIGhlaWdodCBvZiBidWxsZXQgaW4gM2QpXHJcbiAgICAgICAgdGhpcy51dGlsID0gbmV3IFV0aWwoKTtcclxuICAgICAgICB0aGlzLnhQb3MgPSBzdGFydFggLSB0aGlzLmRpbSAvIDI7IC8vY2VudGVyIGJ1bGxldCBhcm91bmQgcGxheWVyXHJcbiAgICAgICAgdGhpcy55UG9zID0gc3RhcnRZIC0gdGhpcy5kaW0gLyAyOyAvL2NlbnRlciBidWxsZXQgYXJvdW5kIHBsYXllclxyXG4gICAgICAgIHRoaXMudVZlY0RpciA9IHVWZWNEaXI7XHJcbiAgICAgICAgdGhpcy5jYW52YXMyRCA9IGNhbnZhczJEO1xyXG4gICAgICAgIHRoaXMubWFwU2l6ZUluZm8gPSBtYXBTaXplSW5mbztcclxuICAgICAgICB0aGlzLmNyb3VjaGVkQnVsbGV0ID0gY3JvdWNoZWRCdWxsZXQ7XHJcbiAgICB9XHJcbiAgICBtb3ZlQnVsbGV0KCkge1xyXG4gICAgICAgIHRoaXMueFBvcyArPSB0aGlzLnZlbG9jaXR5ICogdGhpcy51VmVjRGlyLmdldFgoKTtcclxuICAgICAgICB0aGlzLnlQb3MgKz0gdGhpcy52ZWxvY2l0eSAqIHRoaXMudVZlY0Rpci5nZXRZKCk7XHJcbiAgICB9XHJcbiAgICAvL3RoaXMgYWxnbyBleHBlY3RzIHRoZSB5IHRvIGJlIHJlbGF0aXZlIHRvIG9yaWdpbiBhdCBib3R0b20gbGVmdFxyXG4gICAgcG9pbnRBZnRlclJvdGF0aW9uKHVuUm90YXRlZFgsIHVuUm90YXRlZFksIGNsb2NrV2lzZVJvdGF0aW9uLCBjZW50ZXJPZlJvdFgsIGNlbnRlck9mUm90WSkge1xyXG4gICAgICAgIGxldCBuZXdYID0gKHVuUm90YXRlZFggLSBjZW50ZXJPZlJvdFgpICogTWF0aC5jb3MoLWNsb2NrV2lzZVJvdGF0aW9uKSAtICh1blJvdGF0ZWRZIC0gY2VudGVyT2ZSb3RZKSAqIE1hdGguc2luKC1jbG9ja1dpc2VSb3RhdGlvbikgKyBjZW50ZXJPZlJvdFg7XHJcbiAgICAgICAgbGV0IG5ld1kgPSAodW5Sb3RhdGVkWCAtIGNlbnRlck9mUm90WCkgKiBNYXRoLnNpbigtY2xvY2tXaXNlUm90YXRpb24pICsgKHVuUm90YXRlZFkgLSBjZW50ZXJPZlJvdFkpICogTWF0aC5jb3MoLWNsb2NrV2lzZVJvdGF0aW9uKSArIGNlbnRlck9mUm90WTtcclxuICAgICAgICByZXR1cm4geyB4OiBuZXdYLCB5OiBuZXdZIH07XHJcbiAgICB9XHJcbiAgICAvL3RoZSBwb250IG9mIHRoaXMgbWV0aG9kIGlzIHRvIHByb2plY3QgeCBldmVuIHNwYWNlZCB2ZWNzIG91dCBvZiBhIHNpZGUgb2YgdGhlIGJ1bGxldCAod2hpY2ggaXMgYSBzcXVhcmUpIGFuZCBkZXRlcm1pbmUgaWYgYW55IG9mIHRob3NlIGFyZSBpbiBhIHBsYXllciwgcmF5LCBvciB3YWxsXHJcbiAgICBjaGVja0lmQnVsbGV0U2lkZUluT2JqZWN0KHNpZGUsIG1hcCwgbWFwU2l6ZUluZm8pIHtcclxuICAgICAgICAvL3RoaXMgdmVjIGlzIGluIHRoZSBkaXIgb2YgdGhlIHNpZGUgb2YgdGhlIGJ1bGxldCB3ZSBjYXJlIGFib3V0XHJcbiAgICAgICAgbGV0IHVWZWMgPSBuZXcgVW5pdFZlY3Rvcih0aGlzLnVWZWNEaXIuZ2V0RGlyRGVnKCkpO1xyXG4gICAgICAgIGxldCBtYXBIZWlnaHQgPSBtYXBTaXplSW5mby5jZWxsSGVpZ2h0ICogbWFwU2l6ZUluZm8ucm93cztcclxuICAgICAgICAvL3RoZSByb2F0aW9uIGFsZ28gdXNlcyBub3JtYWwgY2FydGVzaWFuIGNvbnZlbnRpb24gb2YgYm90dG9tIGxlZnQgYXMgKDAsIDApIHNvIG5lZWQgdG8gaW52IHlcclxuICAgICAgICBsZXQgaW52ZXJzZVkgPSBtYXBIZWlnaHQgLSB0aGlzLnlQb3M7XHJcbiAgICAgICAgbGV0IG1pZFggPSB0aGlzLnhQb3MgKyB0aGlzLmRpbSAvIDI7XHJcbiAgICAgICAgbGV0IG1pZFkgPSBpbnZlcnNlWSAtIHRoaXMuZGltIC8gMjtcclxuICAgICAgICAvL2Fzc3VtZSBubyByb3RhdGlvbiBhbmQgbW92ZSBhY3Jvc3MgdG9wIGZhY2Ugb2YgYnVsbGV0IGZyb20gbGVmdCB0byByaWdodFxyXG4gICAgICAgIC8vdGhlbiByb3RhdGUgcG9pbnRzIHdpdGggcm90YXRpb24gb2YgYnVsbGV0ICsgYWRkaXRpb25hbCByb3RhdGF0aW9uIGRlcCBvbiBzaWRlXHJcbiAgICAgICAgLy8qKip1c2luZyBzcGVjaWFsIGZvcm11bGEgZm9yIHBvaW50IGFmdGVyIHJvdGF0aW9uOiBodHRwczovL21hdGguc3RhY2tleGNoYW5nZS5jb20vcXVlc3Rpb25zLzI3MDE5NC9ob3ctdG8tZmluZC10aGUtdmVydGljZXMtYW5nbGUtYWZ0ZXItcm90YXRpb24gLS0+IHRoZSBzZWNvbmQgZXhwYW5kZWQgZm9ybXVsYVxyXG4gICAgICAgIGxldCBjdXJQb2ludDtcclxuICAgICAgICAvL0ZPUldBUkQgZGlyIGlzIHNhbWUgZGlyIGFzIHVuaXQgdmVjIGZvciBkaXIgYnVsbGV0IGlzIHBvaW50aW5nXHJcbiAgICAgICAgaWYgKHNpZGUgPT09ICdMRUZUJykge1xyXG4gICAgICAgICAgICB1VmVjLnVwZGF0ZURpcigtOTApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzaWRlID09PSAnUklHSFQnKSB7XHJcbiAgICAgICAgICAgIHVWZWMudXBkYXRlRGlyKDkwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2lkZSA9PT0gJ0JPVFRPTScpIHtcclxuICAgICAgICAgICAgdVZlYy51cGRhdGVEaXIoMTgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG51bVByb2plY3Rpb25zID0gNTA7XHJcbiAgICAgICAgbGV0IHNwYWNlID0gdGhpcy5kaW0gLyBudW1Qcm9qZWN0aW9ucztcclxuICAgICAgICAvL3JlYWxseSBob3cgZmFyIG91dCBmcm9tIHNpZWQgb2Ygc3FhdXJlIHdlIHdhbnQgdG8gZ29cclxuICAgICAgICBsZXQgcHJvak1hZyA9IDAuMDE7XHJcbiAgICAgICAgbGV0IHByb2pYO1xyXG4gICAgICAgIGxldCBwcm9qWTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBudW1Qcm9qZWN0aW9uczsgaSsrKSB7XHJcbiAgICAgICAgICAgIGN1clBvaW50ID0gdGhpcy5wb2ludEFmdGVyUm90YXRpb24odGhpcy54UG9zICsgaSAqIHNwYWNlLCBpbnZlcnNlWSwgdVZlYy5nZXREaXJSYWQoKSwgbWlkWCwgbWlkWSk7XHJcbiAgICAgICAgICAgIHByb2pYID0gY3VyUG9pbnQueCArIHVWZWMuZ2V0WCgpICogcHJvak1hZztcclxuICAgICAgICAgICAgcHJvalkgPSAobWFwSGVpZ2h0IC0gY3VyUG9pbnQueSkgKyB1VmVjLmdldFkoKSAqIHByb2pNYWc7IC8vcmUgaW52IHkgc28gaXQgZm9sbG93cyBjYW52YXMgY29udmVudGlvblxyXG4gICAgICAgICAgICBpZiAodGhpcy51dGlsLmluTWFwQmxvY2socHJvalgsIHByb2pZLCBtYXBTaXplSW5mbywgbWFwKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdEhpdC5XYWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBPYmplY3RIaXQuTm9uZTtcclxuICAgIH1cclxuICAgIGNoZWNrT2JqZWN0SGl0KG1hcCwgbWFwU2l6ZUluZm8pIHtcclxuICAgICAgICBpZiAodGhpcy5jaGVja0lmQnVsbGV0U2lkZUluT2JqZWN0KCdGT1JXQVJEJywgbWFwLCBtYXBTaXplSW5mbykgPT09IE9iamVjdEhpdC5XYWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3RIaXQuV2FsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tJZkJ1bGxldFNpZGVJbk9iamVjdCgnTEVGVCcsIG1hcCwgbWFwU2l6ZUluZm8pID09PSBPYmplY3RIaXQuV2FsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0SGl0LldhbGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrSWZCdWxsZXRTaWRlSW5PYmplY3QoJ1JJR0hUJywgbWFwLCBtYXBTaXplSW5mbykgPT09IE9iamVjdEhpdC5XYWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3RIaXQuV2FsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tJZkJ1bGxldFNpZGVJbk9iamVjdCgnQk9UVE9NJywgbWFwLCBtYXBTaXplSW5mbykgPT09IE9iamVjdEhpdC5XYWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3RIaXQuV2FsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdEhpdC5Ob25lO1xyXG4gICAgfVxyXG4gICAgZHJhdzJEKCkge1xyXG4gICAgICAgIC8vIGV4cGFuZCBvdXQgZnJvbSBlYWNoIHNpZGUgYSBiaXQgdG8gc2VlIGlmIGluIGJsb2NrXHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY2FudmFzMkQuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2dyZXknO1xyXG4gICAgICAgIGxldCBtaWRYID0gdGhpcy54UG9zICsgdGhpcy5kaW0gLyAyO1xyXG4gICAgICAgIGxldCBtaWRZID0gdGhpcy55UG9zICsgdGhpcy5kaW0gLyAyO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUobWlkWCwgbWlkWSk7XHJcbiAgICAgICAgY3R4LnJvdGF0ZSh0aGlzLnVWZWNEaXIuZ2V0RGlyUmFkKCkpO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoLW1pZFgsIC1taWRZKTtcclxuICAgICAgICBjdHguZmlsbFJlY3QodGhpcy54UG9zLCB0aGlzLnlQb3MsIHRoaXMuZGltLCB0aGlzLmRpbSk7XHJcbiAgICAgICAgY3R4LnJlc2V0VHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcbiAgICBnZXRYKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnhQb3M7XHJcbiAgICB9XHJcbiAgICBnZXRZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnlQb3M7XHJcbiAgICB9XHJcbiAgICAvL2FjY291bnRzIGZvciByb3RhdGlvblxyXG4gICAgLy9BIC0tPiBCIC0tPiBDIC0tPiBEIGlzIGNsb2Nrd2lzZSBhcm91bmQgcmVjdGFuZ2xlIGZyb20gdG9wIGxlZnRcclxuICAgIGdldEJvdW5kaW5nQm94KG1hcFNpemVJbmZvKSB7XHJcbiAgICAgICAgbGV0IG1hcEhlaWdodCA9IG1hcFNpemVJbmZvLmNlbGxIZWlnaHQgKiBtYXBTaXplSW5mby5yb3dzO1xyXG4gICAgICAgIC8vdGhlIHJvYXRpb24gYWxnbyB1c2VzIG5vcm1hbCBjYXJ0ZXNpYW4gY29udmVudGlvbiBvZiBib3R0b20gbGVmdCBhcyAoMCwgMCkgc28gbmVlZCB0byBpbnYgeVxyXG4gICAgICAgIGxldCBpbnZlcnNlWSA9IG1hcEhlaWdodCAtIHRoaXMueVBvcztcclxuICAgICAgICBsZXQgbWlkWCA9IHRoaXMueFBvcyArIHRoaXMuZGltIC8gMjtcclxuICAgICAgICBsZXQgbWlkWSA9IGludmVyc2VZIC0gdGhpcy5kaW0gLyAyO1xyXG4gICAgICAgIGxldCBBID0gdGhpcy5wb2ludEFmdGVyUm90YXRpb24odGhpcy54UG9zLCBpbnZlcnNlWSwgdGhpcy51VmVjRGlyLmdldERpclJhZCgpLCBtaWRYLCBtaWRZKTtcclxuICAgICAgICBBLnkgPSAobWFwSGVpZ2h0IC0gQS55KTtcclxuICAgICAgICBsZXQgQiA9IHRoaXMucG9pbnRBZnRlclJvdGF0aW9uKHRoaXMueFBvcyArIHRoaXMuZGltLCBpbnZlcnNlWSwgdGhpcy51VmVjRGlyLmdldERpclJhZCgpLCBtaWRYLCBtaWRZKTtcclxuICAgICAgICBCLnkgPSAobWFwSGVpZ2h0IC0gQi55KTtcclxuICAgICAgICBsZXQgRCA9IHRoaXMucG9pbnRBZnRlclJvdGF0aW9uKHRoaXMueFBvcywgaW52ZXJzZVkgLSB0aGlzLmRpbSwgdGhpcy51VmVjRGlyLmdldERpclJhZCgpLCBtaWRYLCBtaWRZKTtcclxuICAgICAgICBELnkgPSAobWFwSGVpZ2h0IC0gRC55KTtcclxuICAgICAgICBsZXQgQyA9IHRoaXMucG9pbnRBZnRlclJvdGF0aW9uKHRoaXMueFBvcyArIHRoaXMuZGltLCBpbnZlcnNlWSAtIHRoaXMuZGltLCB0aGlzLnVWZWNEaXIuZ2V0RGlyUmFkKCksIG1pZFgsIG1pZFkpO1xyXG4gICAgICAgIEMueSA9IChtYXBIZWlnaHQgLSBDLnkpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIEE6IEEsXHJcbiAgICAgICAgICAgIEI6IEIsXHJcbiAgICAgICAgICAgIEM6IEMsXHJcbiAgICAgICAgICAgIEQ6IERcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZ2V0Q3JvdWNoZWRCdWxsZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JvdWNoZWRCdWxsZXQ7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vUGxheWVyXCI7XHJcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuL01hcFwiO1xyXG5pbXBvcnQgeyBVbml0VmVjdG9yIH0gZnJvbSBcIi4vVW5pdFZlY3RvclwiO1xyXG52YXIgT2JqZWN0SGl0O1xyXG4oZnVuY3Rpb24gKE9iamVjdEhpdCkge1xyXG4gICAgT2JqZWN0SGl0W09iamVjdEhpdFtcIlBsYXllclwiXSA9IDBdID0gXCJQbGF5ZXJcIjtcclxuICAgIE9iamVjdEhpdFtPYmplY3RIaXRbXCJXYWxsXCJdID0gMV0gPSBcIldhbGxcIjtcclxuICAgIE9iamVjdEhpdFtPYmplY3RIaXRbXCJSYXlcIl0gPSAyXSA9IFwiUmF5XCI7XHJcbiAgICBPYmplY3RIaXRbT2JqZWN0SGl0W1wiTm9uZVwiXSA9IDNdID0gXCJOb25lXCI7XHJcbn0pKE9iamVjdEhpdCB8fCAoT2JqZWN0SGl0ID0ge30pKTtcclxuZXhwb3J0IGNsYXNzIEdhbWVTdGF0ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMyRCwgY2FudmFzM0QsIG1hcFRlbXBsYXRlLCBhdWRpb0NvbnRyb2wpIHtcclxuICAgICAgICB0aGlzLmNhbnZhczJEID0gY2FudmFzMkQ7XHJcbiAgICAgICAgdGhpcy5jYW52YXMzRCA9IGNhbnZhczNEO1xyXG4gICAgICAgIHRoaXMubWFwU2l6ZUluZm8gPSB7IHJvd3M6IG1hcFRlbXBsYXRlLmxlbmd0aCxcclxuICAgICAgICAgICAgY29sczogbWFwVGVtcGxhdGVbMF0ubGVuZ3RoLFxyXG4gICAgICAgICAgICBjZWxsV2lkdGg6IGNhbnZhczJELndpZHRoIC8gbWFwVGVtcGxhdGVbMF0ubGVuZ3RoLFxyXG4gICAgICAgICAgICBjZWxsSGVpZ2h0OiBjYW52YXMyRC5oZWlnaHQgLyBtYXBUZW1wbGF0ZS5sZW5ndGggfTtcclxuICAgICAgICB0aGlzLm1hcCA9IG5ldyBNYXAodGhpcy5tYXBTaXplSW5mbywgbWFwVGVtcGxhdGUsIGNhbnZhczJEKTtcclxuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoMzAwLCAzNTAsIG5ldyBVbml0VmVjdG9yKDI3MCksIHRoaXMubWFwLCBjYW52YXMyRCwgY2FudmFzM0QsIGF1ZGlvQ29udHJvbCwgdGhpcy5tYXBTaXplSW5mbyk7XHJcbiAgICB9XHJcbiAgICAvL1BsYXllciBpbmZvXHJcbiAgICBpc1BsYXllck1vdmluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXIuaXNQbGF5ZXJNb3ZpbmcoKTtcclxuICAgIH1cclxuICAgIGlzUGxheWVyQ3JvdWNoaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYXllci5pc1BsYXllckNyb3VjaGluZygpO1xyXG4gICAgfVxyXG4gICAgaXNQbGF5ZXJSdW5uaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYXllci5pc1BsYXllclJ1bm5pbmcoKTtcclxuICAgIH1cclxuICAgIGdldENlbnRlclgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxheWVyLmdldFhNaWQoKTtcclxuICAgIH1cclxuICAgIGdldENlbnRlclkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxheWVyLmdldFlNaWQoKTtcclxuICAgIH1cclxuICAgIGdldENlbnRlckRpcigpIHtcclxuICAgICAgICBsZXQgY2VudGVyRGlyID0gdGhpcy5wbGF5ZXIuZ2V0VW5pdFZlYygpO1xyXG4gICAgICAgIHJldHVybiBjZW50ZXJEaXI7XHJcbiAgICB9XHJcbiAgICAvL01hcCBpbmZvXHJcbiAgICBnZXRNYXBTaXplSW5mbygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXBTaXplSW5mbztcclxuICAgIH1cclxuICAgIGdldE1hcCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXA7XHJcbiAgICB9XHJcbiAgICAvL0RyYXdpbmdcclxuICAgIGRyYXdNYXAoKSB7XHJcbiAgICAgICAgdGhpcy5tYXAuZHJhd01hcCgpO1xyXG4gICAgfVxyXG4gICAgZHJhd1BsYXllcigpIHtcclxuICAgICAgICB0aGlzLnBsYXllci5kcmF3MkQoKTtcclxuICAgIH1cclxuICAgIC8vVXBkYXRpbmcgYW5kIGRyYXdpbmcgYnVsbGV0c1xyXG4gICAgdXBkYXRlQW5kRHJhd0J1bGxldHMoKSB7XHJcbiAgICAgICAgbGV0IGJ1bGxldHMgPSB0aGlzLnBsYXllci5nZXRCdWxsZXRzKCkuc2xpY2UoMCk7XHJcbiAgICAgICAgYnVsbGV0cy5mb3JFYWNoKChidWxsZXQsIGkpID0+IHtcclxuICAgICAgICAgICAgYnVsbGV0Lm1vdmVCdWxsZXQoKTtcclxuICAgICAgICAgICAgaWYgKGJ1bGxldC5jaGVja09iamVjdEhpdCh0aGlzLm1hcCwgdGhpcy5tYXBTaXplSW5mbykgPT09IE9iamVjdEhpdC5XYWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5yZW1vdmVCdWxsZXRzKGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy9nb25uYSBkcmF3IGV2ZW4gYWZ0ZXIgY29sbGlzaW9uXHJcbiAgICAgICAgYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiBidWxsZXQuZHJhdzJEKCkpO1xyXG4gICAgfVxyXG4gICAgZ2V0QWxsQnVsbGV0cygpIHtcclxuICAgICAgICAvL2xldCBidWxsZXRzOiBCdWxsZXRbXSA9IHRoaXMucGxheWVyLmdldEJ1bGxldHMoKS5zbGljZSgwKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXIuZ2V0QnVsbGV0cygpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi9CbG9jayc7XHJcbmltcG9ydCB7IEJsb2NrVHlwZSB9IGZyb20gJy4vQmxvY2tUeXBlJztcclxuZXhwb3J0IGNsYXNzIE1hcCB7XHJcbiAgICBjb25zdHJ1Y3RvcihtYXBTaXplSW5mbywgbWFwVGVtcGxhdGUsIGNhbnZhcykge1xyXG4gICAgICAgIHRoaXMuYmxvY2tzID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5tYXBTaXplSW5mbyA9IG1hcFNpemVJbmZvO1xyXG4gICAgICAgIGlmIChtYXBUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICBtYXBUZW1wbGF0ZS5mb3JFYWNoKChyb3csIGlSb3cpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCByID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgICAgICAgICByb3cuZm9yRWFjaCgoYlR5cGUsIGlDb2wpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByLnB1c2gobmV3IEJsb2NrKGJUeXBlLCBpUm93LCBpQ29sKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tzLnB1c2gocik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRyYXdNYXAoKSB7XHJcbiAgICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuYmxvY2tzLmZvckVhY2goKHJvdywgaVJvdykgPT4ge1xyXG4gICAgICAgICAgICByb3cuZm9yRWFjaCgoYmxvY2ssIGlDb2wpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChibG9jay5ibG9ja1R5cGUgPT09IEJsb2NrVHlwZS5XYWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnJlY3QodGhpcy5tYXBTaXplSW5mby5jZWxsV2lkdGggKiBpQ29sLCB0aGlzLm1hcFNpemVJbmZvLmNlbGxIZWlnaHQgKiBpUm93LCB0aGlzLm1hcFNpemVJbmZvLmNlbGxXaWR0aCwgdGhpcy5tYXBTaXplSW5mby5jZWxsSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldEJsb2NrcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ibG9ja3M7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVW5pdFZlY3RvciB9IGZyb20gJy4vVW5pdFZlY3Rvcic7XHJcbmltcG9ydCB7IEJ1bGxldCB9IGZyb20gJy4vQnVsbGV0JztcclxuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4vVXRpbCc7XHJcbi8vbm90IHVzaW5nIFdBU0QgYmVjYXVzZSBpdCB3YXMgY2F1c2luZyBwcm9ibGVtc1xyXG4vL3NwZWNpZmljYWxseSB3aGVuIGNyb3VjaGluZyArIG1vdmluZyBmb3J3YXJkL2JhY2t3YXJkIGFuZCB0aGVuIHRyeWluZyB0byByb3RhdGFlIHJpZ2h0ICh3b3VsZG50IHJvdGF0ZSBidXQgZm9yIHNvbWUgcmVhc29uIHJvdGF0ZSBsZWZ0IHdvcmtlZClcclxudmFyIEtFWVM7XHJcbihmdW5jdGlvbiAoS0VZUykge1xyXG4gICAgS0VZU1tcIlVQXCJdID0gXCJ3XCI7XHJcbiAgICBLRVlTW1wiTEVGVF9ST1RBVElPTlwiXSA9IFwiYVwiO1xyXG4gICAgS0VZU1tcIkRPV05cIl0gPSBcInNcIjtcclxuICAgIEtFWVNbXCJSSUdIVF9ST1RBVElPTlwiXSA9IFwiZFwiO1xyXG4gICAgS0VZU1tcIkNST1VDSFwiXSA9IFwiY1wiO1xyXG4gICAgS0VZU1tcIlJVTlwiXSA9IFwiIFwiO1xyXG59KShLRVlTIHx8IChLRVlTID0ge30pKTtcclxuZXhwb3J0IGNsYXNzIFBsYXllciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4UG9zLCB5UG9zLCBzdGFydGluZ0RpclVWZWMsIG1hcCwgY2FudmFzMkQsIGNhbnZhczNELCBhdWRpb0NvbnRyb2wsIG1hcFNpemVJbmZvKSB7XHJcbiAgICAgICAgdGhpcy5zdGFuZGluZ1ZlbCA9IDEuNTtcclxuICAgICAgICB0aGlzLmNyb3VjaGluZ1ZlbCA9IDAuNzU7XHJcbiAgICAgICAgdGhpcy5ydW5uaW5nVmVsID0gMztcclxuICAgICAgICB0aGlzLnN0YW5kaW5nQW5ndWxhclZlbCA9IDk7XHJcbiAgICAgICAgdGhpcy5jcm91Y2hpbmdBbmd1bGFyVmVsID0gMS41O1xyXG4gICAgICAgIHRoaXMucGxheWVyQ2lyY2xlUmFkaXVzID0gMjtcclxuICAgICAgICB0aGlzLmtleXNTdGF0ZSA9IHt9O1xyXG4gICAgICAgIHRoaXMuYnVsbGV0cyA9IFtdO1xyXG4gICAgICAgIHRoaXMudXRpbCA9IG5ldyBVdGlsKCk7XHJcbiAgICAgICAgdGhpcy54UG9zID0geFBvcztcclxuICAgICAgICB0aGlzLnlQb3MgPSB5UG9zO1xyXG4gICAgICAgIHRoaXMuZGlyVVZlYyA9IHN0YXJ0aW5nRGlyVVZlYztcclxuICAgICAgICB0aGlzLm1hcCA9IG1hcDtcclxuICAgICAgICB0aGlzLmNhbnZhczJEID0gY2FudmFzMkQ7XHJcbiAgICAgICAgdGhpcy5jYW52YXMzRCA9IGNhbnZhczNEO1xyXG4gICAgICAgIHRoaXMuYXVkaW9Db250cm9sID0gYXVkaW9Db250cm9sO1xyXG4gICAgICAgIHRoaXMubWFwU2l6ZUluZm8gPSBtYXBTaXplSW5mbztcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBhbmcgPSBNYXRoLmF0YW4oKHRoaXMuY3VyTW91c2VQb3NYIC0gNzAwIC8gMikgLyAzNTApICsgdGhpcy5kaXJVVmVjLmdldERpclJhZCgpO1xyXG4gICAgICAgICAgICBsZXQgdVZlYyA9IG5ldyBVbml0VmVjdG9yKHRoaXMudXRpbC50b0RlZyhhbmcpKTtcclxuICAgICAgICAgICAgdGhpcy5idWxsZXRzLnB1c2gobmV3IEJ1bGxldCh0aGlzLmdldFhNaWQoKSwgdGhpcy5nZXRZTWlkKCksIHVWZWMsIHRoaXMuY2FudmFzMkQsIHRoaXMubWFwU2l6ZUluZm8sIHRoaXMuaXNQbGF5ZXJDcm91Y2hpbmcoKSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgS0VZUy5SVU46XHJcbiAgICAgICAgICAgICAgICAgICAgLy9yZWxlYXNlIHRoZSBydW4ga2V5IG9ubHkgZG9lcyBhbnl0aGluZyB3aGVuIHdlIGFyZSBjdXIgcnVubmluZyBidXQgbm90IGNyb3VjaGluZ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vd2UgZG9udCB3YW50IHRvIGNoYW5nZSBhdWRpbyB0byB3YWxraW5nIHdoZW4gd2UgYXJlIGNyb3VjaGluZyttb3ZpbmcgYW5kIGp1c3QgcHJlc3MgYW5kIHJsZWFzZSB0aGUgcnVuIGtleVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5rZXlzU3RhdGVbS0VZUy5DUk9VQ0hdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXVkaW9Db250cm9sLnNldEF1ZGlvV2Fsa2luZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmtleXNTdGF0ZVtLRVlTLlJVTl0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEtFWVMuQ1JPVUNIOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vd2UgZG9udCB3YW50IHNvbWVvbmUgdG8gcHJlc3MgYW5kIHJlbGVhc2UgY3JvdWNoIGtleSB3aGlsZSBydW5uaW5nIGFuZCBjaGFuZ2UgYXVkaW8gdG8gd2Fsa2luZ1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5rZXlzU3RhdGVbS0VZUy5SVU5dKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXVkaW9Db250cm9sLnNldEF1ZGlvV2Fsa2luZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmtleXNTdGF0ZVtLRVlTLkNST1VDSF0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEtFWVMuVVA6XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kb250IHdhbnQgc29tZW9uZSB0byBwcmVzcyBhbmQgcmVsZWFzZSB1cCB3aGlsZSBtb3ZpbmcgYmFjayBhbmQgc3RvcCBhdWRpb1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5rZXlzU3RhdGVbS0VZUy5ET1dOXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvQ29udHJvbC5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5rZXlzU3RhdGVbS0VZUy5VUF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmtleXNTdGF0ZVtLRVlTLlVQXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBLRVlTLkRPV046XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kb250IHdhbnQgc29tZW9uZSB0byBwcmVzcyBhbmQgcmVsZWFzZSBkb3duIHdoaWxlIG1vdmluZyBmb3J3YXJkIGFuZCBzdG9wIGF1ZGlvXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmtleXNTdGF0ZVtLRVlTLlVQXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvQ29udHJvbC5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5rZXlzU3RhdGVbS0VZUy5ET1dOXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2V5c1N0YXRlW0tFWVMuRE9XTl0gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgS0VZUy5MRUZUX1JPVEFUSU9OOlxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5rZXlzU3RhdGVbS0VZUy5MRUZUX1JPVEFUSU9OXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlzU3RhdGVbS0VZUy5MRUZUX1JPVEFUSU9OXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEtFWVMuUklHSFRfUk9UQVRJT046XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmtleXNTdGF0ZVtLRVlTLlJJR0hUX1JPVEFUSU9OXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlzU3RhdGVbS0VZUy5SSUdIVF9ST1RBVElPTl0gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZWN0ID0gdGhpcy5jYW52YXMzRC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgbGV0IHhQb3MgPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICAgICAgICAgIHRoaXMuY3VyTW91c2VQb3NYID0geFBvcztcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZS5jbGllbnRYKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZS5rZXkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgS0VZUy5SVU46XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmtleXNTdGF0ZVtLRVlTLkNST1VDSF0pIHsgLy9jYW50IHJ1biB3aGVuIGNyb3VjaGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvQ29udHJvbC5zZXRBdWRpb1J1bm5pbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5rZXlzU3RhdGVbS0VZUy5SVU5dID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEtFWVMuQ1JPVUNIOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5rZXlzU3RhdGVbS0VZUy5SVU5dKSB7IC8vY2FudCBnZXQgZnJvbSBydW5uaW5nIHRvIGNyb3VjaFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvQ29udHJvbC5zZXRBdWRpb0Nyb3VjaGluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmtleXNTdGF0ZVtLRVlTLkNST1VDSF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgS0VZUy5VUDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5rZXlzU3RhdGVbS0VZUy5ET1dOXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvL2NhbnQgZ28gZm9yd2FyZCBhbmQgYmFjayBhdCBzYW1lIHRpbWVcclxuICAgICAgICAgICAgICAgICAgICAvL3NvIGlmIHVyIGFscmVhZHkgY3JvdWNoaW5nIGFuZCB0aGVuIHN0YXJ0IG1vdmluZywgYXVkaW8gd29udCBvdmVyd3JpdGUgdG8gd2Fsa2luZyBzdGFuZGluIGF1ZGlvXHJcbiAgICAgICAgICAgICAgICAgICAgLy9zaW1pbGFyIGlkZWEgZm9yIHJ1blxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5rZXlzU3RhdGVbS0VZUy5DUk9VQ0hdICYmICF0aGlzLmtleXNTdGF0ZVtLRVlTLlJVTl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdWRpb0NvbnRyb2wuc2V0QXVkaW9XYWxraW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXVkaW9Db250cm9sLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMua2V5c1N0YXRlW0tFWVMuVVBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2V5c1N0YXRlW0tFWVMuVVBdID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlRm9yd2FyZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBLRVlTLkRPV046XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMua2V5c1N0YXRlW0tFWVMuVVBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vY2FudCBnbyBmb3J3YXJkIGFuZCBiYWNrIGF0IHNhbWUgdGltZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vc28gaWYgdXIgYWxyZWFkeSBjcm91Y2hpbmcgYW5kIHRoZW4gc3RhcnQgbW92aW5nLCBhdWRpbyB3b250IG92ZXJ3cml0ZSB0byB3YWxraW5nIHN0YW5kaW4gYXVkaW9cclxuICAgICAgICAgICAgICAgICAgICAvL3NpbWlsYXIgaWRlYSBmb3IgcnVuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmtleXNTdGF0ZVtLRVlTLkNST1VDSF0gJiYgIXRoaXMua2V5c1N0YXRlW0tFWVMuUlVOXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvQ29udHJvbC5zZXRBdWRpb1dhbGtpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdWRpb0NvbnRyb2wucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5rZXlzU3RhdGVbS0VZUy5ET1dOXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmtleXNTdGF0ZVtLRVlTLkRPV05dID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmFja3dhcmQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgS0VZUy5MRUZUX1JPVEFUSU9OOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5rZXlzU3RhdGVbS0VZUy5MRUZUX1JPVEFUSU9OXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmtleXNTdGF0ZVtLRVlTLkxFRlRfUk9UQVRJT05dID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3RhdGUoJ0xFRlQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgS0VZUy5SSUdIVF9ST1RBVElPTjpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMua2V5c1N0YXRlW0tFWVMuUklHSFRfUk9UQVRJT05dKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2V5c1N0YXRlW0tFWVMuUklHSFRfUk9UQVRJT05dID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3RhdGUoJ1JJR0hUJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDI1KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGlzUGxheWVyTW92aW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmtleXNTdGF0ZVtLRVlTLlVQXSB8fCB0aGlzLmtleXNTdGF0ZVtLRVlTLkRPV05dO1xyXG4gICAgfVxyXG4gICAgaXNQbGF5ZXJDcm91Y2hpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5c1N0YXRlW0tFWVMuQ1JPVUNIXTtcclxuICAgIH1cclxuICAgIGlzUGxheWVyUnVubmluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5rZXlzU3RhdGVbS0VZUy5SVU5dO1xyXG4gICAgfVxyXG4gICAgZ2V0QnVsbGV0cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5idWxsZXRzO1xyXG4gICAgfVxyXG4gICAgc2V0QnVsbGV0cyhidWxsZXRzKSB7XHJcbiAgICAgICAgdGhpcy5idWxsZXRzID0gYnVsbGV0cztcclxuICAgIH1cclxuICAgIHJlbW92ZUJ1bGxldHMoaW5kZXgpIHtcclxuICAgICAgICB0aGlzLmJ1bGxldHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICAgIC8vIHJvdGF0ZU9uTW91c2VQb3MoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZGlyRm9yd2FyZDogYm9vbGVhbik6dm9pZCB7XHJcbiAgICAvLyAgICAgbGV0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAvLyAgICAgbGV0IHhQb3M6IG51bWJlciA9IHRoaXMuY3VyTW91c2VQb3NYIC0gcmVjdC5sZWZ0O1xyXG4gICAgLy8gICAgIGlmICh4UG9zIDwgY2FudmFzLndpZHRoLzMpIHtcclxuICAgIC8vICAgICAgICAgdGhpcy5kaXJVVmVjLnVwZGF0ZURpcihkaXJGb3J3YXJkID8gLXRoaXMuYW5ndWxhclZlbG9jaXR5IDogdGhpcy5hbmd1bGFyVmVsb2NpdHkpO1xyXG4gICAgLy8gICAgIH0gZWxzZSBpZiAoeFBvcyA+IDIqY2FudmFzLndpZHRoLzMpIHtcclxuICAgIC8vICAgICAgICAgdGhpcy5kaXJVVmVjLnVwZGF0ZURpcihkaXJGb3J3YXJkID8gdGhpcy5hbmd1bGFyVmVsb2NpdHkgOiAtdGhpcy5hbmd1bGFyVmVsb2NpdHkpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuICAgIHJvdGF0ZShkaXIpIHtcclxuICAgICAgICBsZXQgdmVsID0gdGhpcy5rZXlzU3RhdGVbS0VZUy5DUk9VQ0hdID8gdGhpcy5jcm91Y2hpbmdBbmd1bGFyVmVsIDogdGhpcy5zdGFuZGluZ0FuZ3VsYXJWZWw7XHJcbiAgICAgICAgaWYgKGRpciA9PT0gJ0xFRlQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlyVVZlYy51cGRhdGVEaXIoLXZlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGRpciA9PT0gJ1JJR0hUJykge1xyXG4gICAgICAgICAgICB0aGlzLmRpclVWZWMudXBkYXRlRGlyKHZlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9jcm91Y2hpbmcgdGFrZXMgcHJpbyBvdmVyIHJ1bm5pbmdcclxuICAgIG1vdmVGb3J3YXJkKCkge1xyXG4gICAgICAgIGxldCB2ZWwgPSB0aGlzLmtleXNTdGF0ZVtLRVlTLkNST1VDSF0gPyB0aGlzLmNyb3VjaGluZ1ZlbCA6ICh0aGlzLmtleXNTdGF0ZVtLRVlTLlJVTl0gPyB0aGlzLnJ1bm5pbmdWZWwgOiB0aGlzLnN0YW5kaW5nVmVsKTtcclxuICAgICAgICBsZXQgY2hhbmdlWCA9IHZlbCAqIHRoaXMuZGlyVVZlYy5nZXRYKCk7XHJcbiAgICAgICAgbGV0IGNoYW5nZVkgPSB2ZWwgKiB0aGlzLmRpclVWZWMuZ2V0WSgpO1xyXG4gICAgICAgIGlmICghdGhpcy51dGlsLmluTWFwQmxvY2sodGhpcy54UG9zICsgY2hhbmdlWCwgdGhpcy55UG9zICsgY2hhbmdlWSwgdGhpcy5tYXBTaXplSW5mbywgdGhpcy5tYXApKSB7XHJcbiAgICAgICAgICAgIHRoaXMueVBvcyArPSB2ZWwgKiB0aGlzLmRpclVWZWMuZ2V0WSgpO1xyXG4gICAgICAgICAgICB0aGlzLnhQb3MgKz0gdmVsICogdGhpcy5kaXJVVmVjLmdldFgoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvL2Nyb3VjaGluZyB0YWtlcyBwcmlvIG92ZXIgcnVubmluZ1xyXG4gICAgbW92ZUJhY2t3YXJkKCkge1xyXG4gICAgICAgIGxldCB2ZWwgPSB0aGlzLmtleXNTdGF0ZVtLRVlTLkNST1VDSF0gPyB0aGlzLmNyb3VjaGluZ1ZlbCA6ICh0aGlzLmtleXNTdGF0ZVtLRVlTLlJVTl0gPyB0aGlzLnJ1bm5pbmdWZWwgOiB0aGlzLnN0YW5kaW5nVmVsKTtcclxuICAgICAgICBsZXQgY2hhbmdlWCA9IC12ZWwgKiB0aGlzLmRpclVWZWMuZ2V0WCgpO1xyXG4gICAgICAgIGxldCBjaGFuZ2VZID0gLXZlbCAqIHRoaXMuZGlyVVZlYy5nZXRZKCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnV0aWwuaW5NYXBCbG9jayh0aGlzLnhQb3MgKyBjaGFuZ2VYLCB0aGlzLnlQb3MgKyBjaGFuZ2VZLCB0aGlzLm1hcFNpemVJbmZvLCB0aGlzLm1hcCkpIHtcclxuICAgICAgICAgICAgdGhpcy55UG9zIC09IHZlbCAqIHRoaXMuZGlyVVZlYy5nZXRZKCk7XHJcbiAgICAgICAgICAgIHRoaXMueFBvcyAtPSB2ZWwgKiB0aGlzLmRpclVWZWMuZ2V0WCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRyYXcyRCgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jYW52YXMyRC5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIGxldCByYWRBbmdsZSA9IHRoaXMuZGlyVVZlYy5nZXREaXJSYWQoKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKHRoaXMueFBvcywgdGhpcy55UG9zKTtcclxuICAgICAgICBjdHgucm90YXRlKHJhZEFuZ2xlKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKC10aGlzLnhQb3MsIC10aGlzLnlQb3MpO1xyXG4gICAgICAgIC8vY3R4LmZpbGxSZWN0KHRoaXMueFBvcywgdGhpcy55UG9zLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5hcmModGhpcy54UG9zLCB0aGlzLnlQb3MsIHRoaXMucGxheWVyQ2lyY2xlUmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnZ3JlZW4nO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcclxuICAgIH1cclxuICAgIGdldFVuaXRWZWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlyVVZlYztcclxuICAgIH1cclxuICAgIGdldFhNaWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueFBvcztcclxuICAgIH1cclxuICAgIGdldFlNaWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueVBvcztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi9VdGlsJztcclxuZXhwb3J0IGNsYXNzIFJheSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnU3RhdGUsIGNhbnZhczJELCBjYW52YXMzRCwgdVZlY0Rpcikge1xyXG4gICAgICAgIHRoaXMud2Fsa2luZ0ZyYW1lQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMud2Fsa2luZ0ZyYW1lSW5jciA9IDQ7IC8vZm9ybXVsYSBmb3IgbnVtIG9mIHVwIGFuZCBkb3ducyBpcyAxLygyL3dhbGluZ0ZyYW1lSW5jcilcclxuICAgICAgICB0aGlzLnV0aWwgPSBuZXcgVXRpbCgpO1xyXG4gICAgICAgIHRoaXMuZ1N0YXRlID0gZ1N0YXRlO1xyXG4gICAgICAgIHRoaXMuY2FudmFzMkQgPSBjYW52YXMyRDtcclxuICAgICAgICB0aGlzLmNhbnZhczNEID0gY2FudmFzM0Q7XHJcbiAgICAgICAgdGhpcy51VmVjRGlyID0gdVZlY0RpcjtcclxuICAgICAgICAvL2Zsb29yIHdpbGwgYmUgYXQgbWF4IGhhbGYgd2F5IHVwIHRoZSBzY3JlZW4gaS5lIGNhbnZhczNkIGhlaWdodCAvIDJcclxuICAgICAgICBsZXQgY29sb3IgPSB7IHI6IDAsIGc6IDE4MywgYjogMjU1IH07XHJcbiAgICAgICAgdGhpcy5ncmQgPSBjYW52YXMzRC5nZXRDb250ZXh0KCcyZCcpLmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIGNhbnZhczNELmhlaWdodCwgMCwgY2FudmFzM0QuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgbGV0IG51bVBpeFRvQWRkTmV3U3RvcENvbG9yID0gMi41O1xyXG4gICAgICAgIGxldCBjb2xvckNoYW5nZVBlclN0b3BDb2xvciA9IDE7XHJcbiAgICAgICAgbGV0IG51bUluY3JzID0gTWF0aC5jZWlsKChjYW52YXMzRC5oZWlnaHQgLyAyKSAvIG51bVBpeFRvQWRkTmV3U3RvcENvbG9yKTtcclxuICAgICAgICBsZXQgc3RvcENvbG9yU3RlcCA9IDEgLyBudW1JbmNycztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUluY3JzOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5ncmQuYWRkQ29sb3JTdG9wKGkgKiBzdG9wQ29sb3JTdGVwLCBgcmdiKCR7Y29sb3Iucn0sICR7Y29sb3IuZ30sICR7Y29sb3IuYn0pYCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0Q29sb3IoY29sb3IsIHsgcjogMCwgZzogLWNvbG9yQ2hhbmdlUGVyU3RvcENvbG9yLCBiOiAtY29sb3JDaGFuZ2VQZXJTdG9wQ29sb3IgKiAxLjQgfSk7IC8vdGhhdCAqMS40IGlzIGp1c3QgdGhlcmUgYmVjYXVzZSB0byBhY2MgZGFya2VuIGZyb20gbGlnaHQgdG8gZGFyayBibHVlIHRvIGJsYWNrIHRoZSBiIHBhcnQgY2hhbmdlcyBhdCBhIHJhdGUgb2YgMS40XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0RWRnZUNvcmRzKGJsb2NrKSB7XHJcbiAgICAgICAgbGV0IGNlbGxXaWR0aCA9IHRoaXMuZ1N0YXRlLmdldE1hcFNpemVJbmZvKCkuY2VsbFdpZHRoO1xyXG4gICAgICAgIGxldCBjZWxsSGVpZ2h0ID0gdGhpcy5nU3RhdGUuZ2V0TWFwU2l6ZUluZm8oKS5jZWxsSGVpZ2h0O1xyXG4gICAgICAgIGxldCBibG9ja1ggPSBjZWxsV2lkdGggKiBibG9jay5nZXRDb2woKTtcclxuICAgICAgICBsZXQgYmxvY2tZID0gY2VsbEhlaWdodCAqIGJsb2NrLmdldFJvdygpO1xyXG4gICAgICAgIHJldHVybiB7IEM6IHsgeDogYmxvY2tYLCB5OiBibG9ja1kgKyBjZWxsSGVpZ2h0IH0sXHJcbiAgICAgICAgICAgIEQ6IHsgeDogYmxvY2tYICsgY2VsbFdpZHRoLCB5OiBibG9ja1kgKyBjZWxsSGVpZ2h0IH0sXHJcbiAgICAgICAgICAgIEI6IHsgeDogYmxvY2tYICsgY2VsbFdpZHRoLCB5OiBibG9ja1kgfSxcclxuICAgICAgICAgICAgQTogeyB4OiBibG9ja1gsIHk6IGJsb2NrWSB9IH07XHJcbiAgICB9XHJcbiAgICBjaGVja0VkZ2VSYXkoYmxvY2tIaXQpIHtcclxuICAgICAgICBsZXQgZWRnZUNvb3JkcyA9IHRoaXMuZ2V0RWRnZUNvcmRzKGJsb2NrSGl0KTtcclxuICAgICAgICB0aGlzLmVkZ2VSYXkgPSBmYWxzZTtcclxuICAgICAgICBsZXQgc3RhcnRUb0VkZ2VWZWMgPSBudWxsO1xyXG4gICAgICAgIGxldCBzdGFydFRvRWRnZVZlY01hZyA9IG51bGw7XHJcbiAgICAgICAgbGV0IGFuZ2xlQmV0d2VlblJheUFuZFN0YXJ0VG9FZGdlVmVjID0gbnVsbDtcclxuICAgICAgICBsZXQgZGlzdEJldHdlZW5SYXlFbmRBbmRTdGFydFRvRWRnZVZlY0VuZCA9IG51bGw7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoZWRnZUNvb3JkcykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgICBzdGFydFRvRWRnZVZlYyA9IHsgeDogZWRnZUNvb3Jkc1trZXldLnggLSB0aGlzLmdTdGF0ZS5nZXRDZW50ZXJYKCksIHk6IGVkZ2VDb29yZHNba2V5XS55IC0gdGhpcy5nU3RhdGUuZ2V0Q2VudGVyWSgpIH07XHJcbiAgICAgICAgICAgIHN0YXJ0VG9FZGdlVmVjTWFnID0gTWF0aC5zcXJ0KE1hdGgucG93KHN0YXJ0VG9FZGdlVmVjLngsIDIpICsgTWF0aC5wb3coc3RhcnRUb0VkZ2VWZWMueSwgMikpO1xyXG4gICAgICAgICAgICAvL2RvaW5nIGRvdCBwcm9kIHRvIGdldCBhbmdsZSBiZXR3ZWVuIHJheSB2ZWMgbmFkIHN0YXJ0IHRvIGVkZ2UgdmVjXHJcbiAgICAgICAgICAgIGFuZ2xlQmV0d2VlblJheUFuZFN0YXJ0VG9FZGdlVmVjID0gTWF0aC5hY29zKCh0aGlzLnVWZWNEaXIuZ2V0WCgpICogc3RhcnRUb0VkZ2VWZWMueCArIHRoaXMudVZlY0Rpci5nZXRZKCkgKiBzdGFydFRvRWRnZVZlYy55KSAvIChzdGFydFRvRWRnZVZlY01hZykpICogMTgwIC8gTWF0aC5QSTtcclxuICAgICAgICAgICAgLy9kaXN0IGZvcm11bGFcclxuICAgICAgICAgICAgZGlzdEJldHdlZW5SYXlFbmRBbmRTdGFydFRvRWRnZVZlY0VuZCA9IE1hdGguc3FydChNYXRoLnBvdygoZWRnZUNvb3Jkc1trZXldLnggLSB0aGlzLmVuZFgpLCAyKSArIE1hdGgucG93KChlZGdlQ29vcmRzW2tleV0ueSAtIHRoaXMuZW5kWSksIDIpKTtcclxuICAgICAgICAgICAgLy9zbyBib3RoIHRoZSBhbmdsZSBiZXR3ZWVuIHRoZSBjdXIgcmF5IGFuZCB0aGUgcHJvamVjdGVkIHJheSBmcm9tIGVuZGdlIHRvIHN0YXJ0IGhhcyB0byBiZSB3aXRoaW4gYSBsaW1pdCBCVVQgQUxTT1xyXG4gICAgICAgICAgICAvL3RoZSBkaXN0IGIvdyBlbmQgb2YgcmF5IGFuZCBlYWNoIGVkZ2UgaGFzIHRvIGJlIHdpdGhpbiBhIGxpbWl0IHRvb1xyXG4gICAgICAgICAgICBpZiAoYW5nbGVCZXR3ZWVuUmF5QW5kU3RhcnRUb0VkZ2VWZWMgPD0gMC4xICYmIGRpc3RCZXR3ZWVuUmF5RW5kQW5kU3RhcnRUb0VkZ2VWZWNFbmQgPD0gMy41KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVkZ2VSYXkgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYWxjdWxhdGVDb2xsaXNpb25zQW5kSWZFZGdlKCkge1xyXG4gICAgICAgIGxldCBjdXJYID0gdGhpcy5nU3RhdGUuZ2V0Q2VudGVyWCgpO1xyXG4gICAgICAgIGxldCBjdXJZID0gdGhpcy5nU3RhdGUuZ2V0Q2VudGVyWSgpO1xyXG4gICAgICAgIHRoaXMuYnVsbGV0SGl0RW5kWCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5idWxsZXRIaXRFbmRZID0gbnVsbDtcclxuICAgICAgICBsZXQgYnVsbGV0cyA9IHRoaXMuZ1N0YXRlLmdldEFsbEJ1bGxldHMoKTtcclxuICAgICAgICB3aGlsZSAoIXRoaXMudXRpbC5pbk1hcEJsb2NrKGN1clgsIGN1clksIHRoaXMuZ1N0YXRlLmdldE1hcFNpemVJbmZvKCksIHRoaXMuZ1N0YXRlLmdldE1hcCgpKSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuYnVsbGV0SGl0RW5kWCAmJiAhdGhpcy5idWxsZXRIaXRFbmRZKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1bGxldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYnVsbGV0ID0gYnVsbGV0c1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5zcXJ0KE1hdGgucG93KChjdXJYIC0gYnVsbGV0LmdldFgoKSksIDIpICsgTWF0aC5wb3coKGN1clkgLSBidWxsZXQuZ2V0WSgpKSwgMikpIDwgNykgeyAvL2Nob29zaW5nIDE0IGNhdXNlIHRoYXRzIHRoZSBkaWFnb25hbCBvZiBhIHNxdWFyZSB3aXRoIHNpZGUgbGVuIDEwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBib3VuZGluZ0JveCA9IGJ1bGxldC5nZXRCb3VuZGluZ0JveCh0aGlzLmdTdGF0ZS5nZXRNYXBTaXplSW5mbygpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudXRpbC5wb2ludEluUmVjdGFuZ2xlKHsgeDogY3VyWCwgeTogY3VyWSB9LCBib3VuZGluZ0JveCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVsbGV0SGl0RW5kWCA9IGN1clg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1bGxldEhpdEVuZFkgPSBjdXJZO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcm91Y2hlZEJ1bGxldCA9IGJ1bGxldC5nZXRDcm91Y2hlZEJ1bGxldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3VyWCArPSB0aGlzLnVWZWNEaXIuZ2V0WCgpIC8gNDtcclxuICAgICAgICAgICAgY3VyWSArPSB0aGlzLnVWZWNEaXIuZ2V0WSgpIC8gNDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbmRYID0gY3VyWDtcclxuICAgICAgICB0aGlzLmVuZFkgPSBjdXJZO1xyXG4gICAgICAgIGxldCBjdXJCbG9jayA9IHRoaXMudXRpbC5nZXRNYXBCbG9ja0Zyb21Db29yZChjdXJYLCBjdXJZLCB0aGlzLmdTdGF0ZS5nZXRNYXBTaXplSW5mbygpKTtcclxuICAgICAgICBsZXQgYmxvY2tIaXQgPSB0aGlzLmdTdGF0ZS5nZXRNYXAoKS5nZXRCbG9ja3MoKVtjdXJCbG9jay55XVtjdXJCbG9jay54XTtcclxuICAgICAgICB0aGlzLmNoZWNrRWRnZVJheShibG9ja0hpdCk7XHJcbiAgICB9XHJcbiAgICBnZXRBZGp1c3RlZExlbmd0aChlbmRYLCBlbmRZKSB7XHJcbiAgICAgICAgbGV0IHJheUxlbiA9IE1hdGguc3FydChNYXRoLnBvdygodGhpcy5nU3RhdGUuZ2V0Q2VudGVyWCgpIC0gZW5kWCksIDIpICsgTWF0aC5wb3coKHRoaXMuZ1N0YXRlLmdldENlbnRlclkoKSAtIGVuZFkpLCAyKSk7XHJcbiAgICAgICAgLy9saW4gYWxnIGVxbiBpLmUgZG90IHByb2Qgb2YgdHdvIHZlY3MgLyBwcm9kIG9mIHRoZWlyIG1hZ25pdHVyZSA9IGNvcyBvZiBhbmdsZSBiZXR3ZWVuIGVtIChtYWcgb2YgYm90aCBoZXJlIGlzIDEgdGhvKVxyXG4gICAgICAgIGxldCBjb3NUaGV0YSA9IHRoaXMudVZlY0Rpci5nZXRYKCkgKiB0aGlzLmdTdGF0ZS5nZXRDZW50ZXJEaXIoKS5nZXRYKCkgKyB0aGlzLnVWZWNEaXIuZ2V0WSgpICogdGhpcy5nU3RhdGUuZ2V0Q2VudGVyRGlyKCkuZ2V0WSgpO1xyXG4gICAgICAgIHJldHVybiByYXlMZW4gKiBjb3NUaGV0YTtcclxuICAgIH1cclxuICAgIHBlcmZvcm1SYXlDYWxjdWxhdGlvbnMobmV3VVZlY0Rpcikge1xyXG4gICAgICAgIHRoaXMudVZlY0RpciA9IG5ld1VWZWNEaXI7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVDb2xsaXNpb25zQW5kSWZFZGdlKCk7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmdldEFkanVzdGVkTGVuZ3RoKHRoaXMuZW5kWCwgdGhpcy5lbmRZKTtcclxuICAgICAgICBpZiAodGhpcy5idWxsZXRIaXRFbmRYICYmIHRoaXMuYnVsbGV0SGl0RW5kWSkge1xyXG4gICAgICAgICAgICB0aGlzLmxlbmd0aFRvQnVsbGV0ID0gdGhpcy5nZXRBZGp1c3RlZExlbmd0aCh0aGlzLmJ1bGxldEhpdEVuZFgsIHRoaXMuYnVsbGV0SGl0RW5kWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vd2Fsa2luZyBmcmFtZSBpbmNyIGNvbnRyb2xzIGhvdyBtYW55IHBpeCB0aGUgc2NyZWVuIG1vdmVzIHVwIGFuZCBkb3duIHBlciBmcmFtZSAoc28gd2Fsa2luZyBjb3VudCBpcyBiL3cgb3NzY2lsYXRlcyBiL3cgMCBhbmQgNjApIHdoaWxlIHBsYXllciBtb3Zlc1xyXG4gICAgICAgIC8vc28gbmVlZCB0byBzZXQgaXQgZGlmZmVyZW50IGRlcCBvbiBpZiBjcm91Y2hpbmcsIHdhbGtpbmcgb3IgcnVubmluZ1xyXG4gICAgICAgIC8vZmlyc3Qgbm9ybWFsemllIHdhbGtpZ24gZnJhbWUgaW5jciB0byAxIGFuZCB0aGVuIG11bHRpcCBieSBmYWN0b3JcclxuICAgICAgICAvL2NhbnQganVzdCBzYXkgPSAzIG9yID0gNiBjYXVzZSB0aGV5IG1pZ2h0YSBiZWVuIGEgbmVnIG51bSBiZWZvcmVcclxuICAgICAgICBpZiAodGhpcy5nU3RhdGUuaXNQbGF5ZXJDcm91Y2hpbmcoKSkge1xyXG4gICAgICAgICAgICB0aGlzLndhbGtpbmdGcmFtZUluY3IgPSB0aGlzLndhbGtpbmdGcmFtZUluY3IgLyBNYXRoLmFicyh0aGlzLndhbGtpbmdGcmFtZUluY3IpO1xyXG4gICAgICAgICAgICB0aGlzLndhbGtpbmdGcmFtZUluY3IgKj0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5nU3RhdGUuaXNQbGF5ZXJSdW5uaW5nKCkpIHtcclxuICAgICAgICAgICAgdGhpcy53YWxraW5nRnJhbWVJbmNyID0gdGhpcy53YWxraW5nRnJhbWVJbmNyIC8gTWF0aC5hYnModGhpcy53YWxraW5nRnJhbWVJbmNyKTtcclxuICAgICAgICAgICAgdGhpcy53YWxraW5nRnJhbWVJbmNyICo9IDg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLndhbGtpbmdGcmFtZUluY3IgPSB0aGlzLndhbGtpbmdGcmFtZUluY3IgLyBNYXRoLmFicyh0aGlzLndhbGtpbmdGcmFtZUluY3IpO1xyXG4gICAgICAgICAgICB0aGlzLndhbGtpbmdGcmFtZUluY3IgKj0gNDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmdTdGF0ZS5pc1BsYXllck1vdmluZygpKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2Fsa2luZ0ZyYW1lQ291bnQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLndhbGtpbmdGcmFtZUNvdW50IDw9IDYwICYmIHRoaXMud2Fsa2luZ0ZyYW1lQ291bnQgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLndhbGtpbmdGcmFtZUNvdW50ICs9IHRoaXMud2Fsa2luZ0ZyYW1lSW5jcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMud2Fsa2luZ0ZyYW1lSW5jciAqPSAtMTtcclxuICAgICAgICAgICAgdGhpcy53YWxraW5nRnJhbWVDb3VudCArPSB0aGlzLndhbGtpbmdGcmFtZUluY3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZHJhd1JheTJEKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmNhbnZhczJELmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgaWYgKHRoaXMuZ1N0YXRlLmdldENlbnRlckRpcigpLmdldERpclJhZCgpID09IHRoaXMudVZlY0Rpci5nZXREaXJSYWQoKSkgeyAvL3RoaXMgaXMgdGhlIGNlbnRlciBjb2xcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCIjRkYwMDAwXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKHRoaXMuZ1N0YXRlLmdldENlbnRlclgoKSwgdGhpcy5nU3RhdGUuZ2V0Q2VudGVyWSgpKTtcclxuICAgICAgICBpZiAodGhpcy5idWxsZXRIaXRFbmRYICYmIHRoaXMuYnVsbGV0SGl0RW5kWSkge1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnYmx1ZSc7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8odGhpcy5idWxsZXRIaXRFbmRYLCB0aGlzLmJ1bGxldEhpdEVuZFkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdncmVlbic7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8odGhpcy5lbmRYLCB0aGlzLmVuZFkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh0aGlzLmVuZFgsIHRoaXMuZW5kWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5saW5lVG8odGhpcy5lbmRYLCB0aGlzLmVuZFkpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICB9XHJcbiAgICBhZGp1c3RDb2xvcihzdGFydENvbG9yLCBjb2xvckNoYW5nZSkge1xyXG4gICAgICAgIHN0YXJ0Q29sb3IuciA9IE1hdGgubWF4KHN0YXJ0Q29sb3IuciArIGNvbG9yQ2hhbmdlLnIsIDApO1xyXG4gICAgICAgIHN0YXJ0Q29sb3IuZyA9IE1hdGgubWF4KHN0YXJ0Q29sb3IuZyArIGNvbG9yQ2hhbmdlLmcsIDApO1xyXG4gICAgICAgIHN0YXJ0Q29sb3IuYiA9IE1hdGgubWF4KHN0YXJ0Q29sb3IuYiArIGNvbG9yQ2hhbmdlLmIsIDApO1xyXG4gICAgfVxyXG4gICAgZHJhd1JheTNEKHNsaWNlV2lkdGgsIHNsaWNlQ29sKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY2FudmFzM0QuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAvL2Nyb3VjaGluZyBhbmQgcnVubmluZyBhbmltYXRpb25cclxuICAgICAgICBsZXQgY3JvdWNoaW5nUGl4aGlmdCA9IC0yNTA7XHJcbiAgICAgICAgbGV0IGNyb3VjaGluZ0ZhY3RvciA9IGNyb3VjaGluZ1BpeGhpZnQgKiAoMSAvICh0aGlzLmxlbmd0aCAvIDEyKSk7IC8vbmVlZCB0byBmYWN0b3IgaW4gbGVuZ3RoIG9mIHJheSBiZWNhdXNlIGNsc29lciBzdHVmZiBnZXRzIG1vcmUgdGFsbCB0aGFuIHN0dWZmIHRoYXRzIGZ1cnRoZXIgYXdheVxyXG4gICAgICAgIGxldCB3YWxraW5nRmFjdG9yID0gdGhpcy53YWxraW5nRnJhbWVDb3VudCAvIDEwO1xyXG4gICAgICAgIC8vY2FsY3VsYXRpbmcgY2VpbGluZyBhbmQgZmxvb3IgZ2l2ZW4gbGVuZ3RoIG9mIHJheSArIHdhbGtpbmcgYW5kIGNyb3VjaGluZyBhbmltYXRpb25cclxuICAgICAgICBsZXQgY2VpbGluZyA9IHRoaXMuY2FudmFzM0QuaGVpZ2h0IC8gMiAtIHRoaXMuY2FudmFzM0QuaGVpZ2h0IC8gKHRoaXMubGVuZ3RoIC8gMTIpICsgKHRoaXMuZ1N0YXRlLmlzUGxheWVyQ3JvdWNoaW5nKCkgPyBjcm91Y2hpbmdGYWN0b3IgOiAwKSArIHdhbGtpbmdGYWN0b3I7XHJcbiAgICAgICAgbGV0IGZsb29yID0gdGhpcy5jYW52YXMzRC5oZWlnaHQgLSBjZWlsaW5nICsgd2Fsa2luZ0ZhY3RvciAqIDIgKyAodGhpcy5nU3RhdGUuaXNQbGF5ZXJDcm91Y2hpbmcoKSA/IGNyb3VjaGluZ0ZhY3RvciAqIDIgOiAwKTtcclxuICAgICAgICBsZXQgZGlzdEZyb21DZWlsVG9GbG9vciA9IGZsb29yIC0gY2VpbGluZztcclxuICAgICAgICAvL3dhbGwgc2hhZGluZyBiYXNlZCBvbiByYXkgbGVuZ3RoXHJcbiAgICAgICAgbGV0IGNvbG9yID0geyByOiAxNzUsIGc6IDE3NSwgYjogMTc1IH07XHJcbiAgICAgICAgdGhpcy5hZGp1c3RDb2xvcihjb2xvciwgeyByOiAtdGhpcy5sZW5ndGggLyAzLjUsIGc6IC10aGlzLmxlbmd0aCAvIDMuNSwgYjogLXRoaXMubGVuZ3RoIC8gMy41IH0pO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBgcmdiKCR7Y29sb3Iucn0sICR7Y29sb3IuZ30sICR7Y29sb3IuYn0pYDtcclxuICAgICAgICAvL2NvbG9yaW5nIGNlbnRlciBjb2wgYW5kIGVkZ2UgY29scyBkaWZmZXJlbnRseVxyXG4gICAgICAgIGlmIChNYXRoLmFicyh0aGlzLmdTdGF0ZS5nZXRDZW50ZXJEaXIoKS5nZXREaXJSYWQoKSAtIHRoaXMudVZlY0Rpci5nZXREaXJSYWQoKSkgPD0gMC4wMDc1KSB7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIiNGRjAwMDBcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5lZGdlUmF5KSB7XHJcbiAgICAgICAgICAgIGxldCBjb2xvciA9IHsgcjogMTI1LCBnOiAxMjUsIGI6IDEyNSB9O1xyXG4gICAgICAgICAgICB0aGlzLmFkanVzdENvbG9yKGNvbG9yLCB7IHI6IC10aGlzLmxlbmd0aCAvIDMuNSwgZzogLXRoaXMubGVuZ3RoIC8gMy41LCBiOiAtdGhpcy5sZW5ndGggLyAzLjUgfSk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBgcmdiKCR7Y29sb3Iucn0sICR7Y29sb3IuZ30sICR7Y29sb3IuYn0pYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9XQUxMIENPTFVNTlxyXG4gICAgICAgIGN0eC5maWxsUmVjdCgoKHNsaWNlQ29sKSAqIHNsaWNlV2lkdGgpLCBjZWlsaW5nLCBzbGljZVdpZHRoLCBkaXN0RnJvbUNlaWxUb0Zsb29yKTtcclxuICAgICAgICAvL0ZMT09SIENPTFVNTlxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmdyZDtcclxuICAgICAgICBjdHguZmlsbFJlY3QoKChzbGljZUNvbCkgKiBzbGljZVdpZHRoKSwgZmxvb3IsIHNsaWNlV2lkdGgsIHRoaXMuY2FudmFzM0QuaGVpZ2h0IC0gZmxvb3IpO1xyXG4gICAgICAgIC8vU0tZIENPTFVNTlxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCgoKHNsaWNlQ29sKSAqIHNsaWNlV2lkdGgpLCAwLCBzbGljZVdpZHRoLCBjZWlsaW5nKTtcclxuICAgICAgICAvL2NhbGN1YWx0aW5nIGJ1bGxldCBjZWlsIGFuZCBmbG9vciBpZiBidWxsZXQgaW4gcmF5IHZpZXdhXHJcbiAgICAgICAgaWYgKHRoaXMuYnVsbGV0SGl0RW5kWCAmJiB0aGlzLmJ1bGxldEhpdEVuZFkpIHtcclxuICAgICAgICAgICAgLy9jYW50IHVzZSB0aGUgY2VpbGluZyBhbmQgZmxvb3IgZnJvbSBhYm92ZSBzaW5jZSB0aGUgY3JvdWNoaW5nIGFuZCB3YWxraW5nIHNoaWZ0IG1lc3Mgc3R1ZmYgdXBcclxuICAgICAgICAgICAgLy9hbGwgd2UgcmVhbGx5IHdhbnQgaXMgYSBmbG9vciBhbmQgY2VpbGluZyByZWwgdG8gY2VudGVyIG9mIHNjcmVlbiBidXQgY3JvdWNoaWduIHNoaWZ0IG1ha2VzIHN0dWZmIG9mZiBjZW50ZXJcclxuICAgICAgICAgICAgLy9jbG9zZXIgc3R1ZmYgd2lsbCBnbyB1cCBtb3JlIHRoYW4gZmFydGhlciBzdHVmZiBhbmQgYmUgZXZlbiBtb3JlIG9mZiBjZW50ZXJcclxuICAgICAgICAgICAgbGV0IGNlaWwgPSB0aGlzLmNhbnZhczNELmhlaWdodCAvIDIgLSB0aGlzLmNhbnZhczNELmhlaWdodCAvICh0aGlzLmxlbmd0aCAvIDEyKSArIHdhbGtpbmdGYWN0b3I7XHJcbiAgICAgICAgICAgIGxldCBmbHIgPSB0aGlzLmNhbnZhczNELmhlaWdodCAtIGNlaWwgKyB3YWxraW5nRmFjdG9yICogMjtcclxuICAgICAgICAgICAgbGV0IGNyb3VjaGVkQnVsbGV0U2hpZnQgPSBjcm91Y2hpbmdQaXhoaWZ0ICogKDEgLyAodGhpcy5sZW5ndGhUb0J1bGxldCAvIDEyKSk7XHJcbiAgICAgICAgICAgIGxldCBtaWQgPSAoZmxyIC0gY2VpbCkgLyAyICsgY2VpbDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmdTdGF0ZS5pc1BsYXllckNyb3VjaGluZygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jcm91Y2hlZEJ1bGxldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pZCArPSBjcm91Y2hlZEJ1bGxldFNoaWZ0ICogLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY3JvdWNoZWRCdWxsZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtaWQgKz0gY3JvdWNoZWRCdWxsZXRTaGlmdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgc2hpZnRGcm9tTWlkID0gdGhpcy5jYW52YXMzRC5oZWlnaHQgLyAodGhpcy5sZW5ndGhUb0J1bGxldCAvIDEuNSk7XHJcbiAgICAgICAgICAgIGxldCBidWxsZXRDZWlsID0gbWlkIC0gc2hpZnRGcm9tTWlkO1xyXG4gICAgICAgICAgICBsZXQgYnVsbGV0Rmxvb3IgPSBtaWQgKyAobWlkIC0gYnVsbGV0Q2VpbCk7XHJcbiAgICAgICAgICAgIC8vd2FsbCBzaGFkaW5nIGJhc2VkIG9uIHJheSBsZW5ndGhcclxuICAgICAgICAgICAgbGV0IGNvbG9yID0geyByOiAyMjQsIGc6IDg2LCBiOiAwIH07XHJcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0Q29sb3IoY29sb3IsIHsgcjogLSgodGhpcy5sZW5ndGhUb0J1bGxldCAvIDMpICogMi42KSwgZzogLXRoaXMubGVuZ3RoVG9CdWxsZXQgLyAzLCBiOiAwIH0pO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KCgoc2xpY2VDb2wpICogc2xpY2VXaWR0aCksIGJ1bGxldENlaWwgLSAwLjUsIHNsaWNlV2lkdGgsIChidWxsZXRGbG9vciAtIGJ1bGxldENlaWwpICsgMSk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBgcmdiKCR7Y29sb3Iucn0sICR7Y29sb3IuZ30sICR7Y29sb3IuYn0pYDtcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KCgoc2xpY2VDb2wpICogc2xpY2VXaWR0aCksIGJ1bGxldENlaWwsIHNsaWNlV2lkdGgsIGJ1bGxldEZsb29yIC0gYnVsbGV0Q2VpbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFJheSB9IGZyb20gXCIuL1JheVwiO1xyXG5pbXBvcnQgeyBVbml0VmVjdG9yIH0gZnJvbSBcIi4vVW5pdFZlY3RvclwiO1xyXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi9VdGlsJztcclxuZXhwb3J0IGNsYXNzIFJheXMge1xyXG4gICAgY29uc3RydWN0b3IoZ1N0YXRlLCBjYW52YXMyRCwgY2FudmFzM0QpIHtcclxuICAgICAgICB0aGlzLnJheXMgPSBbXTtcclxuICAgICAgICB0aGlzLmZvdiA9IDkwO1xyXG4gICAgICAgIHRoaXMuZGlzdFRvUHJvamVjdGlvbiA9IDM1MDtcclxuICAgICAgICB0aGlzLnBsYXllck1vdmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudXRpbCA9IG5ldyBVdGlsKCk7XHJcbiAgICAgICAgdGhpcy5nU3RhdGUgPSBnU3RhdGU7XHJcbiAgICAgICAgdGhpcy5jYW52YXMyRCA9IGNhbnZhczJEO1xyXG4gICAgICAgIHRoaXMuY2FudmFzM0QgPSBjYW52YXMzRDtcclxuICAgIH1cclxuICAgIC8vc29tZSByZXNvdXJjZXMgdXNlZDpcclxuICAgIC8vaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjQxNzM5NjYvcmF5Y2FzdGluZy1lbmdpbmUtcmVuZGVyaW5nLWNyZWF0aW5nLXNsaWdodC1kaXN0b3J0aW9uLWluY3JlYXNpbmctdG93YXJkcy1lZGdlc1xyXG4gICAgLy9odHRwczovL2dhbWVkZXYuc3RhY2tleGNoYW5nZS5jb20vcXVlc3Rpb25zLzE1Njg0Mi9ob3ctY2FuLWktY29ycmVjdC1hbi11bndhbnRlZC1maXNoZXllLWVmZmVjdC13aGVuLWRyYXdpbmctYS1zY2VuZS13aXRoLXJheWNhc3Rpbi8xNTY4NTMjMTU2ODUzXHJcbiAgICAvL2h0dHBzOi8vZ2FtZWRldi5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvOTc1NzQvaG93LWNhbi1pLWZpeC10aGUtZmlzaGV5ZS1kaXN0b3J0aW9uLWluLW15LXJheWNhc3QtcmVuZGVyZXJcclxuICAgIC8vaHR0cHM6Ly93d3cuZ2FtZWRldi5uZXQvZm9ydW1zL3RvcGljLzI3MjUyNi1yYXljYXN0aW5nLS0tLWZpc2hleWUtZGlzdG9ydGlvbi8/cGFnZT0xXHJcbiAgICAvL3NvIHRoZXJlcyB0d28gZWZmZWN0cywgb25lIGlzIHRoZSBmaXNoZXllIGNvcnJlY3Rpb24gYnV0IGFub3RoZXIgaXMgdGhlIG5vbiBsaW5lYXJpdHkgb2YgYW5nbGUgaW5jcmVhc2VzIGJldHdlZW4gcmF5c1xyXG4gICAgc2V0dXBSYXlzKCkge1xyXG4gICAgICAgIGxldCBjZW50ZXJVVmVjID0gdGhpcy5nU3RhdGUuZ2V0Q2VudGVyRGlyKCk7XHJcbiAgICAgICAgdGhpcy5kaXN0VG9Qcm9qZWN0aW9uID0gdGhpcy5jYW52YXMzRC53aWR0aCAvIDIgLyAoTWF0aC50YW4odGhpcy51dGlsLnRvUmFkKHRoaXMuZm92IC8gMikpKTtcclxuICAgICAgICBsZXQgY291bnRlciA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhbnZhczNELndpZHRoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgbGV0IGFuZyA9IE1hdGguYXRhbigoaSAtIHRoaXMuY2FudmFzM0Qud2lkdGggLyAyKSAvIHRoaXMuZGlzdFRvUHJvamVjdGlvbikgKyBjZW50ZXJVVmVjLmdldERpclJhZCgpO1xyXG4gICAgICAgICAgICBsZXQgdVZlYyA9IG5ldyBVbml0VmVjdG9yKHRoaXMudXRpbC50b0RlZyhhbmcpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmF5c1tjb3VudGVyXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYXlzW2NvdW50ZXJdLnBlcmZvcm1SYXlDYWxjdWxhdGlvbnModVZlYyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UmF5ID0gbmV3IFJheSh0aGlzLmdTdGF0ZSwgdGhpcy5jYW52YXMyRCwgdGhpcy5jYW52YXMzRCwgdVZlYyk7XHJcbiAgICAgICAgICAgICAgICBuZXdSYXkucGVyZm9ybVJheUNhbGN1bGF0aW9ucyh1VmVjKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmF5cy5wdXNoKG5ld1JheSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY291bnRlcisrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRyYXcyRCgpIHtcclxuICAgICAgICB0aGlzLnJheXMuZm9yRWFjaChyYXkgPT4gcmF5LmRyYXdSYXkyRCgpKTtcclxuICAgIH1cclxuICAgIGRyYXczRCgpIHtcclxuICAgICAgICBsZXQgcmF5U2xpY2VXaWR0aCA9IHRoaXMuY2FudmFzM0Qud2lkdGggLyB0aGlzLnJheXMubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMucmF5cy5mb3JFYWNoKChyYXksIGkpID0+IHtcclxuICAgICAgICAgICAgcmF5LmRyYXdSYXkzRChyYXlTbGljZVdpZHRoLCBpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgVW5pdFZlY3RvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkaXIpIHtcclxuICAgICAgICB0aGlzLmRpciA9IGRpcjtcclxuICAgICAgICB0aGlzLnggPSBNYXRoLmNvcyh0aGlzLnRvUmFkKGRpcikpO1xyXG4gICAgICAgIHRoaXMueSA9IE1hdGguc2luKHRoaXMudG9SYWQoZGlyKSk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVEaXIoY2hhbmdlKSB7XHJcbiAgICAgICAgdGhpcy5kaXIgKz0gY2hhbmdlO1xyXG4gICAgICAgIHRoaXMueCA9IE1hdGguY29zKHRoaXMudG9SYWQodGhpcy5kaXIpKTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLnNpbih0aGlzLnRvUmFkKHRoaXMuZGlyKSk7XHJcbiAgICB9XHJcbiAgICB0b1JhZChkZWcpIHtcclxuICAgICAgICByZXR1cm4gZGVnICogTWF0aC5QSSAvIDE4MDtcclxuICAgIH1cclxuICAgIGdldERpckRlZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXI7XHJcbiAgICB9XHJcbiAgICBnZXREaXJSYWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlyICogTWF0aC5QSSAvIDE4MDtcclxuICAgIH1cclxuICAgIGdldFgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcclxuICAgIH1cclxuICAgIGdldFkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBCbG9ja1R5cGUgfSBmcm9tIFwiLi9CbG9ja1R5cGVcIjtcclxuZXhwb3J0IGNsYXNzIFV0aWwge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIC8vYWxnbyBmcm9tIHRoZSBmb2xsb3dpbiByZXNvdXJjZXM6IFxyXG4gICAgLy8qKipyZXF1aXJlcyBmb3IgQSBCIGFuZCBDIHRvIGZvbGxvdyBvbmUgYW5vdGhlciBpLmUgQSBpcyB0b3AgbGVmdCwgQiBpcyB0b3AgcmlnaHQsIEMgaXMgYm90dG9tIHJpZ2h0XHJcbiAgICAvL2h0dHBzOi8vbWF0aC5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvMjE1NzkzMS9ob3ctdG8tY2hlY2staWYtYS1wb2ludC1pcy1pbnNpZGUtYS1zcXVhcmUtMmQtcGxhbmVcclxuICAgIC8vaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjc1MjcyNS9maW5kaW5nLXdoZXRoZXItYS1wb2ludC1saWVzLWluc2lkZS1hLXJlY3RhbmdsZS1vci1ub3QvMzc4NjUzMzIjMzc4NjUzMzJcclxuICAgIHBvaW50SW5SZWN0YW5nbGUobSwgcikge1xyXG4gICAgICAgIHZhciBBQiA9IHRoaXMudmVjdG9yKHIuQSwgci5CKTtcclxuICAgICAgICB2YXIgQU0gPSB0aGlzLnZlY3RvcihyLkEsIG0pO1xyXG4gICAgICAgIHZhciBCQyA9IHRoaXMudmVjdG9yKHIuQiwgci5DKTtcclxuICAgICAgICB2YXIgQk0gPSB0aGlzLnZlY3RvcihyLkIsIG0pO1xyXG4gICAgICAgIHZhciBkb3RBQkFNID0gdGhpcy5kb3QoQUIsIEFNKTtcclxuICAgICAgICB2YXIgZG90QUJBQiA9IHRoaXMuZG90KEFCLCBBQik7XHJcbiAgICAgICAgdmFyIGRvdEJDQk0gPSB0aGlzLmRvdChCQywgQk0pO1xyXG4gICAgICAgIHZhciBkb3RCQ0JDID0gdGhpcy5kb3QoQkMsIEJDKTtcclxuICAgICAgICByZXR1cm4gMCA8PSBkb3RBQkFNICYmIGRvdEFCQU0gPD0gZG90QUJBQiAmJiAwIDw9IGRvdEJDQk0gJiYgZG90QkNCTSA8PSBkb3RCQ0JDO1xyXG4gICAgfVxyXG4gICAgdmVjdG9yKHAxLCBwMikge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IChwMi54IC0gcDEueCksXHJcbiAgICAgICAgICAgIHk6IChwMi55IC0gcDEueSlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgdG9SYWQoZGVnKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlZyAqIE1hdGguUEkgLyAxODA7XHJcbiAgICB9XHJcbiAgICB0b0RlZyhyYWQpIHtcclxuICAgICAgICByZXR1cm4gcmFkIC8gTWF0aC5QSSAqIDE4MDtcclxuICAgIH1cclxuICAgIGRvdCh1LCB2KSB7XHJcbiAgICAgICAgcmV0dXJuIHUueCAqIHYueCArIHUueSAqIHYueTtcclxuICAgIH1cclxuICAgIGdldE1hcEJsb2NrRnJvbUNvb3JkKHgsIHksIG1hcFNpemVJbmZvKSB7XHJcbiAgICAgICAgbGV0IGNlbGxXaWR0aCA9IG1hcFNpemVJbmZvLmNlbGxXaWR0aDtcclxuICAgICAgICBsZXQgY2VsbEhlaWdodCA9IG1hcFNpemVJbmZvLmNlbGxIZWlnaHQ7XHJcbiAgICAgICAgbGV0IGN1clhCbG9ja0luZGV4ID0gTWF0aC5jZWlsKHggLyBjZWxsV2lkdGgpIC0gMTtcclxuICAgICAgICBsZXQgY3VyWUJsb2NrSW5kZXggPSBNYXRoLmNlaWwoeSAvIGNlbGxIZWlnaHQpIC0gMTtcclxuICAgICAgICByZXR1cm4geyB4OiBjdXJYQmxvY2tJbmRleCwgeTogY3VyWUJsb2NrSW5kZXggfTtcclxuICAgIH1cclxuICAgIGluTWFwQmxvY2soeCwgeSwgbWFwU2l6ZUluZm8sIG1hcCkge1xyXG4gICAgICAgIHJldHVybiBtYXAuZ2V0QmxvY2tzKClbdGhpcy5nZXRNYXBCbG9ja0Zyb21Db29yZCh4LCB5LCBtYXBTaXplSW5mbykueV1bdGhpcy5nZXRNYXBCbG9ja0Zyb21Db29yZCh4LCB5LCBtYXBTaXplSW5mbykueF0uZ2V0QmxvY2tUeXBlKCkgPT09IEJsb2NrVHlwZS5XYWxsO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgQXVkaW9Db250cm9sIH0gZnJvbSBcIi4vQXVkaW9Db250cm9cIjtcclxuaW1wb3J0IHsgQmxvY2tUeXBlIH0gZnJvbSBcIi4vQmxvY2tUeXBlXCI7XHJcbmltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuL0dhbWVTdGF0ZVwiO1xyXG5pbXBvcnQgeyBSYXlzIH0gZnJvbSBcIi4vUmF5c1wiO1xyXG5sZXQgY2FudmFzMkQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FudmFzTGVmdCcpO1xyXG5sZXQgY2FudmFzM0QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FudmFzUmlnaHQnKTtcclxuLy9odHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PWRuUlhfYkhiWWdzIGdvdCBhdWRpbyBmcm9tIGhlcmVcclxuLy9hdWRpbyBpbml0aWFsIHZhbHVlc1xyXG5sZXQgYXVkaW9Db250cm9sID0gbmV3IEF1ZGlvQ29udHJvbCgnYXVkaW8nKTtcclxubGV0IG1hcFRlbXBsYXRlID0gW1xyXG4gICAgW0Jsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGxdLFxyXG4gICAgW0Jsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsXSxcclxuICAgIFtCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuV2FsbF0sXHJcbiAgICBbQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLldhbGxdLFxyXG4gICAgW0Jsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsXSxcclxuICAgIFtCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsXSxcclxuICAgIFtCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGxdLFxyXG4gICAgW0Jsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLldhbGxdLFxyXG4gICAgW0Jsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsXSxcclxuICAgIFtCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLldhbGxdLFxyXG4gICAgW0Jsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLldhbGxdLFxyXG4gICAgW0Jsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLldhbGxdLFxyXG4gICAgW0Jsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5XYWxsXSxcclxuICAgIFtCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuRW1wdHksIEJsb2NrVHlwZS5FbXB0eSwgQmxvY2tUeXBlLkVtcHR5LCBCbG9ja1R5cGUuV2FsbF0sXHJcbiAgICBbQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbCwgQmxvY2tUeXBlLldhbGwsIEJsb2NrVHlwZS5XYWxsLCBCbG9ja1R5cGUuV2FsbF0sXHJcbl07XHJcbmNvbnN0IEdTdGF0ZSA9IG5ldyBHYW1lU3RhdGUoY2FudmFzMkQsIGNhbnZhczNELCBtYXBUZW1wbGF0ZSwgYXVkaW9Db250cm9sKTtcclxuY29uc3QgcmF5cyA9IG5ldyBSYXlzKEdTdGF0ZSwgY2FudmFzMkQsIGNhbnZhczNEKTtcclxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XHJcbi8vICAgICB2YXIgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuLy8gICAgIGNvbnNvbGUubG9nKGUuY2xpZW50WCAtIHJlY3QubGVmdCwgZS5jbGllbnRZIC0gcmVjdC50b3ApO1xyXG4vLyB9KTtcclxuZnVuY3Rpb24gY2xlYXJDYW52YXMoY2FudmFzKSB7XHJcbiAgICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbn1cclxuZnVuY3Rpb24gbWFpbigpIHtcclxuICAgIGNsZWFyQ2FudmFzKGNhbnZhczJEKTtcclxuICAgIGNsZWFyQ2FudmFzKGNhbnZhczNEKTtcclxuICAgIEdTdGF0ZS5kcmF3TWFwKCk7XHJcbiAgICBHU3RhdGUuZHJhd1BsYXllcigpO1xyXG4gICAgcmF5cy5zZXR1cFJheXMoKTtcclxuICAgIHJheXMuZHJhdzJEKCk7XHJcbiAgICBHU3RhdGUudXBkYXRlQW5kRHJhd0J1bGxldHMoKTtcclxuICAgIC8vR1N0YXRlLmRyYXdCdWxsZXRzKCk7XHJcbiAgICByYXlzLmRyYXczRCgpO1xyXG59XHJcbnNldEludGVydmFsKG1haW4sIDEwMDAgLyA2MCk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=