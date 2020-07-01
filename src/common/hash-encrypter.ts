import { sha256 } from "js-sha256";
import { injectable } from "inversify";

@injectable()
export class HashEncrypter {
  getHash(input: string) {
    const hash = sha256.create();
    hash.update(input);
    const output = hash.hex();
    return output;
  }
}
