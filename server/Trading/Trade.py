from datetime import datetime
from dataclasses import dataclass, field

@dataclass(frozen=True, order=True)
class Trade:
    price: float = field(compare=False)
    volume: int = field(compare=False)
    buyer: str = field(compare=False)
    seller: str = field(compare=False)
    timestamp: datetime = field(compare=True, init=False,default_factory=lambda: datetime.utcnow().timestamp())
    
    def __eq__(self, other):
        if not isinstance(other, Trade):
            return False
        return self.timestamp == other.timestamp
        
    def __repr__(self):
        return f"Trade(price={self.price}, volume={self.volume}, buyer='{self.buyer}', seller='{self.seller}', timestamp={self.timestamp})"
