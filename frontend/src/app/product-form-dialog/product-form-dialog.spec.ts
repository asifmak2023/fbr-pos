import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormDialog } from './product-form-dialog';

describe('ProductFormDialog', () => {
  let component: ProductFormDialog;
  let fixture: ComponentFixture<ProductFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
