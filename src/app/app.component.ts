import { Component, NgModule,OnChanges, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
import axios from 'axios';
import * as $ from 'jquery';
import { debounceTime } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnChanges {
  title = 'freeDictionary';
  word = '';
  result = '';
  data: any;
  isDark: boolean = true;
  switchColor: string = 'black';
  audioUrl: string = '';
  searchMeaning: FormControl = new FormControl();
  selectedLanguage:string='English';
  //showPlayer: boolean = false;
  defNo:number=0;

  ngOnInit() {
    // if (this.audioUrl != '') {
    //   this.showPlayer = true;
    // }

    this.searchMeaning.valueChanges.pipe(debounceTime(700)).subscribe({
      next: (value) => this.findMeaning(value),
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // if (
    //   changes['audioUrl'].previousValue !== changes['audioUrl'].currentValue &&
    //   changes['audioUrl'].currentValue !== ''
    // ) {
    //   this.showPlayer = false;
    //   setTimeout(() => (this.showPlayer = true), 0);
    // }
  }

  findMeaning(value: string) {
    if (value === '') {
      this.data = [];
    }
    let word = value;
    axios
      .get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word)
      .then((res) => {
        this.data = res.data;
        let audios = res.data.find((x) =>
          x.phonetics.find((y) => y.audio.length > 0)
        );
        this.audioUrl = audios.phonetics.find(x=>x.audio.length>0).audio;
        console.log(audios);
        console.log(this.audioUrl);
        console.log(this.data);
      }).catch(error=>{
        this.audioUrl='';
        this.data = [];
        console.log(error)
      })

  }

  toggleDark(event: any) {
    if (event) {
      $('.app').css('background-color', 'rgb(40, 44, 52)');
      $('.app').css('color', 'white');
      this.switchColor = 'black';
    } else {
      $('.app').css('background-color', 'rgb(255, 255, 255)');
      $('.app').css('color', 'black');
      this.switchColor = 'white';
    }
  }
}
