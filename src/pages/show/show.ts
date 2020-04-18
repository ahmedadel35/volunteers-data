import { Component } from '@angular/core';
import { IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  AlertController,
  ModalController  } from 'ionic-angular';

import { CallNumber } from '@ionic-native/call-number';
import { NativeStorage } from '@ionic-native/native-storage';

import { BldTypeProvider } from '../../providers/bld-type/bld-type';
import { VdataManageProvider } from '../../providers/vdata-manage/vdata-manage';

//import { EditModalPage } from '../edit-modal/edit-modal';
//import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-show',
  templateUrl: 'show.html',
})
export class ShowPage {
  public title: string;
  private fulldata: string[];
  private resetData: string[];
  public type: string = 'pos';
  private bldInput: string;
  private bldSign: boolean;
  private animate:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private nativeStorage: NativeStorage,
              public bldProvider: BldTypeProvider,
              private vdMange: VdataManageProvider,
              private callNum: CallNumber) {

    this.bldInput = bldProvider.getBldType();
    this.title = bldProvider.getBldType();

    // check either to show all users or only who can volunteer
    // default is all =====> home.ts Ln: 57
    this.nativeStorage.getItem('whotoshow')
    .then(d => {
      let allv = d === 'allv' ? true : false;
      this.showData(allv);
    })
    .catch(err => {
      this.vdMange.showToast(false);
    })
  }

  doRefresh(refresher = null) {
    this.animate = true;
    this.nativeStorage.getItem('whotoshow')
    .then(d => {
      let allv = d === 'allv' ? true : false;
      this.showData(allv)
      .then(_ => {
        this.animate = false;
        if(refresher !== null){
          refresher.complete()
        }
      });
    })
  }

  // searchbar handler
  // search by name
  getItems(ev: any) {

    // reset data var
    this.fulldata = this.resetData;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.fulldata = this.fulldata.filter((item) => {
        return (item['name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  // call user number
  callByNum(n: string) {
    this.callNum.callNumber(n, true);
  }

  presentActionSheet(index: number, name: string, pn:number, bldSign:boolean, since: string) {
    let actionSheet = this.actionSheetCtrl.create({
      title: name,
      cssClass: 'center-txt',
      buttons: [
        {
          text: 'تعديل',
          handler: () => {
            // create modal to edit user
            let editModal = this.modalCtrl.create('EditModalPage', {
              data: this.fulldata,
              index: index,
              name: name,
              pn: pn,
              since: since,
              bldType: this.bldInput,
              bldSign: bldSign
            });
            editModal.present();
          }
        },{
          text: 'مسح',
          handler: () => {
            var alert = this.alertCtrl.create({
              title: 'مسح',
              message: name,
              cssClass: 'center-txt',
              buttons: [
                  {
                      text: 'إلغاء',
                      role: 'cancel'
                  },
                  {
                      text: 'تأكيد',
                      handler: () => {
                        //console.log(index);
                          this.vdMange.updateUserInf(index, name, pn, this.bldInput, bldSign, since, true)
                          .then(_ => {
                            this.doRefresh();
                            actionSheet.dismiss();
                          });
                      }
                  }
              ]
          });
          alert.present();
          }
        },{
          text: 'إلغاء',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  showData(allv = true){
    // get data from file
    return this.vdMange.showData()
    .then((vd) => {// data found successfully
      if(vd.length){
        // filter data  to show only searched blood type
        let result = []; // create an array to save result
        vd.filter((item) => {
          //console.log(item['bldType']['type'], this.bldInput.toUpperCase(), item['bldType']['type'].indexOf(this.bldInput.toUpperCase()) > -1)
          if(allv){ // show all users
            if(item['bldType']['type'] == this.bldInput.toUpperCase()){
              result.push(item);
              //console.log(item);
            }
          }
          else{
            // show only who can voulnteer
            // with last volunteer data from now less than three months
            if(item['bldType']['type'] == this.bldInput.toUpperCase()
            && this.monthDiff(item['since'], true) < 3){
              result.push(item);
            }
          }
        })
        //console.log(result);
        if(result.length){
          //console.log(result);
          this.fulldata = this.resetData = result;
        }
        else{
          // no user with this blood type
          // show toast to user and return to home page
          this.vdMange.showToast(false, false, true);
          this.navCtrl.pop(); 
        }
      }
      else{
        // data is empty
        // show toast to user and return to home page
        this.vdMange.showToast(false, false, true);
        this.navCtrl.pop();
      }
    })
  }

  /**
  * create a function to get the deffrence of two dates
  *
  * @param d old date (person last blood vl date)
  * @param num show numberd outbut or string compined
  */
  monthDiff(d, num = false) {
    var months,
        d1 = new Date(d),
        d2 = new Date(Date.now());
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1; // add one because js months starts with 0
    months += d2.getMonth() + 1; 
    if(!num){
      var ext = months >= 12 ? Math.floor((months/12)) + ' سنه' : Math.floor(months) + ' شهر';
      if(months === 0){
        ext = 'الشهر ده';
      }
      else if(months < 0){
        ext = '';
      }
      else{
        ext = ext;
      }
      return ext;
    }
    else{
      return months <= 0 ? 0 : months;
    }
  }

  /**
   * choose who to present in show 
   * either all users or only who can voulnteer
   * @default allv show all users
   */ 
  whoToShow(){
    let onlyv = false,
        allv = true;
    
    let alert = this.alertCtrl.create({
      title: 'إعرض',
      cssClass: 'ctxt',
    });

    this.nativeStorage.getItem('whotoshow')
    .then( (d) => {
      if(d === 'onlyv'){
        onlyv = true;
        allv = false;
      }
      
      alert.addInput({
        type: 'radio',
        label: 'الكل',
        value: 'allv',
        checked: allv
      });
      alert.addInput({
        type: 'radio',
        label: 'من يمكنهم التبرع فقط',
        value: 'onlyv',
        checked: onlyv
      });
  
      alert.addButton('إلغاء');
      alert.addButton({
        text: 'موافق',
        handler: data => {
          this.nativeStorage.setItem('whotoshow', data); // set var to choosed label
          allv = data === 'allv' ? true : false;
          onlyv = data === 'onlyv' ? true : false;
          
          // check if user changed alredy checked label or not
          // if not do nothing
          // if true refresh page
          if((d !== 'allv' && data === 'allv' && allv)
          || (d !== 'onlyv' && data === 'onlyv' && onlyv)){
            this.doRefresh();
          }
          // else
            // do nothing
        }
      });
      alert.present();
    })
    .catch(err => {
      //console.log(err);
    });
  }

}
