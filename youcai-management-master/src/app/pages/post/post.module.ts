/*
 * @Author: your name
 * @Date: 2020-02-08 01:46:31
 * @LastEditTime : 2020-02-12 01:01:28
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\pages\post\post-module.ts
 */
import { NgModule } from '@angular/core';
import { HtmlPipe } from '../../components/transform.pipe'

import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzFormModule } from 'ng-zorro-antd/form';

import { PostRoutingModule } from './post-routing.module';

import { GoodComponent } from './good/good.component';
import { UploadModule } from 'src/app/components/upload/upload.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MobileEditorComponent } from '../../components/mobile-editor/mobile-editor.component';

@NgModule({
  imports: [CommonModule, PostRoutingModule, UploadModule, NzRadioModule, NzFormModule, FormsModule, ReactiveFormsModule],
  declarations: [GoodComponent, MobileEditorComponent, HtmlPipe],
  exports: [GoodComponent]
})
export class PostModule { }
