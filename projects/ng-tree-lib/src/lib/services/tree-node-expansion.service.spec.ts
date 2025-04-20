import { TestBed } from '@angular/core/testing';

import { TreeNodeExpansionService } from './tree-node-expansion.service';

describe('TreeNodeExpansionService', () => {
  let service: TreeNodeExpansionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeNodeExpansionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
