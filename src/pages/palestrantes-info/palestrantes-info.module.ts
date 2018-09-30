import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PalestrantesInfoPage } from './palestrantes-info';

@NgModule({
  declarations: [
    PalestrantesInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PalestrantesInfoPage),
  ],
})
export class PalestrantesInfoPageModule {}
