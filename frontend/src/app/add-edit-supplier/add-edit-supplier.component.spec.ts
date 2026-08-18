import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AddEditSupplierComponent } from './add-edit-supplier.component';

describe('AddEditSupplierComponent', () => {
  let component: AddEditSupplierComponent;
  let fixture: ComponentFixture<AddEditSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditSupplierComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
