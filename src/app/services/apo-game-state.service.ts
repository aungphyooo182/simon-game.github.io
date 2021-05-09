import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { START_COUNT, COLORS } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class ApoGameStateService {
  public simon : string[] = [];
  public player : string[] = [];
  public count: number;
  public state = new Subject<any> (); // subjecy is a pratial observable

  public finishedLoop = false;

  constructor() {
    this.count = START_COUNT;
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
      finishedLoop: this.finishedLoop
    });
    console.log('set state');
  }

  restartSimon() : void { //checked
    this.count = START_COUNT;
    this.generateSimon();
  }

  playerGuess(val: string) {
    this.player.push(val); //push val to player array
    // this.compareSimon().then(this.isComplete()); //check if correct
    this.compareSimon().subscribe(data=>{
      console.log('check');
      this.checkComplete();
    });
  }

  compareSimon(): Observable<any>{
    for (let i = 0; i < this.player.length; i++) {
      if(this.player[i] !== this.simon[i]) {
        this.player = [];
        console.log('wrong');
      }
      else {
        console.log('correct');
      }
    }
    return of(true);
  }

  checkComplete(){
    console.log(this.player.length,this.simon.length,this.player.length === this.simon.length)
    if (this.player.length === this.simon.length) {
      console.log('update')
      this.updateGame();
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
    console.log('updateGame');
    setTimeout(() => {
      this.appendSimon(true);
      this.loop();
      this.player = [];
    }, 1000);
  }
}
