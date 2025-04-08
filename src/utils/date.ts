export const getTimeAgo = (date: string): string => {
  const formatTwoDigits = (value: number) => String(value).padStart(2, '0');

  const timestampInMilliseconds = Date.parse(date);

  const diff = Date.now() - timestampInMilliseconds;
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 30) {
    return `${diffDays}일 전`;
  } else {
    const timestamp = new Date(timestampInMilliseconds);
    return `${timestamp.getFullYear()}-${formatTwoDigits(timestamp.getMonth() + 1)}-${formatTwoDigits(timestamp.getDate())}`;
  }
};
