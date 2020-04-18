import { Component } from '@angular/core';
import { IonicPage,
         NavController,
         NavParams,
         ViewController } from 'ionic-angular';
//import { File } from '@ionic-native/file';

//import { BldTypeProvider } from '../../providers/bld-type/bld-type';
import { VdataManageProvider } from '../../providers/vdata-manage/vdata-manage';

//import { ShowPage } from '../../pages/show/show';

@IonicPage()
@Component({
  selector: 'page-edit-modal',
  templateUrl: 'edit-modal.html',
})
export class EditModalPage {
  private index: number;
  private name: string;
  private pn: number;
  private since: any;
  private bldType: string;
  private bldSign: boolean;
  public today: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private vdMange: VdataManageProvider,
    //private file: File,
    //public shareBld: BldTypeProvider
  ) {
    
    //init vars
    this.index = navParams.get('index');
    this.name = navParams.get('name');
    this.pn = navParams.get('pn');
    this.since = navParams.get('since');
    this.bldType = navParams.get('bldType');
    this.bldSign = navParams.get('bldSign');

    // get today date to set the minninum date in date picker
    let d = new Date(Date.now());
    let m = d.getMonth() +1; // js month starts with 0
    let month = m > 9 ? m : '0' + m;
    this.today = d.getFullYear() + '-' + month + '-' + d.getDate();

  }
  

  save(){
    this.vdMange.updateUserInf(this.index, this.name, this.pn,  this.bldType, this.bldSign, this.since);
  }

}
