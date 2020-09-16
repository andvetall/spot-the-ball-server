class Environment {
  get secret(): string {
    return process.env.secret;
  }
  get tokenExpiresIn(): number {
    if (!process.env.tokenExpiresIn) {
      return 86400;
    }
    return parseFloat(process.env.tokenExpiresIn);
  }
  get connectionString(): string {
    return (
      process.env.connectionString
    );
  }
  get databaseName(): string {
    return ( 
      // process.env.dataBaseProd
      process.env.dataBaseDev
      );
  }
  get emailService(): string{
    return (
      process.env.emailService
    )
  }
  get emailHost(): string{
    return (
      process.env.emailHost
    )
  }
  get email(): string{
    return (
      // process.env.emailProd
      process.env.emailDev
    )
  }
  get password(): string{
    return (
      // process.env.passwordProd
      process.env.passwordDev
    )
  }
  get link(): string{
    return (
      // process.env.linkProd
      process.env.linkDev
    )
  }
}
export const Environments = new Environment();
