/*
 * @Author: your name
 * @Date: 2020-02-08 01:46:02
 * @LastEditTime : 2020-02-12 01:01:05
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\pages\post\post-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoodComponent } from './good/good.component';
const routes: Routes = [
  { path: 'good', component: GoodComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule {}