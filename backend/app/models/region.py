"""Region model — Dev A. One branch of the fuel company."""
from app.extensions import db
from app.utils.timeutils import utcnow


class Region(db.Model):
    __tablename__ = "regions"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    code = db.Column(db.String(10), nullable=False, unique=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=utcnow, onupdate=utcnow
    )

    def __repr__(self):
        return f"<Region {self.code} {self.name}>"
