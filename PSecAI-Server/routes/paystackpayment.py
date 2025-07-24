import os
import requests
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
import uuid

# Load environment variables from .env file
load_dotenv()

# Get Paystack secret and public keys from environment
PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY')
PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY')

# Headers for Paystack requests
HEADERS = {
    'Authorization': f'Bearer {PAYSTACK_SECRET_KEY}',
    'Content-Type': 'application/json',
}

# Create Blueprints
paystackPayment_bp = Blueprint('paystack_payment', __name__)
paystackPaymentkey_bp = Blueprint('paystackPaymentkey_bp', __name__)

# List of currencies that require x100 scaling (minor units)
MINOR_UNIT_CURRENCIES = ['NGN', 'GHS', 'ZAR', 'KES']  # add KES here


@paystackPayment_bp.route('/initialize-payment', methods=['POST'])
def initialize_payment():
    try:
        data = request.get_json()
        email = data.get('email')
        amount = float(data.get('amount', 0))
        currency = data.get('currency', 'KES').upper()

        if not email or amount <= 0:
            return jsonify({'error': 'Valid email and amount are required'}), 400

        if currency in MINOR_UNIT_CURRENCIES:
            paystack_amount = int(amount * 100)
        else:
            paystack_amount = int(amount)

        # Generate a unique reference using uuid4 (you can customize this)
        reference = str(uuid.uuid4())

        payload = {
            'email': email,
            'amount': paystack_amount,
            'currency': currency,
            'reference': reference  # Send this unique reference
        }

        response = requests.post(
            'https://api.paystack.co/transaction/initialize',
            json=payload,
            headers=HEADERS
        )

        result = response.json()

        if response.status_code == 200:
            return jsonify({
                'authorization_url': result['data']['authorization_url'],
                'access_code': result['data']['access_code'],
                'reference': result['data']['reference'],
                'paystackPublicKey': PAYSTACK_PUBLIC_KEY 
            })
        else:
            return jsonify({'error': result.get('message', 'Unknown error')}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@paystackPaymentkey_bp.route('/get-public-key', methods=['GET'])
def get_public_key():
    public_key = os.getenv('PAYSTACK_PUBLIC_KEY')
    if public_key:
        return jsonify({"public_key": public_key})
    else:
        return jsonify({"error": "Public key not found"}), 500
