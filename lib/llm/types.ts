export interface LlmProvider {
  readonly name: string;
  complete(input: { system: string; user: string; json?: boolean }): Promise<string>;
}
