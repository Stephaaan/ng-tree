import { TestBed } from '@angular/core/testing';

import { TreeNavigationService } from './tree-navigation.service';

describe('TreeNavigationService', () => {
  let service: TreeNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
