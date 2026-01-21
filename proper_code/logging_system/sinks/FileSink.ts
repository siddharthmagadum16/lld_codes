import * as fs from "fs";
import * as path from "path";
import { ILogSink } from "../interfaces/ILogSink";
import { ILogFormatter } from "../interfaces/ILogFormatter";
import { LogEntry } from "../entities/LogEntry";
import { DefaultFormatter } from "../formatters/DefaultFormatter";

/**
 * File Sink - Outputs logs to a file
 * Supports log rotation based on file size
 * Uses async write operations with buffering for performance
 */
export class FileSink implements ILogSink {
  readonly name: string = "FileSink";
  private readonly _formatter: ILogFormatter;
  private readonly _filePath: string;
  private readonly _maxFileSize: number;
  private readonly _maxBackupFiles: number;
  private _writeStream: fs.WriteStream | null = null;
  private _currentSize: number = 0;
  private _buffer: string[] = [];
  private _flushInterval: NodeJS.Timeout | null = null;
  private _isFlushing: boolean = false;

  constructor(options: {
    filePath: string;
    formatter?: ILogFormatter;
    maxFileSize?: number; // bytes, default 10MB
    maxBackupFiles?: number; // default 5
    flushIntervalMs?: number; // default 1000ms
  }) {
    this._formatter = options.formatter ?? new DefaultFormatter();
    this._filePath = options.filePath;
    this._maxFileSize = options.maxFileSize ?? 10 * 1024 * 1024; // 10MB
    this._maxBackupFiles = options.maxBackupFiles ?? 5;

    this.ensureDirectoryExists();
    this.initializeStream();

    // Set up periodic flush
    const flushIntervalMs = options.flushIntervalMs ?? 1000;
    this._flushInterval = setInterval(() => this.flush(), flushIntervalMs);
  }

  async write(entry: LogEntry): Promise<void> {
    const formattedMessage = this._formatter.format(entry);
    this._buffer.push(formattedMessage);

    // Flush if buffer gets too large
    if (this._buffer.length >= 100) {
      await this.flush();
    }
  }

  async close(): Promise<void> {
    if (this._flushInterval) {
      clearInterval(this._flushInterval);
      this._flushInterval = null;
    }

    await this.flush();

    return new Promise((resolve, reject) => {
      if (this._writeStream) {
        this._writeStream.end(() => {
          this._writeStream = null;
          resolve();
        });
        this._writeStream.on("error", reject);
      } else {
        resolve();
      }
    });
  }

  private async flush(): Promise<void> {
    if (this._isFlushing || this._buffer.length === 0) {
      return;
    }

    this._isFlushing = true;
    const dataToWrite = this._buffer.join("\n") + "\n";
    this._buffer = [];

    try {
      // Check if rotation is needed
      const bytesToWrite = Buffer.byteLength(dataToWrite, "utf8");
      if (this._currentSize + bytesToWrite > this._maxFileSize) {
        await this.rotateFile();
      }

      // Write to stream
      await this.writeToStream(dataToWrite);
      this._currentSize += bytesToWrite;
    } catch (error) {
      console.error("FileSink flush error:", error);
    } finally {
      this._isFlushing = false;
    }
  }

  private writeToStream(data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._writeStream) {
        this.initializeStream();
      }

      const canWrite = this._writeStream!.write(data, "utf8");
      if (canWrite) {
        resolve();
      } else {
        this._writeStream!.once("drain", resolve);
      }
      this._writeStream!.once("error", reject);
    });
  }

  private async rotateFile(): Promise<void> {
    // Close current stream
    if (this._writeStream) {
      await new Promise<void>((resolve) => {
        this._writeStream!.end(resolve);
      });
      this._writeStream = null;
    }

    // Rotate backup files
    for (let i = this._maxBackupFiles - 1; i >= 0; i--) {
      const currentPath = i === 0 ? this._filePath : `${this._filePath}.${i}`;
      const newPath = `${this._filePath}.${i + 1}`;

      if (fs.existsSync(currentPath)) {
        if (i === this._maxBackupFiles - 1) {
          fs.unlinkSync(currentPath);
        } else {
          fs.renameSync(currentPath, newPath);
        }
      }
    }

    // Reinitialize stream
    this.initializeStream();
  }

  private initializeStream(): void {
    this._writeStream = fs.createWriteStream(this._filePath, { flags: "a" });

    // Get current file size
    if (fs.existsSync(this._filePath)) {
      this._currentSize = fs.statSync(this._filePath).size;
    } else {
      this._currentSize = 0;
    }
  }

  private ensureDirectoryExists(): void {
    const dir = path.dirname(this._filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

