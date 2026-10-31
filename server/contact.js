export const reasons = ['Wanted to hire you', 'just need to talk with you', 'others'];
export function validateContact(input) {
  if (!input || !reasons.includes(input.reason)) throw new Error('Choose a valid reason.');
  if (typeof input.mobile !== 'string' || !/^[+\d\s()-]{8,24}$/.test(input.mobile)) throw new Error('Enter a valid mobile number.');
  let mobile = input.mobile.replace(/[\s()-]/g, '');
  if (/^[6-9]\d{9}$/.test(mobile)) mobile = '+91' + mobile;
  if (!/^\+[1-9]\d{7,14}$/.test(mobile)) throw new Error('Include the country code, for example +91 followed by your mobile number.');
  if (typeof input.whatsapp !== 'boolean') throw new Error('Choose whether the number uses WhatsApp.');
  return { reason: input.reason, mobile, whatsapp: input.whatsapp };
}
export async function submitContact(input, collection, ownerPhone = '+917339339065') {
  const contact = validateContact(input);
  await collection.insertOne({ ...contact, createdAt: new Date(), source: 'portfolio', status: 'new' });
  const text = `Hello Annamalai, ${contact.reason}. My mobile number is ${contact.mobile}.`;
  return {
    saved: true,
    message: 'Your request has been saved. Annamalai can contact you on your mobile number.',
    whatsappUrl: contact.whatsapp ? `https://wa.me/${ownerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}` : null,
  };
}
