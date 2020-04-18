import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

@Injectable()
export class VdataManageProvider {
  dataDir: string;
  vdataDir: string;
  loader: any;

  constructor(public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              private file: File,
              private fileChr: FileChooser
            ) {
    
    this.dataDir = this.file.externalDataDirectory; // internalStorage/Android/data
    this.vdataDir = this.dataDir + 'vdata/'; // // internalStorage/Android/data/vdata/{{file goes here}}
  }
  

  // check data directory
  checkDataDir(): void{
    this.file.checkDir(this.dataDir, 'vdata')
    .then(_ => {return true})
    .catch(err => {return false})
  }

  // check data file and create it if
  // file not found at first time use
  createDirFile(): void{
    let loader = this.loadingCtrl.create({
      content: 'جارى التحميل'
    });
    loader.present();
    this.file.createDir(this.dataDir, 'vdata', false)
    .then(_ => {
      loader.dismiss();
      this.file.writeFile(this.vdataDir, 'vd.json', '[]');
    })
    .catch((err) => {
      loader.dismiss();
    })
  }

 
  showData(){
    // show loader
    let loader = this.loadingCtrl.create({
      content: 'جارى التحميل'
    });
    loader.present();

    return this.file.readAsText(this.vdataDir, 'vd.json')
    .then((vd) => {
      console.log(vd);
      loader.dismiss();
      return JSON.parse(vd);
    })
    .catch((err) => {
      loader.dismiss();
      return err;
    });
    
  }

  saveToFile(index: number, name: string, pn: number, bldType: {type, sign}, since: string){
    let loader = this.loadingCtrl.create({
      content: 'جارى التحميل'
    });
    loader.present();
    // check if file exists
    this.file.checkFile(this.dataDir+'vdata/', 'vd.json')
    .then(_ => {
      // file found 
      this.file.readAsText(this.vdataDir, 'vd.json')
      .then((txt) => {
        // convert text to json array of obj
        let vdata = JSON.parse(txt);
        // add new data to an object
        // and push it to old data object
        let newvd = {
          name: name,
          pn: pn,
          bldType: {
            type: bldType.type,
            sign: bldType.sign
          },
          since: since
        };
        vdata.push(newvd);
        console.log(newvd);
        // write full data to file
        this.file.writeExistingFile(this.vdataDir, 'vd.json', vdata);
        loader.dismiss();
        this.showToast(true);
      })
      .catch((err) => {
        loader.dismiss();
        this.showToast(false);
      });
    })
    .catch((err) => {
      loader.dismiss();
      this.showToast(false);
    })
  }

  // show.ts && edit-modal.ts
  // edit save users or delete
  updateUserInf(index: number, name: string, pn: number, bldType: string, bldSign: boolean, since: string, del: boolean = false){
    let loader = this.loadingCtrl.create({
      content: 'جارى التحميل'
    });
    loader.present();

    return this.file.readAsText(this.vdataDir, 'vd.json')
    .then((vd) => {
      let newvd = {
        name: name,
        pn: pn,
        bldType: {
          type: bldType,
          sign: bldSign
        },
        since: since
      };

      let vdata: Array<{}> = JSON.parse(vd);
      //console.log(vdata[index], newvd,vdata[index] = newvd);
      //console.log(+index, index);
      let success = true,
          delmes = false;
      if(del){
        vdata.splice(index, 1);
        delmes = true;
      }
      else{
        vdata[index] = newvd;
      }
      //console.log('sec', vdata);
      this.file.writeExistingFile(this.vdataDir, 'vd.json', JSON.stringify(vdata))
      .then(_ => {
        loader.dismiss();
        this.showToast(success, delmes);
        return vdata;
      })
      .catch((err) => {
        loader.dismiss();
        this.showToast(false);
      })
    })
    .catch((err) => {
      loader.dismiss();
      this.showToast(false);
    });
  }

  /**
   * merge another data file
   * @description open file chooser to let user select another data file and read it
   *              then open current data file and read it
   *              merge two files into one
   *              and save at app data Dir
   * @requires internalStorage selecting a file from otherwise this dir will cause an error
   * @requires fileName => vd.json
   */
  mergeFile(){
    this.fileChr.open()
    .then(uri => {
      (<any>window).FilePath.resolveNativePath(uri, (result) => {
        // show loader
        let loader = this.loadingCtrl.create({
          content: 'جارى التحميل'
        });
        loader.present();

        // check if choosed file is our file
        // if not return with an error
        if(!result.match(/\/vd.json/)){
          this.showToast(false, false, false, 'تم اختيار ملف خاطئ');
          loader.dismiss();
          return false;
        }
        let path = result.replace(/vd.json/,'');
          this.file.readAsText(path, 'vd.json')
          .then(newData => {
            console.log(newData);
            newData = JSON.parse(newData);
            // open current file
            console.log(this.dataDir);
            this.file.readAsText(this.vdataDir, 'vd.json')
            .then(oldData => {
              //console.log(oldData);
              oldData = JSON.parse(oldData);
              // concat two arrays
              oldData = oldData.concat(newData);
              //console.log(oldData);
              // write it again
              this.file.writeExistingFile(this.vdataDir, 'vd.json', JSON.stringify(oldData))
              .then(_ => {
                //console.log(oldData);
                loader.dismiss();
                this.showToast(true);
              })
              .catch(err =>{
                //console.log(err);
              })
              
            })
            .catch(err => {
              //console.log(err);
              loader.dismiss();
            })
          })
          .catch(err => {
            //console.log(err);
            loader.dismiss();
          })
      })
    })
    .catch(e => {
      //console.log(e);
    });
  }

  /**
   * Show Toast with an message
   * 
   * @param success either saved or error happend
   * @param del delete entry message
   * @param nodata no data found message
   * @param custom set custom message
   */
  showToast(success = true, del = false, nodata = false, custom = ''): void{
    let mes = success === true ? 'تم الحفظ بنجاح' : 'حدث خطأ غير متوقع';
    if(del){
      mes = "تم المسح بنجاح";
    }
    if(nodata){
      mes = 'عفوا.. لم يتم اضافه اى متبرعين  بهذه الفصيله';
    }
    if(custom.length > 1){
      mes = custom;
    }
    let toast = this.toastCtrl.create({
      message: mes,
      duration: 3000,
      position: 'bottom',
      cssClass: "center-txt"
    });
    toast.present();
  }
}