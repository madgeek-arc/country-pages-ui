import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormControlService} from '../../services/form-control.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  ChapterModel,
  Fields,
  GroupedField,
  HandleBitSet,
  Tab, Tabs,
  UiVocabulary
} from '../../domain/dynamic-form-model';
import BitSet from "bitset";
import {PremiumSortPipe} from "../../shared/pipes/premium-sort.pipe";

import UIkit from 'uikit';
import {SurveyService} from "../../../app/services/survey.service";

@Component({
  selector: 'app-chapter-edit',
  templateUrl: './chapter.component.html',
  providers: [FormControlService]
})
export class ChapterEditComponent implements OnChanges{

  @Input() answerValue: Object = null;
  @Input() form: FormGroup = null;
  @Input() tabsHeader: string;
  @Input() surveyAnswerId: string = null;
  @Input() readonly : boolean = null;
  @Input() validate : boolean = null;
  @Input() chapter: ChapterModel = null;
  @Input() fields: GroupedField[] = null;

  @Output() chapterHasChanges = new EventEmitter<string[]>();

  vocabularies: Map<string, string[]>;
  subVocabularies: UiVocabulary[] = [];
  editMode = true;

  bitset: Tabs = new Tabs;
  errorMessage = '';
  successMessage = '';
  ready = false;
  showLoader = false;
  hasChanges = false;
  pendingService = false;

  showBitsets = false;
  loaderBitSet = new BitSet;
  loaderPercentage = 0;
  tabIndex= 0;

  premiumSort = new PremiumSortPipe();

  constructor(public route: ActivatedRoute, private surveyService: SurveyService,
              protected formControlService: FormControlService,
              protected fb: FormBuilder,
              protected router: Router) {
  }

  ngOnInit() {
    // super.ngOnInit();
  }

  ngOnChanges(changes:SimpleChanges) {
    this.ready=false
    if (this.answerValue) {
      this.initializations();
      this.ready = true
      if (this.validate) {
        // console.log('validating');
        // for (let key in this.form.value) {
          // console.log(this.form.get(key));
          // console.log(key + ': '+ this.form.get(key).valid);
        // }
      }
    }
  }

  onSubmit(tempSave: boolean, pendingService?: boolean) {
    // if (this.form.valid) {
    window.scrollTo(0, 0);
    this.showLoader = true;
    this.formControlService.postItem(this.surveyAnswerId, this.form.getRawValue(), this.editMode).subscribe(
      res => {
        // this.router.navigate(['/contributions/mySurveys']);
      },
      error => {
        this.errorMessage = 'Something went bad, server responded: ' + JSON.stringify(error.error.error);
        this.showLoader = false;
        console.log(error);
      },
      () => {
        this.successMessage = 'Updated successfully!';
        setTimeout( () => {
          UIkit.alert('#successMessage').close();
        }, 4000);
        this.showLoader = false;
        this.unsavedChangesPrompt(true, 'notNull');
      }
    );
    // } else {
    //   this.errorMessage = 'Please check if all the required fields have a value.';
    //   window.scrollTo(0, 0);
    //   console.log('is service valid: ' + this.form.get('service').valid);
    //   console.log('is extras valid: ' + this.form.get('extras').valid);
    // for (let extrasKey in this.form.get('extras').value) {
    //   console.log(this.form.get('extras.'+extrasKey));
    //   console.log(extrasKey + ': '+ this.form.get('extras.'+extrasKey).valid);
    // }
    // }
  }

  validateSurvey() {
    if (this.form.valid) {
      this.surveyService.changeAnswerValidStatus(this.surveyAnswerId, this.validate).subscribe(
        next => {
          UIkit.modal('#validation-modal').hide();
          this.router.navigate(['/contributions/mySurveys'])
        },
        error => {
          console.error(error)
        },
        () => {});
    }
  }

