export interface CodingQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  starterCode: {
    python: string;
    javascript: string;
  };
}

export interface TheoryQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'open-ended';
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  category: string;
}

export interface LogicalQuestion {
  id: number;
  question: string;
  type: 'puzzle' | 'reasoning';
  answer: string;
  explanation: string;
  timeLimit: number; // in minutes
}

export const codingQuestions: CodingQuestion[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists."
    ],
    testCases: [
      { input: "[2,7,11,15], 9", expectedOutput: "[0,1]" },
      { input: "[3,2,4], 6", expectedOutput: "[1,2]" },
      { input: "[3,3], 6", expectedOutput: "[0,1]" }
    ],
    starterCode: {
      python: `def two_sum(nums, target):
    """
    Find two numbers that add up to target
    Args:
        nums: List of integers
        target: Target sum
    Returns:
        List of two indices
    """
    # Write your solution here
    pass`,
      javascript: `function twoSum(nums, target) {
    /**
     * Find two numbers that add up to target
     * @param {number[]} nums
     * @param {number} target
     * @return {number[]}
     */
    // Write your solution here
}`
    }
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.",
    examples: [
      {
        input: 's = "()"',
        output: "true"
      },
      {
        input: 's = "()[]{}"',
        output: "true"
      },
      {
        input: 's = "(]"',
        output: "false"
      }
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only '()[]{}'."
    ],
    testCases: [
      { input: '"()"', expectedOutput: "true" },
      { input: '"()[]{}"', expectedOutput: "true" },
      { input: '"(]"', expectedOutput: "false" },
      { input: '"([)]"', expectedOutput: "false" }
    ],
    starterCode: {
      python: `def is_valid(s):
    """
    Check if parentheses are valid
    Args:
        s: String containing parentheses
    Returns:
        Boolean indicating validity
    """
    # Write your solution here
    pass`,
      javascript: `function isValid(s) {
    /**
     * Check if parentheses are valid
     * @param {string} s
     * @return {boolean}
     */
    // Write your solution here
}`
    }
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a sorted manner and return the head of the merged linked list.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]"
      }
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 ≤ Node.val ≤ 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    testCases: [
      { input: "[1,2,4], [1,3,4]", expectedOutput: "[1,1,2,3,4,4]" },
      { input: "[], []", expectedOutput: "[]" },
      { input: "[], [0]", expectedOutput: "[0]" }
    ],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    """
    Merge two sorted linked lists
    Args:
        list1: Head of first sorted list
        list2: Head of second sorted list
    Returns:
        Head of merged sorted list
    """
    # Write your solution here
    pass`,
      javascript: `function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function mergeTwoLists(list1, list2) {
    /**
     * Merge two sorted linked lists
     * @param {ListNode} list1
     * @param {ListNode} list2
     * @return {ListNode}
     */
    // Write your solution here
}`
    }
  },
  {
    id: 4,
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6."
      },
      {
        input: "nums = [1]",
        output: "1"
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-10⁴ ≤ nums[i] ≤ 10⁴"
    ],
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { input: "[1]", expectedOutput: "1" },
      { input: "[5,4,-1,7,8]", expectedOutput: "23" }
    ],
    starterCode: {
      python: `def max_subarray(nums):
    """
    Find maximum sum of contiguous subarray
    Args:
        nums: List of integers
    Returns:
        Maximum sum
    """
    # Write your solution here
    pass`,
      javascript: `function maxSubArray(nums) {
    /**
     * Find maximum sum of contiguous subarray
     * @param {number[]} nums
     * @return {number}
     */
    // Write your solution here
}`
    }
  },
  {
    id: 5,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]"
      },
      {
        input: "root = [1]",
        output: "[[1]]"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 ≤ Node.val ≤ 1000"
    ],
    testCases: [
      { input: "[3,9,20,null,null,15,7]", expectedOutput: "[[3],[9,20],[15,7]]" },
      { input: "[1]", expectedOutput: "[[1]]" },
      { input: "[]", expectedOutput: "[]" }
    ],
    starterCode: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root):
    """
    Level order traversal of binary tree
    Args:
        root: Root of binary tree
    Returns:
        List of lists representing each level
    """
    # Write your solution here
    pass`,
      javascript: `function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function levelOrder(root) {
    /**
     * Level order traversal of binary tree
     * @param {TreeNode} root
     * @return {number[][]}
     */
    // Write your solution here
}`
    }
  }
];

