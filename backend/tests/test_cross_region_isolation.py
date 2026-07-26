"""
Cross-region isolation tests.

Both developers write this test in week 1. It is the single most important
test in the project: it is the difference between "region scoping is
implemented" and "region scoping actually holds".

Assumes conftest.py (Phase 0, shared) provides:
    client                  - Flask test client
    auth_header(user)       - {"Authorization": "Bearer <token>"}
    nairobi_user            - role 'user',           region Nairobi
    nairobi_admin           - role 'regional_admin',  region Nairobi
    mombasa_admin           - role 'regional_admin',  region Mombasa
    super_admin             - role 'super_admin',     region None
    mombasa_customer        - a Customer row in Mombasa
    mombasa_order           - an Order row in Mombasa
"""
import pytest


class TestCustomerIsolation:
    def test_list_excludes_other_regions(self, client, auth_header, nairobi_user,
                                         mombasa_customer):
        res = client.get("/api/customers", headers=auth_header(nairobi_user))
        assert res.status_code == 200
        ids = [c["id"] for c in res.json["items"]]
        assert mombasa_customer.id not in ids

    def test_direct_id_lookup_returns_404_not_403(self, client, auth_header,
                                                  nairobi_user, mombasa_customer):
        """
        404, deliberately. A 403 would confirm the record exists and let
        someone map another branch's data by iterating IDs.
        """
        res = client.get(
            f"/api/customers/{mombasa_customer.id}", headers=auth_header(nairobi_user)
        )
        assert res.status_code == 404
        assert res.json["error"]["code"] == "not_found"

    def test_cannot_update_other_region_customer(self, client, auth_header,
                                                 nairobi_admin, mombasa_customer):
        res = client.patch(
            f"/api/customers/{mombasa_customer.id}",
            json={"name": "Renamed by Nairobi"},
            headers=auth_header(nairobi_admin),
        )
        assert res.status_code == 404

    def test_region_id_in_body_is_ignored_on_create(self, client, auth_header,
                                                    nairobi_user, mombasa_region):
        """The region comes from the token. A body value must not override it."""
        res = client.post(
            "/api/customers",
            json={
                "name": "Injection Test Ltd",
                "phone": "0700000001",
                "region_id": mombasa_region.id,
            },
            headers=auth_header(nairobi_user),
        )
        assert res.status_code == 201
        assert res.json["region_id"] != mombasa_region.id


class TestOrderIsolation:
    def test_cannot_read_other_region_order(self, client, auth_header, nairobi_user,
                                            mombasa_order):
        res = client.get(
            f"/api/orders/{mombasa_order.id}", headers=auth_header(nairobi_user)
        )
        assert res.status_code == 404

    def test_cannot_approve_other_region_order(self, client, auth_header,
                                               nairobi_admin, mombasa_order):
        res = client.post(
            f"/api/orders/{mombasa_order.id}/approve",
            headers=auth_header(nairobi_admin),
        )
        assert res.status_code == 404

    def test_cannot_order_for_other_region_customer(self, client, auth_header,
                                                    nairobi_user, mombasa_customer,
                                                    nairobi_fuel):
        res = client.post(
            "/api/orders",
            json={
                "customer_id": mombasa_customer.id,
                "items": [{"fuel_id": nairobi_fuel.id, "quantity": "100"}],
            },
            headers=auth_header(nairobi_user),
        )
        assert res.status_code == 404

    def test_cannot_order_against_other_region_stock(self, client, auth_header,
                                                     nairobi_user, nairobi_customer,
                                                     mombasa_fuel):
        res = client.post(
            "/api/orders",
            json={
                "customer_id": nairobi_customer.id,
                "items": [{"fuel_id": mombasa_fuel.id, "quantity": "100"}],
            },
            headers=auth_header(nairobi_user),
        )
        assert res.status_code == 404


class TestRoleGating:
    def test_normal_user_cannot_approve(self, client, auth_header, nairobi_user,
                                        nairobi_order):
        res = client.post(
            f"/api/orders/{nairobi_order.id}/approve",
            headers=auth_header(nairobi_user),
        )
        assert res.status_code == 403

    def test_normal_user_cannot_read_financial_reports(self, client, auth_header,
                                                       nairobi_user):
        res = client.get("/api/reports/revenue", headers=auth_header(nairobi_user))
        assert res.status_code == 403

    def test_regional_admin_cannot_read_consolidated(self, client, auth_header,
                                                     nairobi_admin):
        res = client.get("/api/reports/consolidated", headers=auth_header(nairobi_admin))
        assert res.status_code == 403

    def test_super_admin_sees_all_regions(self, client, auth_header, super_admin,
                                          mombasa_customer, nairobi_customer):
        res = client.get("/api/customers?per_page=100", headers=auth_header(super_admin))
        assert res.status_code == 200
        ids = [c["id"] for c in res.json["items"]]
        assert mombasa_customer.id in ids
        assert nairobi_customer.id in ids


class TestDeliveryStockDeduction:
    def test_delivery_deducts_stock_once(self, client, auth_header, nairobi_admin,
                                         approved_nairobi_order, nairobi_fuel):
        """
        The idempotency guard. Two DELIVERED calls must not deduct twice -
        this is the bug that silently corrupts regional inventory.
        """
        opening = nairobi_fuel.quantity_available
        ordered = approved_nairobi_order.items[0].quantity

        res = client.post(
            "/api/distributions",
            json={
                "order_id": approved_nairobi_order.id,
                "vehicle_registration": "KDA123X",
                "driver_name": "James Mwangi",
                "driver_phone": "0722000000",
                "scheduled_date": "2026-08-01",
            },
            headers=auth_header(nairobi_admin),
        )
        assert res.status_code == 201
        delivery_id = res.json["id"]

        for status in ("in_transit", "delivered", "delivered"):
            client.patch(
                f"/api/distributions/{delivery_id}/status",
                json={"status": status},
                headers=auth_header(nairobi_admin),
            )

        assert nairobi_fuel.quantity_available == opening - ordered

    def test_cannot_schedule_unapproved_order(self, client, auth_header,
                                              nairobi_admin, nairobi_order):
        res = client.post(
            "/api/distributions",
            json={
                "order_id": nairobi_order.id,
                "vehicle_registration": "KDA123X",
                "driver_name": "James Mwangi",
                "driver_phone": "0722000000",
                "scheduled_date": "2026-08-01",
            },
            headers=auth_header(nairobi_admin),
        )
        assert res.status_code == 422

    @pytest.mark.parametrize("bad_transition", ["delivered"])
    def test_cannot_skip_in_transit(self, client, auth_header, nairobi_admin,
                                    pending_delivery, bad_transition):
        res = client.patch(
            f"/api/distributions/{pending_delivery.id}/status",
            json={"status": bad_transition},
            headers=auth_header(nairobi_admin),
        )
        assert res.status_code == 409
