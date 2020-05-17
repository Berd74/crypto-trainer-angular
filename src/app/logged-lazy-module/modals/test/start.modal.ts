import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FirebaseAuthService} from '../../../services/firebase.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  templateUrl: './start.modal.html',
  styleUrls: ['./start.modal.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class StartModal implements OnInit {
  @Input() name;

  public formGroup: FormGroup;
  public error: string;


  constructor(private firebaseAuthService: FirebaseAuthService,
              private formBuilder: FormBuilder,
              private angularFireDatabase: AngularFireDatabase,
              public activeModal: NgbActiveModal) {
  }

  public ngOnInit() {
    this.formGroup = this.formBuilder.group({
      cash: ['', [Validators.required, Validators.min(100), Validators.max(100000), Validators.pattern('^[0-9]+$')]],
    });
    this.formGroup.valueChanges.subscribe(n => this.error = null);
  }

  public onOkClick() {

    if (this.formGroup.valid) {

      this.angularFireDatabase.database.ref('users/' + this.firebaseAuthService.user.uid + '/cash').set(
        this.formGroup.value.cash
      );

      this.error = null;
      this.activeModal.close();
    } else {
      this.error = 'Provide number in range 100 - 1000000';
    }

  }

}