export const theoryQuestions: TheoryQuestion[] = [
  {
    id: 1,
    question: "What is the time complexity of searching for an element in a balanced binary search tree?",
    type: "multiple-choice",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(log n)",
    explanation: "In a balanced BST, the height is log n, so searching requires at most log n comparisons.",
    category: "Data Structures"
  },
  {
    id: 2,
    question: "Explain the difference between a stack and a queue, and provide one real-world use case for each.",
    type: "open-ended",
    correctAnswer: "Stack follows LIFO (Last In, First Out) principle - used in function call management, undo operations. Queue follows FIFO (First In, First Out) principle - used in task scheduling, breadth-first search.",
    explanation: "Stack: LIFO structure, used for function calls, expression evaluation, undo operations. Queue: FIFO structure, used for task scheduling, BFS, handling requests in order.",
    category: "Data Structures"
  },
  {
    id: 3,
    question: "What is the space complexity of the recursive Fibonacci algorithm?",
    type: "multiple-choice",
    options: ["O(1)", "O(log n)", "O(n)", "O(2^n)"],
    correctAnswer: "O(n)",
    explanation: "The recursive call stack can go up to n levels deep, requiring O(n) space.",
    category: "Algorithms"
  },
  {
    id: 4,
    question: "What is a hash collision and how can it be resolved?",
    type: "open-ended",
    correctAnswer: "A hash collision occurs when two different keys produce the same hash value. It can be resolved using chaining (storing multiple values in a list at the same index) or open addressing (finding another empty slot).",
    explanation: "Hash collisions are inevitable due to the pigeonhole principle. Common resolution methods include chaining, linear probing, quadratic probing, and double hashing.",
    category: "Data Structures"
  },
  {
    id: 5,
    question: "Which sorting algorithm has the best average-case time complexity?",
    type: "multiple-choice",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Quick Sort"],
    correctAnswer: "Merge Sort",
    explanation: "Merge Sort has O(n log n) time complexity in all cases (best, average, worst), while Quick Sort has O(n²) worst case.",
    category: "Algorithms"
  }
];

export const logicalQuestions: LogicalQuestion[] = [
  {
    id: 1,
    question: "You have 8 balls, all identical in appearance. 7 balls weigh the same, but 1 ball is heavier. Using a balance scale only twice, how can you identify the heavier ball?",
    type: "puzzle",
    answer: "Divide into groups of 3, 3, and 2. First weighing: compare the two groups of 3. If balanced, the heavy ball is in the group of 2 (weigh them to find it). If unbalanced, take the heavier group of 3 and weigh any 2 balls against each other. If balanced, the third ball is heavy. If unbalanced, the heavier side has the heavy ball.",
    explanation: "This is a classic logic puzzle that tests systematic thinking and optimization under constraints.",
    timeLimit: 5
  },
  {
    id: 2,
    question: "A sequence follows this pattern: 2, 6, 12, 20, 30, ?. What is the next number and what is the pattern?",
    type: "reasoning",
    answer: "42. The pattern is n(n+1) where n starts from 2: 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42",
    explanation: "This tests pattern recognition and mathematical reasoning skills.",
    timeLimit: 3
  },
  {
    id: 3,
    question: "You're in a room with 3 light switches. Each switch controls a light bulb in another room. You can only visit the other room once. How can you determine which switch controls which bulb?",
    type: "puzzle",
    answer: "Turn on the first switch for a few minutes, then turn it off. Turn on the second switch and leave it on. Go to the other room. The bulb that's on is controlled by the second switch. Touch the other bulbs - the warm one is controlled by the first switch, the cool one by the third switch.",
    explanation: "This puzzle tests creative thinking and the ability to use multiple properties (light and heat) to solve a problem.",
    timeLimit: 4
  },
  {
    id: 4,
    question: "If you have a 3-gallon jug and a 5-gallon jug, how can you measure exactly 4 gallons of water?",
    type: "puzzle",
    answer: "Fill the 5-gallon jug. Pour from it into the 3-gallon jug (leaving 2 gallons in the 5-gallon jug). Empty the 3-gallon jug. Pour the 2 gallons from the 5-gallon jug into the 3-gallon jug. Fill the 5-gallon jug again. Pour from it into the 3-gallon jug until full (this takes 1 gallon, leaving 4 gallons in the 5-gallon jug).",
    explanation: "This classic puzzle tests logical reasoning and problem-solving with constraints.",
    timeLimit: 6
  },
  {
    id: 5,
    question: "In a building, there are 100 floors. You have 2 identical eggs. What's the minimum number of drops needed to find the highest floor from which an egg won't break?",
    type: "reasoning",
    answer: "14 drops maximum. Start at floor 14, then 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100. If it breaks at any floor, use the second egg to test floors one by one from the last safe floor.",
    explanation: "This is the classic 'egg dropping problem' that tests optimization and dynamic programming thinking.",
    timeLimit: 8
  }
];

export function getRandomCodingQuestion(): CodingQuestion {
  return codingQuestions[Math.floor(Math.random() * codingQuestions.length)];
}

export function getRandomTheoryQuestion(): TheoryQuestion {
  return theoryQuestions[Math.floor(Math.random() * theoryQuestions.length)];
}

export function getRandomLogicalQuestion(): LogicalQuestion {
  return logicalQuestions[Math.floor(Math.random() * logicalQuestions.length)];
}

export function getInterviewSet() {
  return {
    coding: getRandomCodingQuestion(),
    theory: getRandomTheoryQuestion(),
    logical: getRandomLogicalQuestion()
  };
}