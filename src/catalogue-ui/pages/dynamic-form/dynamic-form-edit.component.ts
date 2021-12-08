import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormControlService} from '../../services/form-control.service';
import {DynamicFormComponent} from './dynamic-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Fields, FormModel, HandleBitSet} from '../../domain/dynamic-form-model';
import {zip} from 'rxjs/internal/observable/zip';

@Component({
  selector: 'app-dynamic-form-edit',
  templateUrl: './dynamic-form.component.html',
  providers: [FormControlService]
})
export class DynamicFormEditComponent extends DynamicFormComponent implements OnChanges{

  @Input() answerValue: Object = null;

  sub: Subscription;

  constructor(public route: ActivatedRoute,
              protected formControlService: FormControlService,
              protected fb: FormBuilder,
              protected router: Router,) {
    super(formControlService, fb, router);
  }

  ngOnInit() {
    // super.ngOnInit();
  }

  ngOnChanges(changes:SimpleChanges) {
    if (this.answerValue !== null && this.surveyId !== null) {
      this.editMode = true;
      this.ready = false;
      zip(
        this.formControlService.getUiVocabularies(),
        this.formControlService.getFormModel(this.surveyId)
      ).subscribe(res => {
          this.vocabularies = res[0];
          this.fields = res[1][Object.keys(res[1])[0]];
        },
        error => {
          this.errorMessage = 'Something went bad while getting the data for page initialization. ' + JSON.stringify(error.error.error);
        },
        () => {
          this.initializations();
          this.prepareForm(this.answerValue);
          this.form.patchValue(this.answerValue);
          this.validateForm();
          this.ready = true;
        });
    }
  }

  prepareForm(form: Object) {
    for (let key in form) {
      for (let formElementKey in form[key]) {
        if(form[key].hasOwnProperty(formElementKey)) {
          if(Array.isArray(form[key][formElementKey])) {
            // console.log(form[key][formElementKey]);
            // console.log(formElementKey);
            let formFieldData = this.getModelData(this.fields, formElementKey);
            let i = 1;
            if (formFieldData.field.typeInfo.type === 'composite') { // In order for the fields to be enabled
              this.popComposite(key, formElementKey)  // remove it first
              i = 0;  // increase the loops
            }
            let count = 0;
            for (i; i < form[key][formElementKey].length; i++) {
              if (formFieldData.field.typeInfo.type === 'composite') {
                this.pushComposite(key, formElementKey, formFieldData.subFieldGroups);
                // for (let formSubElementKey in form[key][formElementKey]) { // Special case when composite contains array
                  for (let formSubElementName in form[key][formElementKey][count]) {
                    if(form[key][formElementKey][count].hasOwnProperty(formSubElementName)) {
                      if(Array.isArray(form[key][formElementKey][count][formSubElementName])) {
                        // console.log('Key: ' + key + ' formElementKey: ' + formElementKey + ' count: ' + count + ' formSubElementName: ' + formSubElementName);
                        const control = <FormArray>this.form.get([key,formElementKey,count,formSubElementName]);
                        // console.log(control);
                        let required = false;
                        for (let j = 0; j < formFieldData.subFieldGroups.length; j++) {
                          if (formFieldData.subFieldGroups[j].field.name === formSubElementName) {
                            required = formFieldData.subFieldGroups[j].field.form.mandatory;
                          }
                        }
                        for (let j = 0; j < form[key][formElementKey][count][formSubElementName].length - 1; j++) {
                          control.push(required ? new FormControl('', Validators.required) : new FormControl(''));
                        }
                      }
                    }
                  }
                // }
                count++;
              } else {
                this.push(key, formElementKey, formFieldData.field.form.mandatory);
              }
            }
          }
        }
      }
    }
  }

  pushToArrayInsideComposite(parent: string, parentIndex: number, name: string, required: boolean) {
    const control = <FormArray>this.form.get([parent,parentIndex,name]);
    control.push(required ? new FormControl('', Validators.required) : new FormControl(''));
  }

  validateForm() {
    for (let control in this.form.controls) {
      // console.log(control);
      let tmp = this.form.controls[control] as FormGroup;
      for (let key in tmp.controls) {
        let formFieldData = this.getModelData(this.fields, key);
        if (formFieldData?.field.form.mandatory){
          // console.log(key);
          if (formFieldData.field.typeInfo.type === 'composite') {
            // console.log('composite: ' + key);
            for (let i = 0; i < formFieldData.subFieldGroups.length; i++) {
              if (formFieldData.subFieldGroups[i].field.form.mandatory) {
                let data = new HandleBitSet();
                data.field = formFieldData;
                data.position = i;
                this.handleBitSetOfComposite(data);
              }
            }
          } else {
            this.handleBitSet(formFieldData);
          }
        }

        if (Array.isArray(tmp.controls[key].value)) {

        }
      }
    }
  }

  push(group: string, field: string, required: boolean) {
    let tmpArr = this.form.get(group).get(field) as FormArray;
    tmpArr.push(required ? new FormControl('', Validators.required) : new FormControl(''));
  }

  pushComposite(group: string, field: string, subFields: Fields[]) {
    const formGroup: any = {};
    subFields.forEach(subField => {
      if (subField.field.typeInfo.multiplicity) {
        formGroup[subField.field.name] = subField.field.form.mandatory ?
          new FormArray([new FormControl('', Validators.required)])
          : new FormArray([new FormControl('')]);
      } else {
        formGroup[subField.field.name] = subField.field.form.mandatory ? new FormControl('', Validators.required)
          : new FormControl('');
      }
      // In this case fields must be enabled
      // if (subField.field.form.dependsOn !== null) {
      //   formGroup[subField.field.name].disable();
      // }
    });
    let tmpArr = this.form.get(group).get(field) as FormArray;
    tmpArr.push(new FormGroup(formGroup));
  }

  popComposite(group: string, field: string) {
    let tmpArr = this.form.get(group).get(field) as FormArray;
    tmpArr.removeAt(0);
  }

  getModelData(model: FormModel[], name: string): Fields {
    for (let i = 0; i < model.length; i++) {
      for (let j = 0; j < model[i].fields.length; j++) {
        if(model[i].fields[j].field.name === name) {
          return model[i].fields[j];
        }
      }
    }
    return null;
  }

}
