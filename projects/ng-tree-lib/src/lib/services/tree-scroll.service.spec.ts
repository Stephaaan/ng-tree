import { TestBed } from '@angular/core/testing';

import { TreeScrollService } from './tree-scroll.service';

describe('TreeScrollService', () => {
  let service: TreeScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
