import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserUpsertComponent } from './components/user-upsert/user-upsert.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'user-list', component: UserListComponent },
      { path: 'user', component: UserUpsertComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule { }
