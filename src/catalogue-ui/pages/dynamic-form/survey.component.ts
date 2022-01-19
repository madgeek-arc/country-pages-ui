import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Survey, SurveyAnswer} from "../../../app/domain/survey";
import {zip} from "rxjs/internal/observable/zip";
import {FormControlService} from "../../services/form-control.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SurveyService} from "../../../app/services/survey.service";
import {Router} from "@angular/router";
import {
  ChapterModel, Fields,
  GroupedField,
  SurveyModel,
  Tabs,
  UiVocabulary
} from "../../domain/dynamic-form-model";
import BitSet from "bitset";

import UIkit from "uikit";

@Component({
  selector: 'app-survey',
  templateUrl: 'survey.component.html',
  providers: [FormControlService]
})

export class SurveyComponent implements OnInit, OnChanges {

  @Input() surveyAnswers: SurveyAnswer = null;
  @Input() survey: Survey = null;
  @Input() tabsHeader : string = null;

  surveyModel: SurveyModel;
  chapters: ChapterModel[] = [];
  chapterChangeMap: Map<string,boolean> = new Map<string, boolean>();
  currentChapter: ChapterModel = null;
  chapterForSubmission: ChapterModel = null;
  sortedSurveyAnswers: Object = {};
  vocabularies: Map<string, string[]>;
  subVocabularies: UiVocabulary[] = [];
  editMode = false;
  bitset: Tabs = new Tabs;

  ready = false;
  readonly : boolean = false;
  validate : boolean = false;
  errorMessage = '';
  successMessage = '';

  form: FormGroup;

  constructor(private formControlService: FormControlService, private fb: FormBuilder,
              private router: Router, private surveyService: SurveyService) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    if (this.router.url.includes('/view')) {
      this.readonly = true;
    } else if (this.router.url.includes('/validate')) {
      this.validate = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ready = false;
    if (this.surveyAnswers) {
      this.editMode = true;

      zip(
        this.formControlService.getUiVocabularies(),
        this.formControlService.getFormModel(this.surveyAnswers.surveyId)
      ).subscribe(res => {
          this.vocabularies = res[0];
          this.surveyModel = res[1];
          res[1].chapterModels.sort((a, b) => a.chapter.order - b.chapter.order);
          for (const model of res[1].chapterModels) {
            for (const surveyAnswer in this.surveyAnswers.chapterAnswers) {
              if (model.chapter.id === this.surveyAnswers.chapterAnswers[surveyAnswer].chapterId) {
                this.chapters.push(model);
                this.chapterChangeMap.set(model.chapter.id, false);
                this.sortedSurveyAnswers[model.chapter.id] = this.surveyAnswers.chapterAnswers[surveyAnswer].answer;
                break;
              }
            }
          }
          this.currentChapter = this.chapters[0];
        },
        error => {
          this.errorMessage = 'Something went bad while getting the data for page initialization. ' + JSON.stringify(error.error.error);
        },
        () => {
          for (let i  = 0; i < this.chapters.length; i++) {
            this.form.addControl(this.chapters[i].chapter.name, this.formControlService.toFormGroup(this.chapters[i].groupedFieldsList, true));
            this.prepareForm(this.sortedSurveyAnswers[Object.keys(this.sortedSurveyAnswers)[i]], this.chapters[i].groupedFieldsList)
            this.form.get(this.chapters[i].chapter.name).patchValue(this.sortedSurveyAnswers[Object.keys(this.sortedSurveyAnswers)[i]]);
          }
          if (this.surveyAnswers.validated) {
            this.readonly = true;
            this.validate = false;
          } else if (this.validate){
            UIkit.modal('#validation-modal').show();
          }

          setTimeout(() => {
            if (this.readonly) {
              this.form.disable();
            }
          }, 0);
          this.ready = true;
        });
    }
  }

