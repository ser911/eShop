import { Component, OnInit } from '@angular/core';
import { UsersService } from '@eshop-frontend/users';


@Component({
  selector: 'eshop-frontend-root',
  templateUrl: './app.component.html',

})
export class AppComponent implements OnInit {
  constructor(private usersService: UsersService){}

  title = 'cataldo-store';



  ngOnInit(): void {
    //this.usersService.initAppSession();
  }

}
