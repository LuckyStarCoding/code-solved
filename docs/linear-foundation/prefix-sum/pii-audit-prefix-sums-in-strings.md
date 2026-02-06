---
title: "PII Audit: Prefix Sums in Strings"
sidebar_label: "Task: PII Audit"
---
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import LiveCode from "@site/src/components/LiveCode";



**Complexity:** 🚀 `Time: O(n)` to build, `O(1)` to query | 💾 `Space: O(n)`

Prefix sums aren't just for integers. By transforming data into a "Digit Map," we can audit sensitive PII (Personally Identifiable Information) in constant time—a technique used by security scanners to detect leaked credit card or social security numbers at scale.

## 📝 Task Description
Given a string of mixed characters (e.g., `"ID-9921-XJ"`), determine how many **digits** exist within a specific index range `[s, e]`. 

To solve this efficiently:
1.  Transform the string into a binary array (1 for digits, 0 for others).
2.  Pre-compute a Prefix Sum array.
3.  Answer range queries in O(1) time.

<Tabs>
  <TabItem value="examples" label="Examples" default>

| Input String | Range `[s, e]` | Output | Explanation |
| :--- | :--- | :--- | :--- |
| `"ID-9921-XJ"` | `s=3, e=6` | `4` | Substring is `"9921"`, which contains 4 digits. |
| `"ABC-123"` | `s=0, e=2` | `0` | Substring is `"ABC"`, which contains 0 digits. |
| `"44-55"` | `s=0, e=4` | `4` | Substring is `"44-55"`, contains 4 digits. |

  </TabItem>

  <TabItem value="approach" label="Approach">

### 💡 The Strategy

1.  **Pre-process:** Convert the string into a numeric array `arr` where `arr[i] = 1` if the character is a digit, otherwise `0`.
2.  **Build the Tape:** Initialize a `prefixSum` array of size `n + 1`. Fill it such that `prefixSum[i+1]` is the running total of all `1`s encountered.
3.  **Constant Time Query:** To find the count in range `[s, e]`, return the difference: `prefixSum[e + 1] - prefixSum[s]`.



> **Mentor Tip:** The leading `0` in the prefix array is your "Starting Line." It ensures that queries starting at index `0` don't require an `if` statement to handle the edge case.

  </TabItem>

  <TabItem value="try" label="Try">

<LiveCode
  code={`// Task: Find how many digits are in the range [s, e]
const findThreats = (str, s, e) => {
  const n = str.length;
  // 1. Map string to 1s and 0s
  const arr = str.split('').map(char => /\\d/.test(char) ? 1 : 0);
  
  // 2. Build your Prefix Sum array (sum)
  // ...
  
  // 3. Return the range sum calculation
  // return ...
};

console.log(findThreats("ID-9921-XJ-44", 3, 6)); // Expected: 4
`}
/>

  </TabItem>

  <TabItem value="solution" label="Solution">

```javascript
/**
 * @param {string} str
 * @param {number} s (start index)
 * @param {number} e (end index)
 * @return {number}
 */
const findThreats = (str, s, e) => {
  const n = str.length;
  // Step 1: Mapping (O(n))
  const arr = str.split('').map(char => /\d/.test(char) ? 1 : 0);
  
  // Step 2: Pre-computation (O(n))
  let prefixSum = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
      prefixSum[i + 1] = arr[i] + prefixSum[i];
  } 

  // Step 3: Query (O(1))
  return prefixSum[e + 1] - prefixSum[s];
};
```
</TabItem>

</Tabs>