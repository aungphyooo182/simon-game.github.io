import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ApoGameStateService } from 'src/app/services/apo-game-state.service';
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
    });
    this.game.generateSimon();
  }

  playerGuess(e: string) {
    if (e !== 'white' && this.finishedLoop) {
      this.game.playerGuess(e);
    } else {
      this.game.restartSimon();
    }
  }
}
