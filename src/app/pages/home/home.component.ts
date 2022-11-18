import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isShowAllUsers: boolean = false;
  isLoading: boolean = false;
  users = [];
  posts = [];

  constructor(private toastr: ToastrService, private db: AngularFireDatabase) {
    this.isLoading = true;
    this.db
      .object(`/users`)
      .valueChanges()
      .subscribe((obj: any) => {
        if (obj) {
          this.users = Object.values(obj);
          this.isLoading = false;
        } else {
          this.users = [];
          this.isLoading = false;
          this.toastr.error('No User Found!', '', { closeButton: true });
        }
      });
    this.db
      .object(`/posts`)
      .valueChanges()
      .subscribe((obj: any) => {
        if (obj) {
          this.posts = Object.values(obj);
          this.isLoading = false;
        } else {
          this.posts = [];
          this.isLoading = false;
          this.toastr.error('No Posts Found!', '', { closeButton: true });
        }
      });
  }

  ngOnInit(): void {}

  showAllUsers() {
    this.isShowAllUsers = !this.isShowAllUsers;
  }
}
