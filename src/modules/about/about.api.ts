import { api } from "src/modules/common/api";

export interface HealthCheckResult {
  version: string;
  lastCommitDate: Date;
}

export abstract class AboutApi {
  static async getHealth() {
    return api.get<HealthCheckResult>("/");
  }
}
