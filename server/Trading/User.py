from datetime import datetime
from dataclasses import dataclass, field

@dataclass()
class User:
    name: str
    trades: list = field(default_factory=list, init=False)
    position: int = 0
    
    def calculate_pnl(self, settlement_price):
        pnl = 0
        for trade in self.trades:
            if trade.buyer == self.name:
                pnl += (settlement_price - trade.price) * trade.volume
            else:
                pnl += (trade.price - settlement_price) * trade.volume
        return pnl
    
    def __repr__(self):
        return f"User(name='{self.name}', balance={self.balance}, trades={self.trades})"
    
    def __eq__(self, other):
        if not isinstance(other, User):
            if isinstance(other, str):
                return self.name == other
            return False
        return self.name == other.name
    
    def __hash__(self):
        return hash(self.name)
    
    def add_trade(self, trade):
        # update position
        if trade.buyer == self.name:
            self.position += trade.volume
        elif trade.seller == self.name:
            self.position -= trade.volume
        else:
            raise ValueError("Trade does not involve this user")
            
        self.trades.append(trade)