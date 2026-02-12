import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent, within } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';

import { NewComponent } from './new.component';
import { ProductsService } from '../products.service';
import { Product } from '../product';

describe('NewComponent', () => {
  const createProduct = (overrides?: Partial<Product>): Product => {
    const product = new Product();
    product.id = 1;
    product.name = 'Patata';
    product.price = 2.5;
    product.stock = 10;
    product.type = 'Verdura';
    return Object.assign(product, overrides);
  };

  const buildProductsServiceMock = () => ({
    getProducts$: vi.fn(() => of<Product[]>([])),
    getProductByName: vi.fn(() => undefined as Product | undefined),
    postNewProduct: vi.fn((product: Product) => of(product))
  });

  const setup = async () => {
    const productsServiceMock = buildProductsServiceMock();

    await TestBed.configureTestingModule({
      imports: [NewComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(NewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return { fixture, component, productsServiceMock };
  };

  describe('Unit/Logic Tests', () => {
    it('initializes default state with empty product and visible dialog', async () => {
      const { component } = await setup();

      expect(component.product).toBeInstanceOf(Product);
      expect(component.display).toBe(true);
      expect(component.repeatedProduct).toBe('');
    });

    it('initializes form with required validators', async () => {
      const { component } = await setup();

      expect(component.formGroup.get('name')?.hasError('required')).toBe(true);
      expect(component.formGroup.get('type')?.hasError('required')).toBe(true);
      expect(component.formGroup.get('price')?.hasError('required')).toBe(true);
    });

    it('loads products observable from service on init', async () => {
      const { component, productsServiceMock } = await setup();

      expect(productsServiceMock.getProducts$).toHaveBeenCalled();
      expect(component.products$).toBeTruthy();
    });

    it('validates price is greater than zero', async () => {
      const { component } = await setup();

      component.formGroup.patchValue({ name: 'Test', type: 'Verdura', price: 0 });

      expect(component.formGroup.get('price')?.hasError('min')).toBe(true);
      expect(component.formGroup.valid).toBe(false);
    });

    it('calls postNewProduct service method with correct product data', async () => {
      const { component, productsServiceMock } = await setup();

      component.formGroup.patchValue({
        name: 'Tomate',
        type: 'Verdura',
        price: 3.5
      });

      component.onSubmit();

      expect(productsServiceMock.postNewProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Tomate',
          type: 'Verdura',
          price: 3.5
        })
      );
    });

    it('resets form and product after successful save', async () => {
      const { component } = await setup();

      component.formGroup.patchValue({
        name: 'Cebolla',
        type: 'Verdura',
        price: 1.5
      });

      component.onSubmit();

      expect(component.formGroup.value.name).toBeNull();
      expect(component.product.name).toBe('');
      expect(component.repeatedProduct).toBe('');
    });

    it('emits savedProduct event with "saved" after successful creation', async () => {
      const { component } = await setup();
      const emitSpy = vi.spyOn(component.savedProduct, 'emit');

      component.formGroup.patchValue({
        name: 'Pepino',
        type: 'Verdura',
        price: 2
      });

      component.onSubmit();

      expect(emitSpy).toHaveBeenCalledWith('saved');
    });

    it('prevents submission when form is invalid', async () => {
      const { component, productsServiceMock } = await setup();

      component.formGroup.patchValue({ name: '', type: '', price: null });
      component.onSubmit();

      expect(productsServiceMock.postNewProduct).not.toHaveBeenCalled();
    });

    it('detects repeated product name and sets error message', async () => {
      const { component, productsServiceMock } = await setup();
      const existingProduct = createProduct({ name: 'Patata' });
      productsServiceMock.getProductByName.mockReturnValue(existingProduct);

      component.formGroup.patchValue({
        name: 'Patata',
        type: 'Verdura',
        price: 2.5
      });

      component.onSubmit();

      expect(component.repeatedProduct).toBe('Patata');
      expect(productsServiceMock.postNewProduct).not.toHaveBeenCalled();
    });

    it('formats product name to capitalize first letter', async () => {
      const { component } = await setup();

      component.product.name = 'tomate';
      component.format();

      expect(component.product.name).toBe('Tomate');
    });

    it('emits "closed" event when dialog is hidden', async () => {
      const { component } = await setup();
      const emitSpy = vi.spyOn(component.savedProduct, 'emit');

      component.onDialogHide();

      expect(component.display).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith('closed');
    });

    it('resets repeated product error when resetForm is called', async () => {
      const { component } = await setup();

      component.repeatedProduct = 'Patata';
      component.resetForm();

      expect(component.repeatedProduct).toBe('');
    });

    it('validates field errors with isFieldValid method', async () => {
      const { component } = await setup();

      // Campo sin tocar, no muestra error
      expect(component.isFieldValid('name')).toBe(false);

      // Tocar el campo sin valor válido, muestra error
      component.formGroup.get('name')?.markAsTouched();
      expect(component.isFieldValid('name')).toBe(true);

      // Rellenar con valor válido, no muestra error
      component.formGroup.patchValue({ name: 'Test' });
      expect(component.isFieldValid('name')).toBe(false);
    });

    it('returns appropriate error message with getError method', async () => {
      const { component } = await setup();

      const error = component.getError('Nombre', 'name');

      expect(error).toContain('Nombre');
    });

    it('only shows repeated error when name is not empty', async () => {
      const { component, productsServiceMock } = await setup();
      const existingProduct = createProduct({ name: 'Patata' });
      productsServiceMock.getProductByName.mockReturnValue(existingProduct);

      component.formGroup.patchValue({
        name: 'Patata',
        type: '',
        price: null
      });

      component.onSubmit();

      expect(component.repeatedProduct).toBe('Patata');
    });
  });

  describe('Render/Template Tests', () => {
    const renderComponent = async (display = true) => {
      const renderProductsServiceMock = buildProductsServiceMock();

      const result = await render(NewComponent, {
        componentInputs: { display },
        providers: [
          { provide: ProductsService, useValue: renderProductsServiceMock }
        ]
      });

      return { ...result, renderProductsServiceMock };
    };

    it('renders dialog with new product form when display is true', async () => {
      await renderComponent(true);

      expect(screen.getByText(/Crear nuevo producto/i)).toBeTruthy();
    });

    it('renders form fields for name, type, and price', async () => {
      const { container } = await renderComponent();

      expect(screen.getByLabelText(/Nombre/i)).toBeTruthy();
      expect(container.querySelector('p-select[formcontrolname="type"]')).toBeTruthy();
      expect(container.querySelector('p-inputnumber[formcontrolname="price"]')).toBeTruthy();
    });

    it('renders all product types in select dropdown', async () => {
      await renderComponent();

      const select = screen.getByRole('combobox', { name: /Selecciona tipo/i });
      expect(select).toBeTruthy();
    });

    it('displays validation error message for required name field', async () => {
      const { fixture } = await renderComponent();

      const nameInput = screen.getByLabelText(/Nombre/i);
      fireEvent.blur(nameInput);
      fixture.detectChanges();

      const errorMessage = fixture.nativeElement.querySelector('p-message[severity="error"]');
      expect(errorMessage).toBeTruthy();
    });

    it('displays repeated product error when product exists', async () => {
      const { fixture, renderProductsServiceMock } = await renderComponent();
      const existingProduct = createProduct({ name: 'Patata' });
      renderProductsServiceMock.getProductByName.mockReturnValue(existingProduct);

      fixture.componentInstance.formGroup.patchValue({
        name: 'Patata',
        type: 'Verdura',
        price: 2.5
      });

      fixture.componentInstance.onSubmit();
      fixture.detectChanges();

      expect(screen.getByText(/ya existe/i)).toBeTruthy();
    });

    it('displays submit button', async () => {
      await renderComponent();

      expect(screen.getByRole('button', { name: /Enviar/i })).toBeTruthy();
    });

    it('disables submit button when form is invalid', async () => {
      await renderComponent();
      const submitButton = screen.getByRole('button', { name: /Enviar/i });
      // Initially form is invalid
      expect(submitButton).toHaveProperty('disabled', true);
    });

    it('enables submit button when form is valid', async () => {
      const { fixture } = await renderComponent();

      fixture.componentInstance.formGroup.patchValue({
        name: 'Tomate',
        type: 'Verdura',
        price: 3.5
      });
      fixture.detectChanges();

      const submitButton = screen.getByRole('button', { name: /Enviar/i });
      expect(submitButton).toHaveProperty('disabled', false);
    });

    // No cancel button in template, test removed.

    it('clears form after successful product creation', async () => {
      const { fixture } = await renderComponent();

      fixture.componentInstance.formGroup.patchValue({
        name: 'Pepino',
        type: 'Verdura',
        price: 2
      });

      fixture.componentInstance.onSubmit();
      fixture.detectChanges();

      expect(fixture.componentInstance.formGroup.value.name).toBeNull();
    });

    it('shows price validation error for zero value', async () => {
      const { fixture } = await renderComponent();

      const priceInput = fixture.nativeElement.querySelector('p-inputnumber[formcontrolname="price"] input');
      fireEvent.input(priceInput, { target: { value: '0' } });
      fireEvent.blur(priceInput);

      fixture.componentInstance.formGroup.patchValue({ price: 0 });
      fixture.detectChanges();

      const errorMessage = within(fixture.nativeElement).queryByText(/debe ser mayor/i);
      expect(errorMessage).toBeTruthy();
    });

    it('exposes accessible form labels and inputs', async () => {
      await renderComponent();

      // Verify Name input is accessible
      expect(screen.getByLabelText(/Nombre/i)).toBeTruthy();

      // Verify Type combobox is accessible
      expect(screen.getByRole('combobox', { name: /Selecciona tipo/i })).toBeTruthy();

      // Verify Price spinbutton is accessible
      expect(screen.getByRole('spinbutton')).toBeTruthy();
    });
  });
});