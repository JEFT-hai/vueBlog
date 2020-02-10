/*
 * @Author: your name
 * @Date: 2020-02-08 03:31:46
 * @LastEditTime : 2020-02-10 00:12:31
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\components\component.module.ts
 */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';

import { UploadComponent } from './upload.component'

import { NzUploadModule } from 'ng-zorro-antd/upload'
import { NzIconModule, NzModalModule } from 'ng-zorro-antd'
import { ɵAnimationGroupPlayer } from '@angular/animations';

@NgModule({
    imports: [CommonModule, NzUploadModule, NzIconModule, NzModalModule],
    declarations: [UploadComponent],
    exports: [UploadComponent]
})

export class UploadModule {}