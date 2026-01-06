import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionDatesComponent } from './select-dates/select-dates.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GroupByPipe } from './group-by.pipe';
import { GroupBydatePipe } from './group-by.date.pipe';
import { ButtonListComponent } from './button-list/button-list.component';
import { from } from 'rxjs';
import { MatFormFieldModule} from '@angular/material/form-field';
import { ErroresModule } from '@app/errores/errors.module';

@NgModule({ declarations: [GroupByPipe],
    exports: [SelectionDatesComponent, GroupByPipe, GroupBydatePipe, ButtonListComponent], imports: [CommonModule,
        FormsModule,
        ButtonListComponent,
        GroupBydatePipe,
        SelectionDatesComponent,
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatInputModule,
        ErroresModule], providers: [MatDatepickerModule,
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
        ] })
export class ToolsModule { }
