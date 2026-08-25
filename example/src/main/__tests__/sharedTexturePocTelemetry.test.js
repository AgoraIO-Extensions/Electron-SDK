const {
  WORKER_DIAGNOSTIC_PREFIX,
  createTelemetry,
  parseWorkerDiagnostic,
} = require('../sharedTexturePocTelemetry');

function workerLine(overrides = {}) {
  return `${WORKER_DIAGNOSTIC_PREFIX}${JSON.stringify({
    version: 1,
    type: 'stats',
    sequence: 12,
    requestedFrameRate: 30,
    timeOriginMs: 1000,
    monotonicTimeMs: 250,
    drawIntervalsMs: [33, 34],
    contextState: 'active',
    ...overrides,
  })}`;
}

test('parses only the versioned worker diagnostic protocol', () => {
  expect(parseWorkerDiagnostic(workerLine())).toEqual({
    version: 1,
    type: 'stats',
    sequence: 12,
    requestedFrameRate: 30,
    timeOriginMs: 1000,
    monotonicTimeMs: 250,
    drawIntervalsMs: [33, 34],
    contextState: 'active',
  });
  expect(parseWorkerDiagnostic('ordinary console output')).toBeNull();
  expect(() => parseWorkerDiagnostic(`${WORKER_DIAGNOSTIC_PREFIX}{`)).toThrow(
    'Malformed shared texture Worker diagnostic'
  );
  expect(() => parseWorkerDiagnostic(workerLine({ version: 2 }))).toThrow(
    'Unsupported shared texture Worker diagnostic version'
  );
});

test('rejects invalid worker clock and interval fields', () => {
  expect(parseWorkerDiagnostic(workerLine({ requestedFrameRate: 48 }))).toEqual(
    expect.objectContaining({ requestedFrameRate: 48 })
  );
  expect(() => parseWorkerDiagnostic(workerLine({ sequence: -1 }))).toThrow(
    'Invalid shared texture Worker diagnostic'
  );
  expect(() =>
    parseWorkerDiagnostic(workerLine({ drawIntervalsMs: [33, NaN] }))
  ).toThrow('Invalid shared texture Worker diagnostic');
});

test('keeps only the latest 600 samples and reports quantiles', () => {
  const telemetry = createTelemetry({ nowMs: () => 2000, hrtimeNs: () => 9n });
  let monotonicMs = 0;
  telemetry.recordPaint({
    timestampUs: 0,
    rtcTimestampMs: 1000,
    monotonicMs,
  });
  for (let value = 1; value <= 605; value += 1) {
    monotonicMs += value;
    telemetry.recordPaint({
      timestampUs: value,
      rtcTimestampMs: 1000 + value,
      monotonicMs,
    });
  }

  const snapshot = telemetry.snapshot();
  expect(snapshot.paintCount).toBe(606);
  expect(snapshot.paintIntervalsMs).toEqual({
    count: 600,
    p50: 305.5,
    p95: 575.05,
    p99: 599.01,
    max: 605,
  });
  expect(snapshot.lastElectronTimestampUs).toBe(605);
  expect(snapshot.paintEpochMs).toBe(2000);
  expect(snapshot.paintMonotonicNs).toBe('9');
  expect(snapshot.snapshotEpochMs).toBe(2000);
  expect(snapshot.snapshotMonotonicNs).toBe('9');
  expect(snapshot.rtcTimestamp).toBe(1605);
});

test('tracks submission, RTC, Worker clock, and health fields', () => {
  const telemetry = createTelemetry({ nowMs: () => 2000, hrtimeNs: () => 9n });
  telemetry.recordWorkerDiagnostic(parseWorkerDiagnostic(workerLine()));
  telemetry.recordSubmission(7);
  telemetry.recordPendingReplacement();
  telemetry.recordInvalidFrame();
  telemetry.recordSubmissionFailure();
  telemetry.recordDrainTimeout();
  telemetry.recordRtcStats({ txVideoKBitRate: 512 });
  telemetry.recordLocalVideoStats({ encodedFrameCount: 8, sentFrameRate: 30 });
  telemetry.addDegradation('paint-timeout');
  telemetry.addDegradation('gpu-process-gone');
  telemetry.clearDegradation('paint-timeout');

  expect(telemetry.snapshot()).toEqual(
    expect.objectContaining({
      health: 'degraded',
      degradationReasons: ['gpu-process-gone'],
      submittedCount: 1,
      replacedPendingCount: 1,
      invalidFrameCount: 1,
      submissionFailureCount: 1,
      drainTimeoutCount: 1,
      submissionLatencyMs: expect.objectContaining({ count: 1, max: 7 }),
      worker: expect.objectContaining({
        sequence: 12,
        timeOriginMs: 1000,
        monotonicTimeMs: 250,
      }),
      rtc: {
        encodedFrameCount: 8,
        sentFrameRate: 30,
        txVideoKBitRate: 512,
      },
    })
  );

  telemetry.clearDegradation('gpu-process-gone');
  expect(telemetry.snapshot().health).toBe('healthy');
});

test('terminal failure remains failed after degradation reasons clear', () => {
  const telemetry = createTelemetry();
  telemetry.addDegradation('renderer-unresponsive');
  telemetry.markFailed('renderer-gone');
  telemetry.clearDegradation('renderer-unresponsive');

  expect(telemetry.snapshot()).toEqual(
    expect.objectContaining({
      health: 'failed',
      failureReason: 'renderer-gone',
      degradationReasons: [],
    })
  );
});

test('reports whether a degradation reason actually changed', () => {
  const telemetry = createTelemetry();

  expect(telemetry.addDegradation('paint-timeout')).toBe(true);
  expect(telemetry.addDegradation('paint-timeout')).toBe(false);
  expect(telemetry.clearDegradation('paint-timeout')).toBe(true);
  expect(telemetry.clearDegradation('paint-timeout')).toBe(false);
});
