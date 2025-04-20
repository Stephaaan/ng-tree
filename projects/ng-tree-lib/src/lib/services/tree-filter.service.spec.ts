import { TestBed } from '@angular/core/testing';

import { TreeFilterService } from './tree-filter.service';

describe('TreeFilterService', () => {
  let service: TreeFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
