/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = (root) => {
  const result = []
  // 根节点是否有值
  if (root && root.val) {
    result.push(root.val)
  } else {
    return []
  }
  let leftNode = root.left
  let rightNode = root.right
  // 遍历子节点，判断下一节点
  while (leftNode?.val || rightNode?.val) {
    // 添加当前层级节点的值
    result.push(rightNode?.val || leftNode?.val)
    // 保存当前层级的左节点
    const preLeftNode =  leftNode || rightNode
    leftNode = leftNode?.right || leftNode?.left
    if(!leftNode && rightNode?.left){
      leftNode = rightNode.left
    }
    rightNode = rightNode?.right || rightNode?.left
    if(!rightNode && preLeftNode?.right){
      rightNode = preLeftNode.right
    }
  }
  return result
}
