import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { VdataManageProvider } from '../../providers/vdata-manage/vdata-manage';

@IonicPage()
@Component({
  selector: 'page-addnew',
  templateUrl: 'addnew.html',
})
export class AddnewPage {
  private name: string;
  private pn: number;
  private bldInput: string = '';
  private lastVol: string = '';
  private bldType: {type, sign};
  private today: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private vdataMange: VdataManageProvider) {

    // get today date to set the minninum date in date picker
    let d = new Date(Date.now());
    let m = d.getMonth() +1; // js month starts with 0
    let month = m > 9 ? m : '0' + m;
    this.today = d.getFullYear() + '-' + month + '-' + d.getDate();
  }

  saveNew(){
    this.bldInput = this.bldInput.toUpperCase();
    //this.bldInput = 'AB+';
    //console.log(this.bldInput.indexOf('AB'));
    if(this.bldInput.indexOf('AB') > -1){
      this.bldType = {
        type: this.bldInput[0] + this.bldInput[1],
        sign: this.bldInput[2] // + or -
      };
    }
    else{
      this.bldType = {
        type: this.bldInput[0],
        sign: this.bldInput[1]
      };
    }
    this.bldType.sign = this.bldType.sign === '+' ? true : false; // + => true and - => false
    
    this.vdataMange.saveToFile(0, this.name, this.pn, this.bldType, this.lastVol);
    // reset vars
    this.name = this.bldInput = '';
    this.pn = null;
    this.lastVol = '';
  }

  checkBldInput(input){
    if(input > 3 || input < 2){
      return false;
    }
    input = input.toUpperCase();
    if(input === 'A+'
    || input === 'A-'
    || input === 'B+'
    || input === 'B-'
    || input === 'O+'
    || input === 'O-'
    || input === 'AB+'
    || input === 'AB-'){
      return true;
    }
    return false;
  }

}
