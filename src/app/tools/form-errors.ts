import { UntypedFormGroup } from '@angular/forms';

export class FormErrors {
    static getError(name: string, field: string, formGroup: UntypedFormGroup): string {
        const control = formGroup.get(field);
        const errors = control?.errors;

        if (errors) {    
            const messages = new Map<string, string>([
                ['required', `Introduzca un valor en el campo ${name}`],
                ['min', `${name} debe ser mayor que 0`],
                ['minlength', `${name} debe tener un mínimo de ${errors['minlength']?.requiredLength} caracteres`]
            ]);

            const errorKey = Object.keys(errors).find(Boolean);
            return errorKey ? messages.get(errorKey) ?? `Error en ${name}` : '';
        } else {
            return '';
        }
    }

    static checkError(field: string, formGroup: UntypedFormGroup): boolean {
        return !formGroup.controls[field].valid && formGroup.controls[field].touched
    }
}