  validateSurvey() {
    for (const chapterChangeMapElement of this.chapterChangeMap) {
      if (chapterChangeMapElement[1]) {
        UIkit.modal('#validation-modal').hide();
        this.errorMessage = 'There are unsaved changes, please submit all changes first and then validate.';
        return;
      }
    }
    if (this.form.valid) {
      this.surveyService.changeAnswerValidStatus(this.surveyAnswers.id, !this.surveyAnswers.validated).subscribe(
        next => {
          UIkit.modal('#validation-modal').hide();
          this.router.navigate(['/contributions/mySurveys']);
        },
        error => {
          console.error(error);
        },
        () => {});
    } else {
      UIkit.modal('#validation-modal').hide();
      console.log('Invalid form');
      this.form.markAllAsTouched();
      let str = '';
      for (let key in this.form.value) {
        // console.log(this.form.get('extras.'+key));
        console.log(key + ': '+ this.form.get(key).valid);
        if (!this.form.get(key).valid) {
          str = str + '-> ' + key + ' ';
        }
        for (const keyElement in this.form.get(key).value) {
          console.log(keyElement + ': '+ this.form.get(key+'.'+keyElement).valid);
        }
      }
      console.log(str);
      this.errorMessage = 'There are missing fields at chapters ' + str;
    }
  }

  onSubmit() {
    window.scrollTo(0, 0);
    // this.showLoader = true;
    this.formControlService.postItem(this.surveyAnswers.id, this.form.get(this.chapterForSubmission.chapter.name).value, this.editMode).subscribe(
      res => {
        this.successMessage = 'Updated successfully!';
        this.chapterChangeMap.set(this.chapterForSubmission.chapter.id, false);
        UIkit.modal('#unsaved-changes-modal').hide();
      },
      error => {
        this.errorMessage = 'Something went bad, server responded: ' + JSON.stringify(error?.error?.error);
        // this.showLoader = false;
        UIkit.modal('#unsaved-changes-modal').hide();
        console.log(error);
      },
      () => {
        setTimeout(() => {
          UIkit.alert('#successMessage').close();
        }, 4000);
        // this.showLoader = false;
      }
    );
  }

  showUnsavedChangesPrompt(chapter: ChapterModel) {
    console.log(chapter.chapter.name);
    if (this.chapterChangeMap.get(this.currentChapter.chapter.id)) {
      this.chapterForSubmission = this.currentChapter;
      UIkit.modal('#unsaved-changes-modal').show();
    }
    this.currentChapter = chapter;
  }

  getFormGroup(index: number): FormGroup {
    return this.form.get(this.chapters[index].chapter.name) as FormGroup;
  }

  setChapterChangesMap(chapterId: string[]) {
    if (chapterId[1] === null) {
      this.chapterChangeMap.set(chapterId[0], true);
    } else {
      this.chapterChangeMap.set(chapterId[0], false);
    }
  }

  /** create additional fields for arrays if needed --> **/
  prepareForm(form: Object, fields: GroupedField[]) {
    for (let key in form) {
      for (let formElementKey in form[key]) {
        if(form[key].hasOwnProperty(formElementKey)) {
          if(Array.isArray(form[key][formElementKey])) {
            // console.log(form[key][formElementKey]);
            // console.log(formElementKey);
            let formFieldData = this.getModelData(fields, formElementKey);
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

  getModelData(model: GroupedField[], name: string): Fields {
    for (let i = 0; i < model.length; i++) {
      for (let j = 0; j < model[i].fields.length; j++) {
        if(model[i].fields[j].field.name === name) {
          return model[i].fields[j];
        }
      }
    }
    return null;
  }

  popComposite(group: string, field: string) {
    let tmpArr = this.form.get(group).get(field) as FormArray;
    tmpArr.removeAt(0);
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
    });
    let tmpArr = this.form.get(group).get(field) as FormArray;
    tmpArr.push(new FormGroup(formGroup));
  }
  /** <-- create additional fields for arrays if needed **/

}
