import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Json2TreeComponent } from './json2-tree.component';

describe('Json2TreeComponent', () => {
  let component: Json2TreeComponent;
  let fixture: ComponentFixture<Json2TreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Json2TreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Json2TreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
