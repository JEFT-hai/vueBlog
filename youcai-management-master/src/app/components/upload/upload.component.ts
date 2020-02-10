/*
 * @Author: your name
 * @Date: 2020-02-08 00:11:13
 * @LastEditTime : 2020-02-10 02:10:50
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\components\upload\upload.component.ts
 */
import { Component , Input} from '@angular/core';
// import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'jeft-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less']
})

export class UploadComponent {
  @Input() maxLength: Number = 3;
  @Input() ratio: String = '16: 9'
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = [
    // {
    //   uid: -1,
    //   name: 'xxx.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    // }
  ];
  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(private msg: NzMessageService) {}

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error(`图片比例只支持 ${this.ratio}！！！`);
          observer.complete();
          return;
        }

        observer.next(dimensionRes);
        observer.complete();
      });
    });
  };

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src!);
        resolve(width/height === Number(this.ratio));
      };
    });
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  getFiles = () => {
    console.log(this.fileList)
  }
}
