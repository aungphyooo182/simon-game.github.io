import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { START_COUNT, COLORS } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class ApoGameStateService {
  public simon : string[] = [];
  public player : string[] = [];
  public count: number;
  public showWinnerText : boolean;
  public showErrorText : boolean;
  public state = new Subject<any> (); // subjecy is a pratial observable

  public finishedLoop = false;
  public redAudio = new Audio();
  public greenAudio = new Audio();
  public blueAudio = new Audio();
  public yellowAudio = new Audio();
  public soundEffects = [
    this.redAudio, this.greenAudio, this.blueAudio, this.yellowAudio
  ];
  public debugMode = environment.showDebug;
  // src/app/services/apo-game-state.service
  constructor() {
    this.debugMode = false; //testing
    this.count = START_COUNT;
    this.redAudio.src = 'assets/sounds/sfx-animal-dog.mp3';
    this.greenAudio.src = 'assets/sounds/sfx-animal-kitten.mp3';
    this.blueAudio.src = 'assets/sounds/sfx-animal-pig.mp3';
    this.yellowAudio.src = 'assets/sounds/sfx-animal-sheep.mp3';
    this.redAudio.load();
    this.greenAudio.load();
    this.blueAudio.load();
    this.yellowAudio.load();

    this.redAudio.volume = this.debugMode ? 0.1 : 1;
    this.greenAudio.volume = this.debugMode ? 0.1 : 1;
    this.blueAudio.volume = this.debugMode ? 0.1 : 1;
    this.yellowAudio.volume = this.debugMode ? 0.1 : 1;
  }

  private get randomColor() : string {
    return COLORS[Math.floor(Math.random()*4)];
  }

  appendSimon(increment:boolean = false) : void {
    this.simon.push(this.randomColor); //don't need () since get method
    if (increment) {
      this.count++;
      this.setState();
    };
  }

  generateSimon() : void { //first
    console.log('generateSimon');
    this.loopIndex = 0;
    this.simon = [];
    for (let i = 0; i < this.count; i++) {
      this.appendSimon(); //get random color and push into simon array
    }
    this.setState();
    setTimeout(() => {
      this.loop();
    }, 200);
  }

  setState() {
    this.state.next({
      player: this.player,
      simon: this.simon,
      count: this.count,
      finishedLoop: this.finishedLoop,
      showWinnerText : this.showWinnerText,
      showErrorText : this.showErrorText
    });
    console.log('set state');
  }

  restartSimon() : void { //checked
    this.showWinnerText = false;
    this.showErrorText = false;
    this.count = START_COUNT;
    this.generateSimon();
  }

  playeSound(val: number){
    console.log(val);
    this.soundEffects[val].play();
    // this.soundEffects[val].pause;
    // this.soundEffects[val].currentTime = 0;
    setTimeout(() => {
      this.soundEffects[val].pause();
      this.soundEffects[val].currentTime = 0;
    }, 500);
  }

  playerGuess(val: string) {
    this.player.push(val); //push val to player array
    this.playeSound(COLORS[val]);
    // this.compareSimon().then(this.isComplete()); //check if correct
    this.compareSimon().subscribe(data=>{
      if (data) {
        console.log('check');
        this.checkComplete();
      }else {

      }
    });
  }

  compareSimon(): Observable<any>{
    for (let i = 0; i < this.player.length; i++) {
      if(this.player[i] !== this.simon[i]) {
        this.player = [];
        console.log('wrong');
        setTimeout(() => {
          this.showErrorText = true;
        this.setState();
        return of (false);
        }, 100);
      }
      else {
        console.log('correct');
      }
    }
    return of(true);
  }

  showWinner(){
    this.showWinnerText = true;
    this.setState();
  }

  checkComplete(){
    console.log(this.player.length,this.simon.length,this.player.length === this.simon.length)
    if (this.player.length === this.simon.length) {
      console.log('update')
      // I don't want to update asap and show message
      this.showWinner();
      // this.updateGame();
    }else {
      // setTimeout(() => {
      //   this.index = 0;
      //   this.setRing(true);
      // }, 1000);
      // this.loop();
    }
  }

  public loopIndex=0;

  loop() {
    this.finishedLoop = false;
    if (this.loopIndex < this.simon.length) {
      console.log('loop');
      this.clearAll();
      setTimeout(() => {
        var id = '#'+this.simon[this.loopIndex];
        console.log(id+' is added');
        var button = document.querySelectorAll(id)[0];
        button.classList.add('active');
        this.playeSound(COLORS[this.simon[this.loopIndex]]);
        this.clearOthers(this.simon[this.loopIndex]);
        this.loopIndex++;
        setTimeout(() => {
          this.loop();
        }, 1000);
      }, 500);
    }else {
      this.clearAll();
      this.loopIndex = 0;
      this.finishedLoop = true;
      this.setState();
    }
  }

  clearAll(){
    for (let i=0; i<4; i++){
      var id = '#'+COLORS[i];
        var button = document.querySelectorAll(id)[0];
        button.classList.remove('active');
    }
  }

  clearOthers(color:string) {
    for (let i=0;i<4; i++) {
      if(color !== COLORS[i]) {
        var id = '#'+COLORS[i];
        var button = document.querySelectorAll(id)[0];
        button.classList.remove('active');
      }
    }
  }

  updateGame() {
    this.showWinnerText = false;
    console.log('updateGame');
      this.appendSimon(true);
      this.loop();
      this.player = [];
  }

  tryAgain(){
    this.showErrorText = false;
    this.setState();
    this.loopIndex = 0;
    this.loop();
    this.player = [];
  }
}