  initializations() {
    /** Initialize tab bitsets **/
    let requiredTabs = 0, requiredTotal = 0;
    let obj = new Map();
    this.fields.forEach(group => {
      let tab = new Tab();
      tab.requiredOnTab = tab.remainingOnTab = group.required.topLevel;
      tab.valid = false;
      tab.order = group.group.order;
      tab.bitSet = new BitSet;
      // obj[group.group.id] = tab;
      obj.set(group.group.id, tab);
      if (group.required.topLevel > 0) {
        requiredTabs++;
      }
      requiredTotal += group.required.total;
    });
    this.bitset.tabs = obj;
    this.bitset.completedTabs = 0;
    this.bitset.completedTabsBitSet = new BitSet;
    this.bitset.requiredTabs = requiredTabs;
    this.bitset.requiredTotal = requiredTotal;

    /** Initialize and sort vocabulary arrays **/
    // let voc: UiVocabulary[] = this.vocabularies['Subcategory'].concat(this.vocabularies['Scientific subdomain'].concat(this.vocabularies['Subusers']));
    // this.subVocabularies = this.groupByKey(voc, 'parentId');
    // for (const [key, value] of Object.entries(this.vocabularies)) {
    //   this.premiumSort.transform(this.vocabularies[key], ['English', 'Europe', 'Worldwide']);
    // }
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

  /** Bitsets-->**/
  timeOut(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  handleBitSetOfComposite(data: HandleBitSet) {
    let field = data.field;
    let pos = data.position;
    // console.log(field.field.name);

    if (field.field.typeInfo.multiplicity) {
      let formArray = this.form.get(field.field.accessPath) as FormArray;
      let flag = false;
      for (let i = 0; i < formArray.length; i++) {
        if (formArray.controls[i].valid) {
          flag = true;
          field.subFieldGroups.forEach(f => {
            if (f.field.form.mandatory)
              this.loaderBitSet.set(parseInt(f.field.id), 1);
          });
          this.decreaseRemainingFieldsPerTab(field.field.form.group, field.field.form.display.order);
          break;
        }
      }
      if (!flag) {
        // console.log('didnt found valid array field')
        let found = new Array(field.subFieldGroups.length);
        for (let j = 0; j < field.subFieldGroups.length; j++) {
          for (let i = 0; i < formArray.length; i++) {
            if (field.subFieldGroups[j].field.form.mandatory && formArray.controls[i].get(field.subFieldGroups[j].field.name).valid) {
              found[j] = true;
              break;
            }
          }
        }
        for (let i = 0; i < found.length; i++) {
          if (!found[i]) {
            this.loaderBitSet.set(parseInt(field.subFieldGroups[i].field.id), 0);
          } else {
            this.loaderBitSet.set(parseInt(field.subFieldGroups[i].field.id), 1);
          }
        }
        this.increaseRemainingFieldsPerTab(field.field.form.group, field.field.form.display.order);
      }
    } else if (field.subFieldGroups[pos].field.form.mandatory) {
      if (this.form.get(field.subFieldGroups[pos].field.accessPath).valid) {
        this.loaderBitSet.set(parseInt(field.subFieldGroups[pos].field.id), 1);
        if (this.form.get(field.field.accessPath).valid) {
          this.decreaseRemainingFieldsPerTab(field.field.form.group, field.field.form.display.order);
        } else {
          this.increaseRemainingFieldsPerTab(field.field.form.group, field.field.form.display.order);
        }
      } else {
        this.loaderBitSet.set(parseInt(field.subFieldGroups[pos].field.id), 0);
        if (this.form.get(field.field.accessPath).valid) {
          this.decreaseRemainingFieldsPerTab(field.field.form.group, field.field.form.display.order);
        } else {
          this.increaseRemainingFieldsPerTab(field.field.form.group, field.field.form.display.order);
        }
      }
    }
    this.updateLoaderPercentage();
  }

  handleBitSet(data: Fields) {
    console.log(data.field.name);
    if (data.field.typeInfo.multiplicity) {
      this.handleBitSetOfGroup(data);
      return;
    }
    // console.log(this.form.get(data.field.accessPath).valid);
    if (this.form.get(data.field.accessPath).valid) {
      this.decreaseRemainingFieldsPerTab(data.field.form.group, data.field.form.display.order);
      this.loaderBitSet.set(parseInt(data.field.id), 1);
    } else if (this.form.get(data.field.accessPath).invalid) {
      this.increaseRemainingFieldsPerTab(data.field.form.group, data.field.form.display.order);
      this.loaderBitSet.set(parseInt(data.field.id), 0);
    } else if (this.form.get(data.field.accessPath).pending) {
      this.timeOut(300).then(() => this.handleBitSet(data));
      return;
    }
    this.updateLoaderPercentage();
  }

  handleBitSetOfGroup(data: Fields) {
    let formArray = this.form.get(data.field.accessPath) as FormArray;
    let flag = false;
    for (let i = 0; i < formArray.length; i++) {
      if (formArray.controls[i].valid) {
        flag = true;
        this.decreaseRemainingFieldsPerTab(data.field.form.group, data.field.form.display.order);
        this.loaderBitSet.set(parseInt(data.field.id), 1);
        break;
      } else if (formArray.controls[i].pending) {
        this.timeOut(300).then(() => this.handleBitSetOfGroup(data));
        return;
      }
    }
    if (!flag) {
      this.increaseRemainingFieldsPerTab(data.field.form.group, data.field.form.display.order);
      this.loaderBitSet.set(parseInt(data.field.id), 0);
    }
    this.updateLoaderPercentage();
  }

  updateLoaderPercentage() {
    // console.log(this.loaderBitSet.toString(2));
    // console.log('cardinality: ', this.loaderBitSet.cardinality());
    this.loaderPercentage = Math.round((this.loaderBitSet.cardinality() / this.bitset.requiredTotal) * 100);
    // console.log(this.loaderPercentage, '%');
  }

  decreaseRemainingFieldsPerTab(tabId: string, bitIndex: number) {
    this.bitset.tabs.get(tabId).bitSet.set(bitIndex, 1);
    this.bitset.tabs.get(tabId).remainingOnTab = this.bitset.tabs.get(tabId).requiredOnTab - this.bitset.tabs.get(tabId).bitSet.cardinality();
    if (this.bitset.tabs.get(tabId).remainingOnTab === 0 && this.bitset.completedTabsBitSet.get(this.bitset.tabs.get(tabId).order) !== 1) {
      this.calcCompletedTabs(tabId, 1);
    }
  }

  increaseRemainingFieldsPerTab(tabId: string, bitIndex: number) {
    this.bitset.tabs.get(tabId).bitSet.set(bitIndex, 0);
    this.bitset.tabs.get(tabId).remainingOnTab = this.bitset.tabs.get(tabId).requiredOnTab - this.bitset.tabs.get(tabId).bitSet.cardinality();
    if (this.bitset.completedTabsBitSet.get(this.bitset.tabs.get(tabId).order) !== 0) {
      this.calcCompletedTabs(tabId, 0);
    }
  }

  calcCompletedTabs(tabId: string, setValue: number) {
    if (tabId && this.bitset.tabs.get(tabId).order) {
      this.bitset.completedTabsBitSet.set(this.bitset.tabs.get(tabId).order, setValue);
      this.bitset.completedTabs = this.bitset.completedTabsBitSet.cardinality();
    }
  }

  /** <--Bitsets**/

  /** emit changes-->**/
  unsavedChangesPrompt(e: boolean, removeChanges: string = null){
    if (e) {
      this.chapterHasChanges.emit([this.chapter.chapter.id, removeChanges]);
    }
  }
  /** <--emit changes**/

  /** Other stuff **/

  groupByKey(array: any, key: any) {
    return array.reduce((hash: any, obj: any) => {
      if (obj[key] === undefined) {
        return hash;
      }
      return Object.assign(hash, {[obj[key]]: (hash[obj[key]] || []).concat(obj)});
    }, {});
  }

}
