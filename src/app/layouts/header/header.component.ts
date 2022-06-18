import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email = null;

  constructor(private auth: AuthService, private router: Router, private toastr: ToastrService) {
    this.auth.getUser().subscribe((user: any) => {
      this.email = user?.email;
    });
   }

  ngOnInit(): void {
  }

  async handleSignOut() {
    try {
      await this.auth.signOut();
      this.email = null;
      this.router.navigateByUrl("signin");
      this.toastr.success("Signed Out Successfully!", "", {closeButton: true});
    } catch (error) {
      this.toastr.error("Sign Out Failed, please try again!", "", {closeButton: true});
    }
  }

}
