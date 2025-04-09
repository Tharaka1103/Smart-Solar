/**
 * Generates a random 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validates that an OTP is exactly 6 digits
 */
export function isValidOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}
