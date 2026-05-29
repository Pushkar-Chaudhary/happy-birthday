const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const ESEWA_PERSONAL_ID = process.env.ESEWA_PERSONAL_ID || '9848730175';
const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
const ESEWA_SECRET = process.env.ESEWA_SECRET || '8gBm/:/$/qQX';
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const ESEWA_ENV = process.env.ESEWA_ENV || 'sandbox';
const ESEWA_FORM_URL = ESEWA_ENV === 'sandbox'
  ? 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
  : 'https://epay.esewa.com.np/api/epay/main/v2/form';

app.use(express.json());
app.use(express.static(__dirname));

function createSignature(fields) {
  const signedFieldNames = ['total_amount', 'transaction_uuid', 'product_code'];
  const message = signedFieldNames
    .map((name) => `${name}=${fields[name]}`)
    .join(',');
  return crypto
    .createHmac('sha256', ESEWA_SECRET)
    .update(message)
    .digest('base64');
}

app.post('/api/esewa/create-payment', (req, res) => {
  try {
    const amount = Number(req.body.amount || 299);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    const transactionUuid = `gift-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const totalAmount = amount.toFixed(2);
    const taxAmount = '0.00';
    const productCode = ESEWA_PRODUCT_CODE;
    const successUrl = `${req.protocol}://${req.get('host')}/payment-success.html`;
    const failureUrl = `${req.protocol}://${req.get('host')}/payment-failure.html`;

    const fields = {
      amount: totalAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: '0.00',
      product_delivery_charge: '0.00',
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: 'total_amount,transaction_uuid,product_code'
    };

    fields.signature = createSignature(fields);
    fields.merchant_id = ESEWA_MERCHANT_ID;
    fields.form_url = ESEWA_FORM_URL;

    res.json({ ok: true, fields });
  } catch (error) {
    console.error('create-payment failed', error);
    res.status(500).json({ error: 'Unable to prepare eSewa checkout right now.' });
  }
});

app.get('/api/esewa/personal-info', (_req, res) => {
  res.json({
    ok: true,
    personalEsewaId: ESEWA_PERSONAL_ID,
    payUrl: 'https://esewa.com.np/#/home'
  });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`eSewa checkout helper running at http://localhost:${PORT}`);
  console.log(`Using eSewa environment: ${ESEWA_ENV}`);
});
