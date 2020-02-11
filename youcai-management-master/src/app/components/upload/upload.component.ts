/*
 * @Author: your name
 * @Date: 2020-02-08 00:11:13
 * @LastEditTime : 2020-02-11 02:45:27
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\components\upload\upload.component.ts
 */
import { Component , Input} from '@angular/core';
// import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'jeft-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less']
})

export class UploadComponent {
  @Input() maxLength: Number = 3;
  @Input() ratio: Number = 16 / 9;
  imageCropperShow: Boolean = false;
  transform: object = {};
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  scale: number = 1;
  fileList: any = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(private msg: NzMessageService) {}

  //  base64 => file
  dataURLtoFile (dataUrl) {
    var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    let file = new File([u8arr], 'file', {type:mime});
    return file
  };

  // 选择图片方法
  async fileChangeEvent(event: any) {
    const file = event.target.files[0]
    const ok = await this.checkImageDimension(file)
    if (ok) {
      const cover = this.imageCropped
      this.resolveImage({
        originFile: file,
        cover: cover
      })
    } else {
      this.msg.error(`图片宽高比必须要为 ${this.ratio}`);
      this.imageChangedEvent = event;
      this.imageCropperShow = true
    }
  }

  // 图片上传过滤
  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src!);
        resolve(width/height === this.ratio);
      };
    });
  }

  resolveImage (fileItem) {
    this.fileList.push(fileItem)
  }

  // 对于图片item的操作
  handlePreview = (item) => {
    this.previewImage = item.cover || item.url;
    this.previewVisible = true;
  };
  
  handleDelete = (item) => {
    const index = this.fileList.findIndex(itm => item === itm);
    this.fileList.splice(index, 1)
  }
  
  // image-croper 方法

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    return this.croppedImage
  }

  zoomIn (): void {
    this.scale -= .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
  }
  zoomOrigin (): void {
    this.scale = 1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
  }
  zoomOut (): void {
    this.scale += .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
  }
  imageConfirm (): void {
    const file = this.dataURLtoFile(this.croppedImage);
    const fileItem = {
      originFile: this.dataURLtoFile(this.croppedImage),
      cover: this.croppedImage
    }
    this.resolveImage(fileItem)
    this.imageCropperShow = false
  }
}
