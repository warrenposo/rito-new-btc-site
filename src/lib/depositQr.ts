/** QR image URL for a wallet address — matches what users see on deposit / plan payment screens. */
export function depositAddressQrUrl(address: string, size = 280): string {
  const trimmed = address?.trim();
  if (!trimmed) return '';
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data: trimmed,
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}
