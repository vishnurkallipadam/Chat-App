import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators} from '@angular/forms'
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authservice:AuthService,private router:Router) { }

  regForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]),
    password: new FormControl('',[Validators.required,Validators.pattern('^(?=[^A-Z][A-Z])(?=[^a-z][a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')])
  })

  user={
    email:'',
    password:''
  }
  ngOnInit(): void {

  }

  registerStudent(){
    console.log("called");
    
    console.log(this.regForm.value);
    this.authservice.userSignup(this.regForm.value)
    .subscribe(
      data=>{
        console.log("register successfully");
        this.ngOnInit;
      },
      err=>{
        alert(err.error)
        
      }

    )

  }

  login(){
    console.log(this.user);
    this.authservice.userlogin(this.user)
    .subscribe(
      data=>{
        localStorage.setItem('user',"logined")
        alert("login success")
      },
      err=>{        
        alert(err.error);
      }
    )
    

  }

}