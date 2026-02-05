// Cron expression: "sec min hour day" — numbers (0–59, 0–59, 0–23, 1–31) or '*' for every
class Task {
  public constructor(
    public taskId: string,
    public recurrenceRule: string,
    public startDate: Date,
    public fn: Function,
    public args: string[]
  ) {}

  /** Parses a field: returns the number, or null if '*' (any value matches). */
  private parseField(s: string): number | null {
    const t = s.trim();
    if (t === '*') return null;
    const n = Number(t);
    if (!Number.isInteger(n) || n < 0) return null;
    return n;
  }

  /** Returns true if the given date matches the cron rule (sec min hour day). */
  private matches(date: Date, sec: number | null, min: number | null, hour: number | null, day: number | null): boolean {
    if (sec !== null && date.getSeconds() !== sec) return false;
    if (min !== null && date.getMinutes() !== min) return false;
    if (hour !== null && date.getHours() !== hour) return false;
    if (day !== null && date.getDate() !== day) return false;
    return true;
  }

  /** Returns the next execution date for this task, or undefined if none (e.g. @once in the past). */
  public getExecutionDate(): Date | undefined {
    const now = new Date();
    if (this.recurrenceRule === '@once') {
      if (this.startDate.getTime() <= now.getTime()) return undefined;
      return new Date(this.startDate.getTime());
    }

    const parts = this.recurrenceRule.trim().split(/\s+/);
    if (parts.length !== 4) return undefined;
    const sec = this.parseField(parts[0]);
    const min = this.parseField(parts[1]);
    const hour = this.parseField(parts[2]);
    const day = this.parseField(parts[3]);

    // Bounds: sec 0–59, min 0–59, hour 0–23, day 1–31
    if (sec !== null && (sec < 0 || sec > 59)) return undefined;
    if (min !== null && (min < 0 || min > 59)) return undefined;
    if (hour !== null && (hour < 0 || hour > 23)) return undefined;
    if (day !== null && (day < 1 || day > 31)) return undefined;

    const start = this.startDate.getTime();
    let candidate = new Date(Math.max(now.getTime(), start));
    candidate.setMilliseconds(0);

    // Ensure we look at a time not in the past (next run must be in the future)
    if (candidate.getTime() <= now.getTime()) {
      candidate.setTime(candidate.getTime() + 1000);
    }

    const oneYearMs = 366 * 24 * 60 * 60 * 1000;
    const deadline = candidate.getTime() + oneYearMs;

    while (candidate.getTime() < deadline) {
      if (candidate.getTime() >= start && this.matches(candidate, sec, min, hour, day)) {
        return new Date(candidate.getTime());
      }
      candidate.setTime(candidate.getTime() + 1000);
    }
    return undefined;
  }
}

export { Task };