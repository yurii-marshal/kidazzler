import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ELoginUrls, ILoginType, LoginTypes, ELoginTypeNames } from '../shared/models/login-types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormErrors } from '../../core/shared/form-errors';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/auth.service';
import { AppValidators } from '../../core/shared/app-validators';
import { EmailAuth } from '../../core/shared/email-auth.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserRole } from '../../core/shared/enums/user-role.enum';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'kz-login-parent',
  templateUrl: './login-parent.component.html',
  styleUrls: ['../public.scss'],
})
export class LoginParentComponent implements OnInit {
  loginTypeNames = ELoginTypeNames; // to use enum in template
  loginTypeUrls = ELoginUrls; // to use enum in template
  loginTypes: ILoginType[] = LoginTypes;
  currentLoginType: ILoginType = LoginTypes.find(lt => lt.name === 'parent') || LoginTypes[0];

  loginForm: FormGroup;
  formErrors: FormErrors;
  unverifiedEmail: string;
  isUnverified = false;
  isMobile: boolean;

  claimingToken: string;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    protected authService: AuthService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.isMobile = this.userService.isMobile();
    this.claimingToken = localStorage.getItem('business-claiming-token');

    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, AppValidators.email]],
      password: ['', [Validators.required, AppValidators.currentPassword]],
    });

    this.formErrors = new FormErrors(this.loginForm);
  }

  closeMessage(): void {
    this.isUnverified = false;
  }

  sendVerificationMessage(): void {
    this.authService
      .sendVerificationMessage(this.unverifiedEmail)
      .subscribe(() =>
        this._toastr.info('Verification e-mail was sent again. Please check your inbox.'),
      );
  }

  onSubmit(): void {
    this.formErrors.setSubmitted();

    if (!this.loginForm.valid || !this.loginForm.dirty) {
      return;
    }

    this.login(this.loginForm.value).subscribe(
      () => {
        setTimeout(() => this.loginResult());
      },
      response => {
        if (response.status === 403) {
          this.isUnverified = true;
          this.unverifiedEmail = this.loginForm.value['email'];
          window.scrollTo(0, 0);
        } else if (response.error && response.error.message) {
          this._toastr.error(response.error.message);
        }
      },
    );
  }

  login(credentials: EmailAuth): Observable<boolean> {
    return this.authService.loginAsParent(credentials); // default for logging parent
  }

  async loginResult() {
    const user = await this.userService.getProfileSnapshot().toPromise();
    if ((user.role === UserRole.Business)) {
      if (this.claimingToken) {
        window.location.href = `${environment.url}/verify-claim?token=${this.claimingToken}`;
      } else {
        this._router.navigate(['/']);
      }
    } else if (user.role === UserRole.Parent || user.role === UserRole.Organization) {
      this._router.navigate(['/']);
    }
  }
}
