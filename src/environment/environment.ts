class Environment {
  get secret(): string {
    return process.env.secret || "secret";
  }
  get tokenExpiresIn(): number {
    if (!process.env.tokenExpiresIn) {
      return 86400;
    }
    return parseFloat(process.env.tokenExpiresIn);
  }
  get connectionString(): string {
    return (
      process.env.connectionString ||
      "mongodb+srv://dbuser:Qwerty!123@democluster-5xhs4.mongodb.net/test?retryWrites=true&w=majority"
    );
  }
  get databaseName(): string {
    return (
      process.env.databaseName ||
      "MyDataBaseName"
    );
  }
}
export const Environments = new Environment();

export const api_key = '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';
