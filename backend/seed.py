"""
Seed script — shared. Creates three regions, a super admin, and one regional
admin + one user per region, plus starter fuel stock. Run once against an
empty database:

    python seed.py
"""
from app import create_app
from app.extensions import db
from app.models.fuel import Fuel
from app.models.region import Region
from app.models.user import Role, User

REGIONS = [("Nairobi", "NRB"), ("Mombasa", "MSA"), ("Kisumu", "KSM")]


def run():
    app = create_app()
    with app.app_context():
        db.create_all()

        if User.query.filter_by(role=Role.SUPER_ADMIN).first():
            print("Already seeded — nothing to do.")
            return

        root = User(username="root", email="root@fuelco.co.ke",
                    role=Role.SUPER_ADMIN, region_id=None)
        root.set_password("ChangeMe123!")
        db.session.add(root)

        for name, code in REGIONS:
            region = Region(name=name, code=code)
            db.session.add(region)
            db.session.flush()  # need region.id

            admin = User(username=f"{code.lower()}_admin",
                         email=f"admin.{code.lower()}@fuelco.co.ke",
                         role=Role.REGIONAL_ADMIN, region_id=region.id)
            admin.set_password("ChangeMe123!")

            staff = User(username=f"{code.lower()}_staff",
                         email=f"staff.{code.lower()}@fuelco.co.ke",
                         role=Role.USER, region_id=region.id)
            staff.set_password("ChangeMe123!")

            db.session.add_all([admin, staff])
            db.session.add_all([
                Fuel(name="Diesel", fuel_type="diesel", unit_price=185.50,
                     quantity_available=50000, reorder_level=5000, region_id=region.id),
                Fuel(name="Petrol", fuel_type="petrol", unit_price=201.00,
                     quantity_available=40000, reorder_level=5000, region_id=region.id),
            ])

        db.session.commit()
        print("Seeded 3 regions, 1 super admin, 3 regional admins, 3 staff, 6 fuels.")
        print("All passwords: ChangeMe123!  (change them.)")


if __name__ == "__main__":
    run()
