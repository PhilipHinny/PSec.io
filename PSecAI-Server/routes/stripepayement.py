import stripe
from flask import Blueprint, jsonify, request

# Initialize Stripe with your secret key
stripe.api_key = "your-stripe-secret-key-here"

# Create a Blueprint for Stripe routes
stripePayment_bp = Blueprint('stripe', __name__)

@stripePayment_bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        # Amount in cents (e.g., $5.00)
        amount = 500

        # Create a PaymentIntent
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
        )

        # Return the clientSecret of the PaymentIntent
        return jsonify({
            'clientSecret': payment_intent.client_secret
        })
    
    except Exception as e:
        return jsonify(error=str(e)), 403
