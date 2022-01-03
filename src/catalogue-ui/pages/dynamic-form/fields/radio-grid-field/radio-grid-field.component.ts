import {Component, Input, OnInit} from "@angular/core";
import {Fields} from "../../../../domain/dynamic-form-model";
import {FormGroup, FormGroupDirective} from "@angular/forms";

@Component({
  selector: 'app-radio-grid',
  templateUrl: './radio-grid-field.component.html'
})

export class RadioGridFieldComponent implements OnInit {
  @Input() fieldData: Fields;

  form!: FormGroup;
  hideField: boolean = null;


  constructor(private rootFormGroup: FormGroupDirective) {
  }

  ngOnInit() {
    this.form = this.rootFormGroup.control;
    // console.log(this.form)
  }
}
