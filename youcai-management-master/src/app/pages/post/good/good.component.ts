/*
 * @Author: your name
 * @Date: 2020-02-08 00:43:13
 * @LastEditTime : 2020-02-11 17:29:42
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\pages\post\good\good.component.ts
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-good',
  templateUrl: './good.component.html',
  styleUrls: ['./good.component.less']
})

export class GoodComponent implements OnInit {
  validateForm: FormGroup;
  bigTypes: Array<String> = ['水', '电', '泥', '木', '油'];
  bigType: String = '';
  @ViewChild('upload', {static: false}) upload;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      goodType: [null, [Validators.required]],
      goodBrand: [null, [Validators.required]],
      goodName: [null, [Validators.required]],
      goodDesc: [null, [Validators.required]],
      goodPrice: [null, [Validators.required]],
      oldPrice: [null],
      goodSize: [null],
      goodColor: [null],
      goodUnit: [null]
    });
  }

  // form表单提交
  submitForm(): void {
    console.log(this.validateForm, 'valid', Validators.required)
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  getFiles = () =>  {
    const me = this
    console.log(this.upload.fileList)
    // this.upload.getFiles()
  }
}
