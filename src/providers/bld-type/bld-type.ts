import { Injectable } from '@angular/core';

@Injectable()
export class BldTypeProvider {
  bldType: string;
  index: string;

  constructor() {
    this.index = '';
  }

  setBldType(bldType){
    this.bldType = bldType;
  }

  getBldType(){
    return this.bldType;
  }

  setIndex(i){
    this.index = i;
  }

  getIndex(){
    return this.index;
  }

}
