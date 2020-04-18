import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
//import { FileChooser } from '@ionic-native/file-chooser';
//import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

//import { ShowPage } from '../../pages/show/show';
//import { AddnewPage } from '../../pages/addnew/addnew';

import { BldTypeProvider } from '../../providers/bld-type/bld-type';
import { VdataManageProvider } from '../../providers/vdata-manage/vdata-manage';

@IonicPage({
  name: 'home-page'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  shareBld: BldTypeProvider;
  vdProvider: VdataManageProvider;
  dataDir: string;
  bldType: string;
  

  constructor(public navCtrl: NavController,
              private nativeStorage: NativeStorage,
              bldProvider: BldTypeProvider,
              vdataProvider:  VdataManageProvider,
              //private fileChr: FileChooser,
              //private file: File
            ) {
    
    this.shareBld = bldProvider;
    this.vdProvider = vdataProvider;
    this.bldType='';
  }

  ionViewDidLoad() {
    this.firstTimeInc();

    this.vdProvider.createDirFile();
  }

  // create var to check if first run
  firstTimeInc(): void{
    this.nativeStorage.getItem('FirstRun')
    .then(
      data => {
        // nothing here
      },
      error => {
        // native returns an error code: 2
        // if item not found
        if(error.code === 2){
          this.nativeStorage.setItem('FirstRun', 0);
          // set show page to present all saved voulnteers by default
          this.nativeStorage.setItem('whotoshow', 'allv');
        }
       }
    );
  }

  checkBldType(bldType){
    if(bldType && !bldType.length){
      return true;
    }
    return (['A', 'B', 'AB', 'O'].indexOf(bldType.toUpperCase()) < 0) ? true : false; 
  }

  openFile(){
    this.vdProvider.mergeFile();
  }

  doSearch(){
    this.bldType = this.bldType.toUpperCase();
    if(this.bldType.length){
      this.shareBld.setBldType(this.bldType);
      this.navCtrl.push('ShowPage');
    }
  }

  addNew(){
    this.navCtrl.push('AddnewPage');
  }
}
