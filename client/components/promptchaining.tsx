type NodeType = 'user' | 'system' | 'content' | 'summary';

interface TreeNodeData {
  type: NodeType;
  content: string | string[];
  depth?: number;
}

class TreeNode {
  type: NodeType;
  content: string | string[];
  children: TreeNode[];
  depth: number;
  left: TreeNode | null;
  right: TreeNode | null;
  prompt?: string;
  response?: string;
  timestamp: Date;

  constructor(type: NodeType, content: string | string[], depth: number = 0) {
    this.type = type;
    this.content = content;
    this.children = [];
    this.depth = depth;
    this.left = null;
    this.right = null;
    this.timestamp = new Date();
  }

  addChild(node: TreeNode): void {
    node.depth = this.depth + 1;
    this.children.push(node);
  }

  // Binary tree specific methods
  addLeft(node: TreeNode): void {
    this.left = node;
    node.depth = this.depth + 1;
  }

  addRight(node: TreeNode): void {
    this.right = node;
    node.depth = this.depth + 1;
  }
}

class PromptChain {
  private root: TreeNode | null;
  private maxDepth: number;
  private currentNodes: TreeNode[];

  constructor(maxDepth: number = 5) {
    this.root = null;
    this.maxDepth = maxDepth;
    this.currentNodes = [];
  }

  addPrompt(prompt: string, response?: string): TreeNode {
    const node = new TreeNode('user', prompt);
    node.prompt = prompt;
    node.response = response;

    if (!this.root) {
      this.root = node;
      this.currentNodes.push(node);
      return node;
    }

    // Find the best position to add the new node
    const parentNode = this.findBestParent();
    if (parentNode) {
      if (!parentNode.left) {
        parentNode.addLeft(node);
      } else if (!parentNode.right) {
        parentNode.addRight(node);
      } else {
        // If both children exist, replace the oldest one
        const oldestChild = parentNode.left.timestamp < parentNode.right.timestamp 
          ? parentNode.left 
          : parentNode.right;
        
        if (oldestChild === parentNode.left) {
          parentNode.addLeft(node);
        } else {
          parentNode.addRight(node);
        }
      }
    }

    this.currentNodes.push(node);
    
    // Maintain max depth limit
    if (this.currentNodes.length > this.maxDepth) {
      this.currentNodes.shift();
    }

    return node;
  }

  private findBestParent(): TreeNode | null {
    // Find a node that has less than 2 children
    for (const node of this.currentNodes) {
      if (!node.left || !node.right) {
        return node;
      }
    }
    // If all nodes have 2 children, return the oldest
    return this.currentNodes[0] || null;
  }

  getChainHistory(): TreeNode[] {
    return this.currentNodes.slice();
  }

  getLastResponse(): string | undefined {
    const lastNode = this.currentNodes[this.currentNodes.length - 1];
    return lastNode?.response;
  }

  generateNextPrompt(currentResponse: string): string {
    // Simple logic to generate next prompt based on current response
    const prompts = [
      "Can you elaborate more on this?",
      "What are the practical applications?",
      "How does this relate to real-world scenarios?",
      "What are the potential challenges?",
      "Can you provide examples?"
    ];
    
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  }

  canAddMore(): boolean {
    return this.currentNodes.length < this.maxDepth;
  }

  getCurrentDepth(): number {
    return this.currentNodes.length;
  }
}

export { TreeNode, PromptChain };
export type { NodeType, TreeNodeData };