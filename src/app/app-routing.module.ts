import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AddPostComponent } from './pages/add-post/add-post.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const redirectUnauthorizedToSignIn = () => redirectUnauthorizedTo(['signin']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: "signin", component: SigninComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectLoggedInToHome}
  },
  {
    path: "signup", component: SignupComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectLoggedInToHome}
  },
  {
    path: "addpost", component: AddPostComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToSignIn}
  },
  {
    path: "", component: HomeComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToSignIn}
  },
  {
    path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
