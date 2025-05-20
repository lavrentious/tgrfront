import { AboutApi, type HealthCheckResult } from "./about.api";

export abstract class AboutService {
  static async getHealth(): Promise<HealthCheckResult> {
    const res = (await AboutApi.getHealth()).data;
    return { ...res, lastCommitDate: new Date(res.lastCommitDate) };
  }
}
