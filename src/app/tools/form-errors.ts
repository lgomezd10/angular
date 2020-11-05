import { FormGroup } from '@angular/forms';

export class FormErrors {
    static getError(name: string, field: string, formGroup: FormGroup): string {
        const { errors } = formGroup.get(field);

        if (errors) {    
            const mesasges = {
                required: `Introduzca un valor en el campo ${name}`,
                min: `${name} debe ser mayor que 0`,
                minlength: `${name} debe tener un mínimo de ${errors.minlength?.requiredLength} caracteres`
            };

            const errorKey = Object.keys(errors).find(Boolean);
            return mesasges[errorKey];
        } else {
            return '';
        }
    }

    static checkError(field: string, formGroup: FormGroup): boolean {
        return !formGroup.controls[field].valid && formGroup.controls[field].touched
    }
}