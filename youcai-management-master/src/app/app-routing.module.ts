/*
 * @Author: your name
 * @Date: 2020-02-03 15:59:05
 * @LastEditTime: 2020-02-08 01:58:06
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\app-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'verify', loadChildren: () => import('./pages/verify/verify.module').then(m => m.VerifyModule) },
  { path: 'post', loadChildren: () => import('./pages/post/post-module').then(m => m.PostModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
