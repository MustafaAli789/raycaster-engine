export class AudioControl {

    audio: HTMLAudioElement;
    playBackRate?: number;
    volume?: number;

    //footstep config vars play back rate
    walkingPlayBackRate: number = 1.2;
    runningPlayBackRate: number = 2;
    crouchingPlayBackRate: number = 0.8;

    //footstep config vars volume
    walkingVolume: number = 0.3;
    runningVolume: number = 0.45;
    crouchingVolume: number = 0.15;

    constructor(audioElemId: string, playbackRate?: number, loop?: boolean, volume?: number) {
        this.playBackRate = playbackRate ? playbackRate : this.walkingPlayBackRate;
        this.audio = <HTMLAudioElement>document.getElementById(audioElemId)
        this.audio.loop = loop ? loop : true;
        this.volume = volume ? volume : this.walkingVolume;
    }

    setAudioData() {
        this.audio.playbackRate = this.playBackRate;
        this.audio.volume = this.volume;
    }

    setPlayBackRate(playbackRate: number):void {
        this.playBackRate = playbackRate;
        this.setAudioData();
    }
    setVolume(volume: number):void {
        this.volume = volume;
        this.setAudioData();
    }

    play():void {
        this.audio.play();
    }

    stop():void {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    // footsteps method
    setAudioWalking():void {
        this.playBackRate = this.walkingPlayBackRate;
        this.volume = this.walkingVolume;
        this.setAudioData();
    }
    setAudioCrouching():void {
        this.playBackRate = this.crouchingPlayBackRate;
        this.volume = this.crouchingVolume;
        this.setAudioData();
    }
    setAudioRunning():void {
        this.playBackRate = this.runningPlayBackRate;
        this.volume = this.runningVolume;
        this.setAudioData();
    }



}