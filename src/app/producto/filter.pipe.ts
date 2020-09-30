import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toString().toLowerCase();
        return items.filter(it => {
            return it.name.toString().toLowerCase().includes(searchText) 
            || it.productId.toString().toLowerCase().includes(searchText);
        });
    }
}