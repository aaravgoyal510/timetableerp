const bcrypt = require('bcryptjs');

async function generateHash() {
  const pin = '1234';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pin, salt);
  console.log('\n✅ Bcrypt hash for PIN "1234":');
  console.log(hash);
  console.log('\n📋 Copy this hash and update the database with:');
  console.log(`UPDATE public.auth_credentials SET pin_hash = '${hash}' WHERE staff_id IN (1, 2);`);
}

generateHash();
