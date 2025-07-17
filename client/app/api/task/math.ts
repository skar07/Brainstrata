export async function handleMath(prompt: string): Promise<string> {
    try {
      const expression = prompt.replace(/[^-()\d/*+.]/g, ""); // sanitize input
      const result = eval(expression); // Only for demo, avoid eval in real apps.
      return `The result is: ${result}`;
    } catch {
      return "Invalid math expression.";
    }
  }
  