import { Observable } from "rxjs";

export class CommonFormField {
    name: string = '';
    label: string = '';
    type: 'text' | 'number' | 'select' | 'checkbox' = 'text';
    options$?: Observable<any[]>;
    placeholder?: string;
}