from flask import Blueprint, jsonify
from database import get_logged_in_user_id, get_user_plan_from_db

plan_bp = Blueprint("report", __name__)

@plan_bp.route('/get-current-plan', methods=['GET'])
def get_current_plan():
    try:
        # Retrieve logged-in user's ID
        user_id = get_logged_in_user_id()  # Replace with actual logic for fetching logged-in user's ID
        
        # Fetch the user's plan data from the DB
        user_plan = get_user_plan_from_db(user_id)
        
        # Return the user's plan details
        return jsonify({
            "plan": user_plan["name"],  # Assuming the plan has a 'name' field
            "features": user_plan["features"],  # Assuming the plan has 'features'
            "price": user_plan["price"],  # Assuming the plan has a 'price' field
            "next_payment_date": user_plan["next_payment_date"]  # Assuming the plan has 'next_payment_date'
        })
    except Exception as e:
        return jsonify(error=str(e)), 400  # Return error in case of failure
