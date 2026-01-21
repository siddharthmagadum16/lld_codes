import { ILogSink } from "../interfaces/ILogSink";
import { ILogFormatter } from "../interfaces/ILogFormatter";
import { LogEntry } from "../entities/LogEntry";
import { logLevelToString } from "../entities/LogLevel";
import { JsonFormatter } from "../formatters/JsonFormatter";

/**
 * Cloud API Sink - Sends logs to a cloud logging service (e.g., AWS CloudWatch, Datadog)
 * 
 * Demonstrates Open/Closed Principle:
 * - Adding this new sink requires NO changes to the Logger class or existing sinks
 * - Simply create and register with the logger
 * 
 * Features:
 * - Batch sending for efficiency
 * - Retry logic with exponential backoff
 * - Circuit breaker pattern to prevent overwhelming a failing service
 */
export class CloudApiSink implements ILogSink {
  readonly name: string = "CloudApiSink";
  private readonly _endpoint: string;
  private readonly _apiKey: string;
  private readonly _formatter: ILogFormatter;
  private readonly _batchSize: number;
  private readonly _maxRetries: number;
  private _buffer: unknown[] = [];
  private _flushInterval: NodeJS.Timeout | null = null;
  private _isFlushing: boolean = false;
  private _circuitOpen: boolean = false;
  private _failureCount: number = 0;
  private readonly _failureThreshold: number = 5;

  constructor(options: {
    endpoint: string;
    apiKey: string;
    formatter?: ILogFormatter;
    batchSize?: number;
    maxRetries?: number;
    flushIntervalMs?: number;
  }) {
    this._endpoint = options.endpoint;
    this._apiKey = options.apiKey;
    this._formatter = options.formatter ?? new JsonFormatter();
    this._batchSize = options.batchSize ?? 100;
    this._maxRetries = options.maxRetries ?? 3;

    // Set up periodic flush
    const flushIntervalMs = options.flushIntervalMs ?? 10000;
    this._flushInterval = setInterval(() => this.flush(), flushIntervalMs);
  }

  async write(entry: LogEntry): Promise<void> {
    if (this._circuitOpen) {
      // Circuit is open, skip writing to prevent overwhelming failing service
      return;
    }

    const payload = {
      timestamp: entry.timestamp.toISOString(),
      level: logLevelToString(entry.level),
      message: entry.message,
      context: entry.context,
      metadata: entry.metadata,
      formattedMessage: this._formatter.format(entry),
    };

    this._buffer.push(payload);

    if (this._buffer.length >= this._batchSize) {
      await this.flush();
    }
  }

  async close(): Promise<void> {
    if (this._flushInterval) {
      clearInterval(this._flushInterval);
      this._flushInterval = null;
    }

    await this.flush();
  }

  private async flush(): Promise<void> {
    if (this._isFlushing || this._buffer.length === 0 || this._circuitOpen) {
      return;
    }

    this._isFlushing = true;
    const payloadToSend = [...this._buffer];
    this._buffer = [];

    try {
      await this.sendWithRetry(payloadToSend);
      this.resetCircuitBreaker();
    } catch (error) {
      console.error("CloudApiSink flush error:", error);
      this.recordFailure();
      // Re-add failed logs to buffer
      this._buffer.unshift(...payloadToSend);
    } finally {
      this._isFlushing = false;
    }
  }

  private async sendWithRetry(payload: unknown[]): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this._maxRetries; attempt++) {
      try {
        await this.sendToApi(payload);
        return;
      } catch (error) {
        lastError = error as Error;
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 100;
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  private async sendToApi(payload: unknown[]): Promise<void> {
    // Simulated API call - in production, use actual HTTP client
    // Example with fetch:
    // const response = await fetch(this._endpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${this._apiKey}`,
    //   },
    //   body: JSON.stringify({ logs: payload }),
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    // }

    // For demo purposes, simulate API call
    console.log(`[CloudApiSink] Would send ${payload.length} logs to ${this._endpoint}`);
  }

  private recordFailure(): void {
    this._failureCount++;
    if (this._failureCount >= this._failureThreshold) {
      this._circuitOpen = true;
      console.warn("[CloudApiSink] Circuit breaker opened due to repeated failures");

      // Auto-reset circuit after 60 seconds
      setTimeout(() => {
        this._circuitOpen = false;
        this._failureCount = 0;
        console.info("[CloudApiSink] Circuit breaker reset");
      }, 60000);
    }
  }

  private resetCircuitBreaker(): void {
    this._failureCount = 0;
    this._circuitOpen = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

