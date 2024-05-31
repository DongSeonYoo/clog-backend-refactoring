/**
 * 6자리 랜덤 색상 코드를 생성합니다.
 * @example generateRandomColorCode() // FFFFFF
 */
export function generateRandomColorCode(): string {
  return Math.floor(Math.random() * 16777215).toString(16);
}
