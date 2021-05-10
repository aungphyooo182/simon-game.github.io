import { state } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { ApoGameStateService } from 'src/app/services/apo-game-state.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  count: number;
  ring: boolean;
  state: any;
  simonArray: string[];
  finishedLoop: boolean = false;
  supportOrientation: boolean = true;
  showWinnerText: boolean = false;
  showErrorText: boolean = false;
  showDebug = environment.showDebug;

  @HostListener("window:resize") updateOrientatioState() {
    console.log('ori')
    if (window.innerHeight > window.innerWidth) {
      this.supportOrientation = true;
      this.game.generateSimon();
    } else {
      this.supportOrientation = false;
    }
  }
  constructor(
    // private game: GameStateService,
    private game: ApoGameStateService) { }

  ngOnInit(): void {
    this.game.state.subscribe(state=>{
      console.log(state);
      this.state = state;
      this.count = state.count; //for show
      this.simonArray = state.simon;
      this.finishedLoop = state.finishedLoop;
      this.showWinnerText = state.showWinnerText;
      this.showErrorText = state.showErrorText;
    });
    this.updateOrientatioState();
  }

  playerGuess(e: string) {
    if (e !== 'white' && this.finishedLoop) {
      this.game.playerGuess(e);
    } else {
      this.game.restartSimon();
    }
  }

  tryAgain(){
    this.game.tryAgain();
  }

  updateGame() {
    this.game.updateGame();
  }
}
