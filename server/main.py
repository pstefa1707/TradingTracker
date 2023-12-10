from flask import Flask, request
from flask_socketio import SocketIO, join_room, leave_room
from flask_cors import CORS
from Trading import TradingSession, Trade, User  # Ensure correct import paths
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# Dictionary to keep track of trading sessions
trading_sessions = {}

@app.route('/')
def index():
    return "Trading Game Server"

@app.route('/join_as_player', methods=['POST'])
def join_as_player():
    data = request.get_json(force=True)
    session_id = data.get('session_id')
    username = data.get('username')
    
    session = trading_sessions.get(session_id)
    
    # add socketID to room
    user = User(name=username)
    if session:
        if user not in session.users:
            session.add_user(user)
            # Emit to everyone
            socketio.emit('state_update', {'session_id': session_id, **session.__dict__()}, room=session_id)
        return  {'session_id': session_id, 'username': username, 'admin': False, **session.__dict__()}, 200
    else:
        return  {'message': 'Session not found.'}, 404

# SocketIO event for a client joining as an admin
@app.route('/join_as_admin', methods=['POST'])
def join_as_admin():
    data = request.get_json(force=True)
    admin_pass = data.get('admin_pass')
    session_title = data.get('session_title')
    tick_size = 1 # data['tick_size'] (default to 1)
    unit = data.get('unit')
    
    if len(trading_sessions) > 100:
        last_session = list(trading_sessions.keys())[0]
        del trading_sessions[last_session]
        
    new_session = TradingSession(title=session_title, tick_size=tick_size, unit=unit, admin_pass=admin_pass)
    session_id = new_session.get_id()
    
    # Avoid overlap
    while session_id in trading_sessions:
        new_session = TradingSession(title=session_title, tick_size=tick_size, unit=unit, admin_pass=admin_pass)
        session_id = new_session.get_id()
        
    trading_sessions[session_id] = new_session
    
    return {'session_id': session_id, 'admin_pass': admin_pass, 'admin': True, **new_session.__dict__()}, 200
    
@socketio.on('listen_to_room')
def listen_to_room(data):
    session_id = data.get('session_id')
    join_room(session_id)
    print(f"Socket joined room {session_id}")

@app.route('/reconnect_as_admin', methods=["POST"])
def reconnect_as_admin():
    data = request.get_json(force=True)
    session_id = data.get('session_id')
    admin_pass = data.get('admin_pass')
    
    session = trading_sessions.get(session_id)
    if session and session.admin_pass == admin_pass:
        return  {'session_id': session_id, 'admin_pass': admin_pass, 'admin': True, **session.__dict__()}, 200
        print(f"Admin reconnected to the session {session_id}.")
    else:
        return  {'error': 'Invalid game ID or incorrect password'}, 404

# Event handler for submitting a trade
@app.route('/submit_trade', methods=['POST'])
def submit_trade():
    data = request.get_json(force=True)
    session_id = data['session_id']
    price = data['price']
    volume = data['volume']
    buyer = data['buyer']
    seller = data['seller']

    session = trading_sessions.get(session_id)
    if session and session.inplay and User(buyer) in session.users and User(seller) in session.users:
        trade = Trade(price=price, volume=volume, buyer=buyer, seller=seller)
        session.add_trade(trade)
        
        # Update positions for both buyer and seller
        for user in session.users:
            if user.name == buyer or user.name == seller:
                user.add_trade(trade)
        
        socketio.emit('state_update', session.__dict__(), room=session_id)
        print(f"Trade submitted in session {session_id}.")
        return  {'session_id': session_id, 'trade': str(trade)}, 200
    else:
        return  {'error': 'Session not found or not in play.'}, 404

# Event handlers for start, pause, and settle market
@app.route('/start_market', methods=['POST'])
def start_market():
    data = request.get_json(force=True)
    session_id = data['session_id']
    admin_pass = data['admin_pass']
    session = trading_sessions.get(session_id)

    if session and session.admin_pass == admin_pass and not session.completed:
        session.start_market(password=admin_pass)
        socketio.emit('state_update', session.__dict__(), room=session_id)
        return "success", 200
    return "error", 404

@app.route('/pause_market', methods=['POST'])
def pause_market():
    data = request.get_json(force=True)
    session_id = data['session_id']
    admin_pass = data['admin_pass']
    session = trading_sessions.get(session_id)

    if session and session.admin_pass == admin_pass:
        session.pause_market(password = admin_pass)
        socketio.emit('state_update', session.__dict__(), room=session_id)
        return "success", 200
    return "error", 404

@app.route('/settle_market', methods=['POST'])
def settle_market():
    data = request.get_json(force=True)
    session_id = data['session_id']
    settlement_price = data['settlement_price']
    admin_pass = data['admin_pass']
    session = trading_sessions.get(session_id)

    if session and session.admin_pass == admin_pass:
        session.settle_market(settlement_price, password=admin_pass)
        socketio.emit('state_update', session.__dict__(), room=session_id)
        return "success", 200
    return "error", 404  

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000, host="0.0.0.0")