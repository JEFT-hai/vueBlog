/*
 * @Author: your name
 * @Date: 2020-02-08 01:46:31
 * @LastEditTime : 2020-02-08 04:14:11
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\pages\post\post-module.ts
 */
import { NgModule } from '@angular/core';

import { PostRoutingModule } from './post-routing.module';

import { GoodComponent } from './good/good.component';
import { UploadModule } from 'src/app/components/upload/upload.module';

@NgModule({
  imports: [PostRoutingModule, UploadModule],
  declarations: [GoodComponent],
  exports: [GoodComponent]
})
export class PostModule { }
