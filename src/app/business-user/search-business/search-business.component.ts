import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'kz-search-business',
  templateUrl: './search-business.component.html',
  styleUrls: ['./search-business.component.scss', '../business-user.scss'],
})
export class SearchBusinessComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
  }


  ngOnInit() {
    this.form = this.fb.group({
      country: ['United States'],
      name: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.router.navigate(['/search-result'], {
      queryParams: {
        country: this.form.value.country,
        name: this.form.value.name,
      },
    });
  }

}
