const WORKER_DIAGNOSTIC_PREFIX = 'AGORA_SHARED_TEXTURE_POC_V1 ';
const MAX_SAMPLES = 600;

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isWorkerDiagnostic(value) {
  return (
    value &&
    value.version === 1 &&
    typeof value.type === 'string' &&
    Number.isInteger(value.sequence) &&
    value.sequence >= 0 &&
    (value.requestedFrameRate === 30 || value.requestedFrameRate === 60) &&
    isFiniteNumber(value.timeOriginMs) &&
    isFiniteNumber(value.monotonicTimeMs) &&
    Array.isArray(value.drawIntervalsMs) &&
    value.drawIntervalsMs.length <= 120 &&
    value.drawIntervalsMs.every(
      (interval) => isFiniteNumber(interval) && interval >= 0
    ) &&
    typeof value.contextState === 'string'
  );
}

function parseWorkerDiagnostic(message) {
  if (
    typeof message !== 'string' ||
    !message.startsWith(WORKER_DIAGNOSTIC_PREFIX)
  ) {
    return null;
  }
  let diagnostic;
  try {
    diagnostic = JSON.parse(message.slice(WORKER_DIAGNOSTIC_PREFIX.length));
  } catch (_error) {
    throw new Error('Malformed shared texture Worker diagnostic');
  }
  if (diagnostic.version !== 1) {
    throw new Error('Unsupported shared texture Worker diagnostic version');
  }
  if (!isWorkerDiagnostic(diagnostic)) {
    throw new Error('Invalid shared texture Worker diagnostic');
  }
  return diagnostic;
}

function pushBounded(samples, value) {
  samples.push(value);
  if (samples.length > MAX_SAMPLES) samples.shift();
}

function percentile(sorted, ratio) {
  if (sorted.length === 0) return 0;
  const position = (sorted.length - 1) * ratio;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  const weight = position - lower;
  return sorted[lower] + (sorted[upper] - sorted[lower]) * weight;
}

function summarize(samples) {
  if (samples.length === 0) {
    return { count: 0, p50: 0, p95: 0, p99: 0, max: 0 };
  }
  const sorted = [...samples].sort((left, right) => left - right);
  return {
    count: sorted.length,
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    p99: percentile(sorted, 0.99),
    max: sorted[sorted.length - 1],
  };
}

function createTelemetry({
  nowMs = Date.now,
  hrtimeNs = process.hrtime.bigint,
} = {}) {
  const paintIntervals = [];
  const submissionLatencies = [];
  const degradationReasons = new Set();
  let paintCount = 0;
  let submittedCount = 0;
  let replacedPendingCount = 0;
  let invalidFrameCount = 0;
  let submissionFailureCount = 0;
  let drainTimeoutCount = 0;
  let lastPaintMonotonicMs = null;
  let lastElectronTimestampUs = null;
  let paintEpochMs = null;
  let paintMonotonicNs = null;
  let worker = null;
  let failureReason = null;
  const rtc = {
    encodedFrameCount: 0,
    sentFrameRate: 0,
    txVideoKBitRate: 0,
  };

  return {
    recordPaint({ timestampUs, monotonicMs }) {
      if (lastPaintMonotonicMs !== null) {
        pushBounded(paintIntervals, monotonicMs - lastPaintMonotonicMs);
      }
      lastPaintMonotonicMs = monotonicMs;
      lastElectronTimestampUs = timestampUs;
      paintEpochMs = nowMs();
      paintMonotonicNs = String(hrtimeNs());
      paintCount += 1;
    },
    recordSubmission(latencyMs) {
      submittedCount += 1;
      pushBounded(submissionLatencies, latencyMs);
    },
    recordPendingReplacement() {
      replacedPendingCount += 1;
    },
    recordInvalidFrame() {
      invalidFrameCount += 1;
    },
    recordSubmissionFailure() {
      submissionFailureCount += 1;
    },
    recordDrainTimeout() {
      drainTimeoutCount += 1;
    },
    recordWorkerDiagnostic(diagnostic) {
      worker = {
        ...diagnostic,
        drawIntervalsMs: [...diagnostic.drawIntervalsMs],
      };
    },
    recordRtcStats(stats) {
      if (isFiniteNumber(stats && stats.txVideoKBitRate)) {
        rtc.txVideoKBitRate = stats.txVideoKBitRate;
      }
    },
    recordLocalVideoStats(stats) {
      if (isFiniteNumber(stats && stats.encodedFrameCount)) {
        rtc.encodedFrameCount = stats.encodedFrameCount;
      }
      if (isFiniteNumber(stats && stats.sentFrameRate)) {
        rtc.sentFrameRate = stats.sentFrameRate;
      }
    },
    addDegradation(reason) {
      const previousSize = degradationReasons.size;
      degradationReasons.add(reason);
      return degradationReasons.size !== previousSize;
    },
    clearDegradation(reason) {
      return degradationReasons.delete(reason);
    },
    markFailed(reason) {
      failureReason = reason;
    },
    snapshot() {
      return {
        health: failureReason
          ? 'failed'
          : degradationReasons.size > 0
          ? 'degraded'
          : 'healthy',
        failureReason,
        degradationReasons: [...degradationReasons].sort(),
        paintCount,
        submittedCount,
        replacedPendingCount,
        invalidFrameCount,
        submissionFailureCount,
        drainTimeoutCount,
        lastElectronTimestampUs,
        paintEpochMs,
        paintMonotonicNs,
        snapshotEpochMs: nowMs(),
        snapshotMonotonicNs: String(hrtimeNs()),
        rtcTimestamp: 0,
        paintIntervalsMs: summarize(paintIntervals),
        submissionLatencyMs: summarize(submissionLatencies),
        worker: worker
          ? { ...worker, drawIntervalsMs: [...worker.drawIntervalsMs] }
          : null,
        rtc: { ...rtc },
      };
    },
  };
}

module.exports = {
  WORKER_DIAGNOSTIC_PREFIX,
  createTelemetry,
  parseWorkerDiagnostic,
};
