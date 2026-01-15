import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber'
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormErrors } from '@app/tools/form-errors';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-common-form',
  imports: [TableModule, SelectModule, InputNumberModule, ReactiveFormsModule, AsyncPipe, DialogModule, ButtonModule, MessageModule, InputTextModule],
  templateUrl: './common-form.component.html',
  styleUrl: './common-form.component.css',
})
export class CommonFormComponent implements AfterViewInit {


  ngAfterViewInit(): void {
    console.log('CommonFormComponent initialized with fields:', this.formFields);
  }
  /**
   * Configuración de los campos del formulario.
   * Ejemplo:
   * [
   *   { name: 'nombre', label: 'Nombre', type: 'text' },
   *   { name: 'edad', label: 'Edad', type: 'number' },
   *   { name: 'categoria', label: 'Categoría', type: 'select', options: [...] }
   * ]
   */
  @Input() display: boolean = true;
  @Input() formFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'select';
    options$?: Observable<any[]>;
    placeholder?: string;
  }> = [];
  @Input() formName: string = "Formulario";

  /** FormGroup externo a usar */
  @Input() formGroup!: UntypedFormGroup;

  @Output()
  sendButtonOption = new EventEmitter<string>();

  onSubmit() {
    this.display = false;
    console.log('Submitting form with values:', this.formGroup.value);
    this.sendButtonOption.emit('submit');
  }

  onDialogHide() {
    // Resetea el formulario o notifica al padre si es necesario
    this.display = false;
    this.sendButtonOption.emit('closed');

  }

  getError(name: string, field: string): string {
    return FormErrors.getError(name, field, this.formGroup);
  }

  isFieldValid(field: string): boolean {
    return FormErrors.checkError(field, this.formGroup)
  }
}
