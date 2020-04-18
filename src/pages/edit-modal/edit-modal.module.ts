import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditModalPage } from './edit-modal';

@NgModule({
  declarations: [
    EditModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditModalPage),
  ],
})
export class EditModalPageModule {}
