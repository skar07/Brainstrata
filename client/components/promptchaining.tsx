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
  context?: string; // Store context for this node

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

  // Get context from this node
  getContext(): string {
    if (this.context) return this.context;
    
    let context = '';
    if (this.prompt) context += `User: ${this.prompt}`;
    if (this.response) context += `\nAI: ${this.response}`;
    return context;
  }
}

class PromptChain {
  private root: TreeNode | null;
  private maxDepth: number;
  private currentNodes: TreeNode[];
  private currentNode: TreeNode | null; // Track current conversation node

  constructor(maxDepth: number = 50) {
    this.root = null;
    this.maxDepth = maxDepth;
    this.currentNodes = [];
    this.currentNode = null;
  }

  // Add a new prompt to the chain
  addPrompt(prompt: string, response?: string): TreeNode {
    const node = new TreeNode('user', prompt);
    node.prompt = prompt;
    node.response = response;

    if (!this.root) {
      // First prompt - create root
      this.root = node;
      this.currentNode = node;
      this.currentNodes.push(node);
      return node;
    }

    // Add to binary tree structure
    this.addToBinaryTree(node);
    
    // Update current node
    this.currentNode = node;
    this.currentNodes.push(node);
    
    // Maintain max depth limit
    if (this.currentNodes.length > this.maxDepth) {
      this.currentNodes.shift();
    }

    return node;
  }

  // Add node to binary tree structure
  private addToBinaryTree(node: TreeNode): void {
    if (!this.root) return;

    // Find the best position in the binary tree
    const parent = this.findBestParent();
    if (parent) {
      if (!parent.left) {
        parent.addLeft(node);
      } else if (!parent.right) {
        parent.addRight(node);
      } else {
        // If both children exist, replace the oldest one
        const oldestChild = parent.left.timestamp < parent.right.timestamp 
          ? parent.left 
          : parent.right;
        
        if (oldestChild === parent.left) {
          parent.addLeft(node);
        } else {
          parent.addRight(node);
        }
      }
    }
  }

  // Find the best parent node for adding new nodes
  private findBestParent(): TreeNode | null {
    if (!this.root) return null;

    // Use breadth-first search to find a node with available children
    const queue: TreeNode[] = [this.root];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (!current.left || !current.right) {
        return current;
      }
      
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    
    // If all nodes have 2 children, return the root
    return this.root;
  }

  // Get conversation context for the next prompt
  getConversationContext(): string {
    if (!this.currentNode) return '';

    // Build context from the current conversation path
    const contextParts: string[] = [];
    let current: TreeNode | null = this.currentNode;
    
    // Go back up to 3 levels for context
    let level = 0;
    while (current && level < 3) {
      const nodeContext = current.getContext();
      if (nodeContext) {
        contextParts.unshift(nodeContext);
      }
      current = this.findParent(current);
      level++;
    }

    return contextParts.join('\n\n');
  }

  // Find parent of a node in the binary tree
  private findParent(targetNode: TreeNode): TreeNode | null {
    if (!this.root) return null;

    const queue: TreeNode[] = [this.root];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current.left === targetNode || current.right === targetNode) {
        return current;
      }
      
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    
    return null;
  }

  // Get the full chain history
  getChainHistory(): TreeNode[] {
    return this.currentNodes.slice();
  }

  // Get the last response
  getLastResponse(): string | undefined {
    const lastNode = this.currentNodes[this.currentNodes.length - 1];
    return lastNode?.response;
  }

  // Generate next prompt based on current context
  generateNextPrompt(currentResponse: string): string {
    const prompts = [
      "Can you elaborate more on this?",
      "What are the practical applications?",
      "How does this relate to real-world scenarios?",
      "What are the potential challenges?",
      "Can you provide examples?",
      "How does this connect to what we discussed earlier?",
      "What are the implications of this?",
      "Can you break this down further?"
    ];
    
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  }

  // Check if we can add more prompts
  canAddMore(): boolean {
    return this.currentNodes.length < this.maxDepth;
  }

  // Get current depth
  getCurrentDepth(): number {
    return this.currentNodes.length;
  }

  // Get binary tree depth
  getBinaryTreeDepth(): number {
    if (!this.root) return 0;
    return this.calculateTreeDepth(this.root);
  }

  private calculateTreeDepth(node: TreeNode | null): number {
    if (!node) return 0;
    
    const leftDepth = this.calculateTreeDepth(node.left);
    const rightDepth = this.calculateTreeDepth(node.right);
    
    return Math.max(leftDepth, rightDepth) + 1;
  }

  // Reset the chain
  reset(): void {
    this.root = null;
    this.currentNodes = [];
    this.currentNode = null;
  }

  // Get conversation path (the path from root to current node)
  getConversationPath(): TreeNode[] {
    if (!this.currentNode) return [];
    
    const path: TreeNode[] = [];
    let current: TreeNode | null = this.currentNode;
    
    while (current) {
      path.unshift(current);
      current = this.findParent(current);
    }
    
    return path;
  }
}

export { TreeNode, PromptChain };
export type { NodeType, TreeNodeData };