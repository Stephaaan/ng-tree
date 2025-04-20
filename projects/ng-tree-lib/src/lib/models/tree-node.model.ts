export interface TreeNode<M = { [key: string]: unknown }> {
  id: string;
  label: string;
  children?: TreeNode<M>[];
  hasChildren?: boolean;
  isExpanded?: boolean;
  isLoading?: boolean;
  metadata?: M;
}

export interface FlatTreeNode<M = { [key: string]: unknown }> {
  node: TreeNode<M>;
  level: number;
  visible: boolean;
}
