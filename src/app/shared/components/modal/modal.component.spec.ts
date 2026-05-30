import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {

  let component: ModalComponent;

  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ModalComponent]
    })
    .compileComponents();

    fixture =
      TestBed.createComponent(
        ModalComponent
      );

    component =
      fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component)
      .toBeTruthy();
  });

  it('should not display modal when visible is false', () => {

    component.visible = false;

    fixture.detectChanges();

    const backdrop =
      fixture.debugElement.query(
        By.css('.modal-backdrop')
      );

    expect(backdrop)
      .toBeNull();
  });

  it('should display modal when visible is true', () => {

    component.visible = true;

    fixture.detectChanges();

    const backdrop =
      fixture.debugElement.query(
        By.css('.modal-backdrop')
      );

    expect(backdrop)
      .toBeTruthy();
  });

  it('should emit close when clicking backdrop', () => {

    component.visible = true;

    fixture.detectChanges();

    spyOn(
      component.close,
      'emit'
    );

    const backdrop =
      fixture.debugElement.query(
        By.css('.modal-backdrop')
      );

    backdrop.triggerEventHandler(
      'click',
      {}
    );

    expect(
      component.close.emit
    )
    .toHaveBeenCalled();
  });

  it('should not emit close when clicking modal content', () => {

    component.visible = true;

    fixture.detectChanges();

    spyOn(
      component.close,
      'emit'
    );

    const modal =
      fixture.debugElement.query(
        By.css('.modal')
      );

    const event =
      jasmine.createSpyObj(
        'event',
        ['stopPropagation']
      );

    modal.triggerEventHandler(
      'click',
      event
    );

    expect(
      event.stopPropagation
    )
    .toHaveBeenCalled();

    expect(
      component.close.emit
    )
    .not.toHaveBeenCalled();
  });

});