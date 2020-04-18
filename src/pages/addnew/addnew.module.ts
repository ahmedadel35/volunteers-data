import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddnewPage } from './addnew';

@NgModule({
  declarations: [
    AddnewPage,
  ],
  imports: [
    IonicPageModule.forChild(AddnewPage),
  ],
})
export class AddnewPageModule {}
