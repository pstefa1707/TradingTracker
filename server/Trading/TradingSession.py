from uuid import uuid4
from .Trade import Trade
from .User import User
from dataclasses import asdict

class TradingSession:
    def __init__(self, title : str, tick_size : float, unit: str, admin_pass: str):
        # User-defined attributes
        self.title = title
        self.tick_size = tick_size
        self.unit = unit
        self.admin_pass = admin_pass
        
        # Generated attributes
        self.session_id = str(int(uuid4()) % 1000000)
        self.trades : list[Trade] = []
        self.users : set[User] = set()
        self.inplay  : bool = False
        self.completed  : bool = False
        self.settlement_price  : float = None
        self.final_positions : dict = None
        
    def __dict__(self):
        return {
            'title': self.title,
            'tick_size': self.tick_size,
            'unit': self.unit,
            'session_id': str(self.session_id),
            'trades': [asdict(trade) for trade in self.trades],
            'users': {user.name : asdict(user) for user in self.users}, # Convert to mapping
            'inplay': self.inplay,
            'completed': self.completed,
            'settlement_price': self.settlement_price,
            'final_positions': self.final_positions
        }
        
    def admin_protected(func):
        def wrapper(self, *args, password, **kwargs):
            if password != self.admin_pass:
                raise ValueError("Incorrect password")
            return func(self, *args, **kwargs)
        return wrapper
        
    def get_id(self):
        return str(self.session_id)

    def add_trade(self, trade : Trade):
        self.trades.append(trade)
        
    def add_user(self, user : str):
        self.users.add(user)
        
    @admin_protected
    def start_market(self):
        assert (not self.completed)
        self.inplay = True
        
    @admin_protected
    def pause_market(self):
        self.inplay = False
        
    @admin_protected
    def settle_market(self, settlement_price : float):
        self.inplay = False
        self.completed = True
        self.settlement_price = settlement_price
        
        # Calculate final positions
        final_positions = {}
        for user in self.users:
            pnl = user.calculate_pnl(settlement_price)
            final_positions[user.name] = {
                'position': user.position,
                'pnl': pnl
            }
            
        self.final_positions = final_positions