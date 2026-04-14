/**
 * Thuật toán SM-2
 * @param {number} quality: 0 (Again), 3 (Hard), 4 (Good), 5 (Easy)
 * @param {number} repetitions: Số lần đã nhớ thành công liên tiếp
 * @param {number} previousInterval: Khoảng cách ngày ôn tập trước đó
 * @param {number} previousEaseFactor: Hệ số dễ (mặc định 2.5)
 */
export const calculateSM2 = (
  quality,
  repetitions,
  previousInterval,
  previousEaseFactor
) => {
  let nextInterval;
  let nextEaseFactor;
  let nextRepetitions;

  if (quality >= 3) {
    if (repetitions === 0) {
      nextInterval = 1;
    } else if (repetitions === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(previousInterval * previousEaseFactor);
    }

    nextRepetitions = repetitions + 1;

    nextEaseFactor =
      previousEaseFactor +
      (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    nextRepetitions = 0;
    nextInterval = 1;
    nextEaseFactor = previousEaseFactor;
  }

  if (nextEaseFactor < 1.3) nextEaseFactor = 1.3;

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

  return {
    repetitions: nextRepetitions,
    interval_days: nextInterval,
    ease_factor: nextEaseFactor,
    next_review_date: nextReviewDate.toISOString().split('T')[0],
  };
};