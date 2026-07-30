"""User model — Dev A. Employees, admins, and the system super administrator."""
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db
from app.utils.timeutils import utcnow


class Role:
    SUPER_ADMIN = "super_admin"
    REGIONAL_ADMIN = "regional_admin"
    USER = "user"

    ALL = (SUPER_ADMIN, REGIONAL_ADMIN, USER)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True, index=True)
    email = db.Column(db.String(120), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False, default="")
    role = db.Column(db.String(30), nullable=False, default=Role.USER)

    # Nullable: the super administrator belongs to no single region.
    region_id = db.Column(
        db.Integer, db.ForeignKey("regions.id"), nullable=True, index=True
    )
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=utcnow, onupdate=utcnow
    )

    region = db.relationship("Region", backref=db.backref("users", lazy="dynamic"))

    def set_password(self, raw):
        # Explicit method: some OpenSSL builds (e.g. LibreSSL) don't expose
        # scrypt, which is Werkzeug's default since 2.3.
        self.password_hash = generate_password_hash(raw, method="pbkdf2:sha256")

    def check_password(self, raw):
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, raw)

    @property
    def is_super_admin(self):
        return self.role == Role.SUPER_ADMIN

    def __repr__(self):
        return f"<User {self.username} {self.role} region={self.region_id}>"
