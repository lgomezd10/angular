import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionDatesComponent } from './select-dates/select-dates.component';
import { FormsModule } from '@angular/forms';
import { GroupByPipe } from './group-by.pipe';
import { GroupBydatePipe } from './group-by.date.pipe';
import { ButtonListComponent } from './button-list/button-list.component';
import { ErroresModule } from '../errores/errors.module';

@NgModule({
    declarations: [],
    exports: [SelectionDatesComponent, GroupByPipe, GroupBydatePipe, ButtonListComponent],
    imports: [CommonModule,
        GroupByPipe,
        FormsModule,
        ButtonListComponent,
        GroupBydatePipe,
        SelectionDatesComponent,
        ErroresModule], providers: []
})
export class ToolsModule { }
