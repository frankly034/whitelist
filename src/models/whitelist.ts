export class WhitelistModel {
  constructor(public path: string, public ips: string[]) {}

  getPath() {
    return this.path;
  }

  getIps() {
    return this.ips;
  }

  hasIp(ip: string) {
    return this.ips.includes(ip);
  }

  setIp(ips: string[]) {
    const newIps = new Set([...this.ips, ...ips]);
    this.ips = Array.from(newIps);
  }
}
