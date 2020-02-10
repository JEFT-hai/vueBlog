/*
 * @Author: your name
 * @Date: 2020-02-08 00:43:13
 * @LastEditTime : 2020-02-10 01:55:12
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\pages\post\good\good.component.ts
 */
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-good',
  templateUrl: './good.component.html',
  styleUrls: ['./good.component.less']
})

export class GoodComponent implements OnInit {
  @ViewChild('upload', {static: false}) upload;
  constructor() { }

  ngOnInit() {
  }

  getFiles = () =>  {
    const me = this
    console.log(this.upload.fileList)
    // this.upload.getFiles()
  }
}
