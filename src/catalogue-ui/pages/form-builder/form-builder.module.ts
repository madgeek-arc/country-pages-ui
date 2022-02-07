import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilderComponent} from "./form-builder.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {GroupSectionComponent} from "./group-section/group-section.component";
import {FieldBuilderComponent} from "./field-builder/field-builder.component";
import {SectionBuilderComponent} from "./group-builder/section-builder.component";

@NgModule({
  declarations: [
    FormBuilderComponent,
    GroupSectionComponent,
    FieldBuilderComponent,
    SectionBuilderComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
  ],
})

export class FormBuilderModule {}
